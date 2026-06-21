"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { trainers } from "@/lib/data";

export function FeaturedTrainers() {
  return (
    <section id="trainers" className="relative py-28">
      <div className="container-x">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
              Top rated
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Meet a few of the coaches
            </h2>
          </div>
          <a
            href="#cta"
            className="group flex items-center gap-2 text-sm font-medium text-fg"
          >
            Browse all trainers
            <Icon
              name="arrow"
              className="h-4 w-4 text-accent transition-transform group-hover:translate-x-1"
            />
          </a>
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
