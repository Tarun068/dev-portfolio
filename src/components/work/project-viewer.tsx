"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion, useAnimate, type AnimationSequence } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { MediaFrame } from "@/components/media/media-frame";
import { ArrowIcon, CloseIcon } from "@/components/ui/arrow-icon";
import { projectHref, shapeRatio, type Project } from "@/content/projects";
import { site } from "@/content/site";
import { cn, easeOpos, easeOutExpo } from "@/lib/utils";

function embedUrl(project: Project, accent: string) {
  if (project.vimeoId) {
    return `https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&title=0&byline=0&portrait=0&dnt=1&color=${accent.slice(1)}`;
  }
  if (project.youtubeId) {
    return `https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  }
  return null;
}

/** Plays the project straight away (the provider's own controls handle play/pause). */
function Player({ project, accent }: { project: Project; accent: string }) {
  const embed = embedUrl(project, accent);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Activity hides rather than unmounts the viewer: load the player while it's shown and
  // blank it when hidden, so audio never keeps playing in the background.
  useLayoutEffect(() => {
    const frame = frameRef.current;
    const video = videoRef.current;
    if (frame && embed) frame.src = embed;
    video?.play().catch(() => {});
    return () => {
      if (frame) frame.src = "about:blank";
      video?.pause();
    };
  }, [embed]);

  if (project.kind === "image") {
    return project.poster ? (
      <Image
        src={project.poster}
        alt={project.title}
        fill
        sizes="(min-width: 1280px) 1250px, 100vw"
        className="object-contain"
      />
    ) : (
      <MediaFrame project={project} sizes="100vw" className="absolute inset-0" />
    );
  }

  if (embed) {
    return (
      <iframe
        ref={frameRef}
        title={project.title}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 size-full bg-black"
      />
    );
  }

  if (project.videoSrc) {
    return (
      <video
        ref={videoRef}
        src={project.videoSrc}
        poster={project.poster}
        controls
        autoPlay
        playsInline
        className="absolute inset-0 size-full bg-black"
      />
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-paper">
      {project.poster ? (
        <Image
          src={project.poster}
          alt={project.title}
          fill
          sizes="(min-width: 1280px) 1250px, 100vw"
          className="object-cover"
        />
      ) : (
        <p className="text-[15px] text-ink/60 md:text-[18px]">Video coming soon</p>
      )}
    </div>
  );
}

type Props = {
  project: Project;
  /** Projects the arrows step through: the same category (and tab) as `project`. */
  siblings: Project[];
  /** Prev/next arrows, for Youtube/Socials and Motion/Stills only. */
  stepper: boolean;
  accent: string;
  categoryTitle: string;
  closeHref: string;
  /** "modal" when opened over a grid (intercepted route), "page" on a direct visit. */
  mode: "modal" | "page";
};

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Timings from the O Positive director pages: a black curtain drops from the top, the video slides down
// into place, the title rises and the Close tab drops in. Closing plays it back the other way and the
// curtain lifts to reveal the page again. `k` scales every time (0 for reduced motion).
function openSequence(k: number, arrows: boolean): AnimationSequence {
  const sequence: AnimationSequence = [
    ["[data-curtain]", { scaleY: [0, 1] }, { duration: 1 * k, ease: easeOpos }],
    ["[data-media]", { opacity: [0, 1], y: ["-12.5vh", "0vh"] }, { duration: 1.2 * k, ease: easeOutExpo, at: 0.5 * k }],
    ["[data-title]", { opacity: [0, 1], y: ["50%", "0%"] }, { duration: 1 * k, ease: easeOutExpo, at: 0.7 * k }],
    ["[data-close]", { opacity: [0, 1], y: ["-100%", "0%"] }, { duration: 1.2 * k, ease: easeOutExpo, at: 0.85 * k }],
  ];
  if (arrows) sequence.push(["[data-arrow]", { opacity: [0, 1] }, { duration: 1 * k, ease: easeOutExpo, at: 0.85 * k }]);
  return sequence;
}

function closeSequence(k: number, arrows: boolean): AnimationSequence {
  const sequence: AnimationSequence = [
    ["[data-close]", { opacity: 0, y: "-100%" }, { duration: 1 * k, ease: easeOpos }],
    ["[data-media]", { opacity: 0, y: "-15vh" }, { duration: 1 * k, ease: easeOpos, at: 0 }],
    ["[data-title]", { opacity: 0, y: "50%" }, { duration: 1 * k, ease: easeOpos, at: 0 }],
  ];
  if (arrows) sequence.push(["[data-arrow]", { opacity: 0 }, { duration: 0.6 * k, ease: easeOpos, at: 0 }]);
  sequence.push(["[data-curtain]", { scaleY: 0 }, { duration: 1 * k, ease: easeOutExpo, at: 0.5 * k }]);
  return sequence;
}

function StepButton({ dir, onStep, className }: { dir: 1 | -1; onStep: (dir: 1 | -1) => void; className?: string }) {
  return (
    <button
      type="button"
      data-arrow
      onClick={() => onStep(dir)}
      aria-label={dir < 0 ? "Previous project" : "Next project"}
      className={cn("pointer-events-auto -m-3 shrink-0 p-3", className)}
      style={{ opacity: 0 }}
    >
      <ArrowIcon direction={dir < 0 ? "left" : "right"} />
    </button>
  );
}

/** Full-screen dark project view from the PDF: Close tab on top, media centred, accent title below. */
export function ProjectViewer({ project, siblings, stepper, accent, categoryTitle, closeHref, mode }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const closeRef = useRef<HTMLButtonElement>(null);
  const shown = useRef(false);
  const closing = useRef(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  // The arrows swap the project in place and only update the address (history.replaceState), so the
  // viewer stays open without replaying its entrance and the URL always points at the project shown.
  const current = siblings.find((p) => projectHref(p) === pathname) ?? project;
  const canStep = stepper && siblings.length > 1;
  const ratio = shapeRatio[current.shape];

  // Plays on mount and again whenever the (Activity-hidden) viewer is shown again.
  useLayoutEffect(() => {
    shown.current = true;
    closing.current = false;
    const controls = animate(openSequence(reducedMotion() ? 0 : 1, canStep));
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      shown.current = false;
      controls.stop();
    };
  }, [animate, canStep]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    animate(closeSequence(reducedMotion() ? 0 : 1, canStep)).then(() => {
      // Already gone (e.g. the browser's Back button was used mid-animation).
      if (!shown.current) return;
      if (mode === "modal") router.back();
      else router.push(closeHref);
    });
  }, [animate, canStep, mode, closeHref, router]);

  const step = useCallback(
    (dir: 1 | -1) => {
      if (closing.current) return;
      const i = siblings.findIndex((p) => p.slug === current.slug);
      const target = siblings[(i + dir + siblings.length) % siblings.length];
      setDirection(dir);
      window.history.replaceState(null, "", projectHref(target));
      document.title = `${target.title} · ${categoryTitle} — ${site.name}`;
    },
    [siblings, current.slug, categoryTitle],
  );

  useEffect(() => {
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
    };
  }, []);

  // Freeze the smooth scroller underneath while the viewer is open.
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    lenis.stop();
    return () => lenis.start();
  }, [lenis]);

  // Esc closes; ← / → step through the category where the arrows are shown.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (canStep && e.key === "ArrowLeft") step(-1);
      else if (canStep && e.key === "ArrowRight") step(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, step, canStep]);

  // Everything starts hidden (inline styles) and is revealed by the open sequence.
  return (
    <div
      ref={scope}
      role="dialog"
      aria-modal="true"
      aria-label={current.title}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden text-paper [--viewer-chrome:230px] md:[--viewer-chrome:300px]"
    >
      <div data-curtain aria-hidden="true" className="absolute inset-0 origin-top bg-ink" style={{ transform: "scaleY(0)" }} />

      <div className="relative flex justify-center pt-5 md:pt-[70px]">
        <button
          ref={closeRef}
          type="button"
          data-close
          onClick={close}
          className="group flex h-12 w-[150px] items-center justify-center gap-3 bg-paper text-[18px] text-ink md:h-[54px] md:w-[168px] md:text-[21px]"
          style={{ opacity: 0 }}
        >
          Close
          <CloseIcon className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-90" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 py-6 md:px-28 md:py-10">
        <div data-media className="relative flex size-full items-center justify-center" style={{ opacity: 0 }}>
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={current.slug}
              custom={direction}
              className="relative"
              style={{
                aspectRatio: ratio,
                // Narrower when the arrows sit beside it, so they never touch a wide frame.
                width: `min(100%, ${canStep ? 1170 : 1250}px, calc((100svh - var(--viewer-chrome)) * ${ratio}))`,
              }}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 60 }),
                center: { opacity: 1, x: 0 },
                exit: (d: number) => ({ opacity: 0, x: d * -60 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: easeOutExpo }}
            >
              <Player project={current} accent={accent} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Arrows at the content edges, level with the middle of the frame (PDF pages 6–7). */}
        {canStep ? (
          <div className="pointer-events-none absolute inset-0 hidden md:block">
            <div className="container-site flex h-full items-center justify-between">
              <StepButton dir={-1} onStep={step} />
              <StepButton dir={1} onStep={step} />
            </div>
          </div>
        ) : null}
      </div>

      {/* On phones the arrows sit either side of the title instead. */}
      <div className="container-site relative flex items-center justify-center gap-4 pb-6 md:pb-12">
        {canStep ? <StepButton dir={-1} onStep={step} className="md:hidden" /> : null}
        <div data-title className="min-w-0 flex-1" style={{ opacity: 0 }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.slug}
              className="flex flex-wrap items-baseline justify-center gap-x-3 text-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: easeOutExpo }}
            >
              <h2
                className="text-[34px] font-semibold leading-none tracking-[-0.01em] md:text-[56px] lg:text-[64px]"
                style={{ color: accent }}
              >
                {current.title}
              </h2>
              {current.director ? <span className="text-[16px] md:text-[21px]">directed by {current.director}</span> : null}
            </motion.div>
          </AnimatePresence>
        </div>
        {canStep ? <StepButton dir={1} onStep={step} className="md:hidden" /> : null}
      </div>
    </div>
  );
}
