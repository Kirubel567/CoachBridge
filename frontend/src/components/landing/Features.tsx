"use client";

import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { features } from "@/lib/data";

export function Features() {
  return (
    <section id="features" className="relative py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-strong/10 blur-[160px]" />
      <div className="container-x relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
            Everything you need
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Built for real results
          </h2>
          <p className="mt-4 text-muted">
            From smart matching to secure local payments — CoachBridge handles
            the whole journey.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.1}>
              <div className="group h-full rounded-3xl border border-border bg-surface/40 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent-strong/50 hover:bg-surface">
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-accent-strong/15 text-accent ring-1 ring-accent-strong/25 transition-colors group-hover:bg-accent-strong group-hover:text-white">
                  <Icon name={f.icon} className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-muted">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
