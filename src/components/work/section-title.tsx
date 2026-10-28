"use client";

import { motion } from "motion/react";
import { Fragment, useState } from "react";
import { SplitText } from "@/components/motion/split-text";
import { useIntroReady } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type Props = {
  /** Unique per page so the dot never tries to fly between pages. */
  id: string;
  accent: string;
  items: { id: string; label: string }[];
  active: string;
  onSelect?: (id: string) => void;
};

function Dot({ id, accent, pop }: { id: string; accent: string; pop: boolean }) {
  const ready = useIntroReady();
  return (
    <motion.span
      layoutId={`title-dot-${id}`}
      aria-hidden="true"
      className="absolute -left-[0.2em] -top-[0.14em] -z-10 size-[0.84em] rounded-full"
      style={{ background: accent }}
      initial={pop ? { scale: 0 } : false}
      animate={ready ? { scale: 1 } : { scale: 0 }}
      transition={{
        scale: { type: "spring", stiffness: 260, damping: 16, delay: pop ? 0.35 : 0 },
        layout: { type: "spring", stiffness: 300, damping: 22 },
      }}
    />
  );
}

/**
 * Centered section heading with the brand's coloured dot sitting behind the first letter.
 * With two items ("Youtube/Socials") each word becomes a toggle and the dot jumps between them.
 */
export function SectionTitle({ id, accent, items, active, onSelect }: Props) {
  // Pop the dot in on first render only; after a switch it travels via its layoutId.
  const [switched, setSwitched] = useState(false);

  return (
    <h1 className="relative isolate flex flex-wrap items-baseline justify-center text-center text-[34px] font-semibold leading-[1.1] tracking-[-0.01em] sm:text-[42px] lg:text-[48px]">
      {items.map((item, i) => {
        const isActive = item.id === active;
        return (
          <Fragment key={item.id}>
            {i > 0 ? (
              <span aria-hidden="true" className="mx-[0.04em] font-normal text-caption">
                /
              </span>
            ) : null}
            {onSelect ? (
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  setSwitched(true);
                  onSelect(item.id);
                }}
                className={cn(
                  "relative transition-colors duration-500",
                  isActive ? "text-[#232020]" : "text-caption hover:text-ink/45",
                )}
              >
                {isActive ? <Dot id={id} accent={accent} pop={!switched} /> : null}
                <SplitText text={item.label} delay={0.1 + i * 0.12} />
              </button>
            ) : (
              <span className="relative">
                <Dot id={id} accent={accent} pop />
                <SplitText text={item.label} delay={0.1} />
              </span>
            )}
          </Fragment>
        );
      })}
    </h1>
  );
}
