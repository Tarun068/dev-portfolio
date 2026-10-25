"use client";

import { motion, useInView, type Variants } from "motion/react";
import { useRef } from "react";
import { useIntroReady } from "@/lib/hooks";
import { easeOutExpo } from "@/lib/utils";

const presets = {
  fade: {
    hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  // Media wipes in from the left like a timeline clip being dragged out.
  wipe: {
    hidden: { clipPath: "inset(0 100% 0 0)" },
    show: { clipPath: "inset(0 0% 0 0)" },
  },
  rise: {
    hidden: { opacity: 0, y: 60, scale: 0.96 },
    show: { opacity: 1, y: 0, scale: 1 },
  },
  line: {
    hidden: { scaleX: 0 },
    show: { scaleX: 1 },
  },
} satisfies Record<string, Variants>;

type Props = {
  children?: React.ReactNode;
  className?: string;
  preset?: keyof typeof presets;
  delay?: number;
  duration?: number;
  /** Play on mount rather than when scrolled into view. */
  immediate?: boolean;
  as?: "div" | "li" | "section" | "hr" | "span";
};

export function Reveal({
  children,
  className,
  preset = "fade",
  delay = 0,
  duration = 1,
  immediate = false,
  as = "div",
}: Props) {
  const Tag = motion[as] as typeof motion.div;
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const ready = useIntroReady();
  const play = ready && (immediate || seen);

  return (
    <Tag
      ref={ref}
      className={className}
      initial="hidden"
      animate={play ? "show" : "hidden"}
      variants={presets[preset]}
      transition={{ duration, delay, ease: easeOutExpo }}
    >
      {children}
    </Tag>
  );
}
