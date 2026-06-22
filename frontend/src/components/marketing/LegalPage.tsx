import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Shared shell + prose styling for legal/policy pages. */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="pt-32 pb-24">
      <div className="container-x max-w-3xl">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-muted">Last updated: {updated}</p>

        <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 text-sm text-amber-300/90">
          Draft template — placeholder wording to be reviewed and finalized with
          legal counsel before launch.
        </div>

        <Prose className="mt-10">{children}</Prose>
      </div>
    </main>
  );
}

export function Prose({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "space-y-4 leading-relaxed text-muted",
        "[&_h2]:mt-10 [&_h2]:mb-2 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-fg",
        "[&_a]:text-accent [&_a]:underline",
        "[&_strong]:text-fg",
        "[&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_li]:marker:text-accent-strong",
        className
      )}
    >
      {children}
    </div>
  );
}
