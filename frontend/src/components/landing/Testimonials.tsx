"use client";

import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { testimonials } from "@/lib/data";

export function Testimonials() {
  return (
    <section className="relative py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
            Loved by both sides
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Real people, real progress
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <figure className="flex h-full flex-col rounded-3xl border border-border bg-surface/40 p-8">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Icon key={j} name="star" className="h-4 w-4 text-lime" />
                  ))}
                </div>
                <blockquote className="flex-1 text-lg leading-relaxed text-fg">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-border pt-4">
                  <p className="font-display font-semibold">{t.name}</p>
                  <p className="text-sm text-muted">{t.role}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
