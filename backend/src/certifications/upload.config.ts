import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { randomBytes } from 'crypto';
import type { Request } from 'express';
import { AppException } from '../common/app-exception';

const root = process.env.UPLOAD_DIR || './uploads';
export const CERT_DIR = join(root, 'certifications');
if (!existsSync(CERT_DIR)) mkdirSync(CERT_DIR, { recursive: true });

export const MAX_CERT_BYTES = 10 * 1024 * 1024; // 10 MB

export const certStorage = diskStorage({
  destination: CERT_DIR,
  filename: (_req, file, cb) => {
    cb(null, randomBytes(12).toString('hex') + extname(file.originalname));
  },
});

export function certFileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) {
  if (/^(image\/(png|jpe?g|webp)|application\/pdf)$/.test(file.mimetype)) cb(null, true);
  else cb(new AppException('VALIDATION_ERROR', 'Only PDF or image files are allowed.', 'document'), false);
}
