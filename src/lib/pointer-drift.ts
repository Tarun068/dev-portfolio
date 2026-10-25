"use client";

import { motionValue } from "motion/react";
import { useEffect } from "react";

// Pointer position as -50..50 % of the viewport from its centre, eased with a very
// lazy follow (1.5% of the remaining distance per 60fps frame) so cards drift after the mouse.
const xPercent = motionValue(0);
const yPercent = motionValue(0);
const FOLLOW = 0.015;

let users = 0;
let frame = 0;
let last = 0;
let mouseX = 0;
let mouseY = 0;
let ballX = 0;
let ballY = 0;

function onPointerMove(e: PointerEvent) {
  if (e.pointerType !== "mouse") return;
  mouseX = e.clientX;
  mouseY = e.clientY;
}

function tick(time: number) {
  const dt = last ? Math.min(64, time - last) : 16.67;
  last = time;
  const k = 1 - Math.pow(1 - FOLLOW, dt / 16.67);
  ballX += (mouseX - ballX) * k;
  ballY += (mouseY - ballY) * k;
  xPercent.set(((ballX - window.innerWidth / 2) / window.innerWidth) * 100);
  yPercent.set(((ballY - window.innerHeight / 2) / window.innerHeight) * 100);
  frame = requestAnimationFrame(tick);
}

/** Shared, smoothed pointer position. One listener and rAF loop for every card using it. */
export function usePointerDrift(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    if (users++ === 0) {
      mouseX = ballX = window.innerWidth / 2;
      mouseY = ballY = window.innerHeight / 2;
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      frame = requestAnimationFrame(tick);
    }
    return () => {
      if (--users === 0) {
        window.removeEventListener("pointermove", onPointerMove);
        cancelAnimationFrame(frame);
        last = 0;
        xPercent.set(0);
        yPercent.set(0);
      }
    };
  }, [enabled]);

  return { xPercent, yPercent };
}
