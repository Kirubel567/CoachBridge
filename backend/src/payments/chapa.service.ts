import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import { AppException } from '../common/app-exception';

interface InitializeInput {
  txRef: string;
  amountCents: number;
  email: string;
  firstName: string;
  lastName: string;
  callbackUrl: string;
  returnUrl: string;
}

const CHAPA_BASE = 'https://api.chapa.co/v1';

/**
 * Chapa gateway wrapper. With no CHAPA_SECRET_KEY configured it runs in **mock
 * mode**: checkout URLs are stubbed and verification always succeeds, so the
 * whole escrow flow is testable before real keys arrive. Drop the keys into
 * backend/.env to switch to the live API with zero code changes.
 */
@Injectable()
export class ChapaService {
  private readonly logger = new Logger(ChapaService.name);

  constructor(private readonly config: ConfigService) {}

  get isMock(): boolean {
    return !this.config.get<string>('CHAPA_SECRET_KEY');
  }

  private get appUrl(): string {
    return (this.config.get<string>('CORS_ORIGIN') ?? 'http://localhost:3000').split(',')[0];
  }

  async initialize(input: InitializeInput): Promise<{ checkoutUrl: string }> {
    if (this.isMock) {
      this.logger.warn(`[MOCK] Chapa initialize for ${input.txRef}`);
      return { checkoutUrl: `${this.appUrl}/payments/mock-checkout?tx_ref=${input.txRef}` };
    }

    const res = await fetch(`${CHAPA_BASE}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.get('CHAPA_SECRET_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: (input.amountCents / 100).toFixed(2),
        currency: 'ETB',
        email: input.email,
        first_name: input.firstName,
        last_name: input.lastName,
        tx_ref: input.txRef,
        callback_url: input.callbackUrl,
        return_url: input.returnUrl,
      }),
    });
    const json = (await res.json()) as { status: string; data?: { checkout_url?: string } };
    if (!res.ok || json.status !== 'success' || !json.data?.checkout_url) {
      throw new AppException('PAYMENT_FAILED', 'Could not start the payment.');
    }
    return { checkoutUrl: json.data.checkout_url };
  }

  async verify(txRef: string): Promise<{ paid: boolean; chapaRef?: string }> {
    if (this.isMock) {
      return { paid: true, chapaRef: `mock_${txRef}` };
    }
    const res = await fetch(`${CHAPA_BASE}/transaction/verify/${txRef}`, {
      headers: { Authorization: `Bearer ${this.config.get('CHAPA_SECRET_KEY')}` },
    });
    const json = (await res.json()) as {
      status: string;
      data?: { status?: string; reference?: string };
    };
    return {
      paid: json.status === 'success' && json.data?.status === 'success',
      chapaRef: json.data?.reference,
    };
  }

  /** Verify the HMAC signature on an incoming webhook (raw request body). */
  verifyWebhookSignature(rawBody: string, signature: string | undefined): boolean {
    if (this.isMock) return true; // no secret configured yet
    const secret = this.config.get<string>('CHAPA_WEBHOOK_SECRET');
    if (!secret || !signature) return false;
    const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
    return expected === signature;
  }
}
