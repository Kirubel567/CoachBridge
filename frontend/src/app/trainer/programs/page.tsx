"use client";

import { useMemo, useState } from "react";
import { MIcon } from "@/components/ui/MIcon";
import { Eyebrow } from "@/components/app/kit";
import { mockClients } from "@/lib/mock";

type SetRow = { reps: string; weight: string; rpe: string };
type Exercise = { id: number; name: string; sets: SetRow[] };

const library = [
  { name: "Barbell Back Squat", tag: "Legs • Compound" },
  { name: "Romanian Deadlift", tag: "Glutes • Stability" },
  { name: "Bulgarian Split Squat", tag: "Legs • Unilateral" },
  { name: "Leg Press 45°", tag: "Quads • Hypertrophy" },
  { name: "Overhead Press", tag: "Shoulders • Compound" },
  { name: "Kettlebell Swings", tag: "Power • Explosive" },
];

let uid = 1;
const newExercise = (name: string): Exercise => ({
  id: uid++,
  name,
  sets: [
    { reps: "8", weight: "60kg", rpe: "8" },
    { reps: "8", weight: "60kg", rpe: "8" },
    { reps: "8", weight: "60kg", rpe: "9" },
  ],
});

export default function ProgramsPage() {
  const [client, setClient] = useState(mockClients[0].id);
  const [title, setTitle] = useState("Phase 2: Hypertrophy & Power");
  const [exercises, setExercises] = useState<Exercise[]>([
    newExercise("Barbell Back Squat"),
  ]);

  const volume = useMemo(
    () =>
      exercises.reduce(
        (sum, ex) =>
          sum +
          ex.sets.reduce(
            (s, set) =>
              s + (parseInt(set.reps) || 0) * (parseInt(set.weight) || 0),
            0
          ),
        0
      ),
    [exercises]
  );

  const add = (name: string) =>
    setExercises((p) => [...p, newExercise(name)]);
  const remove = (id: number) =>
    setExercises((p) => p.filter((e) => e.id !== id));
  const addSet = (id: number) =>
    setExercises((p) =>
      p.map((e) =>
        e.id === id
          ? { ...e, sets: [...e.sets, { reps: "8", weight: "60kg", rpe: "8" }] }
          : e
      )
    );
  const setField = (
    id: number,
    idx: number,
    key: keyof SetRow,
    value: string
  ) =>
    setExercises((p) =>
      p.map((e) =>
        e.id === id
          ? {
              ...e,
              sets: e.sets.map((s, i) =>
                i === idx ? { ...s, [key]: value } : s
              ),
            }
          : e
      )
    );

  return (
    <div className="mx-auto flex max-w-[1300px] flex-col gap-6 lg:flex-row">
      {/* Left column */}
      <div className="flex w-full shrink-0 flex-col gap-6 lg:w-80">
        <div className="rounded-[24px] bento-card p-6">
          <Eyebrow className="mb-4">Active client</Eyebrow>
          <select
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className="w-full rounded-xl border border-outline-variant bg-surface-container px-4 py-3 text-sm text-on-surface outline-none focus:border-primary"
          >
            {mockClients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.goal}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col overflow-hidden rounded-[24px] bento-card">
          <div className="border-b border-outline-variant p-5">
            <div className="relative">
              <MIcon
                name="search"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant"
              />
              <input
                placeholder="Search exercises…"
                className="w-full rounded-xl border border-outline-variant bg-surface-container-highest py-2 pl-10 pr-4 text-sm text-on-surface outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="max-h-[420px] space-y-1 overflow-y-auto p-2">
            {library.map((ex) => (
              <button
                key={ex.name}
                onClick={() => add(ex.name)}
                className="group w-full rounded-xl p-3 text-left transition-colors hover:bg-surface-container"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-on-surface group-hover:text-primary">
                    {ex.name}
                  </span>
                  <MIcon name="add_circle" className="text-[18px] text-on-surface-variant group-hover:text-primary" />
                </div>
                <Eyebrow>{ex.tag}</Eyebrow>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Builder canvas */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-[24px] bento-card">
        <div className="flex items-center justify-between border-b border-outline-variant p-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full max-w-[420px] border-none bg-transparent font-display text-[24px] font-semibold text-on-surface outline-none"
          />
          <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Day 1: Lower Body
          </span>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {exercises.map((ex, exIdx) => (
            <div
              key={ex.id}
              className="group relative overflow-hidden rounded-2xl border border-outline-variant bg-surface-container/50 transition-all hover:border-primary/50"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-primary" />
              <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-[32px] font-semibold leading-none text-on-surface-variant/40">
                      {String.fromCharCode(65 + exIdx)}1
                    </span>
                    <div>
                      <h3 className="font-display text-[20px] font-semibold text-on-surface">
                        {ex.name}
                      </h3>
                      <p className="text-sm text-on-surface-variant">
                        Rest: 180s
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => remove(ex.id)}
                    className="grid h-9 w-9 place-items-center rounded-lg text-on-surface-variant opacity-0 transition-opacity hover:bg-surface-container-highest hover:text-error group-hover:opacity-100"
                  >
                    <MIcon name="delete" className="text-[20px]" />
                  </button>
                </div>

                {/* Sets grid */}
                <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-3">
                  {(["Set", "Reps", "Weight", "RPE"] as const).map((h) => (
                    <Eyebrow key={h} className={h === "Set" ? "w-10" : ""}>
                      {h}
                    </Eyebrow>
                  ))}
                  {ex.sets.map((s, i) => (
                    <div key={i} className="contents">
                      <div className="grid h-10 w-10 place-items-center rounded-lg border border-outline-variant/30 bg-surface-container-highest text-sm text-on-surface-variant">
                        {i + 1}
                      </div>
                      {(["reps", "weight", "rpe"] as const).map((k) => (
                        <input
                          key={k}
                          value={s[k]}
                          onChange={(e) =>
                            setField(ex.id, i, k, e.target.value)
                          }
                          className="h-10 rounded-lg border border-outline-variant bg-surface-container-highest text-center text-sm font-medium text-on-surface outline-none focus:border-primary"
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addSet(ex.id)}
                  className="mt-4 flex items-center gap-2 text-xs font-medium text-primary hover:text-on-surface"
                >
                  <MIcon name="add_circle" className="text-[16px]" />
                  Add set
                </button>
              </div>
            </div>
          ))}

          <p className="py-6 text-center text-sm text-on-surface-variant">
            Click an exercise from the library to add it here.
          </p>
        </div>

        {/* Footer stats */}
        <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container p-6">
          <div className="flex items-center gap-8">
            <div>
              <Eyebrow>Total volume</Eyebrow>
              <p className="font-display text-[20px] font-semibold text-on-surface">
                {volume.toLocaleString()} kg
              </p>
            </div>
            <div>
              <Eyebrow>Exercises</Eyebrow>
              <p className="font-display text-[20px] font-semibold text-on-surface">
                {exercises.length}
              </p>
            </div>
            <div>
              <Eyebrow>Intensity</Eyebrow>
              <p className="font-display text-[20px] font-semibold text-secondary">
                High
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-on-primary hover:opacity-90">
            <MIcon name="save" className="text-[18px]" />
            Assign program
          </button>
        </div>
      </div>
    </div>
  );
}
