"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { MasonryGrid, VideoGrid } from "@/components/work/project-grids";
import { SectionTitle } from "@/components/work/section-title";
import type { Project, Tab } from "@/content/projects";
import { easeOutExpo } from "@/lib/utils";

type Props = {
  id: string;
  accent: string;
  tabs: [Tab, Tab];
  projectsByTab: Record<string, Project[]>;
};

/** Youtube/Socials and Motion/Stills: the heading words switch between two grids. */
export function WorkTabs({ id, accent, tabs, projectsByTab }: Props) {
  const [active, setActive] = useState(tabs[0].id);
  const tab = tabs.find((t) => t.id === active) ?? tabs[0];
  const direction = active === tabs[0].id ? -1 : 1;

  return (
    <>
      <div className="container-site mb-8 mt-4 md:mb-[46px] md:mt-[46px]">
        <SectionTitle id={id} accent={accent} items={tabs} active={active} onSelect={setActive} />
      </div>
      <div className="container-site overflow-x-clip">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={tab.id}
            custom={direction}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 80, filter: "blur(12px)" }),
              center: { opacity: 1, x: 0, filter: "blur(0px)" },
              exit: (d: number) => ({ opacity: 0, x: d * -80, filter: "blur(12px)" }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: easeOutExpo }}
          >
            {tab.layout === "grid" ? (
              <VideoGrid projects={projectsByTab[tab.id] ?? []} />
            ) : (
              <MasonryGrid projects={projectsByTab[tab.id] ?? []} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
