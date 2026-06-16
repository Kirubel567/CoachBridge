import type { Trainer, Review, DayAvailability, Booking } from "./types";

// ------------------------------------------------------------------
// Mock "database". Replaced by real API responses in Phase 7.
// ------------------------------------------------------------------

export const mockTrainers: Trainer[] = [
  {
    id: "selam-bekele",
    name: "Selam Bekele",
    initials: "SB",
    accent: "#7c5cff",
    specialty: "Strength & Conditioning",
    location: "Bole, Addis Ababa",
    city: "Addis Ababa",
    rating: 4.9,
    reviewCount: 128,
    sessions: 320,
    price: 700,
    experienceYears: 7,
    verified: "verified",
    sessionTypes: ["in-person", "online"],
    tags: ["Strength", "Weight loss", "Beginner-friendly"],
    bio: "Certified strength coach helping busy professionals build sustainable strength and drop fat without living in the gym.",
    gallery: ["g1", "g2", "g3"],
  },
  {
    id: "dawit-girma",
    name: "Dawit Girma",
    initials: "DG",
    accent: "#cdff4a",
    specialty: "Functional Training",
    location: "Bole, Addis Ababa",
    city: "Addis Ababa",
    rating: 4.8,
    reviewCount: 86,
    sessions: 210,
    price: 600,
    experienceYears: 5,
    verified: "verified",
    sessionTypes: ["in-person"],
    tags: ["Mobility", "Athletic", "Rehab"],
    bio: "Former national athlete focused on functional movement, mobility, and injury-proofing everyday people.",
    gallery: ["g1", "g2"],
  },
  {
    id: "hanna-tesfaye",
    name: "Hanna Tesfaye",
    initials: "HT",
    accent: "#b8a4ff",
    specialty: "Yoga & Nutrition",
    location: "Kazanchis, Addis Ababa",
    city: "Addis Ababa",
    rating: 5.0,
    reviewCount: 203,
    sessions: 415,
    price: 550,
    experienceYears: 9,
    verified: "verified",
    sessionTypes: ["in-person", "online"],
    tags: ["Yoga", "Nutrition", "Mindfulness"],
    bio: "Yoga instructor and certified nutritionist blending movement and food for calm, lasting change.",
    gallery: ["g1", "g2", "g3", "g4"],
  },
  {
    id: "yonas-alemu",
    name: "Yonas Alemu",
    initials: "YA",
    accent: "#7c5cff",
    specialty: "Bodybuilding Coach",
    location: "Piassa, Addis Ababa",
    city: "Addis Ababa",
    rating: 4.9,
    reviewCount: 141,
    sessions: 280,
    price: 800,
    experienceYears: 8,
    verified: "verified",
    sessionTypes: ["in-person"],
    tags: ["Hypertrophy", "Competition prep"],
    bio: "Competition bodybuilder coaching aesthetics, contest prep, and disciplined nutrition.",
    gallery: ["g1", "g2", "g3"],
  },
  {
    id: "mekdes-fikru",
    name: "Mekdes Fikru",
    initials: "MF",
    accent: "#b8a4ff",
    specialty: "Pre/Post-natal Fitness",
    location: "Sarbet, Addis Ababa",
    city: "Addis Ababa",
    rating: 4.9,
    reviewCount: 64,
    sessions: 150,
    price: 650,
    experienceYears: 6,
    verified: "verified",
    sessionTypes: ["in-person", "online"],
    tags: ["Pre-natal", "Post-natal", "Women's health"],
    bio: "Specialist in safe, empowering training for mothers before and after birth.",
    gallery: ["g1", "g2"],
  },
  {
    id: "abel-tsegaye",
    name: "Abel Tsegaye",
    initials: "AT",
    accent: "#cdff4a",
    specialty: "Boxing & HIIT",
    location: "Megenagna, Addis Ababa",
    city: "Addis Ababa",
    rating: 4.7,
    reviewCount: 97,
    sessions: 240,
    price: 700,
    experienceYears: 6,
    verified: "verified",
    sessionTypes: ["in-person"],
    tags: ["Boxing", "HIIT", "Conditioning"],
    bio: "Boxing coach bringing high-energy conditioning and real self-defense fundamentals.",
    gallery: ["g1", "g2", "g3"],
  },
];

