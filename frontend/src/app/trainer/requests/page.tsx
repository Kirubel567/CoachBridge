"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MIcon } from "@/components/ui/MIcon";
import { Bento, Eyebrow } from "@/components/app/kit";
import { mockRequests } from "@/lib/mock";

const quotes: Record<string, string> = {
  rq1: "Looking to shed body fat and build a sustainable routine…",
  rq2: "Former athlete returning to peak form after a long break…",
  rq3: "Starting fresh — I need a rigid, structured plan to follow.",
};

export default function RequestsPage() {
  const [requests, setRequests] = useState(mockRequests);
  const [log, setLog] = useState<{ name: string; action: string }[]>([]);

  function resolve(id: string, action: "accepted" | "declined") {
    const req = requests.find((r) => r.id === id);
    if (!req) return;
    setLog((l) => [{ name: req.trainee, action }, ...l]);
    setRequests((rs) => rs.filter((r) => r.id !== id));
  }

  return (
    <div className="mx-auto max-w-[1100px] space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          { l: "New this week", v: "+14", d: "12%", icon: "trending_up", tone: "text-secondary" },
          { l: "Conversion rate", v: "68%", d: "Stable", icon: "check_circle", tone: "text-secondary" },
          { l: "Avg response time", v: "4.2h", d: "+0.8h", icon: "schedule", tone: "text-error" },
        ].map((s) => (
          <Bento key={s.l} className="flex flex-col justify-between">
            <Eyebrow>{s.l}</Eyebrow>
            <div className="mt-4 flex items-end justify-between">
              <span className="font-display text-[32px] font-semibold text-on-surface">
                {s.v}
              </span>
              <span className={`flex items-center gap-1 text-sm ${s.tone}`}>
                <MIcon name={s.icon} className="text-[16px]" /> {s.d}
              </span>
            </div>
          </Bento>
        ))}
      </div>

      <AnimatePresence>
        {log.map((l, i) => (
          <motion.div
            key={`${l.name}-${i}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl px-4 py-3 text-sm ${
              l.action === "accepted"
                ? "bg-secondary/10 text-secondary"
                : "bg-error/10 text-error"
            }`}
          >
            You {l.action} {l.name}&apos;s request.
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Table */}
      <div className="overflow-hidden rounded-[24px] bento-card">
        <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low/50 px-8 py-6">
          <div className="flex gap-4">
            <button className="border-b-2 border-primary pb-1 text-sm text-primary">
              All requests
            </button>
            <button className="text-sm text-on-surface-variant hover:text-on-surface">
              Elite
            </button>
            <button className="text-sm text-on-surface-variant hover:text-on-surface">
              Performance
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            Sort by:{" "}
            <button className="flex items-center gap-1 text-on-surface">
              Recent <MIcon name="expand_more" className="text-[16px]" />
            </button>
          </div>
        </div>

        <div className="divide-y divide-outline-variant">
          <AnimatePresence>
            {requests.map((r) => (
              <motion.div
                key={r.id}
                layout
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-4 px-8 py-6 transition-colors hover:bg-surface-container/30"
              >
                <div className="flex flex-1 items-center gap-4">
                  <span
                    className="grid h-12 w-12 place-items-center rounded-2xl text-sm font-bold text-on-primary-container"
                    style={{ background: r.accent }}
                  >
                    {r.initials}
                  </span>
                  <div>
                    <h4 className="font-display text-base text-on-surface">
                      {r.trainee}
                    </h4>
                    <p className="text-sm text-on-surface-variant">
                      {new Date(r.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      · {r.time}
                    </p>
                  </div>
                </div>
                <div className="hidden flex-1 lg:block">
                  <div className="mb-1 flex gap-2">
                    <span className="rounded-md bg-surface-variant px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant">
                      {r.goal}
                    </span>
                    <span className="rounded-md bg-surface-variant px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant">
                      {r.type}
                    </span>
                  </div>
                  <p className="line-clamp-1 text-sm italic text-on-surface-variant">
                    {quotes[r.id] ?? "Excited to get started with a coach."}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => resolve(r.id, "declined")}
                    className="grid h-10 w-10 place-items-center rounded-xl border border-outline-variant text-on-surface-variant transition-all hover:border-error hover:text-error"
                    aria-label="Decline"
                  >
                    <MIcon name="close" className="text-[20px]" />
                  </button>
                  <button
                    onClick={() => resolve(r.id, "accepted")}
                    className="flex items-center gap-2 rounded-xl bg-secondary px-6 py-2.5 text-sm font-medium text-on-secondary transition-all hover:brightness-110 active:scale-95"
                  >
                    <MIcon name="check_circle" filled className="text-[20px]" />
                    Accept
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {requests.length === 0 && (
            <div className="px-8 py-16 text-center">
              <p className="font-display text-lg font-semibold text-on-surface">
                All caught up
              </p>
              <p className="mt-2 text-on-surface-variant">
                No pending requests right now.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Bento className="border-l-4 border-l-primary">
          <div className="flex items-start gap-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
              <MIcon name="auto_awesome" className="text-[22px]" />
            </span>
            <div>
              <h3 className="mb-2 font-display text-[18px] font-semibold text-on-surface">
                Demand insight
              </h3>
              <p className="mb-4 text-sm text-on-surface-variant">
                You have a high volume of strength-focused requests this week.
                Consider opening more slots to capture the overflow.
              </p>
              <button className="text-sm font-medium text-primary hover:underline">
                View program capacity →
              </button>
            </div>
          </div>
        </Bento>
        <Bento>
          <h3 className="mb-2 font-display text-[18px] font-semibold text-on-surface">
            Automated rules
          </h3>
          <p className="mb-4 text-sm text-on-surface-variant">
            Decline requests automatically when weekly availability is under 3
            sessions?
          </p>
          <div className="flex items-center gap-4">
            <button className="rounded-xl bg-surface-container px-4 py-2 text-sm text-on-surface hover:bg-surface-container-high">
              Setup auto-filter
            </button>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-secondary">
              Pro feature
            </span>
          </div>
        </Bento>
      </div>
    </div>
  );
}
