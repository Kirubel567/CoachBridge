import type { Trainer, Review, DayAvailability, Booking } from "./types";
import {
  mockTrainers,
  mockReviews,
  mockAvailability,
  mockBookings,
} from "./mock";
import { http, USE_REAL_API } from "./http";

/**
 * Typed API client. Every method mirrors an endpoint in docs/API.md.
 *
 * If NEXT_PUBLIC_API_URL is set, methods call the real backend via http().
 * Otherwise they resolve from the mock database with simulated latency.
 * The signatures — and therefore all calling code — never change.
 */

const LATENCY = 350; // ms — simulates network so loading states feel real

function delay<T>(value: T, ms = LATENCY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export interface TrainerQuery {
  q?: string;
  specialty?: string; // "All" = no filter
  sessionType?: "in-person" | "online";
  maxPrice?: number;
  minRating?: number;
  sort?: "rating" | "price-asc" | "price-desc" | "sessions";
}

function toQueryString(query: TrainerQuery): string {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.specialty && query.specialty !== "All")
    params.set("specialty", query.specialty);
  if (query.sessionType) params.set("sessionType", query.sessionType);
  if (typeof query.maxPrice === "number")
    params.set("maxPrice", String(query.maxPrice));
  if (typeof query.minRating === "number")
    params.set("minRating", String(query.minRating));
  if (query.sort) params.set("sort", query.sort);
  const s = params.toString();
  return s ? `?${s}` : "";
}

function filterMockTrainers(query: TrainerQuery): Trainer[] {
  let list = [...mockTrainers];
  const { q, specialty, sessionType, maxPrice, minRating, sort } = query;

  if (q) {
    const needle = q.toLowerCase();
    list = list.filter(
      (t) =>
        t.name.toLowerCase().includes(needle) ||
        t.specialty.toLowerCase().includes(needle) ||
        t.tags.some((tag) => tag.toLowerCase().includes(needle))
    );
  }
  if (specialty && specialty !== "All") {
    list = list.filter(
      (t) =>
        t.tags.some((tag) =>
          tag.toLowerCase().includes(specialty.toLowerCase())
        ) || t.specialty.toLowerCase().includes(specialty.toLowerCase())
    );
  }
  if (sessionType) {
    list = list.filter((t) => t.sessionTypes.includes(sessionType));
  }
  if (typeof maxPrice === "number") {
    list = list.filter((t) => t.price <= maxPrice);
  }
  if (typeof minRating === "number") {
    list = list.filter((t) => t.rating >= minRating);
  }

  switch (sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "sessions":
      list.sort((a, b) => b.sessions - a.sessions);
      break;
    case "rating":
    default:
      list.sort((a, b) => b.rating - a.rating);
  }
  return list;
}

export const api = {
  trainers: {
    // GET /trainers
    list(query: TrainerQuery = {}): Promise<Trainer[]> {
      if (USE_REAL_API)
        return http<Trainer[]>(`/trainers${toQueryString(query)}`);
      return delay(filterMockTrainers(query));
    },

    // GET /trainers/:id
    get(id: string): Promise<Trainer | null> {
      if (USE_REAL_API) return http<Trainer | null>(`/trainers/${id}`);
      return delay(mockTrainers.find((t) => t.id === id) ?? null);
    },

    // GET /trainers/:id/reviews
    reviews(id: string): Promise<Review[]> {
      if (USE_REAL_API) return http<Review[]>(`/trainers/${id}/reviews`);
      return delay(mockReviews);
    },

    // GET /trainers/:id/availability
    availability(id: string): Promise<DayAvailability[]> {
      if (USE_REAL_API)
        return http<DayAvailability[]>(`/trainers/${id}/availability`);
      return delay(mockAvailability(id.length));
    },
  },

  bookings: {
    // GET /bookings/mine
    mine(): Promise<Booking[]> {
      if (USE_REAL_API) return http<Booking[]>(`/bookings/mine`);
      return delay(mockBookings);
    },
  },
};
