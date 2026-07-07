import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { TokensService } from '../tokens.service';
import { AppException } from '../../common/app-exception';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * Global guard: requires a valid Bearer access token unless the route is
 * marked @Public(). On success, attaches the decoded payload to req.user.
 */
@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokens: TokensService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;

    const req = ctx.switchToHttp().getRequest<Request>();
    const header = req.headers['authorization'];
    if (!header || !header.startsWith('Bearer ')) {
      throw new AppException('UNAUTHENTICATED', 'Authentication required.');
    }

    try {
      req.user = await this.tokens.verifyAccessToken(header.slice(7));
    } catch {
      throw new AppException('UNAUTHENTICATED', 'Invalid or expired token.');
    }
    return true;
  }
}
