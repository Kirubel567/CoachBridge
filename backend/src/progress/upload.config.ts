import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { randomBytes } from 'crypto';
import type { Request } from 'express';
import { AppException } from '../common/app-exception';

const root = process.env.UPLOAD_DIR || './uploads';
export const PROGRESS_DIR = join(root, 'progress');
if (!existsSync(PROGRESS_DIR)) mkdirSync(PROGRESS_DIR, { recursive: true });

export const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB

export const progressPhotoStorage = diskStorage({
  destination: PROGRESS_DIR,
  filename: (_req, file, cb) => {
    cb(null, randomBytes(12).toString('hex') + extname(file.originalname));
  },
});

export function imageFileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) {
  if (/^image\/(png|jpe?g|webp)$/.test(file.mimetype)) cb(null, true);
  // An AppException (HttpException) is preserved by Nest's multer layer → 400.
  else cb(new AppException('VALIDATION_ERROR', 'Only PNG, JPG, or WEBP images are allowed.', 'photo'), false);
}
