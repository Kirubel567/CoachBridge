import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/auth-user';
import { PaginationQuery } from '../common/pagination';
import { SendMessageDto, StartMessageDto } from './dto/messages.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messages: MessagesService) {}

  @Get('inbox')
  inbox(@CurrentUser() user: AuthUser) {
    return this.messages.inbox(user.sub);
  }

  // Start or continue a conversation by recipient id.
  @Post()
  start(@CurrentUser() user: AuthUser, @Body() dto: StartMessageDto) {
    return this.messages.sendToUser(user.sub, dto.toUserId, dto.body);
  }

  @Get(':conversationId')
  history(
    @CurrentUser() user: AuthUser,
    @Param('conversationId') conversationId: string,
    @Query() q: PaginationQuery,
  ) {
    return this.messages.history(user.sub, conversationId, q);
  }

  @Post(':conversationId')
  send(
    @CurrentUser() user: AuthUser,
    @Param('conversationId') conversationId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.messages.send(user.sub, conversationId, dto.body);
  }
}
