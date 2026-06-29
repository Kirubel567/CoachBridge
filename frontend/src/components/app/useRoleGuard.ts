"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import type { Role } from "@/lib/types";
import { homeForRole } from "@/lib/nav";

/**
 * Guards an authed area. Redirects to login/onboarding when needed, and
 * bounces users to their own role's home if they hit the wrong area.
 * Returns `true` only when it's safe to render the area.
 */
export function useRoleGuard(role: Role) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else if (!user.onboarded) {
      router.replace("/onboarding");
    } else if (user.role !== role) {
      router.replace(homeForRole(user.role));
    }
  }, [user, loading, role, router]);

  return !loading && !!user && user.onboarded && user.role === role;
}
