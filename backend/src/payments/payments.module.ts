import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ChapaService } from './chapa.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, ChapaService],
})
export class PaymentsModule {}
