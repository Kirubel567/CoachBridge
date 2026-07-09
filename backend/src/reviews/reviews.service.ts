import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../common/app-exception';
import { screenMessage } from '../messages/anti-disintermediation';
import { CreateReviewDto, RespondReviewDto } from './dto/reviews.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(authorId: string, dto: CreateReviewDto) {
    const trainer = await this.prisma.trainerProfile.findUnique({
      where: { userId: dto.trainerId },
    });
    if (!trainer) throw new AppException('NOT_FOUND', 'Trainer not found.', 'trainerId');

    // SRS inverse requirement: only reviewable after a completed session.
    const completed = await this.prisma.booking.findFirst({
      where: { traineeId: authorId, trainerId: dto.trainerId, status: 'completed' },
    });
    if (!completed) {
      throw new AppException(
        'FORBIDDEN',
        'You can only review a trainer after a completed session.',
      );
    }

    const existing = await this.prisma.review.findFirst({
      where: { authorId, trainerId: dto.trainerId },
    });
    if (existing) {
      throw new AppException('CONFLICT', 'You have already reviewed this trainer.');
    }

    const screen = screenMessage(dto.comment);
    const review = await this.prisma.review.create({
      data: {
        authorId,
        trainerId: dto.trainerId,
        rating: dto.rating,
        comment: dto.comment,
        flagged: screen.flagged,
        flagReason: screen.reason,
      },
    });
    await this.recomputeRating(dto.trainerId);
    return review;
  }

  async mine(authorId: string) {
    const rows = await this.prisma.review.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
      include: { trainer: { select: { fullName: true, avatarUrl: true } } },
    });
    return rows.map((r) => ({
      id: r.id,
      trainerId: r.trainerId,
      trainerName: r.trainer.fullName,
      rating: r.rating,
      comment: r.comment,
      response: r.response,
      date: r.createdAt,
    }));
  }

  async respond(reviewId: string, trainerId: string, dto: RespondReviewDto) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new AppException('NOT_FOUND', 'Review not found.');
    if (review.trainerId !== trainerId) {
      throw new AppException('FORBIDDEN', 'You can only respond to your own reviews.');
    }
    return this.prisma.review.update({
      where: { id: reviewId },
      data: { response: dto.response },
    });
  }

  /** Refresh the trainer's denormalized rating (used by discovery/matching). */
  private async recomputeRating(trainerId: string) {
    const agg = await this.prisma.review.aggregate({
      where: { trainerId, hidden: false },
      _avg: { rating: true },
      _count: true,
    });
    await this.prisma.trainerProfile.update({
      where: { userId: trainerId },
      data: {
        ratingAvg: agg._avg.rating ?? 0,
        ratingCount: agg._count,
      },
    });
  }
}
