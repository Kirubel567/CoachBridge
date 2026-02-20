import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// Type of a user row returned from Prisma
export type User = Awaited<ReturnType<typeof prisma.user.findUnique>>;

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignupRequest {
  // Common fields
  fullName: string;           // required for all users
  email: string;
  phone_number?: string;      // optional, keep if you store it in Prisma later
  password: string;
  confirm_password: string;
  role: "trainer" | "trainee" | "admin"; // match Prisma Role enum

  // Trainer optional fields
  bio?: string;
  yearsOfExperience?: number;
  certifications?: string[];
  specialties?: string[];
  hourlyRate?: number;

  contactInstagram?: string;
  contactWebsite?: string;
  contactTelegram?: string;

  // Client optional fields
  dateOfBirth?: string;       // or Date
  heightCm?: number;
  weightKg?: number;
  fitnessGoals?: string[];
  membershipActive?: boolean;
}
export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface AuthRequest {
  user?: User;
}

export interface JWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
}