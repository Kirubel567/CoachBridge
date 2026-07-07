import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import type { Request } from 'express';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from './app-exception';

export const IDEMPOTENT_KEY = 'idempotent';

/** Marks a route as requiring an `Idempotency-Key` header (payments, bookings). */
export const Idempotent = () => SetMetadata(IDEMPOTENT_KEY, true);

/**
 * For @Idempotent() routes: requires the header, returns the cached response on
 * a repeat, and stores the result on first success. Runs inside the response
 * envelope interceptor so it caches the raw handler payload.
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const idempotent = this.reflector.getAllAndOverride<boolean>(IDEMPOTENT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!idempotent) return next.handle();

    const req = context.switchToHttp().getRequest<Request>();
    const key = req.headers['idempotency-key'];
    if (!key || typeof key !== 'string') {
      throw new AppException('VALIDATION_ERROR', 'Idempotency-Key header is required.', 'Idempotency-Key');
    }
    const userId = req.user?.sub ?? 'anon';
    const id = `${userId}:${key}`;

    const existing = await this.prisma.idempotencyKey.findUnique({ where: { id } });
    if (existing) return of(existing.response);

    return next.handle().pipe(
      tap((data) => {
        void this.prisma.idempotencyKey
          .create({ data: { id, response: (data ?? {}) as Prisma.InputJsonValue } })
          .catch(() => undefined); // ignore races / duplicate keys
      }),
    );
  }
}
