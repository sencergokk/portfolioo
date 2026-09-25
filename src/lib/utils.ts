import type { CSSProperties } from "react";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/** Per-card accent colours exposed as CSS variables (`--a1`, `--a2`, `--spot`). */
export function accentVars(from: string, to: string): CSSProperties {
  return { "--a1": from, "--a2": to, "--spot": from } as CSSProperties;
}
