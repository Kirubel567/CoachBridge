"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { MIcon } from "@/components/ui/MIcon";
import { Bento, Eyebrow } from "@/components/app/kit";
import { cn } from "@/lib/cn";

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors",
        on ? "bg-primary" : "bg-surface-container-highest"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
          on ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

const notifRows = [
  { key: "workout", icon: "fitness_center", tone: "text-primary bg-primary/10", label: "New workout alerts", desc: "Push notification when a coach assigns a new routine." },
  { key: "report", icon: "analytics", tone: "text-secondary bg-secondary/10", label: "Weekly performance report", desc: "A detailed summary of your weekly gains and milestones." },
  { key: "community", icon: "campaign", tone: "text-tertiary bg-tertiary-container/10", label: "Community announcements", desc: "Local events and platform-wide challenges." },
];

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({ workout: true, report: true, community: false });

  const initials = user?.name?.split(" ").map((p) => p[0]).join("").toUpperCase();

  function del() {
    if (confirm("Delete your account? This cannot be undone.")) {
      logout();
      router.replace("/");
    }
  }

  return (
    <div className="mx-auto max-w-[1000px] space-y-10">
      {/* Profile */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-[20px] font-semibold text-on-surface">
              Profile configuration
            </h2>
            <p className="text-sm text-on-surface-variant">
              Manage your public identity and account details.
            </p>
          </div>
          <button
            onClick={() => setSaved(true)}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:brightness-110"
          >
            {saved ? "Saved ✓" : "Save changes"}
          </button>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <Bento className="col-span-12 flex flex-col items-center justify-center text-center md:col-span-4">
            <div className="relative mb-4">
              <span className="grid h-32 w-32 place-items-center rounded-full bg-surface-container-high font-display text-4xl font-bold text-on-surface ring-1 ring-primary/30">
                {initials}
              </span>
              <button className="absolute bottom-1 right-1 grid h-10 w-10 place-items-center rounded-full bg-primary text-on-primary">
                <MIcon name="edit" className="text-[18px]" />
              </button>
            </div>
            <p className="font-medium text-on-surface">{user?.name}</p>
            <p className="text-sm capitalize text-on-surface-variant">
              {user?.role} since 2026
            </p>
          </Bento>
          <Bento className="col-span-12 md:col-span-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Eyebrow className="mb-2">Display name</Eyebrow>
                <input
                  defaultValue={user?.name}
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-high px-4 py-3 text-on-surface outline-none focus:border-primary"
                />
              </div>
              <div>
                <Eyebrow className="mb-2">Email address</Eyebrow>
                <input
                  defaultValue={user?.email}
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-high px-4 py-3 text-on-surface outline-none focus:border-primary"
                />
              </div>
              <div className="sm:col-span-2">
                <Eyebrow className="mb-2">Short bio</Eyebrow>
                <textarea
                  rows={3}
                  defaultValue="Focused on strength & metabolic conditioning."
                  className="w-full resize-none rounded-xl border border-outline-variant bg-surface-container-high px-4 py-3 text-on-surface outline-none focus:border-primary"
                />
              </div>
            </div>
          </Bento>
        </div>
      </section>

      {/* Notifications */}
      <section>
        <div className="mb-6">
          <h2 className="font-display text-[20px] font-semibold text-on-surface">
            Notification preferences
          </h2>
          <p className="text-sm text-on-surface-variant">
            Control how and when you receive updates.
          </p>
        </div>
        <div className="overflow-hidden rounded-[24px] bento-card">
          <div className="divide-y divide-outline-variant/40">
            {notifRows.map((n) => (
              <div
                key={n.key}
                className="flex items-center justify-between p-6 transition-colors hover:bg-surface-container-low"
              >
                <div className="flex gap-4">
                  <span className={cn("grid h-10 w-10 place-items-center rounded-xl", n.tone)}>
                    <MIcon name={n.icon} className="text-[22px]" />
                  </span>
                  <div>
                    <h4 className="font-semibold text-on-surface">{n.label}</h4>
                    <p className="text-sm text-on-surface-variant">{n.desc}</p>
                  </div>
                </div>
                <Toggle
                  on={notifs[n.key as keyof typeof notifs]}
                  onClick={() =>
                    setNotifs((p) => ({
                      ...p,
                      [n.key]: !p[n.key as keyof typeof notifs],
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Danger zone */}
      <section>
        <div className="mb-6">
          <h2 className="font-display text-[20px] font-semibold text-error">
            Danger zone
          </h2>
          <p className="text-sm text-on-surface-variant">
            Irreversible actions that affect your account and data.
          </p>
        </div>
        <div className="rounded-[24px] border border-error/30 bg-surface p-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h4 className="font-semibold text-on-surface">
                Permanent account deletion
              </h4>
              <p className="mt-1 text-sm text-on-surface-variant">
                Completely erase your account and all associated data. This
                action is final.
              </p>
            </div>
            <button
              onClick={del}
              className="whitespace-nowrap rounded-xl bg-error px-6 py-3 text-sm font-semibold text-on-error hover:brightness-110"
            >
              Delete account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
