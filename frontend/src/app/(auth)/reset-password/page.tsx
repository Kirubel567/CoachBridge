"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export default function ResetPasswordPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | undefined>();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (form.get("password") !== form.get("confirm")) {
      setError("Passwords don't match.");
      return;
    }
    setError(undefined);
    setSubmitting(true);
    setTimeout(() => setDone(true), 600); // Mock — POST /auth/reset-password
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-border bg-surface/60 p-8 text-center backdrop-blur-xl"
      >
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-lime text-ink">
          <Icon name="check" className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-semibold">
          Password updated
        </h1>
        <p className="mt-2 text-muted">You can now log in with your new password.</p>
        <Link
          href="/login"
          className="mt-6 inline-flex rounded-full bg-accent-strong px-6 py-3 text-sm font-medium text-white"
        >
          Go to login
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-surface/60 p-8 backdrop-blur-xl">
      <h1 className="font-display text-2xl font-semibold">Set a new password</h1>
      <p className="mt-1 text-sm text-muted">Choose a strong password.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Field label="New password" htmlFor="password">
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="••••••••"
          />
        </Field>
        <Field label="Confirm password" htmlFor="confirm" error={error}>
          <Input
            id="confirm"
            name="confirm"
            type="password"
            required
            placeholder="••••••••"
          />
        </Field>
        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? "Updating…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}
