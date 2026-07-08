"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MIcon } from "@/components/ui/MIcon";
import { Bento, Eyebrow } from "@/components/app/kit";
import { mockVerifications } from "@/lib/mock";

export default function VerificationsPage() {
  const [queue, setQueue] = useState(mockVerifications);
  const [log, setLog] = useState<{ name: string; action: string }[]>([]);

  function resolve(id: string, action: "approved" | "rejected") {
    const item = queue.find((q) => q.id === id);
    if (!item) return;
    setLog((l) => [{ name: item.name, action }, ...l]);
    setQueue((q) => q.filter((v) => v.id !== id));
  }

  const stats = [
    { l: "Pending requests", v: String(queue.length), d: "+12%", tone: "text-primary", icon: "arrow_upward" },
    { l: "Avg review time", v: "4.2h", d: "Optimal", tone: "text-secondary", icon: "bolt" },
    { l: "Total verified", v: "1,842", d: "Since 2023", tone: "text-on-surface-variant", icon: "" },
    { l: "Rejection rate", v: "8.4%", d: "Focus on Q&A", tone: "text-error", icon: "warning" },
  ];

  return (
    <div className="mx-auto max-w-[1200px] space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {stats.map((s) => (
          <Bento key={s.l}>
            <Eyebrow className="mb-2">{s.l}</Eyebrow>
            <div className="flex items-end justify-between">
              <span className="font-display text-[32px] font-semibold text-on-surface">
                {s.v}
              </span>
              <span className={`flex items-center gap-1 text-xs ${s.tone}`}>
                {s.icon && <MIcon name={s.icon} className="text-[14px]" />}
                {s.d}
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
              l.action === "approved"
                ? "bg-secondary/10 text-secondary"
                : "bg-error/10 text-error"
            }`}
          >
            {l.name} {l.action}.
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Queue */}
      <section className="overflow-hidden rounded-[24px] bento-card">
        <div className="flex items-center justify-between border-b border-outline-variant p-6">
          <div>
            <h4 className="font-display text-[20px] font-semibold text-on-surface">
              Verification queue
            </h4>
            <p className="text-sm text-on-surface-variant">
              Review trainer certifications and government IDs.
            </p>
          </div>
          <div className="flex overflow-hidden rounded-lg border border-outline-variant bg-surface-container">
            <button className="bg-primary-container/20 px-4 py-2 text-sm text-primary">
              Pending
            </button>
            <button className="border-l border-outline-variant px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface">
              Resolved
            </button>
          </div>
        </div>

        <div className="hidden grid-cols-[1.6fr_1fr_1fr_1.2fr] border-b border-outline-variant bg-surface-container-low px-6 py-4 md:grid">
          {["Trainer", "Specialization", "Documents", "Submitted / Actions"].map(
            (h) => (
              <Eyebrow key={h}>{h}</Eyebrow>
            )
          )}
        </div>

        <div className="divide-y divide-outline-variant">
          <AnimatePresence>
            {queue.map((v) => (
              <motion.div
                key={v.id}
                layout
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 items-center gap-4 px-6 py-5 transition-colors hover:bg-surface-container-lowest md:grid-cols-[1.6fr_1fr_1fr_1.2fr]"
              >
                <div className="flex items-center gap-4">
                  <span
                    className="grid h-10 w-10 place-items-center rounded-full text-xs font-bold text-on-primary-container"
                    style={{ background: v.accent }}
                  >
                    {v.initials}
                  </span>
                  <div>
                    <p className="font-medium text-on-surface">{v.name}</p>
                    <p className="text-sm text-on-surface-variant">
                      {v.name.toLowerCase().replace(" ", ".")}@example.com
                    </p>
                  </div>
                </div>
                <div>
                  <span className="rounded-lg border border-outline-variant bg-surface-container-high px-2.5 py-1 text-sm text-on-surface">
                    {v.specialty}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <MIcon name="description" className="text-[20px] text-primary" />
                  <span className="text-sm">2 files</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-secondary" />
                      <span className="text-sm font-medium text-secondary">
                        Awaiting review
                      </span>
                    </div>
                    <p className="text-[12px] text-on-surface-variant">
                      {new Date(v.submitted).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => resolve(v.id, "rejected")}
                      className="rounded-lg border border-outline-variant px-3 py-1.5 text-xs font-bold text-on-surface-variant hover:border-error hover:text-error"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => resolve(v.id, "approved")}
                      className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-on-primary"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {queue.length === 0 && (
            <div className="px-6 py-16 text-center">
              <p className="font-display text-lg font-semibold text-on-surface">
                Queue cleared
              </p>
              <p className="mt-2 text-on-surface-variant">
                No trainers awaiting verification.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Standards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Bento className="lg:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <MIcon name="info" className="text-[22px] text-primary" />
            <h4 className="font-display text-[20px] font-semibold text-on-surface">
              Verification standards
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              ["Certification integrity", "Check valid expiry dates on NASM, ACE, or ISSN certificates. Digital verification links preferred."],
              ["Identity checks", "Verify identity against government ID and ensure no active disciplinary flags."],
            ].map(([t, d]) => (
              <div
                key={t}
                className="rounded-xl border border-outline-variant bg-surface-container-low p-4"
              >
                <h5 className="mb-2 font-bold text-on-surface">{t}</h5>
                <p className="text-sm text-on-surface-variant">{d}</p>
              </div>
            ))}
          </div>
        </Bento>
        <Bento className="flex flex-col items-center justify-center text-center">
          <span className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-secondary/10 text-secondary">
            <MIcon name="auto_awesome" className="text-[32px]" />
          </span>
          <h4 className="mb-2 font-display text-[20px] font-semibold text-on-surface">
            Auto-audit ready
          </h4>
          <p className="mb-6 text-sm text-on-surface-variant">
            Pre-scan documents for authenticity and common forgery markers.
          </p>
          <button className="w-full rounded-xl border border-outline-variant bg-surface-container-highest py-3 text-sm text-on-surface transition-all hover:bg-primary hover:text-on-primary">
            Enable smart review
          </button>
        </Bento>
      </div>
    </div>
  );
}
