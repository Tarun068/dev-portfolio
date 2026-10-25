"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { accentHex, getCategory, type Project } from "@/content/projects";
import { cn, hashString } from "@/lib/utils";

const tones = Object.values(accentHex);

/** Cinematic stand-in shown until a project has a real poster image. */
function Placeholder({ project }: { project: Project }) {
  const h = hashString(project.slug);
  const accent = accentHex[getCategory(project.category)?.accent ?? "sun"];
  const second = tones[h % tones.length];
  const x = 15 + (h % 70);
  const y = 15 + ((h >>> 8) % 70);
  const seconds = String((h >>> 4) % 60).padStart(2, "0");
  const frames = String((h >>> 12) % 24).padStart(2, "0");

  return (
    <div className="grain absolute inset-0 overflow-hidden bg-ink">
      <div
        className="absolute inset-0 animate-[drift_14s_ease-in-out_infinite]"
        style={{
          animationDelay: `-${h % 14}s`,
          background: `radial-gradient(70% 60% at ${x}% ${y}%, ${accent}66 0%, transparent 70%), radial-gradient(60% 55% at ${100 - x}% ${100 - y}%, ${second}3d 0%, transparent 70%)`,
        }}
      />
      <span className="absolute right-3 top-2.5 font-mono text-[10px] tracking-[0.2em] text-white/35">
        00:00:{seconds}:{frames}
      </span>
    </div>
  );
}

type Props = {
  project: Project;
  sizes: string;
  className?: string;
  /** Load eagerly with high priority (above-the-fold hero). */
  eager?: boolean;
  /** Play the muted preview loop (if the project has one). */
  playing?: boolean;
};

export function MediaFrame({ project, sizes, className, eager, playing = false }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing]);

  return (
    <div className={cn("relative overflow-hidden bg-ink", className)}>
      {project.poster ? (
        <Image
          src={project.poster}
          alt={project.title}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
          className="object-cover"
        />
      ) : (
        <Placeholder project={project} />
      )}
      {project.previewSrc ? (
        <video
          ref={videoRef}
          src={project.previewSrc}
          muted
          loop
          playsInline
          preload="none"
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-500",
            playing ? "opacity-100" : "opacity-0",
          )}
        />
      ) : null}
    </div>
  );
}
