import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Page } from './pagination';
import { SKIP_ENVELOPE } from './skip-envelope.decorator';

interface Envelope<T> {
  success: true;
  data: T;
  meta?: unknown;
}

function isPage(value: unknown): value is Page<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { __page?: unknown }).__page === true
  );
}

/**
 * Wraps every successful controller return in the standard success envelope
 * `{ success: true, data, meta? }` the frontend's http.ts expects. Controllers
 * that return a paginate() Page get their `data`/`meta` hoisted automatically.
 */
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, unknown>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<unknown> {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_ENVELOPE, [
      context.getHandler(),
      context.getClass(),
    ]);
    return next.handle().pipe(
      map((payload): unknown => {
        if (skip) return payload;
        if (isPage(payload)) {
          return { success: true, data: payload.data, meta: payload.meta };
        }
        return { success: true, data: payload } satisfies Envelope<unknown>;
      }),
    );
  }
}
