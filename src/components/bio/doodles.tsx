import { cn } from "@/lib/utils";

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

/** Hand-drawn ellipse around its children (static, as in the PDF). */
export function Scribble({
  children,
  className,
  seed = 1,
  width = 240,
  height = 110,
}: {
  children: React.ReactNode;
  className?: string;
  seed?: number;
  width?: number;
  height?: number;
}) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="pointer-events-none absolute -inset-[6%] size-[112%] -rotate-[5deg] overflow-visible"
        fill="none"
        aria-hidden="true"
      >
        <path
          d={scribblePath(width, height, seed)}
          stroke="currentColor"
          strokeWidth={1.3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="relative -rotate-3">{children}</span>
    </div>
  );
}

function arrowHead(c2: Point, end: Point, len = 18, spread = 0.5) {
  const angle = Math.atan2(end[1] - c2[1], end[0] - c2[0]) + Math.PI;
  const a: Point = [end[0] + Math.cos(angle - spread) * len, end[1] + Math.sin(angle - spread) * len];
  const b: Point = [end[0] + Math.cos(angle + spread) * len, end[1] + Math.sin(angle + spread) * len];
  return `M${a[0].toFixed(1)} ${a[1].toFixed(1)} L${end[0]} ${end[1]} L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
}

export type Curve = { from: Point; c1: Point; c2: Point; to: Point };

/** Curved arrows in a shared viewBox over the composition. */
export function DrawnArrows({ curves, viewBox, className }: { curves: Curve[]; viewBox: string; className?: string }) {
  return (
    <svg viewBox={viewBox} fill="none" aria-hidden="true" className={cn("pointer-events-none overflow-visible", className)}>
      {curves.map(({ from, c1, c2, to }, i) => (
        <g key={i} stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d={`M${from[0]} ${from[1]} C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${to[0]} ${to[1]}`} />
          <path d={arrowHead(c2, to)} />
        </g>
      ))}
    </svg>
  );
}
