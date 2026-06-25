"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { WizardShell, Choice } from "./WizardShell";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/components/auth/AuthProvider";

const specialties = [
  "Strength",
  "Weight loss",
  "Yoga",
  "Nutrition",
  "Bodybuilding",
  "Mobility",
  "Boxing",
  "HIIT",
  "Pre/Post-natal",
];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function TrainerOnboarding() {
  const { completeOnboarding } = useAuth();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const [bio, setBio] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [years, setYears] = useState("");
  const [cert, setCert] = useState<string | null>(null);
  const [price, setPrice] = useState("");
  const [types, setTypes] = useState<string[]>(["in-person"]);
  const [avail, setAvail] = useState<string[]>([]);

  const toggle = (
    list: string[],
    setList: (v: string[]) => void,
    v: string
  ) => setList(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  function finish() {
    completeOnboarding();
    setDone(true);
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl rounded-3xl border border-border bg-surface/60 p-10 text-center backdrop-blur-xl"
      >
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-lime text-ink">
          <Icon name="shield" className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-semibold">
          Profile submitted
        </h1>
        <p className="mt-2 text-muted">
          Our team will review your certifications. You&apos;ll get a Verified
          badge once approved — usually within 48 hours.
        </p>
        <Link
          href="/trainer"
          className="mt-6 inline-flex rounded-full bg-accent-strong px-6 py-3 text-sm font-medium text-white"
        >
          Go to dashboard
        </Link>
      </motion.div>
    );
  }

  if (step === 0) {
    return (
      <WizardShell
        step={0}
        total={4}
        title="Tell trainees about you"
        onNext={() => setStep(1)}
        canNext={bio.trim().length > 10 && tags.length > 0}
      >
        <div className="space-y-5">
          <Field label="Short bio" htmlFor="bio">
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="What's your coaching style and who do you help?"
            />
          </Field>
          <Field label="Years of experience" htmlFor="yrs">
            <Input
              id="yrs"
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="5"
            />
          </Field>
          <div>
            <p className="mb-2 text-sm font-medium">Specialties</p>
            <div className="flex flex-wrap gap-2">
              {specialties.map((s) => (
                <Choice
                  key={s}
                  active={tags.includes(s)}
                  onClick={() => toggle(tags, setTags, s)}
                >
                  {s}
                </Choice>
              ))}
            </div>
          </div>
        </div>
      </WizardShell>
    );
  }

  if (step === 1) {
    return (
      <WizardShell
        step={1}
        total={4}
        title="Upload your certification"
        subtitle="Required for verification. PDF or image."
        onBack={() => setStep(0)}
        onNext={() => setStep(2)}
        canNext={!!cert}
      >
        <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface-2/50 px-6 py-12 text-center transition-colors hover:border-accent-strong/50">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-accent-strong/15 text-accent">
            <Icon name="clipboard" className="h-6 w-6" />
          </div>
          {cert ? (
            <p className="text-sm text-lime">{cert}</p>
          ) : (
            <>
              <p className="text-sm font-medium">Click to upload</p>
              <p className="text-xs text-muted">Certification + government ID</p>
            </>
          )}
          <input
            type="file"
            className="hidden"
            accept=".pdf,image/*"
            onChange={(e) =>
              setCert(e.target.files?.[0]?.name ?? "document.pdf")
            }
          />
        </label>
      </WizardShell>
    );
  }

  if (step === 2) {
    return (
      <WizardShell
        step={2}
        total={4}
        title="Set your pricing"
        onBack={() => setStep(1)}
        onNext={() => setStep(3)}
        canNext={!!price && types.length > 0}
      >
        <div className="space-y-5">
          <Field label="Price per session (ETB)" htmlFor="price">
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="700"
            />
          </Field>
          <div>
            <p className="mb-2 text-sm font-medium">Session types offered</p>
            <div className="flex gap-2">
              {["in-person", "online"].map((t) => (
                <Choice
                  key={t}
                  active={types.includes(t)}
                  onClick={() => toggle(types, setTypes, t)}
                >
                  <span className="capitalize">{t}</span>
                </Choice>
              ))}
            </div>
          </div>
        </div>
      </WizardShell>
    );
  }

  return (
    <WizardShell
      step={3}
      total={4}
      title="When are you available?"
      subtitle="Pick the days you typically coach. Refine times later."
      onBack={() => setStep(2)}
      onNext={finish}
      nextLabel="Submit profile"
      canNext={avail.length > 0}
    >
      <div className="flex flex-wrap gap-2">
        {days.map((d) => (
          <Choice
            key={d}
            active={avail.includes(d)}
            onClick={() => toggle(avail, setAvail, d)}
          >
            {d}
          </Choice>
        ))}
      </div>
    </WizardShell>
  );
}
