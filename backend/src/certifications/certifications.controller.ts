import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CertificationsService } from './certifications.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/auth-user';
import { SubmitCertificationDto } from './dto/certifications.dto';
import { certFileFilter, certStorage, MAX_CERT_BYTES } from './upload.config';

@Controller('certifications')
export class CertificationsController {
  constructor(private readonly certs: CertificationsService) {}

  @Roles('trainer')
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'document', maxCount: 1 },
        { name: 'govId', maxCount: 1 },
      ],
      { storage: certStorage, limits: { fileSize: MAX_CERT_BYTES }, fileFilter: certFileFilter },
    ),
  )
  submit(
    @CurrentUser() user: AuthUser,
    @Body() dto: SubmitCertificationDto,
    @UploadedFiles() files: { document?: Express.Multer.File[]; govId?: Express.Multer.File[] },
  ) {
    return this.certs.submit(user.sub, dto, files ?? {});
  }

  @Roles('trainer')
  @Get('status')
  status(@CurrentUser() user: AuthUser) {
    return this.certs.status(user.sub);
  }
}
