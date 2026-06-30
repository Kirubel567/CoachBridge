"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DayAvailability, Trainer } from "@/lib/types";
import { MIcon } from "@/components/ui/MIcon";
import { cn } from "@/lib/cn";

export function DashboardBookingCard({
  trainer,
  availability,
}: {
  trainer: Trainer;
  availability: DayAvailability[];
}) {
  const [dayIdx, setDayIdx] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [type, setType] = useState(trainer.sessionTypes[0]);
  const [confirmed, setConfirmed] = useState(false);
  const day = availability[dayIdx];

  return (
    <div className="rounded-[24px] bento-card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
            Session price
          </p>
          <p className="mt-1 flex items-baseline gap-1">
            <span className="font-display text-[32px] font-semibold text-on-surface">
              {trainer.price}
            </span>
            <span className="text-on-surface-variant">ETB/hr</span>
          </p>
        </div>
        <span className="rounded-lg border border-secondary/20 bg-secondary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-secondary">
          Best value
        </span>
      </div>

      {/* Type toggle */}
      {trainer.sessionTypes.length > 1 && (
        <div className="mt-5 flex rounded-xl bg-surface-container-highest p-1">
          {trainer.sessionTypes.map((st) => (
            <button
              key={st}
              onClick={() => {
                setType(st);
                setConfirmed(false);
              }}
              className={cn(
                "flex-1 rounded-lg py-2 text-sm capitalize transition-colors",
                type === st
                  ? "border border-outline-variant bg-surface text-on-surface"
                  : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              {st}
            </button>
          ))}
        </div>
      )}

      {/* Day selector */}
      <div className="mt-5 grid grid-cols-6 gap-2">
        {availability.map((d, i) => (
          <button
            key={d.day}
            onClick={() => {
              setDayIdx(i);
              setSlot(null);
              setConfirmed(false);
            }}
            className={cn(
              "flex flex-col items-center rounded-xl py-2 text-xs transition-colors",
              dayIdx === i
                ? "bg-primary font-semibold text-on-primary"
                : "bg-surface-container-high text-on-surface-variant hover:text-on-surface"
            )}
          >
            <span>{d.day}</span>
            <span className="text-[10px] opacity-70">
              {new Date(d.date).getDate()}
            </span>
          </button>
        ))}
      </div>

      {/* Slots */}
      <p className="mb-2 mt-5 text-sm text-on-surface">Available slots</p>
      <div className="grid grid-cols-3 gap-2">
        {day.slots.map((s) => (
          <button
            key={s.time}
            disabled={s.taken}
            onClick={() => {
              setSlot(s.time);
              setConfirmed(false);
            }}
            className={cn(
              "rounded-lg border py-2 text-sm transition-all",
              s.taken
                ? "cursor-not-allowed border-outline-variant/30 text-on-surface-variant/30 line-through"
                : slot === s.time
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-outline-variant text-on-surface hover:border-primary"
            )}
          >
            {s.time}
          </button>
        ))}
      </div>

      <button
        disabled={!slot}
        onClick={() => setConfirmed(true)}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-medium text-on-primary transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
      >
        {slot ? `Book ${day.day} at ${slot}` : "Select a time"}
        <MIcon name="arrow_forward" className="text-[20px]" />
      </button>

      <AnimatePresence>
        {confirmed && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 overflow-hidden rounded-xl bg-secondary/10 px-4 py-3 text-sm text-secondary"
          >
            <MIcon name="check_circle" filled className="text-[18px]" />
            Requested {type} session — pay after the trainer accepts.
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-4 text-center text-xs text-on-surface-variant">
        No commitment required for your first session
      </p>
    </div>
  );
}
