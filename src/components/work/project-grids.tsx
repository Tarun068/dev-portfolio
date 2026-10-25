"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ProjectTile } from "@/components/work/project-tile";
import type { Project, Shape } from "@/content/projects";
import { useIntroReady } from "@/lib/hooks";
import { cn, easeOutExpo } from "@/lib/utils";

function GridItem({ index, className, children }: { index: number; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -5% 0px" });
  const ready = useIntroReady();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50, scale: 0.94, filter: "blur(10px)" }}
      animate={ready && seen ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : undefined}
      transition={{ duration: 0.9, ease: easeOutExpo, delay: (index % 4) * 0.08 }}
    >
      {children}
    </motion.div>
  );
}

/** Youtube / Motion: two columns of 16:9 frames with hairline gaps. */
export function VideoGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 md:gap-1.5">
      {projects.map((p, i) => (
        <GridItem key={p.slug} index={i}>
          <ProjectTile project={p} className="aspect-video w-full" sizes="(min-width: 640px) 50vw, 100vw" />
        </GridItem>
      ))}
    </div>
  );
}

// Column / row-unit spans for the masonry grid (4 row-units == one square column).
const spans: Record<Shape, string> = {
  square: "col-span-1 row-span-4",
  portrait: "col-span-1 row-span-5",
  vertical: "col-span-1 row-span-7",
  landscape: "col-span-2 row-span-5",
  wide: "col-span-2 row-span-4",
};

/** Socials / Stills: mixed-shape masonry. */
export function MasonryGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="masonry">
      <div className="masonry-grid">
        {projects.map((p, i) => (
          <GridItem key={p.slug} index={i} className={cn("min-h-0", spans[p.shape])}>
            <ProjectTile project={p} className="size-full" sizes="(min-width: 768px) 25vw, 50vw" />
          </GridItem>
        ))}
      </div>
    </div>
  );
}
