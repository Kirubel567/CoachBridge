import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../common/app-exception';
import { durationToMs, randomToken, sha256 } from '../common/crypto.util';
import type { AuthUser } from './auth-user';
import { Role } from '@prisma/client';

@Injectable()
export class TokensService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async issueAccessToken(user: { id: string; role: Role; email: string }): Promise<string> {
    return this.jwt.signAsync(
      { sub: user.id, role: user.role, email: user.email },
      {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get<string>('JWT_ACCESS_TTL') ?? '15m',
      },
    );
  }

  async verifyAccessToken(token: string): Promise<AuthUser> {
    return this.jwt.verifyAsync<AuthUser>(token, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  /** Mint a new opaque refresh token, persist its hash, return the raw value. */
  async issueRefreshToken(userId: string): Promise<string> {
    const raw = randomToken();
    const ttl = this.config.get<string>('JWT_REFRESH_TTL') ?? '30d';
    const expiresAt = new Date(Date.now() + durationToMs(ttl));
    await this.prisma.refreshToken.create({
      data: { userId, tokenHash: sha256(raw), expiresAt },
    });
    return raw;
  }

  /** Validate a refresh token and rotate it (single use). */
  async rotateRefreshToken(raw: string): Promise<{ userId: string; token: string }> {
    const existing = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: sha256(raw) },
    });
    if (!existing || existing.expiresAt < new Date()) {
      if (existing) {
        await this.prisma.refreshToken.delete({ where: { id: existing.id } }).catch(() => undefined);
      }
      throw new AppException('UNAUTHENTICATED', 'Invalid or expired session.');
    }
    await this.prisma.refreshToken.delete({ where: { id: existing.id } });
    const token = await this.issueRefreshToken(existing.userId);
    return { userId: existing.userId, token };
  }

  async revokeRefreshToken(raw: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { tokenHash: sha256(raw) } });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
  }
}
