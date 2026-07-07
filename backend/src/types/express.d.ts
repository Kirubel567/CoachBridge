import type { AuthUser } from '../auth/auth-user';

// Augment Express' Request so guards/controllers can read the authed user.
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
