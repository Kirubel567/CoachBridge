"use client";

import { useState } from "react";
import { MIcon } from "@/components/ui/MIcon";
import { Bento, Eyebrow } from "@/components/app/kit";
import { cn } from "@/lib/cn";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const times = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00"];

export default function SchedulePage() {
  const [slots, setSlots] = useState<Set<string>>(
    () =>
      new Set([
        "Mon-08:00", "Wed-08:00", "Fri-09:00", "Mon-13:00",
        "Tue-09:00", "Wed-10:00", "Thu-10:00", "Fri-13:00",
      ])
  );
  const [saved, setSaved] = useState(false);

  function toggle(key: string, weekend: boolean) {
    if (weekend) return;
    setSaved(false);
    setSlots((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-[1300px]">
      <div className="grid grid-cols-12 gap-6">
        {/* Availability grid */}
        <Bento className="col-span-12 lg:col-span-9">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <Eyebrow>Availability editor</Eyebrow>
              <h3 className="mt-1 font-display text-[24px] font-semibold text-on-surface">
                Weekly time slots
              </h3>
            </div>
            <button
              onClick={() => setSlots(new Set())}
              className="rounded-lg border border-outline-variant px-4 py-2 text-sm text-on-surface hover:bg-surface-container"
            >
              Reset to default
            </button>
          </div>

          {/* Days header */}
          <div className="mb-4 grid grid-cols-8 gap-3">
            <div />
            {days.map((d, i) => (
              <div key={d} className={cn("text-center", i > 4 && "opacity-40")}>
                <span className="block font-display text-[16px] font-semibold text-on-surface">
                  {d}
                </span>
              </div>
            ))}
          </div>

          {/* Slot rows */}
          <div className="space-y-3">
            {times.map((t) => (
              <div key={t} className="grid grid-cols-8 items-center gap-3">
                <div className="text-center text-sm text-on-surface-variant">
                  {t}
                </div>
                {days.map((d, i) => {
                  const key = `${d}-${t}`;
                  const weekend = i > 4;
                  const on = slots.has(key);
                  return (
                    <button
                      key={key}
                      onClick={() => toggle(key, weekend)}
                      disabled={weekend}
                      className={cn(
                        "grid h-11 place-items-center rounded-xl border transition-all",
                        weekend
                          ? "cursor-not-allowed border-outline-variant/30 bg-background/50"
                          : on
                            ? "border-transparent bg-primary-container text-on-primary-container"
                            : "border-outline-variant/30 bg-surface-container-low hover:border-primary/50"
                      )}
                    >
                      {on && !weekend && (
                        <MIcon name="check" filled className="text-[18px]" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </Bento>

        {/* Right sidebar */}
        <div className="col-span-12 space-y-6 lg:col-span-3">
          <Bento>
            <Eyebrow className="mb-4">Capacity insight</Eyebrow>
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-end justify-between">
                  <span className="text-sm text-on-surface">Bookable slots</span>
                  <span className="font-display text-[32px] font-semibold text-secondary">
                    {slots.size}
                  </span>
                </div>
                <div className="h-1 w-full rounded-full bg-surface-container-highest">
                  <div
                    className="h-full rounded-full bg-secondary"
                    style={{ width: `${Math.min(100, slots.size * 3)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-end justify-between">
                  <span className="text-sm text-on-surface">Weekly hours</span>
                  <span className="font-display text-[32px] font-semibold text-primary">
                    {(slots.size * 0.75).toFixed(1)}
                  </span>
                </div>
                <div className="h-1 w-full rounded-full bg-surface-container-highest">
                  <div className="h-full w-[45%] rounded-full bg-primary" />
                </div>
              </div>
            </div>
          </Bento>

          <Bento className="relative overflow-hidden">
            <div className="absolute left-0 top-0 h-1 w-full bg-error/30" />
            <div className="mb-4 flex items-center gap-2 text-error">
              <MIcon name="warning" className="text-[20px]" />
              <Eyebrow className="text-error">Conflicts</Eyebrow>
            </div>
            <div className="rounded-xl border border-error/20 bg-error-container/10 p-3">
              <p className="mb-1 text-[13px] font-medium text-on-error-container">
                Overlapping session
              </p>
              <p className="text-[11px] text-on-error-container/70">
                Monday 09:00 conflicts with a personal session.
              </p>
            </div>
          </Bento>

          <div className="rounded-[24px] border border-primary/20 bg-primary-container/5 p-6">
            <h4 className="mb-2 font-display text-[20px] font-semibold text-primary">
              Save changes?
            </h4>
            <p className="mb-6 text-sm text-on-surface-variant">
              Updates sync to your booking page immediately.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setSaved(true)}
                className="w-full rounded-xl bg-primary py-3 font-bold text-on-primary hover:opacity-90"
              >
                {saved ? "Published ✓" : "Publish schedule"}
              </button>
              <button className="w-full rounded-xl bg-surface-container-highest py-3 text-on-surface hover:bg-surface-variant">
                Save as draft
              </button>
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <Bento className="col-span-12">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h4 className="font-display text-[20px] font-semibold text-on-surface">
                Occupancy heatmap
              </h4>
              <p className="text-sm text-on-surface-variant">
                Peak demand times across the last 30 days.
              </p>
            </div>
            <div className="flex items-center gap-6">
              {[["Low", "bg-surface-container-highest"], ["Medium", "bg-primary/40"], ["High", "bg-primary"]].map(
                ([l, c]) => (
                  <div key={l} className="flex items-center gap-2">
                    <span className={cn("h-3 w-3 rounded", c)} />
                    <Eyebrow>{l}</Eyebrow>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="flex h-32 items-end gap-1">
            {[20, 45, 85, 30, 15, 60, 90, 50, 25, 75, 80, 10, 40, 95, 20, 85, 65, 5, 55, 70, 15].map(
              (h, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded-t-lg transition-all",
                    h > 70 ? "bg-primary" : h > 40 ? "bg-primary/40" : "bg-surface-container-highest"
                  )}
                  style={{ height: `${h}%` }}
                />
              )
            )}
          </div>
        </Bento>
      </div>
    </div>
  );
}
