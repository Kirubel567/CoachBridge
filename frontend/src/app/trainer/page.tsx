"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { MIcon } from "@/components/ui/MIcon";
import { Bento, Eyebrow } from "@/components/app/kit";
import {
  mockRequests,
  mockClients,
  mockEarnings,
  mockReviews,
} from "@/lib/mock";

export default function TrainerDashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "Coach";

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Eyebrow>Trainer overview</Eyebrow>
          <h2 className="mt-1 font-display text-[32px] font-semibold text-on-surface">
            Welcome, {firstName}
          </h2>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-secondary">
          <MIcon name="verified" filled className="text-[16px]" />
          Verified
        </span>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        <Bento className="flex flex-col gap-2">
          <Eyebrow>Total revenue</Eyebrow>
          <div className="flex items-end justify-between">
            <span className="font-display text-[32px] font-semibold text-on-surface">
              {(mockEarnings.thisMonth / 1000).toFixed(1)}K
            </span>
            <span className="flex items-center gap-1 text-sm text-secondary">
              <MIcon name="trending_up" className="text-[16px]" /> +12%
            </span>
          </div>
        </Bento>
        <Bento className="flex flex-col gap-2">
          <Eyebrow>Active clients</Eyebrow>
          <div className="flex items-end justify-between">
            <span className="font-display text-[32px] font-semibold text-on-surface">
              {mockClients.length}
            </span>
            <span className="text-sm text-on-surface-variant">/ 30 max</span>
          </div>
        </Bento>
        <Bento className="flex flex-col gap-2">
          <Eyebrow>Pending requests</Eyebrow>
          <div className="flex items-end justify-between">
            <span className="font-display text-[32px] font-semibold text-on-surface">
              {String(mockRequests.length).padStart(2, "0")}
            </span>
            <span className="rounded bg-primary-container/20 px-2 py-0.5 text-[10px] font-bold text-primary">
              NEW
            </span>
          </div>
        </Bento>
        <Bento className="flex flex-col gap-2">
          <Eyebrow>Rating</Eyebrow>
          <div className="flex items-end justify-between">
            <span className="font-display text-[32px] font-semibold text-on-surface">
              4.9
            </span>
            <div className="flex text-secondary">
              {[1, 2, 3, 4].map((i) => (
                <MIcon key={i} name="star" filled className="text-[16px]" />
              ))}
              <MIcon name="star_half" className="text-[16px]" />
            </div>
          </div>
        </Bento>
      </div>

      {/* Requests + feedback */}
      <div className="grid grid-cols-12 gap-6">
        <Bento className="col-span-12 lg:col-span-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-display text-[20px] font-semibold text-on-surface">
              Pending requests
            </h3>
            <a href="/trainer/requests" className="text-sm text-primary hover:underline">
              View all
            </a>
          </div>
          <div className="space-y-4">
            {mockRequests.slice(0, 3).map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-2xl border border-transparent bg-surface-container-low p-4 transition-all hover:border-outline-variant hover:bg-surface-container"
              >
                <div className="flex items-center gap-4">
                  <span
                    className="grid h-12 w-12 place-items-center rounded-xl text-sm font-bold text-on-primary-container"
                    style={{ background: r.accent }}
                  >
                    {r.initials}
                  </span>
                  <div>
                    <p className="font-semibold text-on-surface">{r.trainee}</p>
                    <p className="text-sm text-on-surface-variant">
                      {r.goal} · {r.type}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:opacity-90">
                    Accept
                  </button>
                  <button className="rounded-xl border border-outline-variant px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-container-highest">
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Bento>

        <Bento className="col-span-12 lg:col-span-4">
          <h3 className="mb-6 font-display text-[20px] font-semibold text-on-surface">
            Latest feedback
          </h3>
          <div className="space-y-6">
            {mockReviews.slice(0, 3).map((r) => (
              <div key={r.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-on-surface">{r.author}</p>
                    <Eyebrow>
                      {new Date(r.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </Eyebrow>
                  </div>
                  <div className="flex origin-right scale-90 text-secondary">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <MIcon key={i} name="star" filled className="text-[16px]" />
                    ))}
                  </div>
                </div>
                <p className="text-sm italic text-on-surface-variant">
                  “{r.comment}”
                </p>
              </div>
            ))}
          </div>
        </Bento>
      </div>

      {/* Active client focus */}
      <div className="relative overflow-hidden rounded-[24px] bento-card">
        <div className="pointer-events-none absolute -left-20 top-0 h-full w-1/2 bg-gradient-to-r from-primary/10 to-transparent" />
        <div className="relative flex flex-col gap-8 p-8 md:flex-row md:items-center">
          <span
            className="grid h-28 w-28 shrink-0 place-items-center rounded-[24px] font-display text-3xl font-bold text-on-primary-container"
            style={{ background: mockClients[0].accent }}
          >
            {mockClients[0].initials}
          </span>
          <div className="flex-1">
            <span className="mb-3 inline-block rounded-full border border-secondary/30 bg-secondary-container/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-secondary">
              Milestone achieved
            </span>
            <h3 className="font-display text-[32px] font-semibold text-on-surface">
              {mockClients[0].name}
            </h3>
            <p className="mt-2 text-on-surface-variant">
              Completed the 100th session and surpassed the strength target.
            </p>
            <div className="mt-6 flex gap-12 border-t border-outline-variant pt-6">
              <div>
                <Eyebrow>Session streak</Eyebrow>
                <p className="font-display text-[24px] font-semibold text-on-surface">
                  14 weeks
                </p>
              </div>
              <div>
                <Eyebrow>Goal progress</Eyebrow>
                <p className="font-display text-[24px] font-semibold text-secondary">
                  {mockClients[0].progress}%
                </p>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-on-primary hover:opacity-90">
              Send congratulations
              <MIcon name="send" className="text-[18px]" />
            </button>
            <a
              href="/trainer/clients"
              className="rounded-xl border border-outline-variant px-6 py-3 text-center font-medium text-on-surface hover:bg-surface-container-highest"
            >
              View full profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
