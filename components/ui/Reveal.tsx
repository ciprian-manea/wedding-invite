"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Set false for a plain fade with no rise (e.g. the footer). */
  rise?: boolean;
  amount?: number;
  delay?: number;
};

export function Reveal({
  children,
  className,
  rise = true,
  amount = 0.3,
  delay = 0,
}: RevealProps) {
  const reducedMotion = useReducedMotion();
  const riseDistance = rise && !reducedMotion ? 16 : 0;

  return (
    <motion.div
      // Framer Motion freezes `initial` at first mount and never re-applies
      // it. `reducedMotion` starts false (matching the server) and only
      // settles to its real value on a later client render, so without this
      // key, an element that mounts before it settles would be stuck with
      // the "full motion" pose forever. Keying on the resolved value forces
      // a fresh mount once it's known — happens almost instantly after
      // hydration, well before a guest could scroll to see it.
      key={reducedMotion ? "reduced" : "full"}
      initial={{ opacity: 0, y: riseDistance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
