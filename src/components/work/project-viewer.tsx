"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import { motion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { MediaFrame } from "@/components/media/media-frame";
import { SplitText } from "@/components/motion/split-text";
import { CloseIcon } from "@/components/ui/arrow-icon";
import { projectHref, shapeRatio, type Project } from "@/content/projects";
import { easeOutExpo } from "@/lib/utils";

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
  prev: Project;
  next: Project;
  total: number;
  accent: string;
  closeHref: string;
  /** "modal" when opened over a grid (intercepted route), "page" on a direct visit. */
  mode: "modal" | "page";
};

/** Full-screen dark project view from the PDF: Close tab on top, media centred, accent title below. */
export function ProjectViewer({ project, prev, next, total, accent, closeHref, mode }: Props) {
  const router = useRouter();
  const closeRef = useRef<HTMLButtonElement>(null);
  const multiple = total > 1;
  const ratio = shapeRatio[project.shape];

  const close = useCallback(() => {
    if (mode === "modal") router.back();
    else router.push(closeHref);
  }, [mode, closeHref, router]);

  const go = useCallback(
    (target: Project) => router.replace(projectHref(target), { scroll: false }),
    [router],
  );

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

  // Esc closes; ← / → step through the category from the keyboard.
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
    <div
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-ink text-paper [--viewer-chrome:230px] md:[--viewer-chrome:300px]"
    >
      <div className="flex justify-center pt-5 md:pt-[70px]">
        <motion.button
          ref={closeRef}
          type="button"
          onClick={close}
          className="group flex h-12 w-[150px] items-center justify-center gap-3 bg-paper text-[18px] text-ink md:h-[54px] md:w-[168px] md:text-[21px]"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6, ease: easeOutExpo }}
        >
          Close
          <CloseIcon className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-90" />
        </motion.button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-6 md:px-28 md:py-10">
        <div
          key={project.slug}
          className="relative"
          style={{
            aspectRatio: ratio,
            width: `min(100%, 1250px, calc((100svh - var(--viewer-chrome)) * ${ratio}))`,
          }}
        >
          <Player project={project} accent={accent} />
        </div>
      </div>

      <div className="container-site flex flex-wrap items-baseline justify-center gap-x-3 pb-6 text-center md:pb-12">
        <span style={{ color: accent }}>
          <SplitText
            key={project.slug}
            as="h2"
            text={project.title}
            stagger={0.025}
            delay={0.1}
            className="text-[34px] font-semibold leading-none tracking-[-0.01em] md:text-[56px] lg:text-[64px]"
          />
        </span>
        {project.director ? <span className="text-[16px] md:text-[21px]">directed by {project.director}</span> : null}
      </div>
    </div>
  );
}
