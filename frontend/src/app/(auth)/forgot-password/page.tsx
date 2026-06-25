"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export default function ForgotPasswordPage() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // Mock — replaced by POST /auth/forgot-password.
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 700);
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-border bg-surface/60 p-8 text-center backdrop-blur-xl"
      >
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-lime text-ink">
          <Icon name="chat" className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-semibold">
          Check your email
        </h1>
        <p className="mt-2 text-muted">
          If an account exists for that address, we&apos;ve sent a reset link.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex rounded-full bg-accent-strong px-6 py-3 text-sm font-medium text-white"
        >
          Back to login
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-surface/60 p-8 backdrop-blur-xl">
      <h1 className="font-display text-2xl font-semibold">Reset your password</h1>
      <p className="mt-1 text-sm text-muted">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@email.com"
          />
        </Field>
        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-accent hover:text-fg">
          Back to login
        </Link>
      </p>
    </div>
  );
}
