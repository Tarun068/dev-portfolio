"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { easeCine } from "@/lib/utils";

const isProjectPath = (p: string) => /^\/work\/[^/]+\/[^/]+/.test(p);

/**
 * A quick "cut": ink shutters cover the screen on each route change and retract
 * column by column. Opening/closing a project modal doesn't trigger it.
 */
export function PageCurtain() {
  const pathname = usePathname();
  const [prev, setPrev] = useState(pathname);
  const [run, setRun] = useState(0);

  if (pathname !== prev) {
    setPrev(pathname);
    if (!isProjectPath(pathname) && !isProjectPath(prev)) setRun((r) => r + 1);
  }

  if (run === 0) return null;

  return (
    <div key={run} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80] flex">
      {Array.from({ length: 5 }, (_, i) => (
        <motion.div
          key={i}
          className="-mr-px h-full flex-1 origin-bottom bg-ink"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.65, delay: 0.04 + i * 0.05, ease: easeCine }}
        />
      ))}
    </div>
  );
}
