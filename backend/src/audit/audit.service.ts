import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { paginate, PaginationQuery } from '../common/pagination';

interface AuditOpts {
  actorId?: string;
  targetType?: string;
  targetId?: string;
  meta?: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  log(action: string, opts: AuditOpts = {}) {
    return this.prisma.auditLog.create({
      data: {
        action,
        actorId: opts.actorId,
        targetType: opts.targetType,
        targetId: opts.targetId,
        meta: opts.meta as Prisma.InputJsonValue | undefined,
      },
    });
  }

  async list(q: PaginationQuery) {
    const page = q.page ?? 1;
    const limit = q.limit ?? 50;
    const [total, rows] = await this.prisma.$transaction([
      this.prisma.auditLog.count(),
      this.prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { actor: { select: { fullName: true, role: true } } },
      }),
    ]);
    return paginate(rows, total, page, limit);
  }
}
