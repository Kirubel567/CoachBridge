import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../common/app-exception';
import { paginate, PaginationQuery } from '../common/pagination';
import { AuditService } from '../audit/audit.service';
import { TokensService } from '../auth/tokens.service';
import { AdminUsersQuery, ModerateDto } from './dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly tokens: TokensService,
  ) {}

  // --- users ---

  async users(q: AdminUsersQuery) {
    const page = q.page ?? 1;
    const limit = q.limit ?? 20;
    const where: Prisma.UserWhereInput = {};
    if (q.role) where.role = q.role;
    if (q.suspended !== undefined) where.suspended = q.suspended;
    if (q.q) {
      where.OR = [
        { fullName: { contains: q.q, mode: 'insensitive' } },
        { email: { contains: q.q, mode: 'insensitive' } },
      ];
    }
    const [total, rows] = await this.prisma.$transaction([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          suspended: true,
          emailVerified: true,
          createdAt: true,
        },
      }),
    ]);
    return paginate(rows, total, page, limit);
  }

  async setSuspended(id: string, adminId: string, suspended: boolean) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new AppException('NOT_FOUND', 'User not found.');
    if (user.role === 'admin') {
      throw new AppException('FORBIDDEN', 'Admins cannot be suspended here.');
    }
    const updated = await this.prisma.user.update({
      where: { id },
      data: { suspended },
      select: { id: true, fullName: true, suspended: true },
    });
    if (suspended) await this.tokens.revokeAllForUser(id); // kill active sessions
    await this.audit.log(suspended ? 'user.suspend' : 'user.activate', {
      actorId: adminId,
      targetType: 'user',
      targetId: id,
    });
    return updated;
  }

  async remove(id: string, adminId: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new AppException('NOT_FOUND', 'User not found.');
    if (user.role === 'admin') {
      throw new AppException('FORBIDDEN', 'Admin accounts cannot be deleted here.');
    }
    await this.prisma.user.delete({ where: { id } });
    await this.audit.log('user.delete', {
      actorId: adminId,
      targetType: 'user',
      targetId: id,
      meta: { email: user.email, role: user.role },
    });
    return { deleted: true };
  }

  // --- moderation: messages ---

  async flaggedMessages(q: PaginationQuery) {
    const page = q.page ?? 1;
    const limit = q.limit ?? 20;
    const where = { flagged: true };
    const [total, rows] = await this.prisma.$transaction([
      this.prisma.message.count({ where }),
      this.prisma.message.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { sender: { select: { id: true, fullName: true } } },
      }),
    ]);
    return paginate(rows, total, page, limit);
  }

  async moderateMessage(id: string, adminId: string, dto: ModerateDto) {
    const msg = await this.prisma.message.findUnique({ where: { id } });
    if (!msg) throw new AppException('NOT_FOUND', 'Message not found.');
    if (dto.action === 'remove') {
      await this.prisma.message.update({
        where: { id },
        data: { body: '[removed by moderator]', flagged: false },
      });
    } else {
      await this.prisma.message.update({ where: { id }, data: { flagged: false } });
    }
    await this.audit.log(`message.${dto.action}`, {
      actorId: adminId,
      targetType: 'message',
      targetId: id,
    });
    return { moderated: dto.action };
  }

  // --- moderation: reviews ---

  async flaggedReviews(q: PaginationQuery) {
    const page = q.page ?? 1;
    const limit = q.limit ?? 20;
    const where = { flagged: true, hidden: false };
    const [total, rows] = await this.prisma.$transaction([
      this.prisma.review.count({ where }),
      this.prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          trainer: { select: { id: true, fullName: true } },
          author: { select: { id: true, fullName: true } },
        },
      }),
    ]);
    return paginate(rows, total, page, limit);
  }

  async moderateReview(id: string, adminId: string, dto: ModerateDto) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new AppException('NOT_FOUND', 'Review not found.');
    if (dto.action === 'remove') {
      await this.prisma.review.update({ where: { id }, data: { hidden: true, flagged: false } });
      await this.recomputeRating(review.trainerId);
    } else {
      await this.prisma.review.update({ where: { id }, data: { flagged: false } });
    }
    await this.audit.log(`review.${dto.action}`, {
      actorId: adminId,
      targetType: 'review',
      targetId: id,
    });
    return { moderated: dto.action };
  }

  private async recomputeRating(trainerId: string) {
    const agg = await this.prisma.review.aggregate({
      where: { trainerId, hidden: false },
      _avg: { rating: true },
      _count: true,
    });
    await this.prisma.trainerProfile.update({
      where: { userId: trainerId },
      data: { ratingAvg: agg._avg.rating ?? 0, ratingCount: agg._count },
    });
  }

  // --- reports ---

  async financialReport() {
    const [paidAgg, payoutAgg, recent] = await this.prisma.$transaction([
      this.prisma.payment.aggregate({
        where: { status: 'paid' },
        _sum: { amountCents: true, commissionCents: true, payoutCents: true },
        _count: true,
      }),
      this.prisma.payout.aggregate({
        where: { status: { in: ['requested', 'processing', 'paid'] } },
        _sum: { amountCents: true },
        _count: true,
      }),
      this.prisma.payment.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
          trainer: { select: { fullName: true } },
          trainee: { select: { fullName: true } },
        },
      }),
    ]);
    return {
      grossCents: paidAgg._sum.amountCents ?? 0,
      commissionCents: paidAgg._sum.commissionCents ?? 0,
      trainerPayoutCents: paidAgg._sum.payoutCents ?? 0,
      paidTransactions: paidAgg._count,
      payoutsRequestedCents: payoutAgg._sum.amountCents ?? 0,
      payoutsCount: payoutAgg._count,
      recent: recent.map((p) => ({
        id: p.id,
        txRef: p.txRef,
        trainer: p.trainer.fullName,
        trainee: p.trainee.fullName,
        amountCents: p.amountCents,
        commissionCents: p.commissionCents,
        status: p.status,
        date: p.createdAt,
      })),
    };
  }

  async usageReport() {
    const [byRole, verifiedTrainers, bookingsByStatus, completed, conversations, messages, reviews, flaggedMsgs] =
      await Promise.all([
        this.prisma.user.groupBy({ by: ['role'], _count: { _all: true }, orderBy: { role: 'asc' } }),
        this.prisma.trainerProfile.count({ where: { verificationStatus: 'verified' } }),
        this.prisma.booking.groupBy({ by: ['status'], _count: { _all: true }, orderBy: { status: 'asc' } }),
        this.prisma.booking.count({ where: { status: 'completed' } }),
        this.prisma.conversation.count(),
        this.prisma.message.count(),
        this.prisma.review.count({ where: { hidden: false } }),
        this.prisma.message.count({ where: { flagged: true } }),
      ]);
    return {
      users: byRole.reduce((acc, r) => ({ ...acc, [r.role]: r._count._all }), {} as Record<string, number>),
      totalUsers: byRole.reduce((s, r) => s + r._count._all, 0),
      verifiedTrainers,
      bookings: bookingsByStatus.reduce(
        (acc, b) => ({ ...acc, [b.status]: b._count._all }),
        {} as Record<string, number>,
      ),
      completedSessions: completed,
      conversations,
      messages,
      reviews,
      flaggedMessages: flaggedMsgs,
    };
  }
}
