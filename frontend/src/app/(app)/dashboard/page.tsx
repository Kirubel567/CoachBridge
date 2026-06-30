"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { MIcon } from "@/components/ui/MIcon";
import { Bento, Eyebrow } from "@/components/app/kit";
import { mockTrainers, mockBookings } from "@/lib/mock";

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "there";
  const next = mockBookings.find((b) => b.status === "confirmed");
  const recommended = mockTrainers.slice(0, 4);

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      {/* Quick actions */}
      <div className="flex flex-wrap gap-4">
        <Link
          href="/dashboard/progress"
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-on-primary transition-transform active:scale-95"
        >
          <MIcon name="add_task" className="text-[20px]" />
          Log workout
        </Link>
        <Link
          href="/dashboard/messages"
          className="flex items-center gap-2 rounded-xl border border-outline-variant bg-surface px-6 py-3 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-high"
        >
          <MIcon name="chat_bubble" className="text-[20px]" />
          Message coach
        </Link>
        <Link
          href="/dashboard/trainers"
          className="flex items-center gap-2 rounded-xl border border-outline-variant bg-surface px-6 py-3 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-high"
        >
          <MIcon name="calendar_today" className="text-[20px]" />
          Book session
        </Link>
      </div>

      {/* Bento: next session + stats */}
      <div className="grid grid-cols-12 gap-6">
        {/* Next session */}
        <Bento className="relative col-span-12 flex min-h-[320px] flex-col justify-between overflow-hidden lg:col-span-7">
          <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-primary/5 blur-[80px]" />
          <div className="relative">
            <div className="mb-8 flex items-center justify-between">
              <span className="rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-secondary">
                Upcoming session
              </span>
              <span className="text-sm text-on-surface-variant">
                {next
                  ? new Date(next.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      hour: "numeric",
                      minute: "2-digit",
                    })
                  : "—"}
              </span>
            </div>
            <div className="mb-8 flex items-center gap-5">
              <span className="grid h-20 w-20 place-items-center rounded-2xl bg-primary-container font-display text-2xl font-bold text-on-primary-container">
                {next?.trainerName.split(" ").map((p) => p[0]).join("") ?? "—"}
              </span>
              <div>
                <h3 className="font-display text-[24px] font-semibold text-on-surface">
                  Strength & Power
                </h3>
                <p className="text-on-surface-variant">
                  with {next?.trainerName ?? "your coach"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-2 rounded-lg border border-outline-variant/30 bg-surface-container-high px-4 py-2 text-sm">
                <MIcon name="timer" className="text-[18px] text-primary" /> 60
                minutes
              </span>
              <span className="flex items-center gap-2 rounded-lg border border-outline-variant/30 bg-surface-container-high px-4 py-2 text-sm capitalize">
                <MIcon name="fitness_center" className="text-[18px] text-secondary" />
                {next?.type ?? "in-person"}
              </span>
            </div>
          </div>
          <button className="relative mt-8 inline-flex w-fit items-center gap-2 rounded-2xl bg-primary px-8 py-4 font-medium text-on-primary transition-shadow hover:shadow-[0_0_24px_rgba(202,190,255,0.3)]">
            <MIcon name="video_call" className="text-[20px]" />
            Join call
          </button>
        </Bento>

        {/* Stat tiles */}
        <div className="col-span-12 grid grid-cols-2 gap-4 lg:col-span-5">
          <Bento className="flex flex-col justify-between">
            <div>
              <Eyebrow>Weekly calories</Eyebrow>
              <p className="mt-1 font-display text-[32px] font-semibold text-on-surface">
                14,280
              </p>
            </div>
            <p className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-secondary">
              <MIcon name="trending_up" className="text-[16px]" /> 12% vs last week
            </p>
          </Bento>
          <Bento className="flex flex-col justify-between">
            <div>
              <Eyebrow>Active minutes</Eyebrow>
              <p className="mt-1 font-display text-[32px] font-semibold text-on-surface">
                420
              </p>
            </div>
            <div className="mt-4 h-1 w-full rounded-full bg-surface-container-high">
              <div className="h-full w-[85%] rounded-full bg-primary" />
            </div>
          </Bento>
          <Bento className="flex flex-col justify-between">
            <div>
              <Eyebrow>Sessions</Eyebrow>
              <p className="mt-1 font-display text-[32px] font-semibold text-on-surface">
                12/15
              </p>
            </div>
            <div className="mt-4 flex gap-1">
              {[1, 1, 1, 0].map((f, i) => (
                <div
                  key={i}
                  className={`h-1 w-full rounded-full ${
                    f ? "bg-secondary" : "bg-outline-variant/30"
                  }`}
                />
              ))}
            </div>
          </Bento>
          <Bento className="relative flex flex-col justify-between overflow-hidden">
            <div className="relative z-10">
              <Eyebrow>Resting HR</Eyebrow>
              <p className="mt-1 font-display text-[32px] font-semibold text-on-surface">
                58 <span className="text-sm text-on-surface-variant">bpm</span>
              </p>
            </div>
            <svg viewBox="0 0 200 40" className="absolute bottom-0 left-0 h-12 w-full">
              <path
                d="M0 35 Q 25 10, 50 30 T 100 20 T 150 25 T 200 5"
                fill="none"
                stroke="#CDFF4A"
                strokeWidth="2"
              />
            </svg>
          </Bento>
        </div>
      </div>

      {/* Recommended trainers */}
      <div>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-display text-[24px] font-semibold text-on-surface">
              Recommended trainers
            </h2>
            <p className="text-sm text-on-surface-variant">
              Matched to your goals and schedule.
            </p>
          </div>
          <Link
            href="/dashboard/trainers"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="flex snap-x gap-6 overflow-x-auto pb-4">
          {recommended.map((t) => (
            <Link
              key={t.id}
              href={`/dashboard/trainers/${t.id}`}
              className="group min-w-[280px] snap-start rounded-[24px] bento-card p-5 transition-transform hover:-translate-y-1"
            >
              <div className="mb-4 flex items-center justify-between">
                <span
                  className="grid h-16 w-16 place-items-center rounded-2xl font-display text-lg font-bold text-on-primary-container"
                  style={{ background: t.accent }}
                >
                  {t.initials}
                </span>
                <span className="flex items-center gap-1 rounded-md border border-white/10 bg-background/60 px-2 py-1 text-[11px] backdrop-blur">
                  <MIcon name="star" filled className="text-[14px] text-secondary" />
                  {t.rating.toFixed(1)}
                </span>
              </div>
              <h4 className="font-display text-[20px] font-semibold text-on-surface">
                {t.name}
              </h4>
              <p className="mb-4 text-sm text-on-surface-variant">
                {t.specialty}
              </p>
              <div className="flex items-center justify-between border-t border-outline-variant/30 pt-4">
                <span className="text-sm">
                  {t.price}{" "}
                  <span className="text-on-surface-variant">ETB/hr</span>
                </span>
                <span className="rounded-lg border border-primary/40 px-4 py-1.5 text-sm text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary">
                  Profile
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
