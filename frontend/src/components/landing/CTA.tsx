"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Icon } from "@/components/ui/Icon";

export function CTA() {
  return (
    <section id="cta" className="relative py-28">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-surface px-8 py-20 text-center sm:px-16">
            {/* Subtle gym atmosphere */}
            <Image
              src="/images/gym.jpg"
              alt=""
              fill
              sizes="100vw"
              className="pointer-events-none absolute inset-0 object-cover opacity-[0.14]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
            <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
            <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent-strong/30 blur-[130px] animate-pulse-glow" />

            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-6xl">
                Your transformation starts today
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-lg text-muted">
                Join thousands of Ethiopians training smarter with a coach who
                fits them. Free to start.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <MagneticButton
                  href="/trainers"
                  className="group flex items-center gap-2 rounded-full bg-accent-strong px-8 py-4 font-medium text-white shadow-lg shadow-accent-strong/30"
                >
                  Find your coach
                  <Icon
                    name="arrow"
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  />
                </MagneticButton>
                <MagneticButton
                  href="/signup?role=trainer"
                  className="rounded-full border border-border px-8 py-4 font-medium text-fg transition-colors hover:bg-surface-2"
                >
                  Become a trainer
                </MagneticButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
