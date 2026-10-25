export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Small deterministic hash so placeholders look different per project but stable across renders. */
export function hashString(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const easeOutExpo = [0.16, 1, 0.3, 1] as const;
export const easeCine = [0.76, 0, 0.24, 1] as const;
