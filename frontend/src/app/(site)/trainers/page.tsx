"use client";

import { useEffect, useMemo, useState } from "react";
import { api, type TrainerQuery } from "@/lib/api";
import { specialtyFilters } from "@/lib/mock";
import type { Trainer } from "@/lib/types";
import {
  TrainerCard,
  TrainerCardSkeleton,
} from "@/components/trainers/TrainerCard";
import { Input, Select } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export default function BrowseTrainersPage() {
  const [q, setQ] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [sessionType, setSessionType] = useState<"" | "in-person" | "online">("");
  const [sort, setSort] = useState<TrainerQuery["sort"]>("rating");
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  // Debounce the free-text search a touch.
  const [debouncedQ, setDebouncedQ] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  const query = useMemo<TrainerQuery>(
    () => ({
      q: debouncedQ || undefined,
      specialty,
      sessionType: sessionType || undefined,
      sort,
    }),
    [debouncedQ, specialty, sessionType, sort]
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.trainers.list(query).then((res) => {
      if (active) {
        setTrainers(res);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [query]);

  return (
    <main className="pt-32 pb-24">
      <div className="container-x">
        {/* Header */}
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
            Find a trainer
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Discover coaches near you
          </h1>
          <p className="mt-4 text-muted">
            Filter by specialty, session type, and more. Every trainer is
            verified.
          </p>
        </div>

        {/* Controls */}
        <div className="mt-10 space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Icon
                name="location"
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted opacity-0"
              />
              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by name, specialty, or goal…"
                  className="pl-11"
                />
              </div>
            </div>
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value as TrainerQuery["sort"])}
              className="sm:w-52"
            >
              <option value="rating">Top rated</option>
              <option value="sessions">Most sessions</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </Select>
          </div>

          {/* Specialty chips */}
          <div className="flex flex-wrap gap-2">
            {specialtyFilters.map((s) => (
              <button
                key={s}
                onClick={() => setSpecialty(s)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition-colors",
                  specialty === s
                    ? "bg-fg font-medium text-ink"
                    : "bg-surface-2 text-muted hover:text-fg"
                )}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Session type toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">Session type:</span>
            {[
              { v: "", label: "Any" },
              { v: "in-person", label: "In-person" },
              { v: "online", label: "Online" },
            ].map((o) => (
              <button
                key={o.v}
                onClick={() => setSessionType(o.v as typeof sessionType)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition-colors",
                  sessionType === o.v
                    ? "bg-accent-strong/20 text-accent ring-1 ring-accent-strong/30"
                    : "text-muted hover:text-fg"
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-muted">
            {loading
              ? "Searching…"
              : `${trainers.length} trainer${trainers.length === 1 ? "" : "s"} found`}
          </p>
        </div>

        {/* Results */}
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <TrainerCardSkeleton key={i} />
            ))
          ) : trainers.length > 0 ? (
            trainers.map((t) => <TrainerCard key={t.id} trainer={t} />)
          ) : (
            <div className="col-span-full rounded-3xl border border-dashed border-border py-20 text-center">
              <p className="font-display text-xl font-semibold">
                No trainers match your filters
              </p>
              <p className="mt-2 text-muted">
                Try broadening your search or clearing a filter.
              </p>
              <button
                onClick={() => {
                  setQ("");
                  setSpecialty("All");
                  setSessionType("");
                }}
                className="mt-6 rounded-full bg-accent-strong px-6 py-2.5 text-sm font-medium text-white"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
