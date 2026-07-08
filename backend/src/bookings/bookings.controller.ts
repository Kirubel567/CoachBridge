import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipEnvelope } from '../common/skip-envelope.decorator';
import { Idempotent } from '../common/idempotency';
import type { AuthUser } from '../auth/auth-user';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Roles('trainee')
  @Idempotent()
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateBookingDto) {
    return this.bookings.create(user.sub, dto);
  }

  @Get('mine')
  mine(@CurrentUser() user: AuthUser) {
    return this.bookings.mine(user.sub);
  }

  @Roles('trainer')
  @Patch(':id/accept')
  accept(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.bookings.accept(id, user.sub);
  }

  @Roles('trainer')
  @Patch(':id/reject')
  reject(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.bookings.reject(id, user.sub);
  }

  @Patch(':id/complete')
  complete(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.bookings.complete(id, user.sub);
  }

  @Delete(':id')
  cancel(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.bookings.cancel(id, user.sub);
  }

  @Get(':id/ics')
  @SkipEnvelope()
  @Header('Content-Type', 'text/calendar; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="coachbridge-session.ics"')
  ics(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.bookings.getIcs(id, user.sub);
  }
}
