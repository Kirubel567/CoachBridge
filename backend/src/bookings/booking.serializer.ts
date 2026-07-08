import type { Prisma } from '@prisma/client';
import { minutesToHHMM } from './time.util';

export type BookingWithParties = Prisma.BookingGetPayload<{
  include: {
    trainer: { select: { fullName: true; avatarUrl: true } };
    trainee: { select: { fullName: true; avatarUrl: true } };
  };
}>;

/** Booking shape for API responses (close to the frontend Booking type). */
export function toBooking(b: BookingWithParties) {
  const startMinute = b.startAt.getUTCHours() * 60 + b.startAt.getUTCMinutes();
  return {
    id: b.id,
    trainerId: b.trainerId,
    trainerName: b.trainer.fullName,
    trainerAvatar: b.trainer.avatarUrl,
    traineeId: b.traineeId,
    traineeName: b.trainee.fullName,
    traineeAvatar: b.trainee.avatarUrl,
    startAt: b.startAt,
    endAt: b.endAt,
    date: b.startAt.toISOString(),
    time: minutesToHHMM(startMinute),
    type: b.sessionType,
    status: b.status,
    priceCents: b.priceCents,
    createdAt: b.createdAt,
  };
}
