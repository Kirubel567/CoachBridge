"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MIcon } from "@/components/ui/MIcon";
import { Bento, Eyebrow } from "@/components/app/kit";
import { mockFlagged } from "@/lib/mock";
import { cn } from "@/lib/cn";

const chips = ["All flags", "External contact", "Abuse", "Spam"];

export default function ModerationPage() {
  const [items, setItems] = useState(mockFlagged);
  const [chip, setChip] = useState(chips[0]);

  const resolve = (id: string) => setItems((p) => p.filter((i) => i.id !== id));

  return (
    <div className="mx-auto max-w-[1200px] space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {[
          { l: "Pending review", v: String(items.length), d: "+12%", tone: "text-error" },
          { l: "Avg response", v: "1.2h", d: "-8%", tone: "text-secondary" },
          { l: "Accuracy", v: "98.4%", d: "Target 99%", tone: "text-on-surface-variant" },
          { l: "Capacity", v: "Optimal", d: "", tone: "text-secondary" },
        ].map((s) => (
          <Bento key={s.l}>
            <Eyebrow className="mb-1">{s.l}</Eyebrow>
            <div className="flex items-end justify-between">
              <span className="font-display text-[28px] font-semibold text-on-surface">
                {s.v}
              </span>
              {s.d && <span className={`text-[12px] ${s.tone}`}>{s.d}</span>}
            </div>
          </Bento>
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-outline-variant bg-surface-container-low p-4">
        {chips.map((c) => (
          <button
            key={c}
            onClick={() => setChip(c)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm transition-colors",
              chip === c
                ? "bg-primary text-on-primary"
                : "text-on-surface-variant hover:bg-surface-container-high"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Flagged cards */}
        <div className="col-span-12 space-y-6 lg:col-span-8">
          <AnimatePresence>
            {items.map((f) => (
              <motion.div
                key={f.id}
                layout
                exit={{ opacity: 0, scale: 0.98 }}
                className="overflow-hidden rounded-[24px] bento-card p-6"
              >
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-surface-variant px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide capitalize text-on-surface-variant">
                      {f.type}
                    </span>
                    <span className="rounded-md border border-error/20 bg-error/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-error">
                      {f.reason}
                    </span>
                  </div>
                  <span className="text-xs text-on-surface-variant">
                    {new Date(f.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="mb-4 rounded-2xl border border-outline-variant/30 bg-surface-container-high/50 p-4">
                  <p className="italic leading-relaxed text-on-surface opacity-90">
                    “{f.content}”
                  </p>
                </div>
                <p className="mb-6 text-xs text-on-surface-variant">
                  Reported from: {f.author}
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => resolve(f.id)}
                    className="flex items-center gap-2 rounded-xl bg-error px-6 py-2.5 text-sm font-medium text-on-error transition-all hover:brightness-110 active:scale-95"
                  >
                    <MIcon name="delete_forever" className="text-[20px]" />
                    Remove content
                  </button>
                  <button
                    onClick={() => resolve(f.id)}
                    className="flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-highest px-6 py-2.5 text-sm font-medium text-on-surface hover:bg-surface-bright"
                  >
                    <MIcon name="done_all" className="text-[20px]" />
                    Keep & dismiss
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {items.length === 0 && (
            <Bento className="py-16 text-center">
              <p className="font-display text-lg font-semibold text-on-surface">
                Nothing to moderate
              </p>
              <p className="mt-2 text-on-surface-variant">The queue is clear.</p>
            </Bento>
          )}
        </div>

        {/* Side panel */}
        <div className="col-span-12 space-y-6 lg:col-span-4">
          <Bento className="relative overflow-hidden">
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
            <h5 className="relative mb-4 font-display text-[18px] font-semibold text-on-surface">
              Live activity
            </h5>
            <div className="relative space-y-4">
              {[
                { c: "bg-secondary", t: "Admin reviewed 4 items", w: "Just now" },
                { c: "bg-error", t: "Critical flag from filter", w: "2m ago" },
                { c: "bg-outline-variant", t: "Queue updated: 3 new reports", w: "10m ago" },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={cn("mt-1.5 h-2 w-2 rounded-full", a.c)} />
                  <div>
                    <p className="text-sm text-on-surface">{a.t}</p>
                    <p className="text-[11px] text-on-surface-variant">{a.w}</p>
                  </div>
                </div>
              ))}
            </div>
          </Bento>

          <Bento>
            <h5 className="mb-4 font-display text-[18px] font-semibold text-on-surface">
              Guidelines
            </h5>
            <ul className="space-y-4">
              {[
                "Zero tolerance for targeted harassment of coaches.",
                "External contact info in messages is removed (anti-disintermediation).",
                "Constructive criticism is allowed; profanity is not.",
              ].map((g) => (
                <li key={g} className="flex items-start gap-3">
                  <MIcon name="verified_user" className="text-[20px] text-secondary" />
                  <p className="text-sm text-on-surface-variant">{g}</p>
                </li>
              ))}
            </ul>
          </Bento>

          <div className="rounded-[24px] border border-primary/20 bg-primary-container/10 p-6">
            <div className="mb-4 flex items-center gap-3">
              <MIcon name="auto_awesome" filled className="text-[22px] text-primary" />
              <h5 className="font-display text-[18px] font-semibold text-primary">
                Insights
              </h5>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-on-surface-variant">
              Detected a surge in off-platform solicitation. Consider a temporary
              lock on new guest reviews.
            </p>
            <button className="w-full rounded-xl bg-primary py-3 font-semibold text-on-primary hover:brightness-110">
              Enable lockdown
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