export const mockReviews: Review[] = [
  {
    id: "r1",
    author: "Meron A.",
    authorInitials: "MA",
    rating: 5,
    comment:
      "Booking took seconds and I've lost 8kg in three months. Selam adjusts every session to how I feel.",
    date: "2026-05-12",
  },
  {
    id: "r2",
    author: "Robel K.",
    authorInitials: "RK",
    rating: 5,
    comment: "Professional, punctual, and genuinely cares about progress.",
    date: "2026-04-28",
  },
  {
    id: "r3",
    author: "Kalkidan T.",
    authorInitials: "KT",
    rating: 4,
    comment: "Great programming. The progress charts keep me accountable.",
    date: "2026-04-03",
  },
];

const times = ["06:00", "07:30", "09:00", "12:00", "17:00", "18:30", "20:00"];
const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function mockAvailability(seed = 0): DayAvailability[] {
  return dayNames.map((day, di) => ({
    day,
    date: new Date(2026, 6, 13 + di).toISOString(),
    slots: times.map((time, ti) => ({
      time,
      taken: (di * 7 + ti + seed) % 4 === 0,
    })),
  }));
}

export const mockBookings: Booking[] = [
  {
    id: "b1",
    trainerId: "hanna-tesfaye",
    trainerName: "Hanna Tesfaye",
    date: new Date(2026, 6, 11).toISOString(),
    time: "07:30",
    type: "in-person",
    status: "confirmed",
    price: 550,
  },
  {
    id: "b2",
    trainerId: "selam-bekele",
    trainerName: "Selam Bekele",
    date: new Date(2026, 6, 3).toISOString(),
    time: "18:30",
    type: "online",
    status: "completed",
    price: 700,
  },
];

// ---- Dashboard mock data ----------------------------------------

export const mockConversations = [
  {
    id: "c1",
    name: "Hanna Tesfaye",
    initials: "HT",
    accent: "#b8a4ff",
    unread: 2,
    time: "2m",
    messages: [
      { from: "them", text: "Great work today! 💪", time: "9:02" },
      { from: "them", text: "Don't forget your mobility drills.", time: "9:03" },
      { from: "me", text: "Thanks coach! Will do this evening.", time: "9:10" },
    ],
  },
  {
    id: "c2",
    name: "Selam Bekele",
    initials: "SB",
    accent: "#7c5cff",
    unread: 0,
    time: "1h",
    messages: [
      { from: "me", text: "Can we move Thursday to 18:30?", time: "8:40" },
      { from: "them", text: "Sure, locked it in ✅", time: "8:44" },
    ],
  },
  {
    id: "c3",
    name: "Dawit Girma",
    initials: "DG",
    accent: "#cdff4a",
    unread: 0,
    time: "3d",
    messages: [{ from: "them", text: "Welcome aboard!", time: "Mon" }],
  },
];

export const mockPlan = {
  trainer: "Hanna Tesfaye",
  week: [
    {
      day: "Monday",
      focus: "Full body strength",
      exercises: [
        { name: "Goblet squat", sets: 4, reps: "10" },
        { name: "Push-ups", sets: 3, reps: "12" },
        { name: "Dumbbell row", sets: 3, reps: "10 / side" },
        { name: "Plank", sets: 3, reps: "45s" },
      ],
    },
    {
      day: "Wednesday",
      focus: "Mobility & core",
      exercises: [
        { name: "World's greatest stretch", sets: 2, reps: "6 / side" },
        { name: "Dead bug", sets: 3, reps: "10" },
        { name: "Hip airplanes", sets: 2, reps: "8 / side" },
      ],
    },
    {
      day: "Friday",
      focus: "Lower body",
      exercises: [
        { name: "Romanian deadlift", sets: 4, reps: "8" },
        { name: "Walking lunges", sets: 3, reps: "12 / side" },
        { name: "Calf raises", sets: 3, reps: "15" },
      ],
    },
  ],
  nutrition: {
    calories: 2100,
    protein: 150,
    carbs: 210,
    fats: 65,
    notes: "Hit protein at every meal. Hydrate 3L/day.",
  },
};

