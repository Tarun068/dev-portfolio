"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/hooks";

type CursorState = { mode: "default" | "hover" | "media"; label: string; color: string };
const initial: CursorState = { mode: "default", label: "", color: "" };

/**
 * Custom cursor. Elements opt in with data attributes:
 *   data-cursor="hover"  -> grows into a ring
 *   data-cursor="media" data-cursor-label="Play" data-cursor-color="#fbb03b" -> coloured disc with a label
 */
export function Cursor() {
  const enabled = useMediaQuery("(pointer: fine) and (prefers-reduced-motion: no-preference)");
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 700, damping: 45, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 700, damping: 45, mass: 0.35 });
  const [state, setState] = useState<CursorState>(initial);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const last = useRef<CursorState>(initial);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);

      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor]");
      const next: CursorState = el
        ? {
            mode: el.dataset.cursor === "media" ? "media" : "hover",
            label: el.dataset.cursorLabel ?? "",
            color: el.dataset.cursorColor ?? "",
          }
        : initial;
      const prev = last.current;
      if (prev.mode !== next.mode || prev.label !== next.label || prev.color !== next.color) {
        last.current = next;
        setState(next);
      }
    }
    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = state.mode === "media" ? 104 : state.mode === "hover" ? 52 : 12;
  const media = state.mode === "media";
  // Over links the dot opens into a hollow ring so it never covers the label underneath.
  const ring = state.mode === "hover";

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{ x: sx, y: sy, mixBlendMode: media ? "normal" : "difference" }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full border-solid border-white text-[15px] font-medium text-ink"
        style={{ x: "-50%", y: "-50%" }}
        initial={false}
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          scale: pressed ? 0.8 : 1,
          borderWidth: ring ? 1.5 : 0,
          backgroundColor: media ? state.color || "#fbb03b" : ring ? "rgba(255,255,255,0)" : "#ffffff",
        }}
        transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.5 }}
      >
        <motion.span animate={{ opacity: media ? 1 : 0, scale: media ? 1 : 0.4 }} transition={{ duration: 0.25 }}>
          {state.label}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
