"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function WizardShell({
  step,
  total,
  title,
  subtitle,
  children,
  onBack,
  onNext,
  nextLabel = "Continue",
  canNext = true,
}: {
  step: number; // 0-indexed
  total: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  canNext?: boolean;
}) {
  const pct = ((step + 1) / total) * 100;

  return (
    <div className="w-full max-w-xl rounded-3xl border border-border bg-surface/60 p-8 backdrop-blur-xl">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs text-muted">
          <span>
            Step {step + 1} of {total}
          </span>
          <span>{Math.round(pct)}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
          <motion.div
            className="h-full rounded-full bg-accent-strong"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
          />
        </div>
      </div>

      <h1 className="font-display text-2xl font-semibold">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-6"
      >
        {children}
      </motion.div>

      <div className="mt-8 flex items-center justify-between gap-3">
        {onBack ? (
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
        ) : (
          <span />
        )}
        <Button onClick={onNext} disabled={!canNext}>
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}

/** Selectable chip used across onboarding steps. */
export function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm transition-colors ${
        active
          ? "border-accent-strong bg-accent-strong/15 text-accent"
          : "border-border text-muted hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}
