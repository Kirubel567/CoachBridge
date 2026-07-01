import { MIcon } from "@/components/ui/MIcon";
import { Bento, Eyebrow } from "@/components/app/kit";
import { mockPlan } from "@/lib/mock";

const macros = [
  { label: "Protein", key: "protein", color: "#cabeff", of: 180 },
  { label: "Carbs", key: "carbs", color: "#b5e530", of: 320 },
  { label: "Fats", key: "fats", color: "#ccbdff", of: 70 },
] as const;

const week = [
  { d: "MON", state: "done" },
  { d: "TUE", state: "done" },
  { d: "WED", state: "today" },
  { d: "THU", state: "rest" },
  { d: "FRI", state: "workout" },
  { d: "SAT", state: "rest" },
  { d: "SUN", state: "rest" },
];

export default function PlansPage() {
  const { nutrition } = mockPlan;
  const today = mockPlan.week[0];

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow className="text-primary">
            Active cycle: {today.focus}
          </Eyebrow>
          <h2 className="mt-1 font-display text-[32px] font-semibold text-on-surface">
            Your training plan
          </h2>
        </div>
        <span className="flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-high px-4 py-2 text-sm">
          <span className="h-2 w-2 rounded-full bg-secondary" />
          Week 4 of 12
        </span>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Nutrition */}
        <Bento className="col-span-12 lg:col-span-4">
          <div className="mb-6 flex items-center justify-between">
            <h4 className="font-display text-[20px] font-semibold text-on-surface">
              Nutrition
            </h4>
            <MIcon name="edit" className="text-[20px] text-primary" />
          </div>
          <div className="relative mx-auto mb-8 flex h-48 w-48 items-center justify-center">
            <svg className="absolute inset-0 h-full w-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="transparent"
                stroke="#1c1a24"
                strokeWidth="8"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="transparent"
                stroke="#cabeff"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="553"
                strokeDashoffset="150"
              />
            </svg>
            <div className="text-center">
              <p className="font-display text-[32px] font-semibold leading-none text-on-surface">
                {nutrition.calories.toLocaleString()}
              </p>
              <Eyebrow className="mt-1">kcal target</Eyebrow>
            </div>
          </div>
          <div className="space-y-5">
            {macros.map((m) => {
              const grams = nutrition[m.key];
              return (
                <div key={m.key} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-on-surface">{m.label}</span>
                    <span className="text-on-surface-variant">
                      {grams}g / {m.of}g
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-container-lowest">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (grams / m.of) * 100)}%`,
                        background: m.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 border-t border-outline-variant pt-6">
            <Eyebrow className="mb-3">Coach note</Eyebrow>
            <p className="text-sm text-on-surface-variant">{nutrition.notes}</p>
          </div>
        </Bento>

        {/* Workout */}
        <div className="col-span-12 space-y-6 lg:col-span-8">
          <Bento>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h4 className="font-display text-[20px] font-semibold text-on-surface">
                  Weekly program
                </h4>
                <p className="text-sm text-on-surface-variant">
                  Consistency tracking for the current cycle.
                </p>
              </div>
            </div>
            <div className="mb-8 grid grid-cols-7 gap-3">
              {week.map((w) => (
                <div key={w.d} className="flex flex-col items-center gap-3">
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wide ${
                      w.state === "today" ? "text-primary" : "text-on-surface-variant"
                    }`}
                  >
                    {w.d}
                  </span>
                  <div
                    className={`grid aspect-square w-full place-items-center rounded-2xl border ${
                      w.state === "today"
                        ? "border-primary bg-primary/10 ring-2 ring-primary"
                        : w.state === "done"
                          ? "border-secondary/40 bg-secondary/5"
                          : "border-outline-variant/40 opacity-60"
                    }`}
                  >
                    <MIcon
                      name={
                        w.state === "done"
                          ? "check_circle"
                          : w.state === "today"
                            ? "fitness_center"
                            : w.state === "rest"
                              ? "hotel"
                              : "event"
                      }
                      filled={w.state === "done"}
                      className={`text-[24px] ${
                        w.state === "today"
                          ? "text-primary"
                          : w.state === "done"
                            ? "text-secondary"
                            : "text-on-surface-variant"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Today's session */}
            <div className="rounded-[20px] border border-outline-variant/30 bg-surface-container-low p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h5 className="font-display text-lg font-bold text-on-surface">
                    {today.focus}
                  </h5>
                  <p className="text-sm text-on-surface-variant">
                    {today.exercises.length} exercises · ~60 min
                  </p>
                </div>
                <button className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 font-medium text-on-primary">
                  <MIcon name="play_arrow" filled className="text-[20px]" />
                  Start
                </button>
              </div>
              <div className="space-y-3">
                {today.exercises.map((ex, i) => (
                  <div
                    key={ex.name}
                    className="flex items-center justify-between rounded-xl border border-outline-variant/50 bg-surface px-4 py-3"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-semibold text-primary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-medium text-on-surface">{ex.name}</span>
                    </div>
                    <span className="text-sm text-on-surface-variant">
                      {ex.sets} × {ex.reps}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Bento>

          {/* Growth mini grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Bento className="flex items-center justify-between">
              <div>
                <Eyebrow>Peak performance</Eyebrow>
                <p className="mt-1 font-display text-[32px] font-semibold text-on-surface">
                  142 kg
                </p>
                <p className="mt-1 flex items-center gap-1 text-sm text-secondary">
                  <MIcon name="trending_up" className="text-[16px]" /> +4.5% vs last week
                </p>
              </div>
              <MIcon name="bolt" className="text-[48px] text-primary/10" />
            </Bento>
            <Bento className="flex items-center justify-between">
              <div>
                <Eyebrow>Sleep quality</Eyebrow>
                <p className="mt-1 font-display text-[32px] font-semibold text-on-surface">
                  84%
                </p>
                <p className="mt-1 flex items-center gap-1 text-sm text-secondary">
                  <MIcon name="auto_awesome" className="text-[16px]" /> Optimal recovery
                </p>
              </div>
              <MIcon name="bedtime" className="text-[48px] text-secondary/10" />
            </Bento>
          </div>
        </div>
      </div>
    </div>
  );
}
