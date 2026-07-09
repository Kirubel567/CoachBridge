import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/auth-user';
import { CreateReviewDto, RespondReviewDto } from './dto/reviews.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  @Roles('trainee')
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateReviewDto) {
    return this.reviews.create(user.sub, dto);
  }

  @Roles('trainee')
  @Get('mine')
  mine(@CurrentUser() user: AuthUser) {
    return this.reviews.mine(user.sub);
  }

  @Roles('trainer')
  @Post(':id/respond')
  respond(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: RespondReviewDto,
  ) {
    return this.reviews.respond(id, user.sub, dto);
  }
}
