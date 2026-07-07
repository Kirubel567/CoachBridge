import { Injectable } from '@nestjs/common';
import { hash, verify } from '@node-rs/argon2';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../common/app-exception';
import { TokensService } from '../auth/tokens.service';
import { toPublicProfile, toPublicUser } from './user.serializer';
import {
  UpdateMeDto,
  UpsertTraineeProfileDto,
  UpsertTrainerProfileDto,
} from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokens: TokensService,
  ) {}

  async getPublic(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { trainerProfile: true },
    });
    if (!user || user.suspended) throw new AppException('NOT_FOUND', 'User not found.');
    return toPublicProfile(user);
  }

  async updateMe(userId: string, dto: UpdateMeDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppException('NOT_FOUND', 'User not found.');

    const data: { fullName?: string; avatarUrl?: string; passwordHash?: string } = {};
    if (dto.fullName !== undefined) data.fullName = dto.fullName;
    if (dto.avatarUrl !== undefined) data.avatarUrl = dto.avatarUrl;

    if (dto.newPassword !== undefined) {
      if (!dto.currentPassword || !(await verify(user.passwordHash, dto.currentPassword))) {
        throw new AppException('VALIDATION_ERROR', 'Current password is incorrect.', 'currentPassword');
      }
      data.passwordHash = await hash(dto.newPassword);
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data,
      include: { traineeProfile: true, trainerProfile: true },
    });
    // A password change invalidates other sessions.
    if (data.passwordHash) await this.tokens.revokeAllForUser(userId);
    return toPublicUser(updated);
  }

  async deleteMe(userId: string) {
    // Right-to-erasure — cascades to profiles, tokens, and (later) bookings.
    await this.prisma.user.delete({ where: { id: userId } });
    return { deleted: true };
  }

  async upsertTraineeProfile(userId: string, dto: UpsertTraineeProfileDto) {
    return this.prisma.traineeProfile.upsert({
      where: { userId },
      create: { userId, ...dto },
      update: { ...dto },
    });
  }

  async upsertTrainerProfile(userId: string, dto: UpsertTrainerProfileDto) {
    return this.prisma.trainerProfile.upsert({
      where: { userId },
      create: { userId, ...dto },
      update: { ...dto },
    });
  }
}
