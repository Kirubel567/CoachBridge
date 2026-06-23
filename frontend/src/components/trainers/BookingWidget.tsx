"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DayAvailability, Trainer } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export function BookingWidget({
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
    <div className="glass rounded-3xl p-6">
      <div className="flex items-baseline justify-between">
        <div>
          <span className="font-display text-2xl font-bold">
            {trainer.price}
          </span>
          <span className="text-sm text-muted"> ETB / session</span>
        </div>
        <span className="flex items-center gap-1 text-sm">
          <Icon name="star" className="h-4 w-4 text-lime" />
          {trainer.rating.toFixed(1)}
        </span>
      </div>

      {/* Session type */}
      {trainer.sessionTypes.length > 1 && (
        <div className="mt-5 grid grid-cols-2 gap-2">
          {trainer.sessionTypes.map((st) => (
            <button
              key={st}
              onClick={() => {
                setType(st);
                setConfirmed(false);
              }}
              className={cn(
                "rounded-xl py-2 text-sm capitalize transition-colors",
                type === st
                  ? "bg-fg font-medium text-ink"
                  : "bg-surface-2 text-muted hover:text-fg"
              )}
            >
              {st}
            </button>
          ))}
        </div>
      )}

      {/* Days */}
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
              "rounded-xl py-2 text-sm transition-colors",
              dayIdx === i
                ? "bg-accent-strong font-medium text-white"
                : "bg-surface-2 text-muted hover:text-fg"
            )}
          >
            {d.day}
          </button>
        ))}
      </div>

      {/* Slots */}
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {day.slots.map((s) => (
          <button
            key={s.time}
            disabled={s.taken}
            onClick={() => {
              setSlot(s.time);
              setConfirmed(false);
            }}
            className={cn(
              "rounded-xl py-2.5 text-sm transition-all",
              s.taken
                ? "cursor-not-allowed bg-surface-2/50 text-muted/40 line-through"
                : slot === s.time
                  ? "bg-accent-strong font-medium text-white ring-2 ring-accent-strong/40"
                  : "bg-surface-2 text-fg hover:bg-border"
            )}
          >
            {s.time}
          </button>
        ))}
      </div>

      <button
        disabled={!slot}
        onClick={() => setConfirmed(true)}
        className="mt-5 w-full rounded-xl bg-lime py-3.5 font-medium text-ink transition-opacity disabled:opacity-40"
      >
        {slot ? `Book ${day.day} at ${slot}` : "Select a time"}
      </button>

      <AnimatePresence>
        {confirmed && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="flex items-center gap-2 overflow-hidden rounded-xl bg-lime/10 px-4 py-3 text-sm text-lime"
          >
            <Icon name="check" className="h-4 w-4 shrink-0" />
            Requested {type} session — {day.day} at {slot}. You&apos;ll pay after
            the trainer accepts.
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-4 text-center text-xs text-muted">
        Free to request · Pay securely with Telebirr, CBE or card
      </p>
    </div>
  );
}
