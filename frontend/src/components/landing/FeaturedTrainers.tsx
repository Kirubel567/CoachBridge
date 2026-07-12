"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { trainers } from "@/lib/data";
import { specialtyFilters } from "@/lib/mock";

// Quick-pick specialties for the landing search (skip the "All" option here).
const quickSpecialties = specialtyFilters.filter((s) => s !== "All").slice(0, 6);

export function FeaturedTrainers() {
  const router = useRouter();
  const [q, setQ] = useState("");

  // Hand the search off to the full discovery page with the query prefilled.
  function goToSearch(specialty?: string) {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (specialty && specialty !== "All") params.set("specialty", specialty);
    const qs = params.toString();
    router.push(qs ? `/trainers?${qs}` : "/trainers");
  }

  return (
    <section id="trainers" className="relative py-28">
      <div className="container-x">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
              Top rated
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Find your trainer
            </h2>
          </div>
          <a
            href="/trainers"
            className="group flex items-center gap-2 text-sm font-medium text-fg"
          >
            Browse all trainers
            <Icon
              name="arrow"
              className="h-4 w-4 text-accent transition-transform group-hover:translate-x-1"
            />
          </a>
        </Reveal>

        {/* Inline search — flows within the landing, then opens full results. */}
        <Reveal delay={0.05} className="mt-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              goToSearch();
            }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
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
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, specialty, or goal…"
                aria-label="Search trainers"
                className="w-full rounded-full border border-border bg-surface/50 py-3.5 pl-11 pr-4 text-sm text-fg outline-none transition-colors placeholder:text-muted focus:border-accent-strong/50"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-fg px-6 py-3.5 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
            >
              Search trainers
            </button>
          </form>

          {/* Specialty quick-picks */}
          <div className="mt-4 flex flex-wrap gap-2">
            {quickSpecialties.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => goToSearch(s)}
                className="rounded-full bg-surface-2 px-4 py-2 text-sm text-muted transition-colors hover:text-fg"
              >
                {s}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trainers.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <motion.article
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative h-full overflow-hidden rounded-3xl border border-border bg-surface/50 p-6"
              >
                <div
                  className="pointer-events-none absolute inset-x-0 -top-24 h-48 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
                  style={{ background: t.accent }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="h-14 w-14 overflow-hidden rounded-2xl ring-1 ring-white/10">
                      <Image
                        src={t.image}
                        alt={t.name}
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-xs">
                      <Icon name="star" className="h-3.5 w-3.5 text-lime" />
                      {t.rating.toFixed(1)}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center gap-1.5">
                    <h3 className="font-display text-xl font-semibold">
                      {t.name}
                    </h3>
                    <Icon name="shield" className="h-4 w-4 text-lime" />
                  </div>
                  <p className="text-sm text-muted">{t.specialty}</p>

                  <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
                    <Icon name="location" className="h-4 w-4 text-accent" />
                    {t.location}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {t.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <span className="font-display text-lg font-bold">
                      {t.price}
                      <span className="text-sm font-normal text-muted">
                        {" "}
                        ETB
                      </span>
                    </span>
                    <span className="text-sm font-medium text-accent transition-colors group-hover:text-fg">
                      View profile →
                    </span>
                  </div>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
