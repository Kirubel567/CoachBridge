import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../common/app-exception';
import { paginate, PaginationQuery } from '../common/pagination';
import { toTrainerDetail, toTrainerListItem, TrainerWithUser } from './trainer.serializer';
import { ListTrainersDto } from './dto/list-trainers.dto';
import { MatchDto } from './dto/match.dto';

const MATCH_THRESHOLD = 40; // below this, we prompt the trainee to broaden.

interface MatchPrefs {
  goals: string[];
  city?: string | null;
  maxBudget?: number;
  sessionType?: 'in-person' | 'online';
}

@Injectable()
export class TrainersService {
  constructor(private readonly prisma: PrismaService) {}

  async list(dto: ListTrainersDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;

    const and: Prisma.TrainerProfileWhereInput[] = [
      { user: { is: { suspended: false } } },
      { verificationStatus: { not: 'rejected' } },
    ];
    if (dto.specialty && dto.specialty !== 'All') {
      and.push({ specialties: { has: dto.specialty } });
    }
    if (dto.sessionType) and.push({ sessionTypes: { has: dto.sessionType } });
    if (dto.minPrice !== undefined || dto.maxPrice !== undefined) {
      and.push({ pricePerSession: { gte: dto.minPrice, lte: dto.maxPrice } });
    }
    if (dto.minRating !== undefined) and.push({ ratingAvg: { gte: dto.minRating } });
    if (dto.location) {
      and.push({
        OR: [
          { city: { contains: dto.location, mode: 'insensitive' } },
          { location: { contains: dto.location, mode: 'insensitive' } },
        ],
      });
    }
    if (dto.q) {
      and.push({
        OR: [
          { user: { is: { fullName: { contains: dto.q, mode: 'insensitive' } } } },
          { bio: { contains: dto.q, mode: 'insensitive' } },
          { city: { contains: dto.q, mode: 'insensitive' } },
          { specialties: { has: dto.q } },
        ],
      });
    }
    const where: Prisma.TrainerProfileWhereInput = { AND: and };

    const sortBy = dto.sortBy ?? 'rating';
    const orderBy: Prisma.TrainerProfileOrderByWithRelationInput =
      sortBy === 'sessions'
        ? { sessionsCount: 'desc' }
        : sortBy === 'price-asc'
          ? { pricePerSession: 'asc' }
          : sortBy === 'price-desc'
            ? { pricePerSession: 'desc' }
            : sortBy === 'experience'
              ? { experienceYears: 'desc' }
              : { ratingAvg: 'desc' };

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.trainerProfile.count({ where }),
      this.prisma.trainerProfile.findMany({
        where,
        include: { user: true },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return paginate(rows.map(toTrainerListItem), total, page, limit);
  }

  async getOne(userId: string) {
    const profile = await this.prisma.trainerProfile.findUnique({
      where: { userId },
      include: { user: true },
    });
    if (!profile || profile.user.suspended) {
      throw new AppException('NOT_FOUND', 'Trainer not found.');
    }
    const reviews = await this.prisma.review.findMany({
      where: { trainerId: userId, hidden: false },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { author: { select: { fullName: true, avatarUrl: true } } },
    });
    return toTrainerDetail(profile, reviews);
  }

  async listReviews(userId: string, pagination: PaginationQuery) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const where = { trainerId: userId, hidden: false };
    const [total, rows] = await this.prisma.$transaction([
      this.prisma.review.count({ where }),
      this.prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { author: { select: { fullName: true, avatarUrl: true } } },
      }),
    ]);
    const data = rows.map((r) => ({
      id: r.id,
      author: r.author.fullName,
      authorAvatar: r.author.avatarUrl,
      rating: r.rating,
      comment: r.comment,
      response: r.response,
      date: r.createdAt,
    }));
    return paginate(data, total, page, limit);
  }

  async match(userId: string, dto: MatchDto) {
    const trainee = await this.prisma.traineeProfile.findUnique({ where: { userId } });
    const prefs: MatchPrefs = {
      goals: dto.goals ?? trainee?.goals ?? [],
      city: dto.city ?? trainee?.city,
      maxBudget: dto.maxBudget,
      sessionType:
        dto.sessionType ??
        (trainee?.preferredSessionTypes?.[0] as 'in-person' | 'online' | undefined),
    };
    return this.rankMatches(prefs, dto.limit ?? 10);
  }

  /** GET /trainers/me/matches — recommendations from the trainee's own profile. */
  async myMatches(userId: string) {
    return this.match(userId, {});
  }

  private async rankMatches(prefs: MatchPrefs, limit: number) {
    const candidates = await this.prisma.trainerProfile.findMany({
      where: {
        user: { is: { suspended: false } },
        verificationStatus: { not: 'rejected' },
      },
      include: { user: true },
    });

    const scored = candidates
      .map((t) => ({ trainer: t, compatibilityScore: this.score(t, prefs) }))
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    const above = scored.filter((s) => s.compatibilityScore >= MATCH_THRESHOLD);
    const broaden = above.length === 0;
    const chosen = (broaden ? scored : above).slice(0, limit);

    return {
      broaden, // SRS 3.2.2.5: when nothing clears the bar, prompt to widen filters
      threshold: MATCH_THRESHOLD,
      trainers: chosen.map((s) => ({
        ...toTrainerListItem(s.trainer),
        compatibilityScore: s.compatibilityScore,
      })),
    };
  }

  /** Deterministic weighted score (docs/API.md §3). Returns 0–100. */
  private score(t: TrainerWithUser, prefs: MatchPrefs): number {
    const goals = prefs.goals.map((g) => g.toLowerCase()).filter(Boolean);
    const specs = t.specialties.map((s) => s.toLowerCase());

    const goalMatch = goals.length
      ? goals.filter((g) => specs.some((s) => s.includes(g) || g.includes(s))).length /
        goals.length
      : 0.5;

    const location = prefs.city
      ? t.city && t.city.toLowerCase() === prefs.city.toLowerCase()
        ? 1
        : 0
      : 0.5;

    let priceFit = 0.5;
    if (prefs.maxBudget && prefs.maxBudget > 0) {
      priceFit =
        t.pricePerSession <= prefs.maxBudget
          ? 1
          : Math.max(0, 1 - (t.pricePerSession - prefs.maxBudget) / prefs.maxBudget);
    }

    // Real availability overlap arrives in Phase 3; approximate via session type.
    const availabilityOverlap = prefs.sessionType
      ? t.sessionTypes.includes(prefs.sessionType)
        ? 1
        : 0.4
      : 0.5;

    const rating = Math.min(1, t.ratingAvg / 5);

    const s =
      0.35 * goalMatch +
      0.25 * location +
      0.2 * priceFit +
      0.15 * availabilityOverlap +
      0.05 * rating;
    return Math.round(s * 100);
  }
}