export const mockProgress = {
  weightSeries: [
    { label: "Wk1", value: 80 },
    { label: "Wk2", value: 79.2 },
    { label: "Wk3", value: 78.1 },
    { label: "Wk4", value: 77.5 },
    { label: "Wk5", value: 76.3 },
    { label: "Wk6", value: 75.4 },
    { label: "Wk7", value: 74.6 },
    { label: "Wk8", value: 73.8 },
  ],
  metrics: [
    { label: "Weight", value: "73.8 kg", change: -6.2, unit: "kg" },
    { label: "Body fat", value: "18.4%", change: -3.1, unit: "%" },
    { label: "Sessions", value: "24", change: 24, unit: "" },
    { label: "Streak", value: "12 wks", change: 0, unit: "" },
  ],
};

export const mockPayments = [
  {
    id: "p1",
    date: "2026-07-03",
    description: "Session — Selam Bekele",
    amount: 700,
    status: "paid" as const,
    method: "Telebirr",
  },
  {
    id: "p2",
    date: "2026-06-28",
    description: "Session — Hanna Tesfaye",
    amount: 550,
    status: "paid" as const,
    method: "CBE Birr",
  },
  {
    id: "p3",
    date: "2026-06-20",
    description: "Pro subscription",
    amount: 499,
    status: "paid" as const,
    method: "Telebirr",
  },
  {
    id: "p4",
    date: "2026-07-11",
    description: "Session — Hanna Tesfaye",
    amount: 550,
    status: "upcoming" as const,
    method: "—",
  },
];

// ---- Trainer-side mock data -------------------------------------

export const mockRequests = [
  {
    id: "rq1",
    trainee: "Meron Alemu",
    initials: "MA",
    accent: "#b8a4ff",
    date: "2026-07-12",
    time: "07:30",
    type: "in-person" as const,
    goal: "Weight loss",
  },
  {
    id: "rq2",
    trainee: "Robel Kebede",
    initials: "RK",
    accent: "#cdff4a",
    date: "2026-07-12",
    time: "18:30",
    type: "online" as const,
    goal: "Build muscle",
  },
  {
    id: "rq3",
    trainee: "Sara Girma",
    initials: "SG",
    accent: "#7c5cff",
    date: "2026-07-13",
    time: "09:00",
    type: "in-person" as const,
    goal: "General fitness",
  },
];

export const mockClients = [
  {
    id: "cl1",
    name: "Meron Alemu",
    initials: "MA",
    accent: "#b8a4ff",
    goal: "Weight loss",
    progress: 68,
    sessions: 14,
    nextSession: "Fri, Jul 12 · 07:30",
  },
  {
    id: "cl2",
    name: "Kalkidan Tadesse",
    initials: "KT",
    accent: "#7c5cff",
    goal: "Strength",
    progress: 42,
    sessions: 9,
    nextSession: "Sat, Jul 13 · 17:00",
  },
  {
    id: "cl3",
    name: "Nahom Bekele",
    initials: "NB",
    accent: "#cdff4a",
    goal: "Mobility",
    progress: 85,
    sessions: 21,
    nextSession: "Mon, Jul 15 · 06:00",
  },
];

