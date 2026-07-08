import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../common/app-exception';
import { AvailabilityService } from './availability.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { toBooking, BookingWithParties } from './booking.serializer';
import { buildIcs } from './ics.util';
import { SESSION_MINUTES } from './time.util';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { BookingStatus } from '@prisma/client';

const PARTY_INCLUDE = {
  trainer: { select: { fullName: true, avatarUrl: true } },
  trainee: { select: { fullName: true, avatarUrl: true } },
} satisfies Prisma.BookingInclude;

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly availability: AvailabilityService,
    private readonly realtime: RealtimeGateway,
    private readonly notifications: NotificationsService,
  ) {}

  /** Push a booking:status socket event + a persistent notification. */
  private async announce(
    recipientId: string,
    bookingId: string,
    status: BookingStatus,
    title: string,
    body: string,
  ) {
    this.realtime.emitToUser(recipientId, 'booking:status', { bookingId, status });
    await this.notifications.notify(recipientId, {
      type: 'booking',
      title,
      body,
      data: { bookingId, status },
    });
  }

  async create(traineeId: string, dto: CreateBookingDto) {
    if (dto.trainerId === traineeId) {
      throw new AppException('VALIDATION_ERROR', 'You cannot book yourself.', 'trainerId');
    }

    const trainer = await this.prisma.trainerProfile.findUnique({
      where: { userId: dto.trainerId },
      include: { user: true },
    });
    if (!trainer || trainer.user.suspended) {
      throw new AppException('NOT_FOUND', 'Trainer not found.');
    }
    if (!trainer.sessionTypes.includes(dto.sessionType)) {
      throw new AppException(
        'VALIDATION_ERROR',
        'This trainer does not offer that session type.',
        'sessionType',
      );
    }

    const startAt = new Date(dto.startAt);
    if (Number.isNaN(startAt.getTime()) || startAt.getTime() <= Date.now()) {
      throw new AppException('VALIDATION_ERROR', 'Choose a time in the future.', 'startAt');
    }
    if (!(await this.availability.isValidSlot(dto.trainerId, startAt))) {
      throw new AppException('SLOT_UNAVAILABLE', 'That slot is not open.', 'startAt');
    }
    const endAt = new Date(startAt.getTime() + SESSION_MINUTES * 60_000);

    // Lock the slot: reject if another active booking already holds it.
    const booking = await this.prisma.$transaction(async (tx) => {
      const clash = await tx.booking.findFirst({
        where: { trainerId: dto.trainerId, startAt, status: { in: ['pending', 'confirmed'] } },
      });
      if (clash) {
        throw new AppException('SLOT_UNAVAILABLE', 'That slot was just taken.', 'startAt');
      }
      return tx.booking.create({
        data: {
          traineeId,
          trainerId: dto.trainerId,
          startAt,
          endAt,
          sessionType: dto.sessionType,
          priceCents: trainer.pricePerSession,
          status: 'pending', // Phase 4 attaches a payment intent here
        },
        include: PARTY_INCLUDE,
      });
    });

    const result = toBooking(booking);
    await this.announce(
      result.trainerId,
      result.id,
      'pending',
      'New booking request',
      `${result.traineeName} requested a ${result.type} session.`,
    );
    return result;
  }

  async mine(userId: string) {
    const rows = await this.prisma.booking.findMany({
      where: { OR: [{ traineeId: userId }, { trainerId: userId }] },
      include: PARTY_INCLUDE,
      orderBy: { startAt: 'asc' },
    });
    return rows.map(toBooking);
  }

  async accept(id: string, trainerId: string) {
    const b = await this.find(id);
    this.assertTrainer(b, trainerId);
    if (b.status !== 'pending') {
      throw new AppException('VALIDATION_ERROR', 'Only pending requests can be accepted.');
    }
    const result = toBooking(await this.setStatus(id, 'confirmed'));
    await this.announce(
      b.traineeId,
      id,
      'confirmed',
      'Booking confirmed',
      `${result.trainerName} accepted your session.`,
    );
    return result;
  }

  async reject(id: string, trainerId: string) {
    const b = await this.find(id);
    this.assertTrainer(b, trainerId);
    if (b.status !== 'pending') {
      throw new AppException('VALIDATION_ERROR', 'Only pending requests can be rejected.');
    }
    const result = toBooking(await this.setStatus(id, 'cancelled', { cancelledAt: new Date() }));
    await this.announce(
      b.traineeId,
      id,
      'cancelled',
      'Booking declined',
      `${result.trainerName} could not take your requested session.`,
    );
    return result;
  }

  async complete(id: string, userId: string) {
    const b = await this.find(id);
    this.assertParty(b, userId);
    if (b.status !== 'confirmed') {
      throw new AppException('VALIDATION_ERROR', 'Only confirmed sessions can be completed.');
    }
    const [updated] = await this.prisma.$transaction([
      this.prisma.booking.update({
        where: { id },
        data: { status: 'completed', completedAt: new Date() },
        include: PARTY_INCLUDE,
      }),
      // Denormalized session tally.
      this.prisma.trainerProfile.update({
        where: { userId: b.trainerId },
        data: { sessionsCount: { increment: 1 } },
      }),
      // Escrow-lite release: a paid booking's trainer share becomes withdrawable.
      this.prisma.payment.updateMany({
        where: { bookingId: id, status: 'paid', escrowReleased: false },
        data: { escrowReleased: true },
      }),
    ]);
    const result = toBooking(updated);
    const otherId = userId === b.trainerId ? b.traineeId : b.trainerId;
    await this.announce(
      otherId,
      id,
      'completed',
      'Session completed',
      'Your session was marked complete.',
    );
    return result;
  }

  async cancel(id: string, userId: string) {
    const b = await this.find(id);
    this.assertParty(b, userId);
    if (b.status !== 'pending' && b.status !== 'confirmed') {
      throw new AppException('VALIDATION_ERROR', 'This booking can no longer be cancelled.');
    }
    if (b.startAt.getTime() <= Date.now()) {
      throw new AppException('VALIDATION_ERROR', 'Past sessions cannot be cancelled.');
    }
    const result = toBooking(await this.setStatus(id, 'cancelled', { cancelledAt: new Date() }));
    const otherId = userId === b.trainerId ? b.traineeId : b.trainerId;
    await this.announce(
      otherId,
      id,
      'cancelled',
      'Booking cancelled',
      'A session was cancelled.',
    );
    return result;
  }

  async getIcs(id: string, userId: string) {
    const b = await this.find(id);
    this.assertParty(b, userId);
    const isTrainer = b.trainerId === userId;
    const other = isTrainer ? b.trainee.fullName : b.trainer.fullName;
    return buildIcs({
      id: b.id,
      startAt: b.startAt,
      endAt: b.endAt,
      summary: `CoachBridge session with ${other}`,
      description: `A ${b.sessionType} training session booked via CoachBridge.`,
      location: b.sessionType === 'online' ? 'Online' : 'In person',
    });
  }

  // --- helpers ---

  private async find(id: string): Promise<BookingWithParties> {
    const b = await this.prisma.booking.findUnique({ where: { id }, include: PARTY_INCLUDE });
    if (!b) throw new AppException('NOT_FOUND', 'Booking not found.');
    return b;
  }

  private assertParty(b: BookingWithParties, userId: string) {
    if (b.traineeId !== userId && b.trainerId !== userId) {
      throw new AppException('FORBIDDEN', 'This is not your booking.');
    }
  }

  private assertTrainer(b: BookingWithParties, trainerId: string) {
    if (b.trainerId !== trainerId) {
      throw new AppException('FORBIDDEN', 'This is not your booking.');
    }
  }

  private setStatus(
    id: string,
    status: 'confirmed' | 'cancelled',
    extra: Prisma.BookingUpdateInput = {},
  ) {
    return this.prisma.booking.update({
      where: { id },
      data: { status, ...extra },
      include: PARTY_INCLUDE,
    });
  }
}
