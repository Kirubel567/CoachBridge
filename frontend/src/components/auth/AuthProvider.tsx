"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Role } from "@/lib/types";
import { API_BASE } from "@/lib/http";

export interface SessionUser {
  name: string;
  email: string;
  role: Role;
  onboarded: boolean;
}

interface AuthContextValue {
  user: SessionUser | null;
  loading: boolean;
  signup: (u: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }) => Promise<SessionUser>;
  login: (u: {
    email: string;
    password: string;
    mockRole?: Role;
  }) => Promise<SessionUser>;
  logout: () => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const SESSION_KEY = "cb_session";
const TOKEN_KEY = "cb_token"; // read by lib/http.ts for the Bearer header

// Real auth is on whenever a backend URL is configured; otherwise we fall back
// to the localStorage mock so the UI still works offline.
const REAL_AUTH = Boolean(API_BASE);

async function authFetch(path: string, body: unknown) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // receive the httpOnly refresh cookie
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.success === false) {
    throw new Error(json?.error?.message ?? "Something went wrong.");
  }
  return json.data as { user: { fullName: string; email: string; role: Role }; accessToken: string };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (raw) setUser(JSON.parse(raw));
        // If we have a token, refresh the session from the backend.
        if (REAL_AUTH && localStorage.getItem(TOKEN_KEY)) {
          const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` },
          });
          const json = await res.json().catch(() => null);
          if (res.ok && json?.data) {
            const me = json.data as { fullName: string; email: string; role: Role };
            const prev = raw ? (JSON.parse(raw) as SessionUser) : null;
            persist({
              name: me.fullName,
              email: me.email,
              role: me.role,
              onboarded: prev?.onboarded ?? true,
            });
          }
        }
      } catch {
        /* ignore */
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function persist(next: SessionUser | null) {
    setUser(next);
    try {
      if (next) localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      else localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }

  const value: AuthContextValue = {
    user,
    loading,

    async signup({ name, email, password, role }) {
      if (REAL_AUTH) {
        const { user: u, accessToken } = await authFetch("/auth/register", {
          fullName: name,
          email,
          password,
          role,
        });
        localStorage.setItem(TOKEN_KEY, accessToken);
        const session: SessionUser = {
          name: u.fullName,
          email: u.email,
          role: u.role,
          onboarded: false,
        };
        persist(session);
        return session;
      }
      const session: SessionUser = { name, email, role, onboarded: false };
      persist(session);
      return session;
    },

    async login({ email, password, mockRole }) {
      if (REAL_AUTH) {
        const { user: u, accessToken } = await authFetch("/auth/login", { email, password });
        localStorage.setItem(TOKEN_KEY, accessToken);
        const session: SessionUser = {
          name: u.fullName,
          email: u.email,
          role: u.role,
          onboarded: true,
        };
        persist(session);
        return session;
      }
      const session: SessionUser = {
        name: "Member",
        email,
        role: mockRole ?? "trainee",
        onboarded: true,
      };
      persist(session);
      return session;
    },

    logout: () => {
      if (REAL_AUTH) {
        fetch(`${API_BASE}/auth/logout`, { method: "POST", credentials: "include" }).catch(
          () => undefined,
        );
        try {
          localStorage.removeItem(TOKEN_KEY);
        } catch {
          /* ignore */
        }
      }
      persist(null);
    },

    completeOnboarding: () =>
      setUser((prev) => {
        const next = prev ? { ...prev, onboarded: true } : prev;
        if (next) {
          try {
            localStorage.setItem(SESSION_KEY, JSON.stringify(next));
          } catch {
            /* ignore */
          }
        }
        return next;
      }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
