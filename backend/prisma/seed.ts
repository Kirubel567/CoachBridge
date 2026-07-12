import { PrismaClient } from '@prisma/client';
import { hash } from '@node-rs/argon2';

const prisma = new PrismaClient();
const PASSWORD = 'coachbridge123'; // demo password for every seeded account

const WEEKDAY_RULES = [1, 2, 3, 4, 5].map((d) => ({
  dayOfWeek: d,
  startMinute: 8 * 60,
  endMinute: 18 * 60,
}));

interface TrainerSeed {
  name: string;
  email: string;
  bio: string;
  specialties: string[];
  city: string;
  location: string;
  priceCents: number;
  experienceYears: number;
  sessionTypes: string[];
  ratings: number[]; // one per review
}

const TRAINERS: TrainerSeed[] = [
  {
    name: 'Selam Bekele', email: 'selam@coachbridge.et',
    bio: 'Strength & conditioning coach helping busy professionals get strong.',
    specialties: ['Strength', 'HIIT'], city: 'Addis Ababa', location: 'Bole, Addis Ababa',
    priceCents: 80000, experienceYears: 6, sessionTypes: ['in-person', 'online'], ratings: [5, 5, 4],
  },
  {
    name: 'Dawit Alemu', email: 'dawit@coachbridge.et',
    bio: 'Yoga and mobility specialist focused on longevity and pain-free movement.',
    specialties: ['Yoga', 'Mobility'], city: 'Addis Ababa', location: 'Kazanchis, Addis Ababa',
    priceCents: 55000, experienceYears: 4, sessionTypes: ['online'], ratings: [5, 4],
  },
  {
    name: 'Hanna Girma', email: 'hanna@coachbridge.et',
    bio: 'Weight-loss and nutrition expert with a sustainable, food-first approach.',
    specialties: ['Weight loss', 'Nutrition'], city: 'Bahir Dar', location: 'Bahir Dar',
    priceCents: 120000, experienceYears: 9, sessionTypes: ['in-person'], ratings: [5, 5, 5, 4],
  },
  {
    name: 'Yonas Tesfaye', email: 'yonas@coachbridge.et',
    bio: 'Bodybuilding coach — hypertrophy programming and contest prep.',
    specialties: ['Bodybuilding', 'Strength'], city: 'Addis Ababa', location: 'Sarbet, Addis Ababa',
    priceCents: 95000, experienceYears: 7, sessionTypes: ['in-person', 'online'], ratings: [5, 4, 5],
  },
  {
    name: 'Marta Assefa', email: 'marta@coachbridge.et',
    bio: 'Pre-natal and post-natal specialist. Safe, confident training for mothers.',
    specialties: ['Pre-natal', 'Mobility'], city: 'Hawassa', location: 'Hawassa',
    priceCents: 70000, experienceYears: 5, sessionTypes: ['in-person', 'online'], ratings: [5, 5],
  },
  {
    name: 'Bruk Kebede', email: 'bruk@coachbridge.et',
    bio: 'Boxing and HIIT coach. High-energy sessions that torch calories.',
    specialties: ['Boxing', 'HIIT'], city: 'Addis Ababa', location: 'Piassa, Addis Ababa',
    priceCents: 85000, experienceYears: 8, sessionTypes: ['in-person'], ratings: [4, 5, 4],
  },
];

const TRAINEES = [
  { name: 'Liya Haile', email: 'liya@coachbridge.et' },
  { name: 'Sara Mekonnen', email: 'sara@coachbridge.et' },
  { name: 'Demo Trainee', email: 'demo@coachbridge.et' },
];

async function upsertUser(email: string, fullName: string, role: 'trainee' | 'trainer' | 'admin', passwordHash: string) {
  return prisma.user.upsert({
    where: { email },
    create: { email, fullName, role, passwordHash, emailVerified: true },
    update: { fullName, role, emailVerified: true },
  });
}

async function main() {
  const passwordHash = await hash(PASSWORD);

  // Admin
  await upsertUser('admin@coachbridge.et', 'Platform Admin', 'admin', passwordHash);

  // Trainees
  const trainees = [];
  for (const t of TRAINEES) {
    const u = await upsertUser(t.email, t.name, 'trainee', passwordHash);
    await prisma.traineeProfile.upsert({
      where: { userId: u.id },
      create: { userId: u.id, goals: ['Weight loss', 'General fitness'], city: 'Addis Ababa', preferredSessionTypes: ['online'] },
      update: {},
    });
    trainees.push(u);
  }

  // Trainers
  for (const t of TRAINERS) {
    const u = await upsertUser(t.email, t.name, 'trainer', passwordHash);
    const ratingAvg = t.ratings.reduce((a, b) => a + b, 0) / t.ratings.length;

    await prisma.trainerProfile.upsert({
      where: { userId: u.id },
      create: {
        userId: u.id, bio: t.bio, specialties: t.specialties, experienceYears: t.experienceYears,
        pricePerSession: t.priceCents, city: t.city, location: t.location, sessionTypes: t.sessionTypes,
        verificationStatus: 'verified', ratingAvg, ratingCount: t.ratings.length, sessionsCount: t.ratings.length * 3,
      },
      update: {
        bio: t.bio, specialties: t.specialties, experienceYears: t.experienceYears,
        pricePerSession: t.priceCents, city: t.city, location: t.location, sessionTypes: t.sessionTypes,
        verificationStatus: 'verified', ratingAvg, ratingCount: t.ratings.length, sessionsCount: t.ratings.length * 3,
      },
    });

    // Availability (reset then create)
    await prisma.availabilityRule.deleteMany({ where: { trainerId: u.id } });
    await prisma.availabilityRule.createMany({ data: WEEKDAY_RULES.map((r) => ({ ...r, trainerId: u.id })) });

    // Verified certification
    await prisma.certification.deleteMany({ where: { trainerId: u.id } });
    await prisma.certification.create({
      data: {
        trainerId: u.id, title: `${t.specialties[0]} Certification`, issuer: 'Ethiopian Fitness Council',
        documentUrl: '/uploads/certifications/seed.pdf', status: 'verified', reviewedAt: new Date(),
      },
    });

    // Reviews from seeded trainees
    await prisma.review.deleteMany({ where: { trainerId: u.id } });
    const comments = ['Fantastic coach, saw real results!', 'Professional and motivating.', 'Highly recommend.', 'Changed how I train.'];
    for (let i = 0; i < t.ratings.length; i++) {
      const author = trainees[i % trainees.length];
      await prisma.review.create({
        data: { trainerId: u.id, authorId: author.id, rating: t.ratings[i], comment: comments[i % comments.length] },
      });
    }
  }

  const counts = {
    users: await prisma.user.count(),
    trainers: await prisma.trainerProfile.count(),
    reviews: await prisma.review.count(),
  };
  console.log('Seed complete:', counts, `\nDemo login → any seeded email + password "${PASSWORD}" (e.g. demo@coachbridge.et / admin@coachbridge.et)`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
