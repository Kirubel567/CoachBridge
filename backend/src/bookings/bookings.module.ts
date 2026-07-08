import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { AvailabilityService } from './availability.service';
import { AvailabilityController } from './availability.controller';

@Module({
  controllers: [BookingsController, AvailabilityController],
  providers: [BookingsService, AvailabilityService],
})
export class BookingsModule {}
