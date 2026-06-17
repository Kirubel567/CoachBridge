// Thin fetch wrapper for the real CoachBridge backend.
//
// When NEXT_PUBLIC_API_URL is set, the API client (lib/api.ts) routes through
// here; otherwise it resolves from the local mock database. This is the single
// switch that turns the frontend "live" — no calling code changes.

const BASE = process.env.NEXT_PUBLIC_API_URL;

/** True when a backend URL is configured — see .env.example. */
export const USE_REAL_API = Boolean(BASE);

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
  const res = await fetch(`${BASE}${path}`, {
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
