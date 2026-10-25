"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { MediaFrame } from "@/components/media/media-frame";
import { SplitText } from "@/components/motion/split-text";
import { ArrowIcon, CloseIcon, PlayIcon } from "@/components/ui/arrow-icon";
import { projectHref, shapeRatio, type Project } from "@/content/projects";
import { easeCine, easeOutExpo } from "@/lib/utils";

function embedUrl(project: Project, accent: string) {
  if (project.vimeoId) {
    return `https://player.vimeo.com/video/${project.vimeoId}?autoplay=1&title=0&byline=0&portrait=0&dnt=1&color=${accent.slice(1)}`;
  }
  if (project.youtubeId) {
    return `https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  }
  return null;
}

function Player({ project, accent }: { project: Project; accent: string }) {
  const [playing, setPlaying] = useState(false);
  // When Activity hides the viewer, drop the iframe so audio doesn't keep playing.
  useLayoutEffect(() => () => setPlaying(false), []);

  const embed = embedUrl(project, accent);

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

  if (playing && embed) {
    return (
      <iframe
        src={embed}
        title={project.title}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 size-full"
      />
    );
  }

  if (playing && project.videoSrc) {
    return (
      <video
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
    <div className="absolute inset-0 overflow-hidden bg-paper">
      {project.poster ? (
        <Image
          src={project.poster}
          alt={project.title}
          fill
          sizes="(min-width: 1280px) 1250px, 100vw"
          className="object-cover"
        />
      ) : null}
      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label={`Play ${project.title}`}
        className="group absolute inset-0 flex items-center justify-center"
        data-cursor="hover"
      >
        <span className="relative flex size-[clamp(72px,8.5vw,168px)] items-center justify-center rounded-full bg-ink text-paper transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110">
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-ping rounded-full opacity-25 [animation-duration:1.8s]"
            style={{ background: accent }}
          />
          <PlayIcon className="relative ml-[8%] w-[22%]" />
        </span>
      </button>
      {playing ? (
        <p className="pointer-events-none absolute inset-x-0 bottom-5 text-center text-[15px] text-ink/60">
          Video coming soon
        </p>
      ) : null}
    </div>
  );
}

type Props = {
  project: Project;
  prev: Project;
  next: Project;
  index: number;
  total: number;
  accent: string;
  label: string;
  closeHref: string;
  /** "modal" when opened over a grid (intercepted route), "page" on a direct visit. */
  mode: "modal" | "page";
};

/** Full-screen dark project view from the PDF: Close tab on top, media centred, accent title below. */
export function ProjectViewer({ project, prev, next, index, total, accent, label, closeHref, mode }: Props) {
  const router = useRouter();
  const [closing, setClosing] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const multiple = total > 1;
  const ratio = shapeRatio[project.shape];

  const close = useCallback(() => {
    if (mode === "modal") setClosing(true);
    else router.push(closeHref);
  }, [mode, closeHref, router]);

  const go = useCallback(
    (target: Project) => router.replace(projectHref(target), { scroll: false }),
    [router],
  );

  // Activity hides rather than unmounts the modal; reset transient state when that happens.
  useLayoutEffect(() => () => setClosing(false), []);

  useEffect(() => {
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
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

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (multiple && e.key === "ArrowLeft") go(prev);
      else if (multiple && e.key === "ArrowRight") go(next);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, go, prev, next, multiple]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-ink text-paper [--viewer-chrome:250px] md:[--viewer-chrome:330px]"
      initial={{ clipPath: "circle(0% at 50% 55%)" }}
      animate={{ clipPath: closing ? "circle(0% at 50% 55%)" : "circle(150% at 50% 55%)" }}
      transition={{ duration: closing ? 0.6 : 0.9, ease: easeCine }}
      onAnimationComplete={() => {
        if (closing) router.back();
      }}
    >
      <div className="flex justify-center pt-5 md:pt-[70px]">
        <motion.button
          ref={closeRef}
          type="button"
          onClick={close}
          className="group flex h-12 w-[150px] items-center justify-center gap-3 bg-paper text-[18px] text-ink md:h-[54px] md:w-[168px] md:text-[20px]"
          data-cursor="hover"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.7, ease: easeOutExpo }}
        >
          Close
          <CloseIcon className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-90" />
        </motion.button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-12 py-6 md:px-28 md:py-10">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={project.slug}
            className="relative"
            style={{
              aspectRatio: ratio,
              width: `min(100%, 1250px, calc((100svh - var(--viewer-chrome)) * ${ratio}))`,
            }}
            initial={{ opacity: 0, scale: 0.9, filter: "blur(16px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(16px)" }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
            onPanEnd={(_, info) => {
              if (!multiple || Math.abs(info.offset.x) < 60) return;
              go(info.offset.x < 0 ? next : prev);
            }}
          >
            <Player project={project} accent={accent} />
          </motion.div>
        </AnimatePresence>

        {multiple ? (
          <>
            <Link
              href={projectHref(prev)}
              replace
              prefetch
              scroll={false}
              aria-label={`Previous: ${prev.title}`}
              className="group absolute left-2 top-1/2 -translate-y-1/2 p-2 md:left-[max(1.5rem,calc(50%-670px))]"
              data-cursor="hover"
            >
              <ArrowIcon direction="left" className="transition-transform duration-500 group-hover:-translate-x-2" />
            </Link>
            <Link
              href={projectHref(next)}
              replace
              prefetch
              scroll={false}
              aria-label={`Next: ${next.title}`}
              className="group absolute right-2 top-1/2 -translate-y-1/2 p-2 md:right-[max(1.5rem,calc(50%-670px))]"
              data-cursor="hover"
            >
              <ArrowIcon className="transition-transform duration-500 group-hover:translate-x-2" />
            </Link>
          </>
        ) : null}
      </div>

      <div className="container-site flex flex-col items-center pb-6 text-center md:pb-12">
        <p className="mb-2 text-[12px] uppercase tracking-[0.3em] text-caption md:text-[13px]">
          {label}
          {multiple ? ` · ${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}` : null}
        </p>
        <div className="flex flex-wrap items-baseline justify-center gap-x-3">
          <span style={{ color: accent }}>
            <SplitText
              key={project.slug}
              as="h2"
              text={project.title}
              stagger={0.025}
              delay={0.15}
              className="text-[34px] font-semibold leading-none tracking-[-0.01em] md:text-[56px] lg:text-[64px]"
            />
          </span>
          {project.director ? <span className="text-[16px] md:text-[21px]">directed by {project.director}</span> : null}
        </div>
      </div>
    </motion.div>
  );
}
