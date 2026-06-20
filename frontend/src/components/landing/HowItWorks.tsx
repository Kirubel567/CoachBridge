"use client";

import { Reveal } from "@/components/ui/Reveal";
import { steps } from "@/lib/data";

export function HowItWorks() {
  return (
    <section id="how" className="relative py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
            How it works
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Three steps to your transformation
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.no} delay={i * 0.12}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-border bg-surface/40 p-8 transition-colors hover:border-accent-strong/50">
                <div className="pointer-events-none absolute -right-6 -top-8 font-display text-[7rem] font-bold leading-none text-surface-2 transition-colors group-hover:text-accent-strong/20">
                  {s.no}
                </div>
                <div className="relative">
                  <div className="mb-6 h-12 w-12 rounded-2xl bg-accent-strong/15 ring-1 ring-accent-strong/30" />
                  <h3 className="font-display text-2xl font-semibold">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-muted">{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
