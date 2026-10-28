"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/hooks";

/**
 * Ring cursor shown only over the client's name in the header (`data-cursor="name"`).
 * Everywhere else the normal system cursor is used. While active it adds `name-cursor` to <html>,
 * which the name link uses to hide the native cursor under the ring.
 */
export function Cursor() {
  const enabled = useMediaQuery("(pointer: fine) and (prefers-reduced-motion: no-preference)");
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 700, damping: 45, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 700, damping: 45, mass: 0.35 });
  const [active, setActive] = useState(false);
  const [pressed, setPressed] = useState(false);
  const activeRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("name-cursor");

    function setOver(over: boolean) {
      if (over === activeRef.current) return;
      activeRef.current = over;
      setActive(over);
    }
    // Position is tracked everywhere so the ring is already in place when the pointer reaches the name.
    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setOver(Boolean((e.target as Element | null)?.closest('[data-cursor="name"]')));
    }
    const onLeave = () => setOver(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      root.classList.remove("name-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="size-[52px] rounded-full border-[1.5px] border-solid border-white"
        style={{ x: "-50%", y: "-50%" }}
        initial={false}
        animate={{ opacity: active ? 1 : 0, scale: active ? (pressed ? 0.8 : 1) : 0.3 }}
        transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.5 }}
      />
    </motion.div>
  );
}
