import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Email sender with a mock/real toggle. With no RESEND_API_KEY configured it
 * logs messages (so flows are testable); set the key in backend/.env to send
 * real email via Resend with zero caller changes.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly config: ConfigService) {}

  private get appUrl(): string {
    return (this.config.get<string>('CORS_ORIGIN') ?? 'http://localhost:3000').split(',')[0];
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      this.logger.log(`[email→${to}] ${subject}`);
      return;
    }
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.config.get<string>('EMAIL_FROM'),
          to,
          subject,
          html,
        }),
      });
      if (!res.ok) this.logger.warn(`Resend failed (${res.status}) for ${to}`);
    } catch (err) {
      this.logger.warn(`Resend error for ${to}: ${(err as Error).message}`);
    }
  }

  async sendVerifyEmail(email: string, token: string): Promise<void> {
    const link = `${this.appUrl}/verify-email?token=${token}`;
    await this.send(
      email,
      'Verify your CoachBridge account',
      `<p>Welcome to CoachBridge! Confirm your email:</p><p><a href="${link}">Verify my account</a></p>`,
    );
  }

  async sendPasswordReset(email: string, token: string): Promise<void> {
    const link = `${this.appUrl}/reset-password?token=${token}`;
    await this.send(
      email,
      'Reset your CoachBridge password',
      `<p>Reset your password:</p><p><a href="${link}">Choose a new password</a></p>`,
    );
  }

  async sendNotification(email: string, title: string, body: string): Promise<void> {
    await this.send(email, title, `<p><strong>${title}</strong></p><p>${body}</p>`);
  }
}
