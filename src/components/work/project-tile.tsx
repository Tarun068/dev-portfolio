"use client";

import Link from "next/link";
import { useState } from "react";
import { MediaFrame } from "@/components/media/media-frame";
import { accentHex, getCategory, projectHref, type Project } from "@/content/projects";
import { cn } from "@/lib/utils";

type Props = {
  project: Project;
  sizes: string;
  className?: string;
  caption?: boolean;
  /** Skip the zoom and accent-frame hover (the list rows animate differently). */
  plain?: boolean;
};

/** Clickable thumbnail. Opens the project in the modal viewer (intercepted route). */
export function ProjectTile({ project, sizes, className, caption = true, plain = false }: Props) {
  const [hovered, setHovered] = useState(false);
  const accent = accentHex[getCategory(project.category)?.accent ?? "sun"];

  return (
    <Link
      href={projectHref(project)}
      scroll={false}
      prefetch
      aria-label={`${project.title}${project.director ? `, directed by ${project.director}` : ""}`}
      className={cn("group relative block overflow-hidden bg-ink", className)}
      data-cursor="media"
      data-cursor-label={project.kind === "image" ? "View" : "Play"}
      data-cursor-color={accent}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <div
        className={cn(
          "absolute inset-0",
          !plain &&
            "transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.07] group-focus-visible:scale-[1.07]",
        )}
      >
        <MediaFrame project={project} sizes={sizes} playing={hovered} className="size-full" />
      </div>

      {/* Accent frame that snaps in on hover */}
      {plain ? null : (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 scale-[1.03] border-[3px] opacity-0 transition duration-500 ease-[var(--ease-out-expo)] group-hover:scale-100 group-hover:opacity-100"
          style={{ borderColor: accent }}
        />
      )}

      {caption ? (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-3 items-end justify-between gap-3 bg-linear-to-t from-ink/85 to-transparent p-3 text-paper opacity-0 transition duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 pointer-coarse:translate-y-0 pointer-coarse:opacity-100 sm:p-4">
          <span className="text-[15px] font-medium leading-tight sm:text-[19px]">{project.title}</span>
          {project.role ? <span className="shrink-0 text-[12px] text-paper/70 sm:text-[14px]">{project.role}</span> : null}
        </span>
      ) : null}
    </Link>
  );
}
