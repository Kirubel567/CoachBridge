import { Injectable } from '@nestjs/common';
import { NotificationType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../common/app-exception';
import { paginate, PaginationQuery } from '../common/pagination';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { MailService } from '../mail/mail.service';

interface NotifyInput {
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  email?: boolean; // also send an email (default: in-app + socket only)
}

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
    private readonly mail: MailService,
  ) {}

  /** Create a notification, push it over the socket, optionally email it. */
  async notify(userId: string, input: NotifyInput) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type: input.type,
        title: input.title,
        body: input.body,
        data: input.data as Prisma.InputJsonValue | undefined,
      },
    });
    this.realtime.emitToUser(userId, 'notification:new', notification);

    if (input.email) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        await this.mail.sendNotification(user.email, input.title, input.body).catch(() => undefined);
      }
    }
    return notification;
  }

  async list(userId: string, q: PaginationQuery) {
    const page = q.page ?? 1;
    const limit = q.limit ?? 20;
    const where = { userId };
    const [total, rows, unread] = await this.prisma.$transaction([
      this.prisma.notification.count({ where }),
      this.prisma.notification.findMany({
        where,
        orderBy: [{ readAt: { sort: 'asc', nulls: 'first' } }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.notification.count({ where: { userId, readAt: null } }),
    ]);
    const result = paginate(rows, total, page, limit);
    return { ...result, meta: { ...result.meta, unread } };
  }

  async markRead(id: string, userId: string) {
    const n = await this.prisma.notification.findUnique({ where: { id } });
    if (!n || n.userId !== userId) throw new AppException('NOT_FOUND', 'Notification not found.');
    return this.prisma.notification.update({
      where: { id },
      data: { readAt: n.readAt ?? new Date() },
    });
  }

  async markAllRead(userId: string) {
    const res = await this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
    return { updated: res.count };
  }
}
