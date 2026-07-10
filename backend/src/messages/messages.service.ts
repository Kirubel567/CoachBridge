import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../common/app-exception';
import { paginate, PaginationQuery } from '../common/pagination';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { screenMessage } from './anti-disintermediation';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
    private readonly notifications: NotificationsService,
  ) {}

  /** Start or continue a conversation with a user, then send. */
  async sendToUser(senderId: string, toUserId: string, body: string) {
    if (toUserId === senderId) {
      throw new AppException('VALIDATION_ERROR', 'You cannot message yourself.', 'toUserId');
    }
    const other = await this.prisma.user.findUnique({ where: { id: toUserId } });
    if (!other) throw new AppException('NOT_FOUND', 'Recipient not found.', 'toUserId');

    const [userAId, userBId] = [senderId, toUserId].sort();
    const conversation = await this.prisma.conversation.upsert({
      where: { userAId_userBId: { userAId, userBId } },
      create: { userAId, userBId },
      update: {},
    });
    return this.send(senderId, conversation.id, body);
  }

  async send(senderId: string, conversationId: string, body: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });
    if (!conversation) throw new AppException('NOT_FOUND', 'Conversation not found.');
    if (conversation.userAId !== senderId && conversation.userBId !== senderId) {
      throw new AppException('FORBIDDEN', 'You are not part of this conversation.');
    }
    const recipientId =
      conversation.userAId === senderId ? conversation.userBId : conversation.userAId;

    const screen = screenMessage(body);
    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        body,
        flagged: screen.flagged,
        flagReason: screen.reason,
      },
    });
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: message.createdAt },
    });

    // Realtime push + persistent notification for the recipient.
    this.realtime.emitToUser(recipientId, 'message:new', message);
    const sender = await this.prisma.user.findUnique({ where: { id: senderId } });
    await this.notifications.notify(recipientId, {
      type: 'message',
      title: `New message from ${sender?.fullName ?? 'someone'}`,
      body: body.slice(0, 120),
      data: { conversationId, messageId: message.id },
    });

    return {
      ...message,
      warning: screen.flagged
        ? 'Sharing contact details or moving off-platform is discouraged and has been flagged.'
        : undefined,
    };
  }

  async inbox(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: { OR: [{ userAId: userId }, { userBId: userId }] },
      orderBy: { lastMessageAt: { sort: 'desc', nulls: 'last' } },
      include: {
        userA: { select: { id: true, fullName: true, avatarUrl: true } },
        userB: { select: { id: true, fullName: true, avatarUrl: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
    return Promise.all(
      conversations.map(async (c) => {
        const other = c.userAId === userId ? c.userB : c.userA;
        const unread = await this.prisma.message.count({
          where: { conversationId: c.id, senderId: { not: userId }, readAt: null },
        });
        const last = c.messages[0];
        return {
          conversationId: c.id,
          participant: other,
          lastMessage: last
            ? { body: last.body, senderId: last.senderId, createdAt: last.createdAt }
            : null,
          lastMessageAt: c.lastMessageAt,
          unread,
        };
      }),
    );
  }

  async history(userId: string, conversationId: string, q: PaginationQuery) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });
    if (!conversation) throw new AppException('NOT_FOUND', 'Conversation not found.');
    if (conversation.userAId !== userId && conversation.userBId !== userId) {
      throw new AppException('FORBIDDEN', 'You are not part of this conversation.');
    }

    const page = q.page ?? 1;
    const limit = q.limit ?? 30;
    const where = { conversationId };
    const [total, rows] = await this.prisma.$transaction([
      this.prisma.message.count({ where }),
      this.prisma.message.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    // Mark the other party's messages as read and let them know.
    const unreadIds = rows.filter((m) => m.senderId !== userId && !m.readAt).map((m) => m.id);
    if (unreadIds.length) {
      await this.prisma.message.updateMany({
        where: { id: { in: unreadIds } },
        data: { readAt: new Date() },
      });
      const otherId =
        conversation.userAId === userId ? conversation.userBId : conversation.userAId;
      this.realtime.emitToUser(otherId, 'message:read', { conversationId, by: userId });
    }

    return paginate(rows, total, page, limit);
  }
}
