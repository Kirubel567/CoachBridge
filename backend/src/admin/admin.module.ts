import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { CertificationsModule } from '../certifications/certifications.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [CertificationsModule, AuthModule], // CertificationsService + TokensService
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
