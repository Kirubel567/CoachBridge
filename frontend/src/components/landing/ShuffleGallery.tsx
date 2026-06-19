"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

const slides = [
  { src: "/images/showcase-1.jpg", label: "Real 1-on-1 coaching" },
  { src: "/images/showcase-2.jpg", label: "Track every lift" },
  { src: "/images/showcase-3.jpg", label: "Gyms across the city" },
];

export function ShuffleGallery({ className }: { className?: string }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className={cn(
        "relative h-36 overflow-hidden rounded-3xl border border-white/10",
        className
      )}
    >
      <AnimatePresence>
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slides[i].src}
            alt=""
            fill
            sizes="400px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
          <p className="absolute bottom-3 left-4 text-sm font-medium text-white">
            {slides[i].label}
          </p>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-3.5 right-4 z-10 flex gap-1.5">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={cn(
              "h-1.5 rounded-full transition-all",
              idx === i ? "w-4 bg-white" : "w-1.5 bg-white/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}
