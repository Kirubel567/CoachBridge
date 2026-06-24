import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { api } from "@/lib/api";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { BookingWidget } from "@/components/trainers/BookingWidget";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const trainer = await api.trainers.get(id);
  if (!trainer) return { title: "Trainer not found — CoachBridge" };
  return {
    title: `${trainer.name} — ${trainer.specialty} | CoachBridge`,
    description: trainer.bio,
  };
}

export default async function TrainerProfilePage({ params }: Params) {
  const { id } = await params;
  const trainer = await api.trainers.get(id);
  if (!trainer) notFound();

  const [reviews, availability] = await Promise.all([
    api.trainers.reviews(id),
    api.trainers.availability(id),
  ]);

  return (
    <main className="pt-28 pb-24">
      <div className="container-x">
        {/* Breadcrumb */}
        <Link
          href="/trainers"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
        >
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
          Back to all trainers
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          {/* Main */}
          <div>
            {/* Header */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <Avatar
                initials={trainer.initials}
                color={trainer.accent}
                size="xl"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                    {trainer.name}
                  </h1>
                  {trainer.verified === "verified" && (
                    <Icon name="shield" className="h-6 w-6 text-lime" />
                  )}
                </div>
                <p className="mt-1 text-lg text-muted">{trainer.specialty}</p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted">
                  <span className="flex items-center gap-1.5">
                    <Icon name="location" className="h-4 w-4 text-accent" />
                    {trainer.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon name="star" className="h-4 w-4 text-lime" />
                    {trainer.rating.toFixed(1)} ({trainer.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { label: "Sessions", value: trainer.sessions.toLocaleString() },
                { label: "Experience", value: `${trainer.experienceYears} yrs` },
                { label: "From", value: `${trainer.price} ETB` },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-border bg-surface/40 p-5 text-center"
                >
                  <div className="font-display text-2xl font-bold">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs text-muted">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              {trainer.tags.map((t) => (
                <Badge key={t} tone="accent">
                  {t}
                </Badge>
              ))}
              {trainer.sessionTypes.map((st) => (
                <Badge key={st} tone="lime" className="capitalize">
                  {st}
                </Badge>
              ))}
            </div>

            {/* About */}
            <section className="mt-10">
              <h2 className="font-display text-2xl font-semibold">About</h2>
              <p className="mt-3 leading-relaxed text-muted">{trainer.bio}</p>
            </section>

            {/* Gallery placeholders */}
            <section className="mt-10">
              <h2 className="font-display text-2xl font-semibold">Gallery</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {trainer.gallery.map((g, i) => (
                  <div
                    key={g}
                    className="aspect-[4/3] rounded-2xl border border-border"
                    style={{
                      background: `linear-gradient(135deg, ${trainer.accent}22, #16161a)`,
                      backgroundSize: "cover",
                      opacity: 1 - i * 0.05,
                    }}
                  />
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section className="mt-10">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-semibold">
                  Reviews ({trainer.reviewCount})
                </h2>
                <span className="flex items-center gap-1.5 text-lg font-semibold">
                  <Icon name="star" className="h-5 w-5 text-lime" />
                  {trainer.rating.toFixed(1)}
                </span>
              </div>
              <div className="mt-5 space-y-4">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-2xl border border-border bg-surface/40 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar
                          initials={r.authorInitials}
                          color="#26262e"
                          size="sm"
                        />
                        <div>
                          <p className="text-sm font-medium">{r.author}</p>
                          <p className="text-xs text-muted">
                            {new Date(r.date).toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Icon
                            key={i}
                            name="star"
                            className="h-4 w-4 text-lime"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {r.comment}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky booking sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <BookingWidget trainer={trainer} availability={availability} />
          </aside>
        </div>
      </div>
    </main>
  );
}
