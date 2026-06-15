// Domain types — aligned with the SRS entities and docs/API.md.
// These are the shapes the frontend codes against; the mock layer and,
// later, the real API both return them.

export type Role = "trainee" | "trainer" | "admin";

export type SessionType = "in-person" | "online";

export type VerificationStatus = "pending" | "verified" | "rejected";

export interface Trainer {
  id: string;
  name: string;
  initials: string;
  accent: string;
  specialty: string;
  location: string;
  city: string;
  rating: number;
  reviewCount: number;
  sessions: number;
  price: number; // ETB per session
  experienceYears: number;
  verified: VerificationStatus;
  sessionTypes: SessionType[];
  tags: string[];
  bio: string;
  gallery: string[]; // placeholder ids for now
}

export interface Review {
  id: string;
  author: string;
  authorInitials: string;
  rating: number;
  comment: string;
  date: string; // ISO
}

export interface Slot {
  time: string; // "07:30"
  taken: boolean;
}

export interface DayAvailability {
  day: string; // "Mon"
  date: string; // ISO
  slots: Slot[];
}

export interface Booking {
  id: string;
  trainerId: string;
  trainerName: string;
  date: string; // ISO
  time: string;
  type: SessionType;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  price: number;
}
