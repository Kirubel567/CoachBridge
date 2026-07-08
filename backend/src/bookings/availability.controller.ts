import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/auth-user';
import { SetAvailabilityDto } from './dto/availability.dto';

@Controller()
export class AvailabilityController {
  constructor(private readonly availability: AvailabilityService) {}

  @Roles('trainer')
  @Put('availability')
  setAvailability(@CurrentUser() user: AuthUser, @Body() dto: SetAvailabilityDto) {
    return this.availability.setRules(user.sub, dto);
  }

  @Public()
  @Get('trainers/:id/availability')
  getAvailability(@Param('id') id: string) {
    return this.availability.getSlots(id);
  }
}
