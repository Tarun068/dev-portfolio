"use client";

import { useMotionValue, useScroll, type MotionValue } from "motion/react";
import { useEffect, type RefObject } from "react";

type Options = {
  /** Which edge of the element drives the progress. */
  edge: "top" | "bottom";
  /** Viewport positions (0 = top, 1 = bottom) where that edge starts and finishes the progress. */
  from: number;
  to: number;
};

/**
 * Scroll progress (0..1) for an element, like useScroll with a target, except the finish point
 * is pulled back to the page's maximum scroll whenever the page is too short to reach it
 * (e.g. the last rows on a tall 2K screen), so scroll-linked animations always complete.
 */
export function useReachableScrollProgress(
  ref: RefObject<HTMLElement | null>,
  { edge, from, to }: Options,
): MotionValue<number> {
  const { scrollY } = useScroll();
  const progress = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let start = 0;
    let end = 1;

    const update = (y: number) => {
      const p = end > start ? (y - start) / (end - start) : 1;
      // Snap the last fraction of a pixel so lines and cards land exactly at full size.
      progress.set(p >= 0.995 ? 1 : Math.max(0, p));
    };
    const measure = () => {
      const rect = el.getBoundingClientRect();
      const scroll = window.scrollY;
      const vh = window.innerHeight;
      const edgeY = (edge === "top" ? rect.top : rect.bottom) + scroll;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);
      start = edgeY - from * vh;
      end = Math.min(edgeY - to * vh, maxScroll);
      update(scroll);
    };

    measure();
    const unsubscribe = scrollY.on("change", update);
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    observer.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      unsubscribe();
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [ref, edge, from, to, scrollY, progress]);

  return progress;
}
