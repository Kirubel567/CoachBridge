import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/auth-user';
import { CreatePlanDto, FromTemplateDto, UpdatePlanDto } from './dto/plans.dto';

@Controller('plans')
export class PlansController {
  constructor(private readonly plans: PlansService) {}

  // Static/collection routes must precede ":id".
  @Get('templates')
  templates() {
    return this.plans.listTemplates();
  }

  @Get('templates/:key')
  template(@Param('key') key: string) {
    return this.plans.getTemplate(key);
  }

  @Roles('trainee')
  @Get('mine')
  mine(@CurrentUser() user: AuthUser) {
    return this.plans.mine(user.sub);
  }

  @Roles('trainer')
  @Get('trainee/:id')
  forTrainee(@CurrentUser() user: AuthUser, @Param('id') traineeId: string) {
    return this.plans.forTrainee(user.sub, traineeId);
  }

  @Roles('trainer')
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreatePlanDto) {
    return this.plans.create(user.sub, dto);
  }

  @Roles('trainer')
  @Post('from-template')
  fromTemplate(@CurrentUser() user: AuthUser, @Body() dto: FromTemplateDto) {
    return this.plans.createFromTemplate(user.sub, dto);
  }

  @Get(':id')
  get(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.plans.get(id, user);
  }

  @Roles('trainer')
  @Put(':id')
  update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.plans.update(id, user.sub, dto);
  }

  @Roles('trainer')
  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.plans.remove(id, user.sub);
  }
}
