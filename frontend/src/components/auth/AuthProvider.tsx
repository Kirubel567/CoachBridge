"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Role } from "@/lib/types";

export interface SessionUser {
  name: string;
  email: string;
  role: Role;
  onboarded: boolean;
}

interface AuthContextValue {
  user: SessionUser | null;
  loading: boolean;
  signup: (u: { name: string; email: string; role: Role }) => void;
  login: (u: { email: string; name?: string; role?: Role }) => void;
  logout: () => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "cb_session";

/**
 * Mock auth/session store persisted to localStorage.
 * Swapped for real /auth endpoints + httpOnly cookies in a later phase —
 * the hook surface (useAuth) stays the same.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  function persist(next: SessionUser | null) {
    setUser(next);
    try {
      if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  const value: AuthContextValue = {
    user,
    loading,
    signup: (u) => persist({ ...u, onboarded: false }),
    login: (u) =>
      persist({
        name: u.name ?? "Member",
        email: u.email,
        role: u.role ?? "trainee",
        onboarded: true,
      }),
    logout: () => persist(null),
    completeOnboarding: () =>
      setUser((prev) => {
        const next = prev ? { ...prev, onboarded: true } : prev;
        if (next) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
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
