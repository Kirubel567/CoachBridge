import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthUser } from '../auth-user';

/** Injects the authenticated user (access-token payload) into a handler. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    return ctx.switchToHttp().getRequest().user;
  },
);
