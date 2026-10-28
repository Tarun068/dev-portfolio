"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { DrawnArrows, Scribble, type Curve } from "@/components/bio/doodles";
import { FillButton } from "@/components/ui/fill-button";
import { site } from "@/content/site";
import { useIntroReady } from "@/lib/hooks";
import { cn } from "@/lib/utils";

// Arrow curves in the stage's 1170×800 coordinate space, traced from PDF page 11.
const curves: Curve[] = [
  { from: [690, 43], c1: [630, 8], c2: [470, 18], to: [401, 109] },
  { from: [1100, 546], c1: [1165, 470], c2: [1172, 372], to: [1101, 313] },
  { from: [107, 582], c1: [118, 690], c2: [205, 735], to: [317, 743] },
];

function Portrait({ className }: { className?: string }) {
  return (
    <div className={cn("grain relative overflow-hidden bg-ink", className)}>
      {site.portrait ? (
        <Image src={site.portrait} alt={site.name} fill sizes="(min-width: 1024px) 380px, 70vw" className="object-cover" />
      ) : (
        <div
          className="absolute inset-0 animate-[drift_16s_ease-in-out_infinite]"
          style={{
            background:
              "radial-gradient(60% 55% at 35% 30%, #fbb03b55 0%, transparent 70%), radial-gradient(55% 50% at 70% 80%, #e5414140 0%, transparent 70%)",
          }}
        />
      )}
    </div>
  );
}

/** The one animated piece on the page: drops in, tilts with the pointer and lifts on hover.
    Flat white frame with no drop shadow, as in the client PDF. */
function Polaroid({ rx, ry, className }: { rx?: MotionValue<number>; ry?: MotionValue<number>; className?: string }) {
  const ready = useIntroReady();
  return (
    <motion.div
      className={cn("z-10 bg-white [transform-style:preserve-3d]", className)}
      style={{ rotateX: rx, rotateY: ry }}
      initial={{ opacity: 0, y: -80, rotate: -14 }}
      animate={ready ? { opacity: 1, y: 0, rotate: 0 } : undefined}
      transition={{ type: "spring", stiffness: 90, damping: 13, delay: 0.15 }}
      whileHover={{ rotate: 2, scale: 1.02 }}
    >
      <Portrait className="absolute left-[5.8%] top-[6.1%] h-[75.1%] w-[88.4%]" />
    </motion.div>
  );
}

function Circle({ className, color }: { className: string; color: string }) {
  return <div aria-hidden="true" className={cn("aspect-square rounded-full", className)} style={{ background: color }} />;
}

// Skia Condensed at 38pt in the PDF (3.4% of the 1170-unit stage).
const hand = "font-hand leading-[0.95] text-ink";

/** Bio page (PDF page 11): polaroid, scribbled notes, drawn arrows and Download CV. */
export function BioComposition() {
  // Pointer position over the stage, -0.5..0.5, for the polaroid's 3D tilt.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 18 });
  const sy = useSpring(my, { stiffness: 90, damping: 18 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-9, 9]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [7, -7]);

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <>
      {/* Desktop: the PDF composition, scaled as one piece via container query units. */}
      <div
        className="relative mx-auto mt-2 hidden aspect-[1170/800] w-full max-w-[min(1170px,max(760px,calc((100svh-230px)*1.4625)))] [container-type:inline-size] [perspective:1400px] lg:block"
        onPointerMove={onPointerMove}
        onPointerLeave={() => {
          mx.set(0);
          my.set(0);
        }}
      >
        <DrawnArrows curves={curves} viewBox="0 0 1170 800" className="absolute inset-0 size-full text-ink" />

        <Circle className="absolute left-[85%] top-[5.4%] w-[7.86%]" color="var(--color-sun)" />
        <Circle className="absolute left-[47.5%] top-[68.1%] w-[7.86%]" color="var(--color-flame)" />

        <Polaroid rx={rotateX} ry={rotateY} className="absolute left-[51.45%] top-[12.5%] h-[61.25%] w-[36.9%]" />

        <div className="absolute left-[28.9%] top-[21.25%] z-20 h-[11.25%] w-[17.1%]">
          <Scribble className="size-full" seed={1} width={200} height={90}>
            <span className={cn(hand, "text-[3.4cqw]")}>Hello!</span>
          </Scribble>
        </div>

        <div className="absolute -left-[4%] top-[36.25%] w-[44.6%] text-right text-[clamp(15px,2cqw,24px)] font-semibold leading-[1.25]">
          <p>{site.bio[0]}</p>
          <p className="mt-[1.25em]">{site.bio[1]}</p>
        </div>

        <div className="absolute left-[67.9%] top-[66.9%] z-20 h-[16.25%] w-[22.2%]">
          <Scribble className="size-full" seed={2.4} width={260} height={130}>
            <span className={cn(hand, "block text-center text-[3.4cqw]")}>
              Every frame
              <br />
              has a story.
            </span>
          </Scribble>
        </div>

        <div className="absolute left-[48.7%] top-[90.9%] -translate-x-1/2">
          <FillButton href={site.cvPath} download className="min-w-[234px]">
            Download CV
          </FillButton>
        </div>
      </div>

      {/* Mobile / tablet: same pieces, stacked. */}
      <div className="container-site flex flex-col items-center pb-16 pt-2 lg:hidden">
        <div className="relative w-[78%] max-w-[380px]">
          <Circle className="absolute -right-[10%] -top-[8%] w-[22%]" color="var(--color-sun)" />
          <Circle className="absolute -bottom-[7%] -left-[10%] w-[22%]" color="var(--color-flame)" />
          <Polaroid className="relative aspect-[432/490] w-full" />
          <div className="absolute -bottom-[12%] -right-[14%] z-20 h-[24%] w-[62%]">
            <Scribble className="size-full" seed={2.4} width={260} height={130}>
              <span className={cn(hand, "block text-center text-[clamp(22px,6vw,32px)]")}>
                Every frame
                <br />
                has a story.
              </span>
            </Scribble>
          </div>
        </div>

        <div className="mt-20 h-[72px] w-[180px]">
          <Scribble className="size-full" seed={1} width={200} height={90}>
            <span className={cn(hand, "text-[36px]")}>Hello!</span>
          </Scribble>
        </div>

        <div className="mt-6 max-w-[560px] text-center text-[18px] font-semibold leading-[1.35] sm:text-[20px]">
          <p>{site.bio[0]}</p>
          <p className="mt-5">{site.bio[1]}</p>
        </div>

        <FillButton href={site.cvPath} download className="mt-10 min-w-[220px]">
          Download CV
        </FillButton>
      </div>
    </>
  );
}
