"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api, type TrainerQuery } from "@/lib/api";
import { specialtyFilters } from "@/lib/mock";
import type { Trainer } from "@/lib/types";
import { MIcon } from "@/components/ui/MIcon";
import { Eyebrow } from "@/components/app/kit";
import { cn } from "@/lib/cn";

export default function FindTrainersPage() {
  const [q, setQ] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [sort, setSort] = useState<TrainerQuery["sort"]>("rating");
  const [minRating, setMinRating] = useState(0);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  const [debouncedQ, setDebouncedQ] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  const query = useMemo<TrainerQuery>(
    () => ({ q: debouncedQ || undefined, specialty, sort, minRating: minRating || undefined }),
    [debouncedQ, specialty, sort, minRating]
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
    <div className="mx-auto max-w-[1200px] space-y-8">
      {/* Filters strip */}
      <section className="flex flex-wrap items-end gap-6 border-b border-outline-variant pb-6">
        <div className="relative min-w-[240px] flex-1">
          <Eyebrow className="mb-2">Search</Eyebrow>
          <MIcon
            name="search"
            className="pointer-events-none absolute left-3 top-[34px] text-[20px] text-on-surface-variant"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Name, specialty, goal…"
            className="w-full rounded-xl border border-outline-variant bg-surface-container-low py-2.5 pl-10 pr-4 text-sm text-on-surface outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Eyebrow>Specialization</Eyebrow>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="min-w-[180px] rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-sm text-on-surface outline-none focus:border-primary"
          >
            {specialtyFilters.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All specialities" : s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Eyebrow>Sort</Eyebrow>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as TrainerQuery["sort"])}
            className="min-w-[160px] rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-sm text-on-surface outline-none focus:border-primary"
          >
            <option value="rating">Top rated</option>
            <option value="sessions">Most sessions</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Eyebrow>Rating</Eyebrow>
          <div className="flex h-[42px] items-center gap-1 rounded-xl border border-outline-variant bg-surface-container-low px-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setMinRating(minRating === n ? 0 : n)}
                aria-label={`${n} stars`}
              >
                <MIcon
                  name="star"
                  filled={n <= minRating}
                  className={cn(
                    "text-[18px]",
                    n <= minRating ? "text-primary" : "text-outline"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => {
            setQ("");
            setSpecialty("All");
            setMinRating(0);
          }}
          className="h-[42px] rounded-xl border border-transparent px-5 text-sm text-on-surface-variant transition-colors hover:border-outline-variant hover:text-on-surface"
        >
          Reset filters
        </button>
      </section>

      <p className="text-sm text-on-surface-variant">
        {loading ? "Searching…" : `${trainers.length} trainers found`}
      </p>

      {/* Results bento */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[320px] animate-pulse rounded-2xl bento-card"
            />
          ))}
        </div>
      ) : trainers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[24px] bento-card p-16 text-center">
          <MIcon name="search_off" className="text-[48px] text-outline-variant" />
          <h3 className="mt-4 font-display text-[24px] font-semibold text-on-surface">
            No trainers found
          </h3>
          <p className="mt-2 max-w-sm text-on-surface-variant">
            Try adjusting your filters or specialization.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trainers.map((t, i) => (
            <Link
              key={t.id}
              href={`/dashboard/trainers/${t.id}`}
              className={cn(
                "group flex flex-col justify-between rounded-2xl bento-card p-6 transition-all hover:-translate-y-1 hover:!border-primary",
                i === 0 && "sm:col-span-2 sm:flex-row sm:items-stretch sm:gap-8"
              )}
            >
              <div className={cn("flex-1", i === 0 && "sm:max-w-[60%]")}>
                <div className="mb-5 flex items-start justify-between">
                  <span
                    className="grid h-16 w-16 place-items-center rounded-2xl font-display text-lg font-bold text-on-primary-container"
                    style={{ background: t.accent }}
                  >
                    {t.initials}
                  </span>
                  {i === 0 && (
                    <span className="flex items-center gap-1.5 rounded-full border border-secondary/30 bg-secondary-container/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-secondary">
                      <MIcon name="verified" filled className="text-[14px]" />
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-[20px] font-semibold text-on-surface">
                    {t.name}
                  </h3>
                  {t.verified === "verified" && (
                    <MIcon name="verified" filled className="text-[18px] text-secondary" />
                  )}
                </div>
                <p className="text-sm text-on-surface-variant">{t.specialty}</p>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-on-surface-variant">
                  {t.bio}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {t.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-outline-variant bg-surface-container-highest px-2.5 py-1 text-[11px] uppercase tracking-wide text-on-surface-variant"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div
                className={cn(
                  "mt-6 flex items-center justify-between border-t border-outline-variant/30 pt-4",
                  i === 0 &&
                    "sm:mt-0 sm:w-px sm:flex-col sm:items-end sm:justify-center sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0"
                )}
              >
                <div className="flex items-center gap-1">
                  <MIcon name="star" filled className="text-[18px] text-secondary" />
                  <span className="text-sm">{t.rating.toFixed(1)}</span>
                </div>
                <span className="font-display text-[20px] font-semibold text-primary">
                  {t.price}
                  <span className="text-sm font-normal text-on-surface-variant">
                    {" "}
                    ETB/hr
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
