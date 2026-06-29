import type { ReactNode } from "react";
import { MIcon } from "@/components/ui/MIcon";
import { cn } from "@/lib/cn";

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-[11px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant",
        className
      )}
    >
      {children}
    </p>
  );
}

export function Bento({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bento-card rounded-[24px] p-6", className)}>
      {children}
    </div>
  );
}

type Tone = "muted" | "secondary" | "error" | "primary";
const toneClass: Record<Tone, string> = {
  muted: "text-on-surface-variant",
  secondary: "text-secondary",
  error: "text-error",
  primary: "text-primary",
};

export function StatTile({
  label,
  value,
  hint,
  hintTone = "muted",
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  hintTone?: Tone;
  icon?: string;
}) {
  return (
    <Bento className="flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <Eyebrow>{label}</Eyebrow>
        {icon && <MIcon name={icon} className="text-[20px] text-primary" />}
      </div>
      <p className="mt-3 font-display text-[32px] font-semibold leading-none tracking-tight text-on-surface">
        {value}
      </p>
      {hint && (
        <p className={cn("mt-2 text-sm", toneClass[hintTone])}>{hint}</p>
      )}
    </Bento>
  );
}

/** Primary pill button (link). */
export function PillLink({
  href,
  children,
  icon,
  className,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  icon?: string;
  className?: string;
  variant?: "primary" | "surface" | "lime";
}) {
  const styles = {
    primary: "bg-primary text-on-primary hover:opacity-90",
    surface:
      "border border-outline-variant bg-surface-container-high text-on-surface hover:bg-surface-variant",
    lime: "bg-secondary text-on-secondary hover:brightness-105",
  }[variant];
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all active:scale-[0.98]",
        styles,
        className
      )}
    >
      {icon && <MIcon name={icon} className="text-[18px]" />}
      {children}
    </a>
  );
}
