"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const slots = ["06:00", "07:30", "09:00", "12:00", "17:00", "18:30", "20:00"];
const taken = new Set(["Mon-09:00", "Wed-17:00", "Fri-06:00", "Sat-12:00"]);

export function BookingPreview() {
  const [day, setDay] = useState("Tue");
  const [slot, setSlot] = useState<string | null>("07:30");
  const [confirmed, setConfirmed] = useState(false);

  return (
    <section className="relative py-28">
      <div className="container-x">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
              Frictionless booking
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Book a session in seconds
            </h2>
            <p className="mt-4 max-w-md text-muted">
              See your trainer&apos;s real-time availability, tap a slot, and
              confirm. The system locks it instantly — no double bookings, no
              back-and-forth.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                "Live availability, always up to date",
                "Instant confirmation + calendar invite",
                "Pay securely with Telebirr, CBE or card",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3 text-fg">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-lime text-ink">
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Interactive booking widget */}
          <Reveal direction="left">
            <div className="glass rounded-3xl p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent-strong font-display font-bold text-white">
                    SB
                  </div>
                  <div>
                    <p className="font-display font-semibold">Selam Bekele</p>
                    <p className="text-xs text-muted">Strength & Conditioning</p>
                  </div>
                </div>
                <span className="rounded-full bg-surface-2 px-3 py-1 text-xs text-muted">
                  This week
                </span>
              </div>

              {/* Days */}
              <div className="mb-5 grid grid-cols-6 gap-2">
                {days.map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setDay(d);
                      setSlot(null);
                      setConfirmed(false);
                    }}
                    className={`rounded-xl py-2 text-sm transition-colors ${
                      day === d
                        ? "bg-fg font-medium text-ink"
                        : "bg-surface-2 text-muted hover:text-fg"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {/* Slots */}
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {slots.map((s) => {
                  const isTaken = taken.has(`${day}-${s}`);
                  const active = slot === s;
                  return (
                    <button
                      key={s}
                      disabled={isTaken}
                      onClick={() => {
                        setSlot(s);
                        setConfirmed(false);
                      }}
                      className={`rounded-xl py-2.5 text-sm transition-all ${
                        isTaken
                          ? "cursor-not-allowed bg-surface-2/50 text-muted/40 line-through"
                          : active
                            ? "bg-accent-strong font-medium text-white ring-2 ring-accent-strong/40"
                            : "bg-surface-2 text-fg hover:bg-border"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={!slot}
                onClick={() => setConfirmed(true)}
                className="mt-6 w-full rounded-xl bg-lime py-3.5 font-medium text-ink transition-opacity disabled:opacity-40"
              >
                {slot ? `Book ${day} at ${slot}` : "Select a time"}
              </button>

              <AnimatePresence>
                {confirmed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="flex items-center gap-2 overflow-hidden rounded-xl bg-lime/10 px-4 py-3 text-sm text-lime"
                  >
                    <Icon name="check" className="h-4 w-4" />
                    Session confirmed — invite sent to your calendar.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
