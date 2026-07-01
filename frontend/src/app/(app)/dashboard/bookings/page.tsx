"use client";

import { useState } from "react";
import Link from "next/link";
import { MIcon } from "@/components/ui/MIcon";
import { StatTile } from "@/components/app/kit";
import { mockBookings } from "@/lib/mock";
import { cn } from "@/lib/cn";

const tabs = ["Upcoming", "Past"] as const;

export default function BookingsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Upcoming");
  const list = mockBookings.filter((b) =>
    tab === "Upcoming"
      ? b.status === "confirmed" || b.status === "pending"
      : b.status === "completed" || b.status === "cancelled"
  );

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatTile label="Next session" value="14:00" hint="In 2 hours" />
        <StatTile
          label="Total booked"
          value="12"
          hint="+2 this week"
          hintTone="secondary"
        />
        <StatTile label="Completed" value="48" hint="Lifetime" />
        <StatTile label="Credits" value="04" hint="Top up" hintTone="primary" />
      </div>

      {/* Header + tabs */}
      <div className="flex items-center justify-between">
        <div className="inline-flex rounded-xl bg-surface-container p-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-lg px-5 py-2 text-sm transition-colors",
                tab === t
                  ? "bg-surface-container-highest font-medium text-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <Link
          href="/dashboard/trainers"
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-on-primary"
        >
          <MIcon name="add" className="text-[18px]" />
          New booking
        </Link>
      </div>

      {/* Session rows */}
      {list.length > 0 ? (
        <div className="overflow-hidden rounded-[24px] bento-card">
          {list.map((b) => {
            const d = new Date(b.date);
            return (
              <div
                key={b.id}
                className="group flex items-center gap-6 border-b border-outline-variant/30 px-8 py-5 transition-colors last:border-0 hover:bg-surface-container-low"
              >
                <div className="flex min-w-[56px] flex-col items-center justify-center border-r border-outline-variant/30 py-1 pr-4">
                  <span className="text-xs font-bold uppercase text-on-surface-variant">
                    {d.toLocaleDateString("en-US", { month: "short" })}
                  </span>
                  <span className="font-display text-2xl font-bold leading-none text-on-surface">
                    {d.getDate()}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-display text-base text-on-surface">
                    Session with {b.trainerName}
                  </h4>
                  <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <MIcon name="schedule" className="text-[16px]" /> {b.time}
                    </span>
                    <span className="flex items-center gap-1 capitalize">
                      <MIcon name="person" className="text-[16px]" /> {b.type}
                    </span>
                  </div>
                </div>
                <span
                  className={cn(
                    "rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider",
                    b.status === "confirmed" &&
                      "border-primary/20 bg-primary/10 text-primary",
                    b.status === "pending" &&
                      "border-outline-variant bg-surface-variant text-on-surface-variant",
                    b.status === "completed" &&
                      "border-secondary/20 bg-secondary/10 text-secondary",
                    b.status === "cancelled" &&
                      "border-error/20 bg-error/10 text-error"
                  )}
                >
                  {b.status}
                </span>
                <span className="hidden w-20 text-right text-sm text-on-surface md:block">
                  {b.price} ETB
                </span>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    className="grid h-9 w-9 place-items-center rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
                    title="Reschedule"
                  >
                    <MIcon name="event_repeat" className="text-[20px]" />
                  </button>
                  <button
                    className="grid h-9 w-9 place-items-center rounded-lg text-error/60 hover:bg-error/10 hover:text-error"
                    title="Cancel"
                  >
                    <MIcon name="close" className="text-[20px]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-outline-variant py-16 text-center">
          <p className="font-display text-lg font-semibold text-on-surface">
            No {tab.toLowerCase()} sessions
          </p>
          <Link
            href="/dashboard/trainers"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-on-primary"
          >
            <MIcon name="search" className="text-[18px]" />
            Find a trainer
          </Link>
        </div>
      )}
    </div>
  );
}
