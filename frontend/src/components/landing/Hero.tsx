"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Icon } from "@/components/ui/Icon";
import { ShuffleGallery } from "@/components/landing/ShuffleGallery";
import { easeOutExpo } from "@/lib/motion";

const line1 = ["Find", "your", "coach."];
const line2 = ["Transform", "your", "life."];

const wordVariants = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: 0,
    transition: { duration: 0.9, delay: 0.2 + i * 0.08, ease: easeOutExpo },
  }),
};

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden pt-32 pb-20"
    >
      {/* Subtle gym backdrop */}
      <Image
        src="/images/hero-bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none absolute inset-0 object-cover opacity-[0.10]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink via-ink/85 to-ink" />

      {/* Background glow + grid */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-accent-strong/25 blur-[140px] animate-pulse-glow" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[380px] w-[380px] rounded-full bg-lime/10 blur-[120px]" />

      <motion.div style={{ y, opacity }} className="container-x relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left: copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs text-muted"
            >
              <span className="h-2 w-2 rounded-full bg-lime" />
              Now live across Ethiopia
            </motion.div>

            <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block overflow-hidden">
                {line1.map((w, i) => (
                  <span key={w} className="inline-block overflow-hidden pb-1">
                    <motion.span
                      className="inline-block"
                      custom={i}
                      variants={wordVariants}
                      initial="hidden"
                      animate="show"
                    >
                      {w}&nbsp;
                    </motion.span>
                  </span>
                ))}
              </span>
              <span className="block overflow-hidden text-gradient">
                {line2.map((w, i) => (
                  <span key={w} className="inline-block overflow-hidden pb-1">
                    <motion.span
                      className="inline-block"
                      custom={i + line1.length}
                      variants={wordVariants}
                      initial="hidden"
                      animate="show"
                    >
                      {w}&nbsp;
                    </motion.span>
                  </span>
                ))}
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="mt-7 max-w-lg text-lg text-muted"
            >
              CoachBridge connects you with certified personal trainers near you.
              Discover, book, track your progress, and pay securely — all in one
              place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.85 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <MagneticButton
                href="#cta"
                className="group flex items-center gap-2 rounded-full bg-accent-strong px-7 py-3.5 font-medium text-white shadow-lg shadow-accent-strong/30 transition-shadow hover:shadow-accent-strong/50"
              >
                Find your coach
                <Icon
                  name="arrow"
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                />
              </MagneticButton>
              <MagneticButton
                href="#how"
                className="flex items-center gap-2 rounded-full border border-border px-6 py-3.5 font-medium text-fg transition-colors hover:bg-surface"
              >
                <Icon name="play" className="h-4 w-4 text-lime" />
                See how it works
              </MagneticButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1 }}
              className="mt-10 flex items-center gap-4"
            >
              <div className="flex -space-x-3">
                {["#7c5cff", "#cdff4a", "#b8a4ff", "#f4f4f6"].map((c, i) => (
                  <span
                    key={i}
                    className="h-9 w-9 rounded-full border-2 border-ink"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <p className="text-sm text-muted">
                <span className="font-semibold text-fg">12,000+</span> sessions
                booked this year
              </p>
            </motion.div>
          </div>

          {/* Right: floating trainer card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: easeOutExpo }}
            className="relative mx-auto hidden w-full max-w-sm lg:block"
          >
            <div className="glass animate-float rounded-3xl p-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-2xl ring-2 ring-accent/40">
                  <Image
                    src="/images/trainer-hanna.jpg"
                    alt="Hanna Tesfaye"
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display text-lg font-semibold">
                      Hanna Tesfaye
                    </p>
                    <Icon name="shield" className="h-4 w-4 text-lime" />
                  </div>
                  <p className="text-sm text-muted">Yoga & Nutrition</p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-1 text-sm">
                <Icon name="star" className="h-4 w-4 text-lime" />
                <span className="font-semibold">5.0</span>
                <span className="text-muted">· 415 sessions</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {["Yoga", "Nutrition", "Beginner-friendly"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-surface-2 px-3 py-1 text-xs text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <div>
                  <span className="font-display text-2xl font-bold">550</span>
                  <span className="text-sm text-muted"> ETB/session</span>
                </div>
                <span className="rounded-full bg-lime px-4 py-2 text-sm font-medium text-ink">
                  Book now
                </span>
              </div>
            </div>

            {/* Shuffling product gallery */}
            <ShuffleGallery className="mt-6" />

            {/* Floating stat chip */}
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="glass absolute -left-10 top-20 rounded-2xl px-4 py-3"
            >
              <p className="text-xs text-muted">Progress</p>
              <p className="font-display text-lg font-bold text-lime">-8.0 kg</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
