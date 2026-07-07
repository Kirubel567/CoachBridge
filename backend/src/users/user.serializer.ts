import type { Prisma, User } from '@prisma/client';

type UserWithProfiles = User & {
  traineeProfile?: Prisma.TraineeProfileGetPayload<true> | null;
  trainerProfile?: Prisma.TrainerProfileGetPayload<true> | null;
};

/** Strips secrets (passwordHash) and shapes a user for API responses. */
export function toPublicUser(user: UserWithProfiles) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    emailVerified: user.emailVerified,
    avatarUrl: user.avatarUrl,
    suspended: user.suspended,
    createdAt: user.createdAt,
    traineeProfile: user.traineeProfile ?? undefined,
    trainerProfile: user.trainerProfile ?? undefined,
  };
}

/** Minimal public view for GET /users/:id (no email for non-self). */
export function toPublicProfile(user: UserWithProfiles) {
  return {
    id: user.id,
    fullName: user.fullName,
    role: user.role,
    avatarUrl: user.avatarUrl,
    trainerProfile: user.trainerProfile ?? undefined,
  };
}
