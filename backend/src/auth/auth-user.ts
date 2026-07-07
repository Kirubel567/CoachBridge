import { Role } from '@prisma/client';

/** The decoded access-token payload attached to req.user by the auth guard. */
export interface AuthUser {
  sub: string; // user id
  role: Role;
  email: string;
  iat?: number;
  exp?: number;
}
