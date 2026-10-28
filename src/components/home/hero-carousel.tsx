"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { MediaFrame } from "@/components/media/media-frame";
import { Magnetic } from "@/components/motion/magnetic";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { FillButton } from "@/components/ui/fill-button";
import { accentHex, getCategory, projectHref, type Project } from "@/content/projects";
import { site } from "@/content/site";
import { useIntroReady } from "@/lib/hooks";
import { easeCine, easeOutExpo } from "@/lib/utils";

const AUTOPLAY_MS = 6500;

/** Home: full-bleed showreel slider with arrows and Download CV underneath (PDF page 1). */
export function HeroCarousel({ slides }: { slides: Project[] }) {
  const [[index, direction], setSlide] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const ready = useIntroReady();
  const panned = useRef(false);
  const count = slides.length;
  const slide = slides[index];
  const category = getCategory(slide.category);
  const accent = accentHex[category?.accent ?? "sun"];

  const go = (step: number) => setSlide(([i]) => [(i + step + count) % count, step]);

  useEffect(() => {
    if (!ready || paused || count < 2) return;
    const t = window.setTimeout(() => setSlide(([i]) => [(i + 1) % count, 1]), AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [index, ready, paused, count]);

  return (
    <section aria-roledescription="carousel" aria-label="Featured work" className="flex flex-1 flex-col">
      <div
        data-surface="dark"
        className="relative min-h-[max(56svh,280px)] w-full flex-1 touch-pan-y overflow-hidden bg-ink md:min-h-[max(65svh,420px)]"
        onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={slide.slug}
            custom={direction}
            className="absolute inset-0"
            variants={{
              enter: (d: number) => ({ clipPath: d > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }),
              center: { clipPath: "inset(0 0% 0 0%)", x: "0%" },
              exit: (d: number) => ({ x: d > 0 ? "-25%" : "25%", clipPath: "inset(0 0% 0 0%)" }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1.1, ease: easeCine }}
            onPanStart={() => {
              panned.current = true;
            }}
            onPanEnd={(_, info) => {
              if (Math.abs(info.offset.x) > 60) go(info.offset.x < 0 ? 1 : -1);
              window.setTimeout(() => {
                panned.current = false;
              }, 0);
            }}
          >
            <Link
              href={projectHref(slide)}
              scroll={false}
              prefetch
              draggable={false}
              className="group block size-full"
              aria-label={`Play ${slide.title}`}
              onClickCapture={(e) => {
                if (panned.current) e.preventDefault();
              }}
            >
              <motion.div
                className="size-full"
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.8, ease: easeOutExpo }}
              >
                <MediaFrame project={slide} sizes="100vw" eager={index === 0} playing className="size-full" />
              </motion.div>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Autoplay progress */}
        {ready && !paused && count > 1 ? (
          <motion.span
            key={index}
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[3px] origin-left"
            style={{ background: accent }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
          />
        ) : null}
      </div>

      {/* Small gap above the button; below it the same space as the header's top padding, so the page
          is framed evenly top and bottom. The slider keeps at least 65% of the screen (56% on phones)
          and grows into any extra height. */}
      <div className="container-site flex items-center justify-between gap-4 pb-6 pt-6 md:pb-12 lg:pb-[70px]">
        <Magnetic>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous project"
            className="group -m-3 p-3"
          >
            <ArrowIcon direction="left" className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-x-2" />
          </button>
        </Magnetic>

        <Magnetic strength={0.2}>
          <FillButton href={site.cvPath} download className="min-w-[200px] md:min-w-[234px]">
            Download CV
          </FillButton>
        </Magnetic>

        <Magnetic>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next project"
            className="group -m-3 p-3"
          >
            <ArrowIcon className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2" />
          </button>
        </Magnetic>
      </div>

      <p className="sr-only" aria-live="polite">
        Slide {index + 1} of {count}: {slide.title}
      </p>
    </section>
  );
}
