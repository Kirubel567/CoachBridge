"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { MIcon } from "@/components/ui/MIcon";
import { Bento, Eyebrow } from "@/components/app/kit";
import { cn } from "@/lib/cn";

const specialties = [
  "Strength",
  "Weight loss",
  "Yoga",
  "Nutrition",
  "Bodybuilding",
  "Mobility",
  "Boxing",
  "HIIT",
];

export default function TrainerProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [tags, setTags] = useState(["Strength", "Mobility", "HIIT"]);

  const toggle = (t: string) =>
    setTags((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      {/* Verified banner */}
      <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-[24px] border border-secondary/20 bg-secondary-container/5 p-6 md:flex-row">
        <div className="flex items-center gap-5">
          <span className="grid h-16 w-16 place-items-center rounded-2xl border border-secondary/20 bg-secondary/10 text-secondary">
            <MIcon name="verified" filled className="text-[36px]" />
          </span>
          <div>
            <h2 className="font-display text-[20px] font-semibold text-secondary">
              You&apos;re a verified trainer
            </h2>
            <p className="max-w-lg text-sm text-on-surface-variant">
              Your certifications are approved and your Verified badge is live on
              your public profile.
            </p>
          </div>
        </div>
        <span className="rounded-full bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-widest text-on-secondary">
          Active
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Identity form */}
        <div className="col-span-12 lg:col-span-8">
          <Bento>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="font-display text-[20px] font-semibold text-on-surface">
                  Professional identity
                </h3>
                <p className="text-sm text-on-surface-variant">
                  The primary info displayed on your public profile.
                </p>
              </div>
              <button className="text-sm text-primary hover:underline">
                Preview profile
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <Eyebrow className="mb-2">Display name</Eyebrow>
                  <input
                    defaultValue={user?.name}
                    className="w-full rounded-xl border border-outline-variant bg-surface-container px-4 py-3 text-on-surface outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <Eyebrow className="mb-2">Professional title</Eyebrow>
                  <input
                    defaultValue="High-Performance Coach"
                    className="w-full rounded-xl border border-outline-variant bg-surface-container px-4 py-3 text-on-surface outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <Eyebrow className="mb-2">Professional bio</Eyebrow>
                <textarea
                  rows={4}
                  defaultValue="Certified strength coach helping busy professionals build sustainable strength and drop fat."
                  className="w-full resize-none rounded-xl border border-outline-variant bg-surface-container px-4 py-3 text-on-surface outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <Eyebrow className="mb-2">Years experience</Eyebrow>
                  <input
                    type="number"
                    defaultValue={7}
                    className="w-full rounded-xl border border-outline-variant bg-surface-container px-4 py-3 text-on-surface outline-none focus:border-primary"
                  />
                </div>
                <div className="md:col-span-2">
                  <Eyebrow className="mb-2">Specializations</Eyebrow>
                  <div className="flex flex-wrap gap-2">
                    {specialties.map((s) => (
                      <button
                        key={s}
                        onClick={() => toggle(s)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-sm transition-colors",
                          tags.includes(s)
                            ? "border-primary/20 bg-primary/10 text-primary"
                            : "border-outline-variant text-on-surface-variant hover:text-on-surface"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-4 border-t border-outline-variant/30 pt-4">
                <button className="text-sm text-on-surface-variant hover:text-on-surface">
                  Discard
                </button>
                <button
                  onClick={() => setSaved(true)}
                  className="rounded-xl bg-primary px-8 py-3 font-bold text-on-primary hover:opacity-90"
                >
                  {saved ? "Saved ✓" : "Save changes"}
                </button>
              </div>
            </div>
          </Bento>
        </div>

        {/* Side */}
        <div className="col-span-12 space-y-6 lg:col-span-4">
          <Bento>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-[20px] font-semibold text-on-surface">
                Certifications
              </h3>
              <button className="grid h-8 w-8 place-items-center rounded-lg border border-outline-variant text-on-surface hover:bg-primary hover:text-on-primary">
                <MIcon name="add" className="text-[20px]" />
              </button>
            </div>
            {[
              { name: "NASM-CPT", id: "#5492021", exp: "Dec 2027", icon: "school" },
              { name: "Precision Nutrition L1", id: "PN-6623", exp: "Lifetime", icon: "nutrition" },
            ].map((c) => (
              <div
                key={c.name}
                className="mb-4 flex items-start gap-4 rounded-2xl border border-outline-variant bg-surface-container-low p-4"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary-container/20 text-secondary">
                  <MIcon name={c.icon} className="text-[22px]" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-on-surface">{c.name}</p>
                  <p className="text-xs text-on-surface-variant">ID: {c.id}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="rounded-full border border-secondary/20 bg-secondary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary">
                      Active
                    </span>
                    <span className="text-[10px] text-outline">Expires {c.exp}</span>
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full rounded-xl border border-dashed border-outline-variant py-3 text-sm text-on-surface-variant transition-colors hover:border-primary/50 hover:text-primary">
              Upload new credential
            </button>
          </Bento>

          <Bento className="border-secondary/10 bg-secondary-container/5">
            <div className="mb-4 flex items-center gap-3">
              <MIcon name="payments" className="text-[22px] text-secondary" />
              <h3 className="font-display text-[20px] font-semibold text-on-surface">
                Pricing
              </h3>
            </div>
            <div className="space-y-1">
              {[
                ["1:1 session", "700 ETB/hr"],
                ["Online session", "550 ETB/hr"],
              ].map(([l, v]) => (
                <div
                  key={l}
                  className="flex items-center justify-between border-b border-outline-variant/30 py-2 last:border-0"
                >
                  <span className="text-sm text-on-surface-variant">{l}</span>
                  <span className="font-display text-lg font-semibold text-on-surface">
                    {v}
                  </span>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full rounded-xl bg-secondary py-2 text-sm font-bold text-on-secondary hover:brightness-105">
              Edit rate card
            </button>
          </Bento>

          <button
            onClick={() => {
              logout();
              router.replace("/");
            }}
            className="flex items-center gap-2 px-2 text-sm text-on-surface-variant hover:text-on-surface"
          >
            <MIcon name="logout" className="text-[20px]" /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
