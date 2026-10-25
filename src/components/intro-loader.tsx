"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { markIntroReady } from "@/lib/hooks";
import { easeCine, easeOutExpo } from "@/lib/utils";

const dots = ["bg-sun", "bg-flame", "bg-sky", "bg-leaf"];
const STORAGE_KEY = "dp-intro-seen";

/** Runs before paint (in <head>) so returning visitors in the same session never see the loader. */
export const introSkipScript = `try{if(sessionStorage.getItem("${STORAGE_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.setAttribute("data-intro-seen","")}catch(e){}`;

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
    }, 2100);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="intro"
          data-intro
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-7 bg-ink text-paper"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.95, ease: easeCine }}
        >
          <p className="flex text-[44px] font-semibold tracking-[-0.01em] sm:text-[72px]" aria-label={site.name}>
            {site.name.split("").map((ch, i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                className="inline-block"
                initial={{ opacity: 0, filter: "blur(18px)", y: 18, scaleX: 1.6 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0, scaleX: 1 }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.06, ease: easeOutExpo }}
              >
                {ch === " " ? " " : ch}
              </motion.span>
            ))}
          </p>
          <div className="flex gap-3">
            {dots.map((color, i) => (
              <motion.span
                key={color}
                className={`size-3.5 rounded-full ${color}`}
                initial={{ scale: 0, y: 0 }}
                animate={{ scale: [0, 1.3, 1], y: [0, -22, 0] }}
                transition={{ duration: 0.7, delay: 0.7 + i * 0.12, ease: easeOutExpo }}
              />
            ))}
          </div>
          <motion.p
            className="text-[13px] uppercase tracking-[0.35em] text-caption"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            {site.taglines[0]}
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