export const mockEarnings = {
  balance: 12400,
  pendingPayout: 3600,
  thisMonth: 18600,
  lastMonth: 15200,
  transactions: [
    { id: "e1", date: "2026-07-03", client: "Meron Alemu", amount: 700, status: "paid" as const },
    { id: "e2", date: "2026-07-01", client: "Kalkidan Tadesse", amount: 700, status: "paid" as const },
    { id: "e3", date: "2026-06-28", client: "Nahom Bekele", amount: 600, status: "paid" as const },
    { id: "e4", date: "2026-07-11", client: "Meron Alemu", amount: 700, status: "pending" as const },
  ],
};

// ---- Admin mock data --------------------------------------------

export const mockVerifications = [
  {
    id: "v1",
    name: "Bruk Assefa",
    initials: "BA",
    accent: "#7c5cff",
    specialty: "CrossFit Coach",
    submitted: "2026-07-09",
    cert: "CrossFit-L2.pdf",
    idDoc: "national-id.jpg",
  },
  {
    id: "v2",
    name: "Liya Haile",
    initials: "LH",
    accent: "#b8a4ff",
    specialty: "Pilates Instructor",
    submitted: "2026-07-08",
    cert: "Pilates-Cert.pdf",
    idDoc: "passport.jpg",
  },
  {
    id: "v3",
    name: "Samuel Tesfa",
    initials: "ST",
    accent: "#cdff4a",
    specialty: "Sports Nutritionist",
    submitted: "2026-07-07",
    cert: "ISSN-Nutrition.pdf",
    idDoc: "national-id.jpg",
  },
];

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "suspended";
  joined: string;
};

export const mockUsers: AdminUser[] = [
  { id: "u1", name: "Meron Alemu", email: "meron@email.com", role: "trainee", status: "active", joined: "2026-05-02" },
  { id: "u2", name: "Selam Bekele", email: "selam@email.com", role: "trainer", status: "active", joined: "2026-03-18" },
  { id: "u3", name: "Robel Kebede", email: "robel@email.com", role: "trainee", status: "active", joined: "2026-06-11" },
  { id: "u4", name: "Yonas Alemu", email: "yonas@email.com", role: "trainer", status: "suspended", joined: "2026-02-25" },
  { id: "u5", name: "Kalkidan Tadesse", email: "kalkidan@email.com", role: "trainee", status: "active", joined: "2026-06-30" },
  { id: "u6", name: "Hanna Tesfaye", email: "hanna@email.com", role: "trainer", status: "active", joined: "2026-01-14" },
];

export const mockFlagged = [
  {
    id: "f1",
    type: "message" as const,
    author: "Yonas Alemu",
    content: "Let's do this off the app, call me on 09...",
    reason: "External contact info",
    date: "2026-07-09",
  },
  {
    id: "f2",
    type: "review" as const,
    author: "Anonymous",
    content: "This trainer is a total scam!!! Worst ever.",
    reason: "Abusive language",
    date: "2026-07-08",
  },
  {
    id: "f3",
    type: "message" as const,
    author: "Robel Kebede",
    content: "Can you WhatsApp me instead? +2519...",
    reason: "Off-platform solicitation",
    date: "2026-07-06",
  },
];

export const mockAdminStats = {
  totalUsers: 4820,
  trainers: 512,
  trainees: 4308,
  revenue: 1_240_000,
  commission: 186_000,
  revenueSeries: [
    { label: "Feb", value: 82 },
    { label: "Mar", value: 96 },
    { label: "Apr", value: 121 },
    { label: "May", value: 140 },
    { label: "Jun", value: 168 },
    { label: "Jul", value: 186 },
  ],
  topTrainers: [
    { name: "Hanna Tesfaye", sessions: 415, revenue: 228_250 },
    { name: "Selam Bekele", sessions: 320, revenue: 224_000 },
    { name: "Yonas Alemu", sessions: 280, revenue: 224_000 },
  ],
};

export const specialtyFilters = [
  "All",
  "Strength",
  "Weight loss",
  "Yoga",
  "Nutrition",
  "Bodybuilding",
  "Mobility",
  "Boxing",
  "HIIT",
  "Pre-natal",
];
