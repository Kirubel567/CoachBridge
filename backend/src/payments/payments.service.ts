import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Payment } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../common/app-exception';
import { ChapaService } from './chapa.service';
import { InitiatePaymentDto, PayoutDto } from './dto/payments.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly chapa: ChapaService,
    private readonly config: ConfigService,
  ) {}

  private get commissionPercent(): number {
    return this.config.get<number>('PLATFORM_COMMISSION_PERCENT') ?? 15;
  }

  async initiate(traineeId: string, dto: InitiatePaymentDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { payment: true, trainee: true },
    });
    if (!booking || booking.traineeId !== traineeId) {
      throw new AppException('NOT_FOUND', 'Booking not found.');
    }
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      throw new AppException('VALIDATION_ERROR', 'This booking can no longer be paid.');
    }

    // Idempotent: reuse an existing payment for the booking.
    if (booking.payment) {
      if (booking.payment.status === 'paid') {
        throw new AppException('CONFLICT', 'This booking is already paid.');
      }
      return this.initiateResult(booking.payment);
    }

    const amountCents = booking.priceCents;
    const commissionCents = Math.round((amountCents * this.commissionPercent) / 100);
    const payoutCents = amountCents - commissionCents;
    const txRef = `cb_${booking.id}_${Date.now().toString(36)}`;

    const [firstName, ...rest] = booking.trainee.fullName.split(' ');
    const { checkoutUrl } = await this.chapa.initialize({
      txRef,
      amountCents,
      email: booking.trainee.email,
      firstName: firstName || 'CoachBridge',
      lastName: rest.join(' ') || 'User',
      callbackUrl: this.webhookUrl(),
      returnUrl: `${this.appUrl()}/dashboard/payments`,
    });

    const payment = await this.prisma.payment.create({
      data: {
        txRef,
        bookingId: booking.id,
        traineeId: booking.traineeId,
        trainerId: booking.trainerId,
        amountCents,
        commissionCents,
        payoutCents,
        checkoutUrl,
        status: 'pending',
      },
    });
    return this.initiateResult(payment);
  }

  async verify(userId: string, txRef: string) {
    const payment = await this.prisma.payment.findUnique({ where: { txRef } });
    if (!payment || (payment.traineeId !== userId && payment.trainerId !== userId)) {
      throw new AppException('NOT_FOUND', 'Payment not found.');
    }
    if (payment.status === 'paid') {
      return { txRef, status: payment.status, amountCents: payment.amountCents };
    }
    const result = await this.chapa.verify(txRef);
    if (result.paid) {
      await this.markPaid(payment.id, result.chapaRef);
      return { txRef, status: 'paid', amountCents: payment.amountCents };
    }
    return { txRef, status: payment.status, amountCents: payment.amountCents };
  }

  async handleWebhook(rawBody: string, signature: string | undefined) {
    if (!this.chapa.verifyWebhookSignature(rawBody, signature)) {
      throw new AppException('FORBIDDEN', 'Invalid webhook signature.');
    }
    let payload: { tx_ref?: string; status?: string };
    try {
      payload = JSON.parse(rawBody || '{}');
    } catch {
      throw new AppException('VALIDATION_ERROR', 'Malformed webhook payload.');
    }
    if (payload.tx_ref && payload.status === 'success') {
      const payment = await this.prisma.payment.findUnique({ where: { txRef: payload.tx_ref } });
      if (payment && payment.status !== 'paid') {
        // Confirm against Chapa before trusting the callback.
        const result = await this.chapa.verify(payload.tx_ref);
        if (result.paid) await this.markPaid(payment.id, result.chapaRef);
      }
    }
    return { received: true };
  }

  async earnings(trainerId: string) {
    const paid = await this.prisma.payment.findMany({
      where: { trainerId, status: 'paid' },
      select: { amountCents: true, commissionCents: true, payoutCents: true, escrowReleased: true },
    });
    let grossCents = 0;
    let commissionCents = 0;
    let pendingEscrowCents = 0;
    let releasedCents = 0;
    for (const p of paid) {
      grossCents += p.amountCents;
      commissionCents += p.commissionCents;
      if (p.escrowReleased) releasedCents += p.payoutCents;
      else pendingEscrowCents += p.payoutCents;
    }
    const payouts = await this.prisma.payout.findMany({
      where: { trainerId, status: { in: ['requested', 'processing', 'paid'] } },
      select: { amountCents: true },
    });
    const withdrawnCents = payouts.reduce((s, p) => s + p.amountCents, 0);
    return {
      grossCents,
      commissionCents,
      pendingEscrowCents, // held until sessions are completed
      releasedCents, // completed sessions, available minus withdrawals
      withdrawnCents,
      availableCents: Math.max(0, releasedCents - withdrawnCents),
      commissionPercent: this.commissionPercent,
    };
  }

  async requestPayout(trainerId: string, dto: PayoutDto) {
    const earnings = await this.earnings(trainerId);
    if (dto.amountCents > earnings.availableCents) {
      throw new AppException('VALIDATION_ERROR', 'Insufficient available balance.', 'amountCents');
    }
    const payout = await this.prisma.payout.create({
      data: {
        trainerId,
        amountCents: dto.amountCents,
        method: dto.method,
        destination: dto.destination,
      },
    });
    return {
      id: payout.id,
      amountCents: payout.amountCents,
      method: payout.method,
      destination: maskDestination(payout.destination),
      status: payout.status,
      createdAt: payout.createdAt,
    };
  }

  async history(userId: string) {
    const rows = await this.prisma.payment.findMany({
      where: { OR: [{ traineeId: userId }, { trainerId: userId }] },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        trainer: { select: { fullName: true } },
        trainee: { select: { fullName: true } },
      },
    });
    return rows.map((p) => {
      const asTrainer = p.trainerId === userId;
      return {
        id: p.id,
        txRef: p.txRef,
        direction: asTrainer ? 'earning' : 'payment',
        counterparty: asTrainer ? p.trainee.fullName : p.trainer.fullName,
        amountCents: p.amountCents,
        commissionCents: p.commissionCents,
        netCents: asTrainer ? p.payoutCents : p.amountCents,
        status: p.status,
        escrowReleased: p.escrowReleased,
        date: p.createdAt,
      };
    });
  }

  // --- helpers ---

  private async markPaid(paymentId: string, chapaRef?: string) {
    await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'paid', paidAt: new Date(), chapaRef },
    });
    this.logger.log(`Payment ${paymentId} marked paid`);
  }

  private initiateResult(payment: Payment) {
    return {
      paymentId: payment.id,
      txRef: payment.txRef,
      checkoutUrl: payment.checkoutUrl,
      amountCents: payment.amountCents,
      commissionCents: payment.commissionCents,
      status: payment.status,
    };
  }

  private appUrl(): string {
    return (this.config.get<string>('CORS_ORIGIN') ?? 'http://localhost:3000').split(',')[0];
  }

  private webhookUrl(): string {
    const port = this.config.get<number>('PORT') ?? 4000;
    return `http://localhost:${port}/api/v1/payments/webhook`;
  }
}

function maskDestination(dest: string): string {
  if (dest.length <= 4) return dest;
  return `${'•'.repeat(Math.max(0, dest.length - 4))}${dest.slice(-4)}`;
}
