"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { Role } from "@/lib/types";
import { useAuth } from "@/components/auth/AuthProvider";

export function SignupForm() {
  const params = useSearchParams();
  const router = useRouter();
  const { signup } = useAuth();
  const initialRole: Role =
    params.get("role") === "trainer" ? "trainer" : "trainee";

  const [role, setRole] = useState<Role>(initialRole);
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    setSubmitting(true);
    // Mock — replaced by POST /auth/register. Then straight into onboarding.
    setTimeout(() => {
      signup({ name, email, role });
      router.push("/onboarding");
    }, 700);
  }

  return (
    <div className="rounded-3xl border border-border bg-surface/60 p-8 backdrop-blur-xl">
      <h1 className="font-display text-2xl font-semibold">Create your account</h1>
      <p className="mt-1 text-sm text-muted">Start free — no card required.</p>

      {/* Role toggle */}
      <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-surface-2 p-1">
        {(["trainee", "trainer"] as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={cn(
              "relative rounded-xl py-2.5 text-sm font-medium transition-colors",
              role === r ? "text-white" : "text-muted hover:text-fg"
            )}
          >
            {role === r && (
              <motion.span
                layoutId="role-pill"
                className="absolute inset-0 rounded-xl bg-accent-strong"
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
              />
            )}
            <span className="relative capitalize">
              {r === "trainee" ? "I'm a trainee" : "I'm a trainer"}
            </span>
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Field label="Full name" htmlFor="name">
          <Input id="name" name="name" required placeholder="Abel Tesfa" />
        </Field>
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@email.com"
          />
        </Field>
        <Field
          label="Password"
          htmlFor="password"
          hint="At least 8 characters."
        >
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="••••••••"
          />
        </Field>

        <Button type="submit" fullWidth disabled={submitting}>
          {submitting
            ? "Creating account…"
            : `Create ${role} account`}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-accent hover:text-fg">
          Log in
        </Link>
      </p>
    </div>
  );
}
