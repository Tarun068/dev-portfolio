"use client";

import { motion } from "motion/react";

type Ease = readonly [number, number, number, number];

// GSAP's "power4" (out) ease.
export const power4: Ease = [0.23, 1, 0.32, 1];

/**
 * Title drawn twice per letter: on hover the letters squash up and away while an accent
 * copy stretches up from the baseline, staggered across the word (0.1s in total).
 * Driven by "rest" / "hover" variants from the nearest motion parent.
 */
export function SwapTitle({
  text,
  accent,
  duration = 0.6,
  ease = power4,
  lift = "-10%",
}: {
  text: string;
  accent: string;
  duration?: number;
  ease?: Ease;
  /** How far the outgoing letters travel up as they squash. */
  lift?: string;
}) {
  const words = text.split(" ");
  const step = 0.1 / Math.max(1, text.replace(/\s/g, "").length - 1);
  let index = 0;

  return (
    <span aria-hidden="true">
      {words.map((word, wi) => (
        <span key={wi}>
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((char) => {
              const i = index++;
              const transition = { duration, ease, delay: i * step };
              return (
                <span key={i} className="relative inline-block">
                  <motion.span
                    className="inline-block origin-top-left"
                    variants={{
                      rest: { scaleY: 1, y: "0%", transition },
                      hover: { scaleY: 0, y: lift, transition },
                    }}
                  >
                    {char}
                  </motion.span>
                  <motion.span
                    className="absolute left-0 top-0 inline-block origin-bottom-left"
                    style={{ color: accent }}
                    variants={{
                      rest: { scaleY: 0, y: "-10%", transition },
                      hover: { scaleY: 1, y: "4%", transition },
                    }}
                  >
                    {char}
                  </motion.span>
                </span>
              );
            })}
          </span>
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
