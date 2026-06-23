import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "About — CoachBridge",
  description:
    "CoachBridge is modernizing personal training in Ethiopia by connecting trainees with verified coaches.",
};

const values = [
  {
    title: "Trust first",
    body: "Every trainer is manually verified. Ratings come only from real, completed sessions.",
  },
  {
    title: "Local by design",
    body: "Built for Ethiopia — Telebirr and CBE payments, cities and gyms you actually know.",
  },
  {
    title: "Results that last",
    body: "Custom plans and honest progress tracking, not vanity metrics.",
  },
];

export default function AboutPage() {
  return (
    <main className="pt-32 pb-24">
      <div className="container-x">
        {/* Hero */}
        <Reveal className="max-w-3xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
            Our mission
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Modernizing personal training in{" "}
            <span className="text-gradient">Ethiopia</span>
          </h1>
          <p className="mt-6 text-lg text-muted">
            Finding a great personal trainer shouldn&apos;t rely on word of
            mouth and luck. CoachBridge gives trainees a trusted, organized way
            to discover verified coaches — and gives trainers the tools to grow
            a real business.
          </p>
        </Reveal>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-6 border-y border-border py-10 md:grid-cols-4">
          {[
            ["500+", "Certified trainers"],
            ["12K+", "Sessions booked"],
            ["8", "Cities"],
            ["4.9", "Avg. rating"],
          ].map(([v, l], i) => (
            <Reveal key={l} delay={i * 0.1} className="text-center">
              <div className="font-display text-4xl font-bold">{v}</div>
              <div className="mt-1 text-sm text-muted">{l}</div>
            </Reveal>
          ))}
        </div>

        {/* Values */}
        <div className="mt-20">
          <SectionHeading
            eyebrow="What we stand for"
            title="Our values"
            align="left"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1}>
                <div className="h-full rounded-3xl border border-border bg-surface/40 p-8">
                  <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-accent-strong/15 text-accent ring-1 ring-accent-strong/25">
                    <Icon name="sparkles" className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-semibold">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-muted">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Reveal className="mt-20">
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-border bg-surface px-8 py-12 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">
                Join the movement
              </h2>
              <p className="mt-2 text-muted">
                Whether you want to train or to coach — start today.
              </p>
            </div>
            <div className="flex gap-3">
              <ButtonLink href="/trainers" variant="primary">
                Find a coach
              </ButtonLink>
              <ButtonLink href="/signup?role=trainer" variant="outline">
                Become a trainer
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
