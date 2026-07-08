import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Req,
  RawBodyRequest,
} from '@nestjs/common';
import type { Request } from 'express';
import { PaymentsService } from './payments.service';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Idempotent } from '../common/idempotency';
import type { AuthUser } from '../auth/auth-user';
import { InitiatePaymentDto, PayoutDto } from './dto/payments.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Roles('trainee')
  @Idempotent()
  @Post('initiate')
  initiate(@CurrentUser() user: AuthUser, @Body() dto: InitiatePaymentDto) {
    return this.payments.initiate(user.sub, dto);
  }

  @Public()
  @Post('webhook')
  webhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('chapa-signature') sig1?: string,
    @Headers('x-chapa-signature') sig2?: string,
  ) {
    const raw = req.rawBody?.toString('utf8') ?? JSON.stringify(req.body ?? {});
    return this.payments.handleWebhook(raw, sig1 ?? sig2);
  }

  @Get('verify/:txRef')
  verify(@CurrentUser() user: AuthUser, @Param('txRef') txRef: string) {
    return this.payments.verify(user.sub, txRef);
  }

  @Get('history')
  history(@CurrentUser() user: AuthUser) {
    return this.payments.history(user.sub);
  }

  @Roles('trainer')
  @Get('earnings')
  earnings(@CurrentUser() user: AuthUser) {
    return this.payments.earnings(user.sub);
  }

  @Roles('trainer')
  @Idempotent()
  @Post('payout')
  payout(@CurrentUser() user: AuthUser, @Body() dto: PayoutDto) {
    return this.payments.requestPayout(user.sub, dto);
  }
}
