"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { MediaFrame } from "@/components/media/media-frame";
import { Magnetic } from "@/components/motion/magnetic";
import { SplitText } from "@/components/motion/split-text";
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
        className="relative h-[56svh] min-h-[280px] w-full touch-pan-y overflow-hidden bg-ink md:h-[65svh] md:min-h-[420px]"
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
              data-cursor="media"
              data-cursor-label="Play"
              data-cursor-color={accent}
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

              <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-transparent" />

              <span className="container-site pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 pb-6 text-paper md:pb-10">
                <span className="block">
                  <motion.span
                    className="mb-2 flex items-center gap-2 text-[13px] uppercase tracking-[0.25em] text-paper/70 md:text-[14px]"
                    initial={{ opacity: 0, y: 12 }}
                    animate={ready ? { opacity: 1, y: 0 } : undefined}
                    transition={{ delay: 0.5, duration: 0.7, ease: easeOutExpo }}
                  >
                    <span className="size-2 rounded-full" style={{ background: accent }} />
                    {category?.title}
                  </motion.span>
                  <SplitText
                    as="span"
                    text={slide.title}
                    delay={0.45}
                    className="block text-[38px] font-semibold leading-[0.95] tracking-[-0.02em] sm:text-[56px] lg:text-[80px]"
                  />
                  {slide.director ? (
                    <span className="mt-2 block text-[15px] text-paper/80 md:text-[19px]">directed by {slide.director}</span>
                  ) : null}
                </span>
                <span className="hidden font-mono text-[13px] tracking-[0.2em] text-paper/60 sm:block">
                  {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </span>
              </span>
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

      <div className="container-site flex flex-1 items-center justify-between gap-4 py-8 md:min-h-[100px] md:py-4">
        <Magnetic>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous project"
            className="group -m-3 p-3"
            data-cursor="hover"
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
            data-cursor="hover"
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
