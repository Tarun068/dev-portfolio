"use client";

import { motion } from "motion/react";
import { SplitText } from "@/components/motion/split-text";
import { useIntroReady } from "@/lib/hooks";

export function ContactHeading() {
  const ready = useIntroReady();
  return (
    <h1 className="relative isolate text-[40px] font-semibold leading-[1.15] tracking-[-0.01em] sm:text-[52px] md:text-right lg:text-[clamp(52px,4.2vw,64px)]">
      <span className="relative inline-block">
        <motion.span
          aria-hidden="true"
          className="absolute -left-[0.18em] -top-[0.12em] -z-10 size-[0.95em] rounded-full bg-leaf"
          initial={{ scale: 0 }}
          animate={ready ? { scale: 1 } : undefined}
          transition={{ type: "spring", stiffness: 240, damping: 13, delay: 0.5 }}
        />
        <SplitText text="Not Ready To Start?" delay={0.1} />
      </span>
      <br />
      <SplitText text="Just Say Hi" delay={0.45} />
    </h1>
  );
}
