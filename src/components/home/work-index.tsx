"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { MediaFrame } from "@/components/media/media-frame";
import { Reveal } from "@/components/motion/reveal";
import { SwapTitle } from "@/components/motion/swap-title";
import type { CategorySlug, Project } from "@/content/projects";
import { cn, easeOutExpo } from "@/lib/utils";

export type WorkIndexItem = {
  slug: CategorySlug;
  href: string;
  title: string;
  accent: string;
  count: number;
  /** Image that fades in behind the list while this row is hovered. */
  cover?: string;
  /** Fallback when there's no cover: this project's media. */
  preview: Project;
};

const DEFAULT_DOT = "#e54141";
const WORD = "Work";

/**
 * Home: index of the four Work categories on a dark band, after the O Positive directors list.
 * Hovering a row dims the others, swaps its title to the category colour, fades that category's
 * media in behind, and a dot on the left tracks the pointer down the list.
 */
export function WorkIndex({ items }: { items: WorkIndexItem[] }) {
  const [active, setActive] = useState<CategorySlug | null>(null);
  const activeItem = items.find((i) => i.slug === active);
  const accent = activeItem?.accent;

  // Activity keeps this page mounted when navigating away; drop the hover state when it hides.
  useLayoutEffect(() => () => setActive(null), []);

  // Pointer-following dot on the list's left edge.
  const dotY = useMotionValue(0);
  const dotYSmooth = useSpring(dotY, { stiffness: 600, damping: 45 });

  function onListPointerMove(e: React.PointerEvent<HTMLUListElement>) {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    dotY.set(Math.min(Math.max(e.clientY - r.top - 12, 0), r.height - 24));
  }

  // The giant word rises into place as the section scrolls up.
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end end"] });
  const wordY = useTransform(scrollYProgress, [0, 1], ["45%", "0%"]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="work-index-title"
      className="relative isolate overflow-hidden bg-ink text-paper"
    >
      {/* Hover backgrounds, one per category */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20">
        {items.map((item) => (
          <motion.div
            key={item.slug}
            className="absolute inset-0"
            initial={false}
            animate={
              active === item.slug ? { opacity: 0.75, filter: "blur(0px)" } : { opacity: 0, filter: "blur(15px)" }
            }
            transition={{ duration: 0.4, ease: [0.45, 0, 0.55, 1] }}
          >
            {item.cover ? (
              <Image src={item.cover} alt="" fill sizes="100vw" className="object-cover" />
            ) : (
              <MediaFrame project={item.preview} sizes="100vw" playing={active === item.slug} className="size-full" />
            )}
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-ink/20 to-ink/50" />
        {/* Extra shade behind the list so accent titles stay readable over bright photos */}
        <div className="absolute inset-0 hidden bg-linear-to-l from-ink/85 via-ink/45 to-transparent md:block" />
      </div>

      <div className="container-site relative flex flex-col pb-[44vw] pt-14 md:min-h-[100svh] md:pb-[24vw] md:pt-24">
        <Reveal className="flex items-center justify-between text-[12px] uppercase tracking-[0.3em] text-caption md:text-[13px]">
          <span>Selected work</span>
          <span>{String(items.length).padStart(2, "0")} categories</span>
        </Reveal>

        <div className="mt-10 flex flex-1 md:mt-16 md:justify-end">
          <div className="relative w-full md:w-[58%] lg:w-[52%]">
            {/* Track dot */}
            <motion.span
              aria-hidden="true"
              className="absolute -left-10 top-0 hidden size-6 items-center justify-center md:flex"
              style={{ y: dotYSmooth }}
            >
              <motion.i
                className="block size-2.5 rounded-full"
                initial={false}
                animate={{ scale: active ? 2 : 1, backgroundColor: accent ?? DEFAULT_DOT }}
                transition={{ duration: 0.4, ease: easeOutExpo }}
              />
            </motion.span>

            <ul onPointerMove={onListPointerMove} onPointerLeave={() => setActive(null)}>
              {items.map((item, i) => {
                const isActive = active === item.slug;
                return (
                  <Reveal as="li" key={item.slug} delay={0.08 * i} className="border-b border-paper/15 first:border-t">
                    <Link
                      href={item.href}
                      prefetch
                      className={cn(
                        "flex items-center gap-4 py-3 transition-opacity duration-500 md:gap-6 md:py-4",
                        active && !isActive ? "opacity-20" : "opacity-100",
                      )}
                      onPointerEnter={(e) => e.pointerType === "mouse" && setActive(item.slug)}
                      onFocus={() => setActive(item.slug)}
                      onBlur={() => setActive(null)}
                      data-cursor="media"
                      data-cursor-label="View"
                      data-cursor-color={item.accent}
                    >
                      <span className="w-7 shrink-0 font-mono text-[12px] text-caption md:text-[13px]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <motion.span
                        className="block min-w-0 flex-1 overflow-hidden pb-[0.06em] text-[clamp(26px,8vw,40px)] font-semibold leading-[1.02] tracking-[-0.02em] sm:text-[52px] lg:text-[clamp(56px,4.9vw,92px)]"
                        initial="rest"
                        animate={isActive ? "hover" : "rest"}
                      >
                        <span className="sr-only">{item.title}</span>
                        <SwapTitle text={item.title} accent={item.accent} duration={0.5} ease={easeOutExpo} lift="-35%" />
                      </motion.span>
                      <span className="flex shrink-0 items-center gap-2 text-[13px] text-caption md:text-[15px]">
                        <span className="size-2 rounded-full" style={{ background: item.accent }} aria-hidden="true" />
                        {String(item.count).padStart(2, "0")}
                        <span className="sr-only"> projects</span>
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Giant word with the brand dot; letters sink while the list is hovered */}
      <motion.h2
        id="work-index-title"
        aria-label={WORD}
        className="pointer-events-none absolute bottom-0 left-[3vw] -z-10 flex select-none items-end text-[36vw] font-semibold leading-[0.74] tracking-[-0.045em] md:text-[26vw]"
        style={{ y: wordY }}
      >
        {WORD.split("").map((char, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="inline-block"
            initial={false}
            animate={{ y: active ? "22%" : "0%" }}
            transition={{ duration: 0.6, ease: easeOutExpo, delay: i * 0.03 }}
          >
            {char}
          </motion.span>
        ))}
        <motion.span
          aria-hidden="true"
          className="mb-[0.08em] ml-[0.06em] inline-block size-[0.22em] rounded-full"
          initial={false}
          animate={{ backgroundColor: accent ?? DEFAULT_DOT, scale: active ? 1.25 : 1 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
        />
      </motion.h2>
    </section>
  );
}
