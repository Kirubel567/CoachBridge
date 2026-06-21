"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { pricing } from "@/lib/data";

export function Pricing() {
  return (
    <section id="pricing" className="relative py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
            Pricing
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Simple, fair, local
          </h2>
          <p className="mt-4 text-muted">
            Start free. Upgrade when you&apos;re ready. Trainers pay nothing
            upfront — just a small commission per session.
          </p>
        </Reveal>

        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-3">
          {pricing.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1} className="h-full">
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`relative flex h-full flex-col rounded-3xl border p-8 ${
                  p.featured
                    ? "border-accent-strong/60 bg-surface glow"
                    : "border-border bg-surface/40"
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-8 rounded-full bg-accent-strong px-3 py-1 text-xs font-medium text-white">
                    Most popular
                  </span>
                )}
                <h3 className="font-display text-xl font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted">{p.tagline}</p>

                <div className="mt-6 flex items-end gap-1">
                  <span className="font-display text-5xl font-bold">
                    {p.price === "0" ? "Free" : p.price}
                  </span>
                  {p.price !== "0" && (
                    <span className="mb-1 text-muted">ETB</span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted">{p.cadence}</p>

                <ul className="mt-8 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <span
                        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                          p.featured
                            ? "bg-accent-strong text-white"
                            : "bg-surface-2 text-lime"
                        }`}
                      >
                        <Icon name="check" className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-fg">{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#cta"
                  className={`mt-8 rounded-full py-3 text-center font-medium transition-transform hover:scale-[1.02] ${
                    p.featured
                      ? "bg-accent-strong text-white"
                      : "bg-fg text-ink"
                  }`}
                >
                  {p.cta}
                </a>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
