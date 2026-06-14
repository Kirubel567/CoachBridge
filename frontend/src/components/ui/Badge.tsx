import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "accent" | "lime" | "success" | "warning" | "danger";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-2 text-muted",
  accent: "bg-accent-strong/15 text-accent ring-1 ring-accent-strong/25",
  lime: "bg-lime/15 text-lime ring-1 ring-lime/25",
  success: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25",
  warning: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/25",
  danger: "bg-red-500/15 text-red-400 ring-1 ring-red-500/25",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
