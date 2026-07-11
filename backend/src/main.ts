import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join, isAbsolute } from 'path';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/all-exceptions.filter';

async function bootstrap() {
  // rawBody is needed to verify Chapa's webhook HMAC signature.
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });
  const config = app.get(ConfigService);

  // Serve uploaded files (progress photos, etc.) at /uploads — outside the API prefix.
  const uploadDir = config.get<string>('UPLOAD_DIR') ?? './uploads';
  app.useStaticAssets(isAbsolute(uploadDir) ? uploadDir : join(process.cwd(), uploadDir), {
    prefix: '/uploads',
  });

  // Everything lives under /api/v1 to match docs/API.md and NEXT_PUBLIC_API_URL.
  app.setGlobalPrefix('api/v1');

  // Allow the frontend (different origin) to load uploaded images.
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cookieParser());
  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN')?.split(',') ?? true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = config.get<number>('PORT') ?? 4000;
  await app.listen(port);
  Logger.log(
    `CoachBridge API ready on http://localhost:${port}/api/v1`,
    'Bootstrap',
  );
}

void bootstrap();
