"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Button/link that magnetically drifts toward the cursor on hover.
 */
export function MagneticButton({
  children,
  className,
  href,
  strength = 0.08,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Very gentle, heavily-damped spring: a subtle lean toward the cursor
  // that settles smoothly, never darting.
  const sx = useSpring(x, { stiffness: 110, damping: 28, mass: 0.9 });
  const sy = useSpring(y, { stiffness: 110, damping: 28, mass: 0.9 });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  const Tag = href ? motion.a : motion.div;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className="inline-block"
    >
      <Tag href={href} className={className} whileTap={{ scale: 0.96 }}>
        {children}
      </Tag>
    </motion.div>
  );
}
