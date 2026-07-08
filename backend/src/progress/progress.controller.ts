import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProgressService } from './progress.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AppException } from '../common/app-exception';
import type { AuthUser } from '../auth/auth-user';
import { CreateProgressDto } from './dto/progress.dto';
import { imageFileFilter, MAX_PHOTO_BYTES, progressPhotoStorage } from './upload.config';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progress: ProgressService) {}

  @Roles('trainee')
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateProgressDto) {
    return this.progress.create(user.sub, dto);
  }

  @Roles('trainee')
  @Get('mine')
  mine(@CurrentUser() user: AuthUser) {
    return this.progress.mine(user.sub);
  }

  @Get('analytics')
  analytics(@CurrentUser() user: AuthUser, @Query('traineeId') traineeId?: string) {
    return this.progress.analytics(user.sub, user.role, traineeId);
  }

  @Roles('trainee')
  @Post('photos')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: progressPhotoStorage,
      limits: { fileSize: MAX_PHOTO_BYTES },
      fileFilter: imageFileFilter,
    }),
  )
  uploadPhoto(@CurrentUser() user: AuthUser, @UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new AppException('VALIDATION_ERROR', 'No photo uploaded.', 'photo');
    return this.progress.addPhoto(user.sub, `/uploads/progress/${file.filename}`);
  }

  @Roles('trainee')
  @Get('photos')
  listPhotos(@CurrentUser() user: AuthUser) {
    return this.progress.photos(user.sub);
  }
}
