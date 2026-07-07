import { Injectable } from '@nestjs/common';
import { hash, verify } from '@node-rs/argon2';
import { AuthTokenType, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { AppException } from '../common/app-exception';
import { randomToken, sha256 } from '../common/crypto.util';
import { toPublicUser } from '../users/user.serializer';
import { TokensService } from './tokens.service';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/auth.dto';

const EMAIL_VERIFY_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000; // 1h

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokens: TokensService,
    private readonly mail: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppException('EMAIL_IN_USE', 'That email is already registered.', 'email');
    }

    const role = dto.role ?? 'trainee';
    const passwordHash = await hash(dto.password);
    const user = await this.prisma.user.create({
      data: { email, passwordHash, fullName: dto.fullName, role },
    });

    // Seed an empty role-specific profile so onboarding can PUT into it.
    if (role === 'trainee') {
      await this.prisma.traineeProfile.create({ data: { userId: user.id } });
    } else if (role === 'trainer') {
      await this.prisma.trainerProfile.create({ data: { userId: user.id } });
    }

    await this.sendEmailVerification(user);
    return this.issueSession(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    // Same error whether the email exists or the password is wrong.
    if (!user || !(await verify(user.passwordHash, dto.password))) {
      throw new AppException('INVALID_CREDENTIALS', 'Incorrect email or password.');
    }
    if (user.suspended) {
      throw new AppException('FORBIDDEN', 'This account has been suspended.');
    }
    return this.issueSession(user);
  }

  async refresh(rawRefresh: string | undefined) {
    if (!rawRefresh) throw new AppException('UNAUTHENTICATED', 'No active session.');
    const { userId, token } = await this.tokens.rotateRefreshToken(rawRefresh);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.suspended) {
      throw new AppException('UNAUTHENTICATED', 'Session is no longer valid.');
    }
    const accessToken = await this.tokens.issueAccessToken(user);
    return { user: toPublicUser(user), accessToken, refreshToken: token };
  }

  async logout(rawRefresh: string | undefined) {
    if (rawRefresh) await this.tokens.revokeRefreshToken(rawRefresh);
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { traineeProfile: true, trainerProfile: true },
    });
    if (!user) throw new AppException('NOT_FOUND', 'User not found.');
    return toPublicUser(user);
  }

  async verifyEmail(token: string) {
    const rec = await this.consumeToken(token, 'email_verify');
    await this.prisma.user.update({
      where: { id: rec.userId },
      data: { emailVerified: true },
    });
    return { verified: true };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    // Never reveal whether an email is registered.
    if (user) {
      const raw = randomToken();
      await this.prisma.authToken.create({
        data: {
          userId: user.id,
          type: 'password_reset',
          tokenHash: sha256(raw),
          expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MS),
        },
      });
      await this.mail.sendPasswordReset(user.email, raw);
    }
    return { sent: true };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const rec = await this.consumeToken(dto.token, 'password_reset');
    const passwordHash = await hash(dto.password);
    await this.prisma.user.update({
      where: { id: rec.userId },
      data: { passwordHash },
    });
    // Invalidate every existing session after a password change.
    await this.tokens.revokeAllForUser(rec.userId);
    return { reset: true };
  }

  // --- helpers ---

  private async issueSession(user: User) {
    const accessToken = await this.tokens.issueAccessToken(user);
    const refreshToken = await this.tokens.issueRefreshToken(user.id);
    return { user: toPublicUser(user), accessToken, refreshToken };
  }

  private async sendEmailVerification(user: User) {
    const raw = randomToken();
    await this.prisma.authToken.create({
      data: {
        userId: user.id,
        type: 'email_verify',
        tokenHash: sha256(raw),
        expiresAt: new Date(Date.now() + EMAIL_VERIFY_TTL_MS),
      },
    });
    await this.mail.sendVerifyEmail(user.email, raw);
  }

  private async consumeToken(raw: string, type: AuthTokenType) {
    const rec = await this.prisma.authToken.findUnique({
      where: { tokenHash: sha256(raw) },
    });
    if (!rec || rec.type !== type || rec.usedAt || rec.expiresAt < new Date()) {
      throw new AppException('VALIDATION_ERROR', 'This link is invalid or has expired.', 'token');
    }
    await this.prisma.authToken.update({
      where: { id: rec.id },
      data: { usedAt: new Date() },
    });
    return rec;
  }
}
