"use client";

import { motion } from "motion/react";
import { SplitText } from "@/components/motion/split-text";
import { useIntroReady } from "@/lib/hooks";

// Matches SplitText's default per-letter stagger, so the two halves of the first line read as one.
const STAGGER = 0.028;

export function ContactHeading() {
  const ready = useIntroReady();
  return (
    <h1 className="relative isolate text-[40px] font-bold leading-[1.15] tracking-[-0.01em] sm:text-[52px] md:text-right lg:text-[clamp(52px,4.2vw,60px)]">
      {/* The dot is pinned to the first word so it stays behind the "N" however the line wraps,
          the same way as the dot on the other page titles. */}
      <span className="relative inline-block">
        <motion.span
          aria-hidden="true"
          className="absolute -left-[0.2em] -top-[0.14em] -z-10 size-[0.84em] rounded-full bg-leaf"
          initial={{ scale: 0 }}
          animate={ready ? { scale: 1 } : undefined}
          transition={{ type: "spring", stiffness: 240, damping: 13, delay: 0.5 }}
        />
        <SplitText text="Not" delay={0.1} stagger={STAGGER} />
      </span>{" "}
      <SplitText text="Ready To Start?" delay={0.1 + 3 * STAGGER} stagger={STAGGER} />
      <br />
      <SplitText text="Just Say Hi" delay={0.45} />
    </h1>
  );
}
