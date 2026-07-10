import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CertificationsService } from '../certifications/certifications.service';
import { AuditService } from '../audit/audit.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/auth-user';
import { PaginationQuery } from '../common/pagination';
import { AdminUsersQuery, ModerateDto, RejectCertDto, SuspendDto } from './dto/admin.dto';

@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly admin: AdminService,
    private readonly certs: CertificationsService,
    private readonly audit: AuditService,
  ) {}

  // --- users ---
  @Get('users')
  users(@Query() q: AdminUsersQuery) {
    return this.admin.users(q);
  }

  @Patch('users/:id/suspend')
  suspend(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: SuspendDto) {
    return this.admin.setSuspended(id, user.sub, dto.suspended ?? true);
  }

  @Delete('users/:id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.admin.remove(id, user.sub);
  }

  // --- certifications ---
  @Get('certifications/queue')
  certQueue(@Query() q: PaginationQuery) {
    return this.certs.queue(q);
  }

  @Patch('certifications/:id/verify')
  verifyCert(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.certs.verify(id, user.sub);
  }

  @Patch('certifications/:id/reject')
  rejectCert(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: RejectCertDto) {
    return this.certs.reject(id, user.sub, dto.reason);
  }

  // --- moderation ---
  @Get('messages/flagged')
  flaggedMessages(@Query() q: PaginationQuery) {
    return this.admin.flaggedMessages(q);
  }

  @Patch('messages/:id/moderate')
  moderateMessage(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: ModerateDto) {
    return this.admin.moderateMessage(id, user.sub, dto);
  }

  @Get('reviews/flagged')
  flaggedReviews(@Query() q: PaginationQuery) {
    return this.admin.flaggedReviews(q);
  }

  @Patch('reviews/:id/moderate')
  moderateReview(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: ModerateDto) {
    return this.admin.moderateReview(id, user.sub, dto);
  }

  // --- reports & audit ---
  @Get('reports/financial')
  financial() {
    return this.admin.financialReport();
  }

  @Get('reports/usage')
  usage() {
    return this.admin.usageReport();
  }

  @Get('audit')
  auditLog(@Query() q: PaginationQuery) {
    return this.audit.list(q);
  }
}
