import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { api } from "@/lib/api";
import { MIcon } from "@/components/ui/MIcon";
import { Bento, Eyebrow } from "@/components/app/kit";
import { DashboardBookingCard } from "@/components/trainers/DashboardBookingCard";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const t = await api.trainers.get(id);
  return { title: t ? `${t.name} — CoachBridge` : "Trainer — CoachBridge" };
}

export default async function DashboardTrainerProfile({ params }: Params) {
  const { id } = await params;
  const trainer = await api.trainers.get(id);
  if (!trainer) notFound();

  const [reviews, availability] = await Promise.all([
    api.trainers.reviews(id),
    api.trainers.availability(id),
  ]);

  return (
    <div className="mx-auto max-w-[1200px]">
      <Link
        href="/dashboard/trainers"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-on-surface-variant transition-colors hover:text-on-surface"
      >
        <MIcon name="arrow_back" className="text-[18px]" />
        Back to all trainers
      </Link>

      <div className="grid grid-cols-12 gap-6">
        {/* Left column */}
        <div className="col-span-12 space-y-6 lg:col-span-8">
          {/* Header */}
          <Bento>
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <span
                className="grid h-28 w-28 shrink-0 place-items-center rounded-[24px] font-display text-3xl font-bold text-on-primary-container"
                style={{ background: trainer.accent }}
              >
                {trainer.initials}
              </span>
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-display text-[32px] font-semibold text-on-surface">
                    {trainer.name}
                  </h1>
                  {trainer.verified === "verified" && (
                    <span className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
                      <MIcon name="verified" filled className="text-[16px]" />
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-on-surface-variant">
                  <span className="flex items-center gap-2 text-sm">
                    <MIcon name="location_on" className="text-[20px]" />
                    {trainer.location}
                  </span>
                  <span className="flex items-center gap-2 text-sm text-secondary">
                    <MIcon name="grade" filled className="text-[20px]" />
                    {trainer.rating.toFixed(1)} ({trainer.reviewCount} reviews)
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trainer.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-lg border border-outline-variant bg-surface-container-high px-3 py-1 text-sm text-on-surface"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Bento>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { v: `${trainer.experienceYears}+`, l: "Years exp.", c: "text-primary" },
              { v: trainer.sessions, l: "Sessions", c: "text-secondary" },
              { v: "15", l: "Active slots", c: "text-on-surface" },
            ].map((s) => (
              <Bento key={s.l} className="text-center">
                <p className={`font-display text-[32px] font-semibold ${s.c}`}>
                  {s.v}
                </p>
                <Eyebrow className="mt-1">{s.l}</Eyebrow>
              </Bento>
            ))}
          </div>

          {/* About */}
          <Bento className="space-y-3">
            <h2 className="font-display text-[20px] font-semibold text-on-surface">
              About {trainer.name.split(" ")[0]}
            </h2>
            <p className="leading-relaxed text-on-surface-variant">{trainer.bio}</p>
          </Bento>

          {/* Gallery */}
          <div>
            <h2 className="mb-4 font-display text-[20px] font-semibold text-on-surface">
              Coaching environment
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {trainer.gallery.map((g, i) => (
                <div
                  key={g}
                  className="aspect-square rounded-[24px] border border-outline-variant"
                  style={{
                    background: `linear-gradient(135deg, ${trainer.accent}33, #201e28)`,
                    opacity: 1 - i * 0.06,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Reviews */}
          <Bento className="space-y-5">
            <h2 className="font-display text-[20px] font-semibold text-on-surface">
              Client reviews
            </h2>
            {reviews.map((r) => (
              <div
                key={r.id}
                className="space-y-3 rounded-[20px] border border-outline-variant/30 bg-surface-container-low p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-surface-container-high text-xs font-bold">
                      {r.authorInitials}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-on-surface">
                        {r.author}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {new Date(r.date).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex text-secondary">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <MIcon key={i} name="star" filled className="text-[16px]" />
                    ))}
                  </div>
                </div>
                <p className="italic text-on-surface-variant">“{r.comment}”</p>
              </div>
            ))}
          </Bento>
        </div>

        {/* Right column — sticky booking */}
        <div className="col-span-12 lg:col-span-4">
          <div className="space-y-6 lg:sticky lg:top-24">
            <DashboardBookingCard trainer={trainer} availability={availability} />
            <Bento className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-secondary/10 text-secondary">
                <MIcon name="bolt" filled className="text-[22px]" />
              </span>
              <div>
                <p className="text-sm text-on-surface">Fast responder</p>
                <p className="text-xs text-on-surface-variant">
                  Usually replies within 15 minutes
                </p>
              </div>
            </Bento>
          </div>
        </div>
      </div>
    </div>
  );
}
