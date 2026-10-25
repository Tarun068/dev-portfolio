"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useIntroReady } from "@/lib/hooks";
import { cn, easeOutExpo } from "@/lib/utils";

type Point = [number, number];

/** A hand-drawn loop: an ellipse traced ~1.8 times with a slight outward drift so the strokes don't overlap. */
function scribblePath(w: number, h: number, seed: number) {
  const cx = w / 2;
  const cy = h / 2;
  const turns = 1.85;
  const steps = Math.round(72 * turns);
  const start = -2.6 + seed * 0.3;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const p = i / steps;
    const t = start + p * turns * Math.PI * 2;
    const drift = 0.9 + 0.12 * p + 0.025 * Math.sin(i * 0.35 + seed);
    const x = cx + Math.cos(t) * (w / 2 - 6) * drift;
    const y = cy + Math.sin(t) * (h / 2 - 6) * (drift - 0.06 * Math.cos(t * 2 + seed));
    d += `${i === 0 ? "M" : " L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

/** Hand-drawn ellipse that draws itself around its children. */
export function Scribble({
  children,
  className,
  seed = 1,
  delay = 0,
  width = 240,
  height = 110,
}: {
  children: React.ReactNode;
  className?: string;
  seed?: number;
  delay?: number;
  width?: number;
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const ready = useIntroReady();
  const play = ready && seen;

  return (
    <div ref={ref} className={cn("relative flex items-center justify-center", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="pointer-events-none absolute -inset-[6%] size-[112%] -rotate-[5deg] overflow-visible"
        fill="none"
        aria-hidden="true"
      >
        <motion.path
          d={scribblePath(width, height, seed)}
          stroke="currentColor"
          strokeWidth={1.3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={play ? { pathLength: 1, opacity: 1 } : undefined}
          transition={{ pathLength: { duration: 1.4, delay, ease: [0.65, 0, 0.35, 1] }, opacity: { duration: 0.01, delay } }}
        />
      </svg>
      <motion.span
        className="relative"
        initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
        animate={play ? { opacity: 1, scale: 1, rotate: -3 } : undefined}
        transition={{ type: "spring", stiffness: 240, damping: 14, delay: delay + 0.2 }}
      >
        {children}
      </motion.span>
    </div>
  );
}

function arrowHead(c2: Point, end: Point, len = 18, spread = 0.5) {
  const angle = Math.atan2(end[1] - c2[1], end[0] - c2[0]) + Math.PI;
  const a: Point = [end[0] + Math.cos(angle - spread) * len, end[1] + Math.sin(angle - spread) * len];
  const b: Point = [end[0] + Math.cos(angle + spread) * len, end[1] + Math.sin(angle + spread) * len];
  return `M${a[0].toFixed(1)} ${a[1].toFixed(1)} L${end[0]} ${end[1]} L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
}

export type Curve = { from: Point; c1: Point; c2: Point; to: Point; delay?: number };

/** Curved arrows that draw themselves, positioned in a shared viewBox over the composition. */
export function DrawnArrows({ curves, viewBox, className }: { curves: Curve[]; viewBox: string; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const ready = useIntroReady();
  const play = ready && seen;

  return (
    <svg ref={ref} viewBox={viewBox} fill="none" aria-hidden="true" className={cn("pointer-events-none overflow-visible", className)}>
      {curves.map(({ from, c1, c2, to, delay = 0 }, i) => (
        <g key={i} stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <motion.path
            d={`M${from[0]} ${from[1]} C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${to[0]} ${to[1]}`}
            initial={{ pathLength: 0 }}
            animate={play ? { pathLength: 1 } : undefined}
            transition={{ duration: 1.1, delay, ease: [0.65, 0, 0.35, 1] }}
          />
          <motion.path
            d={arrowHead(c2, to)}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={play ? { pathLength: 1, opacity: 1 } : undefined}
            transition={{ duration: 0.35, delay: delay + 1.05, ease: easeOutExpo }}
          />
        </g>
      ))}
    </svg>
  );
}
