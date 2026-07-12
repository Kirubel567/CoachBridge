// Thin fetch wrapper for the real CoachBridge backend.
//
// When NEXT_PUBLIC_API_URL is set, the API client (lib/api.ts) routes through
// here; otherwise it resolves from the local mock database. This is the single
// switch that turns the frontend "live" — no calling code changes.

/** Backend base URL, e.g. http://localhost:4000/api/v1 (see .env.example). */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

/**
 * Whether the typed data endpoints (trainers, bookings…) hit the real backend.
 * Kept as an explicit flag — separate from auth — so the live API can be enabled
 * for auth first, then for data once backend shapes are adapted to these types.
 */
export const USE_REAL_API = process.env.NEXT_PUBLIC_USE_REAL_API === "true";

export class ApiError extends Error {
  code: string;
  field?: string;
  constructor(code: string, message: string, field?: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.field = field;
  }
}

type Envelope<T> = {
  success?: boolean;
  data?: T;
  error?: { code: string; message: string; field?: string };
};

function authHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("cb_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function http<T>(
  path: string,
  opts: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(opts.headers ?? {}),
    },
  });

  let json: Envelope<T> | null = null;
  try {
    json = (await res.json()) as Envelope<T>;
  } catch {
    /* non-JSON response */
  }

  if (!res.ok || json?.success === false) {
    const err = json?.error;
    throw new ApiError(
      err?.code ?? `HTTP_${res.status}`,
      err?.message ?? res.statusText,
      err?.field
    );
  }

  // Backend responds with { success, data }; fall back to the raw body.
  return (json?.data ?? (json as unknown as T)) as T;
}
