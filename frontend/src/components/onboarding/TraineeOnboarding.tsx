"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { WizardShell, Choice } from "./WizardShell";
import { Field, Input, Select } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/components/auth/AuthProvider";

const goalOptions = [
  "Lose weight",
  "Build muscle",
  "Get stronger",
  "Improve mobility",
  "General fitness",
  "Sport performance",
  "Nutrition",
];

export function TraineeOnboarding() {
  const { completeOnboarding } = useAuth();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const [goals, setGoals] = useState<string[]>([]);
  const [level, setLevel] = useState<string | null>(null);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const toggleGoal = (g: string) =>
    setGoals((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );

  function finish() {
    completeOnboarding();
    setDone(true);
  }

  if (done) {
    return <Completed href="/dashboard" cta="Go to dashboard" />;
  }

  if (step === 0) {
    return (
      <WizardShell
        step={0}
        total={3}
        title="What are your goals?"
        subtitle="Pick all that apply — we'll match you accordingly."
        onNext={() => setStep(1)}
        canNext={goals.length > 0}
      >
        <div className="flex flex-wrap gap-2">
          {goalOptions.map((g) => (
            <Choice key={g} active={goals.includes(g)} onClick={() => toggleGoal(g)}>
              {g}
            </Choice>
          ))}
        </div>
      </WizardShell>
    );
  }

  if (step === 1) {
    return (
      <WizardShell
        step={1}
        total={3}
        title="What's your experience level?"
        onBack={() => setStep(0)}
        onNext={() => setStep(2)}
        canNext={!!level}
      >
        <div className="grid gap-3">
          {[
            ["Beginner", "New to structured training"],
            ["Intermediate", "Train regularly, know the basics"],
            ["Advanced", "Experienced and consistent"],
          ].map(([l, d]) => (
            <button
              key={l}
              type="button"
              onClick={() => setLevel(l)}
              className={`rounded-2xl border p-4 text-left transition-colors ${
                level === l
                  ? "border-accent-strong bg-accent-strong/10"
                  : "border-border hover:bg-surface-2"
              }`}
            >
              <p className="font-medium">{l}</p>
              <p className="text-sm text-muted">{d}</p>
            </button>
          ))}
        </div>
      </WizardShell>
    );
  }

  return (
    <WizardShell
      step={2}
      total={3}
      title="A few body stats"
      subtitle="Optional — helps trainers tailor your plan. You can skip."
      onBack={() => setStep(1)}
      onNext={finish}
      nextLabel="Finish"
    >
      <div className="grid grid-cols-2 gap-4">
        <Field label="Height (cm)" htmlFor="h">
          <Input
            id="h"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="175"
          />
        </Field>
        <Field label="Weight (kg)" htmlFor="w">
          <Input
            id="w"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="72"
          />
        </Field>
        <Field label="Preferred session" htmlFor="s" className="col-span-2">
          <Select id="s" defaultValue="">
            <option value="">No preference</option>
            <option value="in-person">In-person</option>
            <option value="online">Online</option>
          </Select>
        </Field>
      </div>
    </WizardShell>
  );
}

function Completed({ href, cta }: { href: string; cta: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-xl rounded-3xl border border-border bg-surface/60 p-10 text-center backdrop-blur-xl"
    >
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-lime text-ink">
        <Icon name="check" className="h-8 w-8" />
      </div>
      <h1 className="mt-6 font-display text-2xl font-semibold">You&apos;re all set!</h1>
      <p className="mt-2 text-muted">
        Your profile is ready. Time to find the coach who fits you.
      </p>
      <Link
        href={href}
        className="mt-6 inline-flex rounded-full bg-accent-strong px-6 py-3 text-sm font-medium text-white"
      >
        {cta}
      </Link>
    </motion.div>
  );
}
