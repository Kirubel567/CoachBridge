import type { Prisma } from '@prisma/client';

// A TrainerProfile row joined with its owning User.
export type TrainerWithUser = Prisma.TrainerProfileGetPayload<{
  include: { user: true };
}>;

const ACCENTS = ['#7C5CFF', '#CDFF4A', '#FF7C5C', '#5CC8FF', '#FF5C9E', '#5CFFB0'];

/** Deterministic accent so a trainer always renders the same gradient colour. */
function accentFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return ACCENTS[h % ACCENTS.length];
}

function initialsFor(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/** Discovery card / list item. Money stays in integer cents of ETB. */
export function toTrainerListItem(t: TrainerWithUser) {
  return {
    id: t.user.id,
    name: t.user.fullName,
    initials: initialsFor(t.user.fullName),
    accent: accentFor(t.user.id),
    avatarUrl: t.user.avatarUrl,
    specialty: t.specialties[0] ?? 'Coach',
    specialties: t.specialties,
    tags: t.specialties.slice(0, 3),
    bio: t.bio ?? '',
    city: t.city,
    location: t.location ?? t.city,
    rating: Number(t.ratingAvg.toFixed(2)),
    reviewCount: t.ratingCount,
    sessions: t.sessionsCount,
    pricePerSession: t.pricePerSession, // cents ETB
    experienceYears: t.experienceYears,
    verified: t.verificationStatus,
    sessionTypes: t.sessionTypes,
  };
}

/** Full public profile (adds recent reviews). */
export function toTrainerDetail(
  t: TrainerWithUser,
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    response: string | null;
    createdAt: Date;
    author: { fullName: string; avatarUrl: string | null };
  }>,
) {
  return {
    ...toTrainerListItem(t),
    emailVerified: t.user.emailVerified,
    gallery: [] as string[],
    reviews: reviews.map((r) => ({
      id: r.id,
      author: r.author.fullName,
      authorAvatar: r.author.avatarUrl,
      rating: r.rating,
      comment: r.comment,
      response: r.response,
      date: r.createdAt,
    })),
  };
}
