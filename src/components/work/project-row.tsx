"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionStyle } from "motion/react";
import { useRef, useState } from "react";
import { PlayIcon } from "@/components/ui/arrow-icon";
import { ProjectTile } from "@/components/work/project-tile";
import { projectHref, type Project } from "@/content/projects";
import { useMediaQuery } from "@/lib/hooks";
import { usePointerDrift } from "@/lib/pointer-drift";

// GSAP's "power4" (out) ease, used for the hover swap.
const power4 = [0.23, 1, 0.32, 1] as const;
// Card width range as a share of the row: a sliver when the row enters, the PDF's half width once it's in place.
const CARD_FROM = "11%";
const CARD_TO = "50%";
const scrub = { stiffness: 140, damping: 30, mass: 0.5 };

/**
 * Title drawn twice per letter: on hover the ink letters squash up and away while an
 * accent copy stretches up from the baseline, staggered across the word (0.1s in total).
 */
function SwapTitle({ text, accent }: { text: string; accent: string }) {
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
              const transition = { duration: 0.6, ease: power4, delay: i * step };
              return (
                <span key={i} className="relative inline-block">
                  <motion.span
                    className="inline-block origin-top-left"
                    variants={{
                      rest: { scaleY: 1, y: "0%", transition },
                      hover: { scaleY: 0, y: "-10%", transition },
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

/** Films / Music Videos row, animated like the O Positive director pages. */
export function ProjectRow({ project, accent, last }: { project: Project; accent: string; last: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion();

  // Card grows with scroll: from when the row's top is 10% below the fold until it reaches 40% from the top
  // (so the first row, which sits there on load, starts at full size like the PDF).
  const { scrollYProgress: grow } = useScroll({ target: ref, offset: [[0, 1.1], [0, 0.4]] });
  const cardWidth = useTransform(useSpring(grow, scrub), [0, 1], [CARD_FROM, CARD_TO]);

  // Divider draws left to right as the bottom of the row scrolls up the screen.
  const { scrollYProgress: draw } = useScroll({ target: ref, offset: [[1, 1], [1, 0.4]] });
  const lineScale = useSpring(draw, scrub);

  // Every card leans after the (lazily followed) mouse, in a tight 200px perspective.
  const tilt = useMediaQuery("(pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)");
  const { xPercent, yPercent } = usePointerDrift(tilt);
  const rotateX = useTransform(yPercent, (v) => v / 30);
  const rotateY = useTransform(xPercent, (v) => v / 30);
  const driftX = useTransform(xPercent, (v) => `${v / 15}%`);

  const label = `${project.title}${project.director ? `, directed by ${project.director}` : ""}`;

  return (
    <li ref={ref} className="relative py-10 first:pt-0 lg:py-12">
      <motion.div
        className="flex flex-col gap-5 md:min-h-[28.125cqw] md:flex-row md:gap-0"
        initial="rest"
        animate={hovered ? "hover" : "rest"}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        <motion.div
          className="w-full shrink-0 self-start [perspective:200px] md:w-(--card-w)"
          style={{ "--card-w": reduced ? CARD_TO : cardWidth } as MotionStyle}
        >
          <motion.div className="will-change-transform" style={{ rotateX, rotateY, x: driftX }}>
            <ProjectTile
              project={project}
              plain
              caption={false}
              className="aspect-video w-full"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </motion.div>
        </motion.div>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-6 md:pb-8 md:pl-10 md:pt-6 lg:pb-10 lg:pl-[60px] lg:pt-[44px]">
          <div>
            <Link
              href={projectHref(project)}
              scroll={false}
              prefetch
              aria-label={label}
              className="block w-fit"
              data-cursor="media"
              data-cursor-label="Play"
              data-cursor-color={accent}
            >
              <h2 className="overflow-hidden pb-[0.08em] text-[46px] font-semibold leading-[1] tracking-[-0.02em] sm:text-[64px] lg:text-[clamp(72px,5.6vw,108px)]">
                <span className="sr-only">{project.title}</span>
                <SwapTitle text={project.title} accent={accent} />
              </h2>
            </Link>
            {project.director ? (
              <p className="mt-3 text-[17px] lg:text-[21px]">directed by {project.director}</p>
            ) : null}
          </div>

          {project.role ? (
            <p className="relative w-fit text-[17px] lg:text-[21px]">
              {project.role}
              <motion.span
                aria-hidden="true"
                className="absolute right-0 top-1/2 flex size-10 items-center justify-center rounded-full text-ink"
                style={{ background: accent, x: "125%", y: "-50%" }}
                variants={{ rest: { scale: 0 }, hover: { scale: 1 } }}
                transition={{ duration: 0.6, ease: power4 }}
              >
                <PlayIcon className="ml-[3px] w-[28%]" />
              </motion.span>
            </p>
          ) : null}
        </div>
      </motion.div>

      {last ? null : (
        <motion.hr
          className="absolute bottom-0 left-0 m-0 h-px w-full origin-left border-0 bg-ink"
          style={{ scaleX: reduced ? 1 : lineScale }}
        />
      )}
    </li>
  );
}
