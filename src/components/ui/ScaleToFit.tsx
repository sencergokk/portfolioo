"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Renders a fixed-size child (e.g. a 250x542 phone mock) scaled down to fit whatever box the
 * layout gives it, so mocks never overflow a viewport-sized card on short or narrow screens.
 */
export function ScaleToFit({
  width,
  height,
  max = 1,
  className,
  children,
}: {
  width: number;
  height: number;
  max?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const s = Math.min(el.clientWidth / width, el.clientHeight / height, max);
      el.style.setProperty("--fit", String(Math.max(0.2, s)));
      el.dataset.ready = "";
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, height, max]);

  return (
    <div ref={ref} className={cn("group/fit relative h-full w-full", className)}>
      <div
        className="absolute top-1/2 left-1/2 opacity-0 transition-opacity duration-300 group-data-ready/fit:opacity-100"
        style={{ width, height, transform: "translate(-50%, -50%) scale(var(--fit, 0.6))" }}
      >
        {children}
      </div>
    </div>
  );
}
