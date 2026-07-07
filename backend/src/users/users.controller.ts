import { Body, Controller, Delete, Get, Param, Patch, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/auth-user';
import {
  UpdateMeDto,
  UpsertTraineeProfileDto,
  UpsertTrainerProfileDto,
} from './dto/users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Patch('me')
  updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateMeDto) {
    return this.users.updateMe(user.sub, dto);
  }

  @Delete('me')
  deleteMe(@CurrentUser() user: AuthUser) {
    return this.users.deleteMe(user.sub);
  }

  @Roles('trainee')
  @Put('me/trainee')
  upsertTrainee(@CurrentUser() user: AuthUser, @Body() dto: UpsertTraineeProfileDto) {
    return this.users.upsertTraineeProfile(user.sub, dto);
  }

  @Roles('trainer')
  @Put('me/trainer')
  upsertTrainer(@CurrentUser() user: AuthUser, @Body() dto: UpsertTrainerProfileDto) {
    return this.users.upsertTrainerProfile(user.sub, dto);
  }

  // Public profile — keep this last so it doesn't shadow /me routes.
  @Public()
  @Get(':id')
  getPublic(@Param('id') id: string) {
    return this.users.getPublic(id);
  }
}
