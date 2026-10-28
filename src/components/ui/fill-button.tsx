"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import { cn, easeOutExpo } from "@/lib/utils";

const fills = ["var(--color-sun)", "var(--color-flame)", "var(--color-sky)", "var(--color-leaf)"];
let fillCursor = 0;

type Common = { children: React.ReactNode; className?: string };
type AsLink = Common & { href: string; download?: boolean | string; type?: never; disabled?: never };
type AsButton = Common & { href?: undefined; download?: never; type?: "button" | "submit"; disabled?: boolean };

/** Black block button; hovering floods it with the next brand colour from the pointer position. */
export function FillButton(props: AsLink | AsButton) {
  const [fill, setFill] = useState({ x: 0, y: 0, color: fills[0], on: false });

  const track = (on: boolean) => (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const next = on ? fills[fillCursor++ % fills.length] : null;
    setFill((f) => ({ x, y, on, color: next ?? f.color }));
  };

  const className = cn(
    "group relative inline-flex h-[54px] min-w-[168px] items-center justify-center overflow-hidden bg-ink px-10 text-[18px] text-paper lg:text-[21px] transition-colors duration-300",
    "disabled:cursor-not-allowed disabled:opacity-60",
    fill.on && "text-ink",
    props.className,
  );

  const content = (
    <>
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute aspect-square w-[260%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ left: fill.x, top: fill.y, background: fill.color }}
        initial={false}
        animate={{ scale: fill.on ? 1 : 0 }}
        transition={{ duration: 0.55, ease: easeOutExpo }}
      />
      <span className="relative z-10">{props.children}</span>
    </>
  );

  const handlers = { onPointerEnter: track(true), onPointerLeave: track(false) };

  if (props.href !== undefined) {
    if (props.download !== undefined || !props.href.startsWith("/")) {
      return (
        <a href={props.href} download={props.download} className={className} {...handlers}>
          {content}
        </a>
      );
    }
    return (
      <Link href={props.href} className={className} {...handlers}>
        {content}
      </Link>
    );
  }

  return (
    <button type={props.type ?? "button"} disabled={props.disabled} className={className} {...handlers}>
      {content}
    </button>
  );
}
