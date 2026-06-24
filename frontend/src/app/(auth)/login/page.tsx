"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";
import type { Role } from "@/lib/types";
import { homeForRole } from "@/lib/nav";
import { cn } from "@/lib/cn";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [role, setRole] = useState<Role>("trainee");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    setSubmitting(true);
    // Mock — replaced by POST /auth/login (which returns the real role).
    setTimeout(() => {
      login({ email, role });
      router.push(homeForRole(role));
    }, 600);
  }

  return (
    <div className="rounded-3xl border border-border bg-surface/60 p-8 backdrop-blur-xl">
      <h1 className="font-display text-2xl font-semibold">Welcome back</h1>
      <p className="mt-1 text-sm text-muted">Log in to your account.</p>

      {/* Mock-only role switch so you can preview both apps. */}
      <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-surface-2 p-1">
        {(["trainee", "trainer", "admin"] as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={cn(
              "rounded-xl py-2 text-sm font-medium capitalize transition-colors",
              role === r
                ? "bg-accent-strong text-white"
                : "text-muted hover:text-fg"
            )}
          >
            {r}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@email.com"
          />
        </Field>
        <Field label="Password" htmlFor="password">
          <Input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
          />
        </Field>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-muted hover:text-fg"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? "Signing in…" : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        New to CoachBridge?{" "}
        <Link href="/signup" className="font-medium text-accent hover:text-fg">
          Create an account
        </Link>
      </p>
    </div>
  );
}
