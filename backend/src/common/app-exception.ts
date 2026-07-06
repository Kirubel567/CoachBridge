import { HttpException, HttpStatus } from '@nestjs/common';

// The error codes the frontend (lib/http.ts) branches on. Kept in sync with
// docs/API.md "Common codes".
export type AppErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'EMAIL_IN_USE'
  | 'INVALID_CREDENTIALS'
  | 'PAYMENT_FAILED'
  | 'SLOT_UNAVAILABLE'
  | 'RATE_LIMITED'
  | 'INTERNAL';

const STATUS_BY_CODE: Record<AppErrorCode, HttpStatus> = {
  VALIDATION_ERROR: HttpStatus.BAD_REQUEST,
  UNAUTHENTICATED: HttpStatus.UNAUTHORIZED,
  FORBIDDEN: HttpStatus.FORBIDDEN,
  NOT_FOUND: HttpStatus.NOT_FOUND,
  CONFLICT: HttpStatus.CONFLICT,
  EMAIL_IN_USE: HttpStatus.CONFLICT,
  INVALID_CREDENTIALS: HttpStatus.UNAUTHORIZED,
  PAYMENT_FAILED: HttpStatus.PAYMENT_REQUIRED,
  SLOT_UNAVAILABLE: HttpStatus.CONFLICT,
  RATE_LIMITED: HttpStatus.TOO_MANY_REQUESTS,
  INTERNAL: HttpStatus.INTERNAL_SERVER_ERROR,
};

/**
 * Domain error that carries a stable machine code (and optional form field),
 * so the exception filter can emit the { code, message, field } envelope the
 * frontend expects.
 */
export class AppException extends HttpException {
  readonly code: AppErrorCode;
  readonly field?: string;

  constructor(code: AppErrorCode, message: string, field?: string) {
    super({ code, message, field }, STATUS_BY_CODE[code]);
    this.code = code;
    this.field = field;
  }
}
