import { cn } from "@/lib/utils";

/** Thin long arrow from the PDF (left/right). */
export function ArrowIcon({ direction = "right", className }: { direction?: "left" | "right"; className?: string }) {
  return (
    <svg
      viewBox="0 0 34 16"
      fill="none"
      aria-hidden="true"
      className={cn("h-4 w-[34px]", direction === "left" && "-scale-x-100", className)}
    >
      <path d="M0 8h32M25 1l7 7-7 7" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className={cn("size-3.5", className)}>
      <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
