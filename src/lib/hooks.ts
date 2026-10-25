"use client";

import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

// Flips to true once the intro loader starts lifting (or immediately when it is skipped),
// so entrance animations don't play unseen behind it.
let introReady = false;
const introListeners = new Set<() => void>();

export function markIntroReady() {
  if (introReady) return;
  introReady = true;
  introListeners.forEach((listener) => listener());
}

export function useIntroReady() {
  return useSyncExternalStore(
    (onChange) => {
      introListeners.add(onChange);
      return () => introListeners.delete(onChange);
    },
    () => introReady,
    () => false,
  );
}
