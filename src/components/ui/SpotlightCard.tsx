"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { onSpotlightMove } from "./motion";

export function SpotlightCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div onPointerMove={onSpotlightMove} className={cn("spotlight", className)}>
      {children}
    </div>
  );
}
