import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import type { Request } from 'express';
import { AppException } from '../../common/app-exception';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { AuthUser } from '../auth-user';

/**
 * Global guard: enforces @Roles(...) on a route. Runs after AccessTokenGuard,
 * so req.user is present. Routes without @Roles are unrestricted (any auth user).
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!roles || roles.length === 0) return true;

    const user = ctx.switchToHttp().getRequest<Request>().user as AuthUser | undefined;
    if (!user || !roles.includes(user.role)) {
      throw new AppException('FORBIDDEN', 'You do not have access to this resource.');
    }
    return true;
  }
}
