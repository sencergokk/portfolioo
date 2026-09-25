import type { ReactNode } from "react";
import type { SceneKey } from "@/scene/director";
import { cn } from "@/lib/utils";

/**
 * A full-screen section: at least one viewport tall, registered as a snap point, and
 * optionally carrying a particle-scene anchor at its vertical centre.
 */
export function Section({
  id,
  scene,
  className,
  children,
  label,
}: {
  id: string;
  scene?: SceneKey;
  className?: string;
  children: ReactNode;
  label?: string;
}) {
  return (
    <section id={id} data-snap="" aria-label={label} className={cn("relative flex min-h-svh flex-col", className)}>
      {scene && (
        <div data-scene={scene} aria-hidden className="pointer-events-none absolute top-1/2 left-0 h-px w-px" />
      )}
      {children}
    </section>
  );
}
