"use client";

import { ReactLenis } from "lenis/react";

/**
 * Site-wide smooth scrolling (Lenis on the window), matching the reference site's
 * ScrollSmoother feel: wheel input eases in over ~0.8s, touch scrolling stays native,
 * and reduced-motion users get plain 1:1 scrolling (Lenis honours that by default).
 */
export function SmoothScroll() {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        autoRaf: true,
        allowNestedScroll: true,
        stopInertiaOnNavigate: true,
      }}
    />
  );
}
