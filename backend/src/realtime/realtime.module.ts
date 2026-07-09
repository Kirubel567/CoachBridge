import { Global, Module } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';
import { AuthModule } from '../auth/auth.module';

// Global so any feature (messages, bookings, payments) can push realtime events.
@Global()
@Module({
  imports: [AuthModule], // TokensService for socket auth
  providers: [RealtimeGateway],
  exports: [RealtimeGateway],
})
export class RealtimeModule {}
