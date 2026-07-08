import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/auth-user';
import { PaginationQuery } from '../common/pagination';
import { ListTrainersDto } from './dto/list-trainers.dto';
import { MatchDto } from './dto/match.dto';

@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainers: TrainersService) {}

  @Public()
  @Get()
  list(@Query() query: ListTrainersDto) {
    return this.trainers.list(query);
  }

  // Trainee-only routes must precede the ":id" catch-all so they aren't shadowed.
  @Roles('trainee')
  @Post('match')
  match(@CurrentUser() user: AuthUser, @Body() dto: MatchDto) {
    return this.trainers.match(user.sub, dto);
  }

  @Roles('trainee')
  @Get('me/matches')
  myMatches(@CurrentUser() user: AuthUser) {
    return this.trainers.myMatches(user.sub);
  }

  @Public()
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.trainers.getOne(id);
  }

  @Public()
  @Get(':id/reviews')
  reviews(@Param('id') id: string, @Query() pagination: PaginationQuery) {
    return this.trainers.listReviews(id, pagination);
  }
}
