"use client";

import { useState } from "react";
import { LineChart } from "@/components/app/LineChart";
import { MIcon } from "@/components/ui/MIcon";
import { Bento, Eyebrow } from "@/components/app/kit";
import { mockProgress } from "@/lib/mock";
import { cn } from "@/lib/cn";

const recent = [
  { name: "Push Day — Upper body", when: "2 hours ago", val: "8,420 kg", label: "Total volume", icon: "repeat", tone: "text-secondary" },
  { name: "Zone 2 Aerobic Base", when: "Yesterday", val: "45:00", label: "Active time", icon: "directions_run", tone: "text-primary" },
  { name: "Pull Day — Heavy Sets", when: "Jul 24", val: "7,150 kg", label: "Total volume", icon: "fitness_center", tone: "text-secondary" },
];

export default function ProgressPage() {
  const [series, setSeries] = useState(mockProgress.weightSeries);
  const [range, setRange] = useState<"Weekly" | "Monthly">("Weekly");
  const [weight, setWeight] = useState("");

  function log(e: React.FormEvent) {
    e.preventDefault();
    if (!weight) return;
    setSeries((p) => [...p, { label: `Wk${p.length + 1}`, value: Number(weight) }]);
    setWeight("");
  }

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="grid grid-cols-12 gap-6">
        {/* Hero chart */}
        <Bento className="col-span-12 lg:col-span-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <Eyebrow>Performance trend</Eyebrow>
              <h2 className="mt-1 font-display text-[24px] font-semibold text-on-surface">
                Velocity & Volume
              </h2>
            </div>
            <div className="flex gap-2">
              {(["Weekly", "Monthly"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-sm",
                    range === r
                      ? "border-outline-variant bg-surface-container-high text-on-surface"
                      : "border-transparent text-on-surface-variant hover:text-on-surface"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <LineChart data={series} stroke="#cabeff" height={240} />
        </Bento>

        {/* Metric tiles */}
        <div className="col-span-12 grid grid-cols-2 gap-6 lg:col-span-4 lg:grid-cols-1">
          <Bento className="flex flex-col justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <MIcon name="fitness_center" filled className="text-[20px] text-secondary" />
                <Eyebrow>Max output</Eyebrow>
              </div>
              <p className="font-display text-[32px] font-semibold text-on-surface">
                142 <span className="text-base text-on-surface-variant">kg</span>
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-outline-variant pt-4 text-sm text-secondary">
              +12% vs last month
              <MIcon name="trending_up" className="text-[18px]" />
            </div>
          </Bento>
          <Bento className="flex flex-col justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <MIcon name="bedtime" filled className="text-[20px] text-primary" />
                <Eyebrow>Recovery score</Eyebrow>
              </div>
              <p className="font-display text-[32px] font-semibold text-on-surface">
                88 <span className="text-base text-on-surface-variant">/ 100</span>
              </p>
            </div>
            <div className="mt-4">
              <div className="h-1 w-full overflow-hidden rounded-full bg-surface-container-high">
                <div className="h-full w-[88%] bg-primary" />
              </div>
            </div>
          </Bento>
        </div>

        {/* Quick log */}
        <Bento className="col-span-12 lg:col-span-4">
          <div className="mb-6 flex items-center gap-2">
            <MIcon name="edit_note" className="text-[22px] text-primary" />
            <h3 className="font-display text-[20px] font-semibold text-on-surface">
              Quick log
            </h3>
          </div>
          <form onSubmit={log} className="space-y-4">
            <div>
              <Eyebrow className="mb-2">Weight (kg)</Eyebrow>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="73.2"
                className="w-full rounded-xl border border-outline-variant bg-surface-container px-4 py-3 text-on-surface outline-none focus:border-primary"
              />
            </div>
            <div>
              <Eyebrow className="mb-2">Notes</Eyebrow>
              <textarea
                rows={3}
                placeholder="How did it feel?"
                className="w-full resize-none rounded-xl border border-outline-variant bg-surface-container px-4 py-3 text-on-surface outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-4 font-bold text-on-primary transition-all hover:opacity-90 active:scale-95"
            >
              Record session
            </button>
          </form>
        </Bento>

        {/* Recent sessions */}
        <Bento className="col-span-12 lg:col-span-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-display text-[20px] font-semibold text-on-surface">
              Recent sessions
            </h3>
            <button className="text-sm text-primary hover:underline">View all</button>
          </div>
          <div className="space-y-1">
            {recent.map((s) => (
              <div
                key={s.name}
                className="group -mx-2 flex items-center justify-between rounded-2xl px-2 py-4 transition-colors hover:bg-surface-container-high"
              >
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-xl border border-outline-variant bg-surface-container-highest">
                    <MIcon name={s.icon} className={cn("text-[22px]", s.tone)} />
                  </span>
                  <div>
                    <h4 className="font-medium text-on-surface">{s.name}</h4>
                    <p className="text-sm text-on-surface-variant">
                      Completed · {s.when}
                    </p>
                  </div>
                </div>
                <div className="hidden text-right md:block">
                  <span className="block font-display text-[18px] font-semibold text-on-surface">
                    {s.val}
                  </span>
                  <Eyebrow>{s.label}</Eyebrow>
                </div>
              </div>
            ))}
          </div>
        </Bento>

        {/* Milestone showcase */}
        <div className="relative col-span-12 overflow-hidden rounded-[24px] bento-card">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-[90px]" />
          <div className="relative max-w-xl p-8">
            <span className="mb-4 inline-block rounded-full bg-secondary px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-on-secondary">
              Current milestone
            </span>
            <h2 className="font-display text-[32px] font-semibold text-on-surface">
              Elite strength certification
            </h2>
            <p className="mt-2 text-on-surface-variant">
              You&apos;re only 480kg of total weekly volume from the next tier.
              Your consistency score is at an all-time high of 94%.
            </p>
            <div className="mt-6 flex gap-4">
              <button className="rounded-xl bg-on-surface px-6 py-2 font-bold text-background hover:opacity-90">
                View roadmap
              </button>
              <button className="rounded-xl border border-outline-variant px-6 py-2 text-on-surface hover:bg-surface-container-high">
                Share stats
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
