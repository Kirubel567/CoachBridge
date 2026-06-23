import Link from "next/link";
import type { Trainer } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";

export function TrainerCard({ trainer }: { trainer: Trainer }) {
  return (
    <Link
      href={`/trainers/${trainer.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent-strong/50 hover:bg-surface"
    >
      <div
        className="pointer-events-none absolute inset-x-0 -top-24 h-48 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
        style={{ background: trainer.accent }}
      />
      <div className="relative flex flex-1 flex-col">
        <div className="flex items-center justify-between">
          <Avatar initials={trainer.initials} color={trainer.accent} size="lg" />
          <Badge tone="neutral">
            <Icon name="star" className="h-3.5 w-3.5 text-lime" />
            {trainer.rating.toFixed(1)}
          </Badge>
        </div>

        <div className="mt-5 flex items-center gap-1.5">
          <h3 className="font-display text-xl font-semibold">{trainer.name}</h3>
          {trainer.verified === "verified" && (
            <Icon name="shield" className="h-4 w-4 text-lime" />
          )}
        </div>
        <p className="text-sm text-muted">{trainer.specialty}</p>

        <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
          <Icon name="location" className="h-4 w-4 text-accent" />
          {trainer.location}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {trainer.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <span className="font-display text-lg font-bold">
            {trainer.price}
            <span className="text-sm font-normal text-muted"> ETB</span>
          </span>
          <span className="flex items-center gap-1 text-sm font-medium text-accent transition-colors group-hover:text-fg">
            View profile
            <Icon
              name="arrow"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function TrainerCardSkeleton() {
  return (
    <div className="h-full rounded-3xl border border-border bg-surface/40 p-6">
      <div className="flex items-center justify-between">
        <div className="h-16 w-16 animate-pulse rounded-2xl bg-surface-2" />
        <div className="h-6 w-12 animate-pulse rounded-full bg-surface-2" />
      </div>
      <div className="mt-5 h-6 w-2/3 animate-pulse rounded bg-surface-2" />
      <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-surface-2" />
      <div className="mt-4 flex gap-2">
        <div className="h-6 w-16 animate-pulse rounded-full bg-surface-2" />
        <div className="h-6 w-16 animate-pulse rounded-full bg-surface-2" />
      </div>
      <div className="mt-6 h-10 w-full animate-pulse rounded bg-surface-2" />
    </div>
  );
}
