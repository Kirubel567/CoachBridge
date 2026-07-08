import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../common/app-exception';
import { SetAvailabilityDto } from './dto/availability.dto';
import {
  atMinuteUTC,
  hhmmToMinutes,
  minutesToHHMM,
  SESSION_MINUTES,
  SLOT_HORIZON_DAYS,
} from './time.util';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  /** Replace a trainer's whole rule set (PUT semantics). */
  async setRules(trainerId: string, dto: SetAvailabilityDto) {
    const rows = dto.rules.map((r) => {
      const startMinute = hhmmToMinutes(r.start);
      const endMinute = hhmmToMinutes(r.end);
      if (Number.isNaN(startMinute) || Number.isNaN(endMinute) || endMinute <= startMinute) {
        throw new AppException('VALIDATION_ERROR', `Invalid time range ${r.start}–${r.end}.`, 'rules');
      }
      return { trainerId, dayOfWeek: r.dayOfWeek, startMinute, endMinute };
    });

    await this.prisma.$transaction([
      this.prisma.availabilityRule.deleteMany({ where: { trainerId } }),
      this.prisma.availabilityRule.createMany({ data: rows }),
    ]);

    return this.getRules(trainerId);
  }

  async getRules(trainerId: string) {
    const rules = await this.prisma.availabilityRule.findMany({
      where: { trainerId },
      orderBy: [{ dayOfWeek: 'asc' }, { startMinute: 'asc' }],
    });
    return rules.map((r) => ({
      dayOfWeek: r.dayOfWeek,
      start: minutesToHHMM(r.startMinute),
      end: minutesToHHMM(r.endMinute),
    }));
  }

  /** Upcoming open slots grouped by day (frontend DayAvailability[] shape). */
  async getSlots(trainerId: string) {
    const trainer = await this.prisma.trainerProfile.findUnique({
      where: { userId: trainerId },
      include: { user: true },
    });
    if (!trainer || trainer.user.suspended) {
      throw new AppException('NOT_FOUND', 'Trainer not found.');
    }

    const rules = await this.prisma.availabilityRule.findMany({ where: { trainerId } });
    const now = new Date();
    const horizonEnd = new Date(now.getTime() + SLOT_HORIZON_DAYS * 86_400_000);

    const booked = await this.prisma.booking.findMany({
      where: {
        trainerId,
        status: { in: ['pending', 'confirmed'] },
        startAt: { gte: now, lte: horizonEnd },
      },
      select: { startAt: true },
    });
    const takenSet = new Set(booked.map((b) => b.startAt.getTime()));

    const days: Array<{ day: string; date: string; slots: Array<{ time: string; taken: boolean }> }> = [];
    for (let i = 0; i < SLOT_HORIZON_DAYS; i++) {
      const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      date.setUTCDate(date.getUTCDate() + i);
      const dow = date.getUTCDay();

      const slots: Array<{ time: string; taken: boolean }> = [];
      for (const rule of rules.filter((r) => r.dayOfWeek === dow)) {
        for (let m = rule.startMinute; m + SESSION_MINUTES <= rule.endMinute; m += SESSION_MINUTES) {
          const slotAt = atMinuteUTC(date, m);
          if (slotAt.getTime() <= now.getTime()) continue; // no past slots
          slots.push({ time: minutesToHHMM(m), taken: takenSet.has(slotAt.getTime()) });
        }
      }
      if (slots.length > 0) {
        days.push({ day: WEEKDAYS[dow], date: date.toISOString(), slots });
      }
    }
    return days;
  }

  /** True if `startAt` lands on a valid, rule-backed slot boundary. */
  async isValidSlot(trainerId: string, startAt: Date): Promise<boolean> {
    const dow = startAt.getUTCDay();
    const slotMinute = startAt.getUTCHours() * 60 + startAt.getUTCMinutes();
    const rules = await this.prisma.availabilityRule.findMany({
      where: { trainerId, dayOfWeek: dow },
    });
    return rules.some(
      (r) =>
        slotMinute >= r.startMinute &&
        slotMinute + SESSION_MINUTES <= r.endMinute &&
        (slotMinute - r.startMinute) % SESSION_MINUTES === 0,
    );
  }
}
