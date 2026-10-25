"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useIntroReady } from "@/lib/hooks";
import { easeOutExpo } from "@/lib/utils";

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  delay?: number;
  stagger?: number;
  /** Wait until scrolled into view instead of playing on mount. */
  inView?: boolean;
};

/** Letters rise out of a mask one after another. Screen readers get the plain string. */
export function SplitText({ text, as = "span", className, delay = 0, stagger = 0.028, inView = false }: Props) {
  const Tag = motion[as] as typeof motion.span;
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const ready = useIntroReady();
  const play = ready && (!inView || seen);

  const words = text.split(" ");
  let index = 0;

  return (
    <Tag ref={ref} className={className} aria-label={text} initial="hidden" animate={play ? "show" : "hidden"}>
      {words.map((word, wi) => (
        <span key={wi} aria-hidden="true">
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((char) => {
              const i = index++;
              return (
                <span key={i} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                  <motion.span
                    className="inline-block will-change-transform"
                    variants={{
                      hidden: { y: "115%", rotate: 10 },
                      show: {
                        y: "0%",
                        rotate: 0,
                        transition: { duration: 0.9, ease: easeOutExpo, delay: delay + i * stagger },
                      },
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
    </Tag>
  );
}
