"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  LOGO_CUT,
  LOGO_HEIGHT,
  LOGO_PATHS,
  LOGO_ROWS,
  LOGO_VIEWBOX,
  LOGO_WIDTH,
} from "@/components/brand/logo-paths";
import { site } from "@/content/site";
import { markIntroReady } from "@/lib/hooks";
import { easeCine, easeOutExpo } from "@/lib/utils";

const STORAGE_KEY = "dp-intro-seen";
/** How long the logo plays before the screen lifts away. */
const INTRO_MS = 2300;
/** How far (in logo units, ~13% of its width) each half starts along the diagonal cut. */
const SLIDE = 90;

/** Runs before paint (in <head>) so returning visitors in the same session never see the loader. */
export const introSkipScript = `try{if(sessionStorage.getItem("${STORAGE_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.setAttribute("data-intro-seen","")}catch(e){}`;

/**
 * Keeps the logo's horizontal edges on whole screen pixels, so they stay sharp on scaled displays
 * (e.g. Windows at 125%), where a plain 250px logo would land between pixels and look soft:
 * each of the logo's six rows becomes a whole number of device pixels and its top edge is
 * nudged onto a pixel boundary.
 */
function usePixelSnap(ref: React.RefObject<SVGSVGElement | null>) {
  useLayoutEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      const cssWidth = window.innerWidth >= 640 ? 250 : 170;
      const row = Math.max(1, Math.round((cssWidth * dpr * LOGO_HEIGHT) / LOGO_WIDTH / LOGO_ROWS));
      const height = (row * LOGO_ROWS) / dpr;
      svg.style.height = `${height}px`;
      svg.style.width = `${(height * LOGO_WIDTH) / LOGO_HEIGHT}px`;
      svg.style.translate = "";
      const top = svg.getBoundingClientRect().top * dpr;
      svg.style.translate = `0 ${(Math.round(top) - top) / dpr}px`;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [ref]);
}

/**
 * The client's DP monogram assembling itself: the two halves slide towards each other along the
 * diagonal cut between them while their outlines draw, then fill in solid as they lock together.
 */
function LogoIntro() {
  const svgRef = useRef<SVGSVGElement>(null);
  usePixelSnap(svgRef);

  const halves = [
    { d: LOGO_PATHS.left, from: 1 }, // comes up the cut from the lower right
    { d: LOGO_PATHS.right, from: -1 }, // comes down the cut from the upper left
  ];

  return (
    <svg
      ref={svgRef}
      viewBox={LOGO_VIEWBOX}
      role="img"
      aria-label={site.name}
      className="w-[170px] shrink-0 overflow-visible sm:w-[250px]"
    >
      {halves.map(({ d, from }) => (
        <motion.g
          key={d}
          initial={{ x: from * SLIDE * LOGO_CUT.x, y: from * SLIDE * LOGO_CUT.y, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{
            x: { duration: 1.4, delay: 0.15, ease: easeOutExpo },
            y: { duration: 1.4, delay: 0.15, ease: easeOutExpo },
            opacity: { duration: 0.3, delay: 0.15 },
          }}
        >
          <motion.path
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth={4}
            strokeLinejoin="miter"
            initial={{ pathLength: 0, opacity: 1 }}
            animate={{ pathLength: 1, opacity: 0 }}
            transition={{
              pathLength: { duration: 1, delay: 0.15, ease: [0.65, 0, 0.35, 1] },
              // Gone as the fill becomes solid, so the outline never haloes the finished logo.
              opacity: { duration: 0.3, delay: 0.95 },
            }}
          />
          <motion.path
            d={d}
            fill="currentColor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.85, ease: "easeOut" }}
          />
        </motion.g>
      ))}
    </svg>
  );
}

export function IntroLoader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (document.documentElement.hasAttribute("data-intro-seen")) {
      markIntroReady();
      const t = window.setTimeout(() => setShow(false), 0);
      return () => window.clearTimeout(t);
    }
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    const t = window.setTimeout(() => {
      setShow(false);
      markIntroReady();
    }, INTRO_MS);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="intro"
          data-intro
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink text-paper"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.95, ease: easeCine }}
        >
          <LogoIntro />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
