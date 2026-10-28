"use client";

import Link from "next/link";
import { motion, useReducedMotion, useTransform, type MotionStyle } from "motion/react";
import { useRef, useState } from "react";
import { SwapTitle } from "@/components/motion/swap-title";
import { ProjectTile } from "@/components/work/project-tile";
import { projectHref, type Project } from "@/content/projects";
import { useMediaQuery } from "@/lib/hooks";
import { usePointerDrift } from "@/lib/pointer-drift";
import { useReachableScrollProgress } from "@/lib/scroll-progress";

// Card width range as a share of the row: a sliver when the row enters, the PDF's half width once it's in place.
const CARD_FROM = "11%";
const CARD_TO = "50%";

/** Films / Music Videos row, animated like the O Positive director pages. */
export function ProjectRow({ project, accent, last }: { project: Project; accent: string; last: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion();

  // Card grows with scroll: from when the row's top is 10% below the fold until it reaches 40% from the top
  // (so the first row, which sits there on load, starts at full size like the PDF). Scrubbed directly;
  // the easing comes from the site-wide smooth scroll, as on the reference. On tall screens where the
  // last rows can't scroll that far, it finishes at the bottom of the page instead.
  const grow = useReachableScrollProgress(ref, { edge: "top", from: 1.1, to: 0.4 });
  const cardWidth = useTransform(grow, [0, 1], [CARD_FROM, CARD_TO]);

  // Divider draws left to right as the bottom of the row scrolls up the screen (always completing).
  const draw = useReachableScrollProgress(ref, { edge: "bottom", from: 1, to: 0.4 });

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
            >
              {/* Side by side, the title scales with the content width (cqw) so titles like "Barkin' Dogs"
                  fit on one line at every screen size, keeping the spacing around the dividers even. */}
              <h2 className="overflow-hidden pb-[0.08em] text-[46px] font-semibold leading-[1] tracking-[-0.02em] sm:text-[64px] md:text-[clamp(48px,7.5cqw,100px)]">
                <span className="sr-only">{project.title}</span>
                <SwapTitle text={project.title} accent={accent} />
              </h2>
            </Link>
            {project.director ? (
              <p className="mt-3 text-[17px] lg:text-[21px]">directed by {project.director}</p>
            ) : null}
          </div>

          {project.role ? (
            <p className="text-[17px] lg:text-[21px]">{project.role}</p>
          ) : null}
        </div>
      </motion.div>

      {last ? null : (
        <motion.hr
          className="absolute bottom-0 left-0 m-0 h-px w-full origin-left border-0 bg-ink"
          style={{ scaleX: reduced ? 1 : draw }}
        />
      )}
    </li>
  );
}
