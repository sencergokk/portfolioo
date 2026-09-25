"use client";

import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { MotionConfig, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion() ?? false;
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        smoothWheel: !reduced,
        anchors: { offset: -24, duration: reduced ? 0 : 1.4 },
        stopInertiaOnNavigate: true,
      }}
    >
      {/* "user": motion drops transform/layout animations when the OS asks for reduced motion. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ReactLenis>
  );
}
