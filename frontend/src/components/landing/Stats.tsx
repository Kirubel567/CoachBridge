"use client";

import { Reveal } from "@/components/ui/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { stats } from "@/lib/data";

export function Stats() {
  return (
    <section className="relative border-y border-border/60 py-16">
      <div className="container-x">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} className="text-center">
              <div className="font-display text-4xl font-bold text-fg sm:text-5xl">
                <AnimatedCounter
                  value={s.value}
                  suffix={s.suffix}
                  decimals={s.decimals ?? 0}
                />
              </div>
              <p className="mt-2 text-sm text-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
