export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Small deterministic hash so placeholders look different per project but stable across renders. */
export function hashString(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const easeOutExpo = [0.16, 1, 0.3, 1] as const;
export const easeCine = [0.76, 0, 0.24, 1] as const;

// The O Positive reference's custom ease (a GSAP CustomEase path of three cubic segments), used for the
// project viewer's curtain so it moves like the reference: slow start, fast middle, settled by ~70%.
const OPOS_SEGMENTS = [
  [0, 0, 0.25, 0, 0.288, -0.004, 0.404, 0.112],
  [0.404, 0.112, 0.54, 0.248, 0.487, 0.707, 0.594, 0.882],
  [0.594, 0.882, 0.65, 0.974, 0.698, 1, 1, 1],
] as const;

const bezier = (a: number, b: number, c: number, d: number, t: number) => {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
};

export function easeOpos(x: number) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const [x0, y0, x1, y1, x2, y2, x3, y3] = OPOS_SEGMENTS.find((s) => x <= s[6]) ?? OPOS_SEGMENTS[2];
  // x(t) rises steadily within each segment, so bisection finds t for this x.
  let lo = 0;
  let hi = 1;
  let t = 0.5;
  for (let i = 0; i < 20; i++) {
    t = (lo + hi) / 2;
    if (bezier(x0, x1, x2, x3, t) < x) lo = t;
    else hi = t;
  }
  return bezier(y0, y1, y2, y3, t);
}
