"use client";

import { useState } from "react";
import { MIcon } from "@/components/ui/MIcon";
import { Bento, Eyebrow } from "@/components/app/kit";
import { mockReviews } from "@/lib/mock";
import { cn } from "@/lib/cn";

const filters = ["All feedback", "Unanswered", "Flagged", "Success stories"];

export default function ReviewsPage() {
  const [tab, setTab] = useState(filters[0]);
  const [openReply, setOpenReply] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const avg =
    mockReviews.reduce((s, r) => s + r.rating, 0) / mockReviews.length;

  function submit(id: string) {
    const text = drafts[id]?.trim();
    if (!text) return;
    setReplies((p) => ({ ...p, [id]: text }));
    setOpenReply(null);
    setDrafts((p) => ({ ...p, [id]: "" }));
  }

  return (
    <div className="mx-auto max-w-[1100px] space-y-8">
      {/* Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Bento>
          <Eyebrow className="mb-2">Average rating</Eyebrow>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[32px] font-semibold text-secondary">
              {avg.toFixed(2)}
            </span>
            <span className="text-sm text-secondary/60">/ 5.0</span>
          </div>
          <div className="mt-4 flex gap-1 text-secondary">
            {[1, 2, 3, 4].map((i) => (
              <MIcon key={i} name="star" filled className="text-[18px]" />
            ))}
            <MIcon name="star_half" className="text-[18px]" />
          </div>
        </Bento>
        <Bento>
          <Eyebrow className="mb-2">Response rate</Eyebrow>
          <span className="font-display text-[32px] font-semibold text-on-surface">
            98.4%
          </span>
          <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-surface-container-high">
            <div className="h-full w-[98%] rounded-full bg-primary" />
          </div>
          <p className="mt-2 text-xs text-on-surface-variant">
            Avg. time: 42 minutes
          </p>
        </Bento>
        <Bento>
          <Eyebrow className="mb-2">Total reviews</Eyebrow>
          <span className="font-display text-[32px] font-semibold text-on-surface">
            {mockReviews.length * 42}
          </span>
          <p className="mt-4 flex items-center gap-2 text-sm text-secondary">
            <MIcon name="trending_up" className="text-[16px]" /> +12% this month
          </p>
        </Bento>
      </div>

      {/* Filter tabs */}
      <div className="inline-flex gap-2 rounded-xl border border-outline-variant bg-surface-container p-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setTab(f)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm transition-colors",
              tab === f
                ? "bg-surface-container-highest text-primary"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Feedback list */}
      <div className="space-y-4">
        {mockReviews.map((r, idx) => (
          <div key={r.id} className="overflow-hidden rounded-[24px] bento-card">
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-surface-container-high text-sm font-bold text-on-surface">
                    {r.authorInitials}
                  </span>
                  <div>
                    <h4 className="font-display text-base text-on-surface">
                      {r.author}
                    </h4>
                    <p className="text-sm text-on-surface-variant">
                      {["Hypertrophy program", "Elite strength", "Functional flow"][idx % 3]}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex gap-0.5 text-secondary">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <MIcon key={i} name="star" filled className="text-[16px]" />
                    ))}
                  </div>
                  <Eyebrow>
                    {new Date(r.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </Eyebrow>
                </div>
              </div>
              <p className="mb-6 leading-relaxed text-on-surface">“{r.comment}”</p>

              {replies[r.id] ? (
                <div className="mb-4 rounded-xl border border-outline-variant/30 bg-surface-container p-4">
                  <Eyebrow className="mb-1 text-primary">Your reply</Eyebrow>
                  <p className="text-sm italic text-on-surface-variant">
                    {replies[r.id]}
                  </p>
                </div>
              ) : null}

              <div className="flex items-center gap-4 border-t border-outline-variant/30 pt-4">
                <button
                  onClick={() => setOpenReply(openReply === r.id ? null : r.id)}
                  className="flex items-center gap-2 text-sm text-primary hover:opacity-80"
                >
                  <MIcon name="reply" className="text-[18px]" /> Reply
                </button>
                <button className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface">
                  <MIcon name="bookmark" className="text-[18px]" /> Save
                </button>
                <button className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface">
                  <MIcon name="flag" className="text-[18px]" /> Flag
                </button>
              </div>
            </div>

            {openReply === r.id && (
              <div className="border-t border-outline-variant bg-surface-container-low p-6">
                <textarea
                  value={drafts[r.id] ?? ""}
                  onChange={(e) =>
                    setDrafts((p) => ({ ...p, [r.id]: e.target.value }))
                  }
                  rows={3}
                  placeholder="Write your expert response…"
                  className="mb-4 w-full resize-none rounded-xl border border-outline-variant bg-surface-container-highest p-4 text-sm text-on-surface outline-none focus:border-primary"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setOpenReply(null)}
                    className="px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => submit(r.id)}
                    className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-on-primary"
                  >
                    Send reply
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
