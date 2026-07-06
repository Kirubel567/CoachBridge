import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';

interface ErrorBody {
  success: false;
  error: { code: string; message: string; field?: string };
}

// Maps HTTP status → a stable error code for plain HttpExceptions that don't
// already carry one.
const CODE_BY_STATUS: Record<number, string> = {
  400: 'VALIDATION_ERROR',
  401: 'UNAUTHENTICATED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  429: 'RATE_LIMITED',
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const { status, body } = this.resolve(exception);

    if (status >= 500) {
      this.logger.error(
        `${req.method} ${req.url} -> ${status} ${body.error.code}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    res.status(status).json(body);
  }

  private resolve(exception: unknown): { status: number; body: ErrorBody } {
    // 1. Our domain errors already carry { code, message, field }.
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();

      // ValidationPipe throws BadRequestException with a `message` array.
      if (typeof response === 'object' && response !== null) {
        const r = response as Record<string, unknown>;
        if (r.code) {
          return {
            status,
            body: {
              success: false,
              error: {
                code: String(r.code),
                message: String(r.message ?? exception.message),
                field: r.field ? String(r.field) : undefined,
              },
            },
          };
        }
        const message = Array.isArray(r.message)
          ? String(r.message[0])
          : String(r.message ?? exception.message);
        return {
          status,
          body: {
            success: false,
            error: {
              code: CODE_BY_STATUS[status] ?? 'ERROR',
              message,
            },
          },
        };
      }

      return {
        status,
        body: {
          success: false,
          error: {
            code: CODE_BY_STATUS[status] ?? 'ERROR',
            message: exception.message,
          },
        },
      };
    }

    // 2. Prisma unique-constraint violation → CONFLICT.
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        const field = (exception.meta?.target as string[] | undefined)?.[0];
        return {
          status: HttpStatus.CONFLICT,
          body: {
            success: false,
            error: {
              code: 'CONFLICT',
              message: 'A record with that value already exists.',
              field,
            },
          },
        };
      }
      if (exception.code === 'P2025') {
        return {
          status: HttpStatus.NOT_FOUND,
          body: {
            success: false,
            error: { code: 'NOT_FOUND', message: 'Resource not found.' },
          },
        };
      }
    }

    // 3. Anything else is an unexpected server error.
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        error: { code: 'INTERNAL', message: 'Something went wrong.' },
      },
    };
  }
}
