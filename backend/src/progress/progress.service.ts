import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../common/app-exception';
import { CreateProgressDto } from './dto/progress.dto';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  create(traineeId: string, dto: CreateProgressDto) {
    return this.prisma.progressEntry.create({
      data: {
        traineeId,
        weightKg: dto.weightKg,
        bodyFatPct: dto.bodyFatPct,
        completedWorkout: dto.completedWorkout ?? false,
        note: dto.note,
        metrics: dto.metrics as Prisma.InputJsonValue | undefined,
      },
    });
  }

  mine(traineeId: string) {
    return this.prisma.progressEntry.findMany({
      where: { traineeId },
      orderBy: { date: 'desc' },
    });
  }

  addPhoto(traineeId: string, url: string) {
    return this.prisma.progressPhoto.create({ data: { traineeId, url } });
  }

  photos(traineeId: string) {
    return this.prisma.progressPhoto.findMany({
      where: { traineeId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Time-series analytics. A trainee sees their own; a trainer may view a
   * trainee they have a booking relationship with (docs/API.md §5).
   */
  async analytics(userId: string, role: Role, traineeIdParam?: string) {
    let targetId = userId;
    if (role === 'trainer') {
      if (!traineeIdParam) {
        throw new AppException('VALIDATION_ERROR', 'traineeId is required.', 'traineeId');
      }
      const rel = await this.prisma.booking.findFirst({
        where: { trainerId: userId, traineeId: traineeIdParam },
      });
      if (!rel) throw new AppException('FORBIDDEN', 'You do not coach this trainee.');
      targetId = traineeIdParam;
    } else if (role === 'admin' && traineeIdParam) {
      targetId = traineeIdParam;
    }

    const entries = await this.prisma.progressEntry.findMany({
      where: { traineeId: targetId },
      orderBy: { date: 'asc' },
    });

    const weight = entries
      .filter((e) => e.weightKg != null)
      .map((e) => ({ date: e.date, value: e.weightKg as number }));
    const bodyFat = entries
      .filter((e) => e.bodyFatPct != null)
      .map((e) => ({ date: e.date, value: e.bodyFatPct as number }));

    const firstW = weight[0]?.value;
    const lastW = weight[weight.length - 1]?.value;

    return {
      entries: entries.length,
      workoutsLogged: entries.filter((e) => e.completedWorkout).length,
      weight,
      bodyFat,
      latestWeightKg: lastW ?? null,
      weightChangeKg: firstW != null && lastW != null ? Number((lastW - firstW).toFixed(1)) : null,
    };
  }
}
