"use client";

import { ReactLenis, useLenis } from "lenis/react";
import Snap from "lenis/snap";
import "lenis/dist/lenis.css";
import { MotionConfig, useReducedMotion } from "motion/react";
import { useEffect, type ReactNode } from "react";

/**
 * Section snapping. Mouse and trackpad go through lenis/snap (it hooks Lenis' wheel stream);
 * touch scrolling stays native and uses CSS scroll-snap (see globals.css), which is switched
 * off while Lenis animates an anchor jump so the two never fight.
 */
function SectionSnap({ reduced }: { reduced: boolean }) {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const html = document.documentElement;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    if (coarse) {
      const onScroll = () => html.classList.toggle("snap-off", lenis.isScrolling === "smooth");
      lenis.on("scroll", onScroll);
      return () => {
        lenis.off("scroll", onScroll);
        html.classList.remove("snap-off");
      };
    }
    if (reduced) return;

    const snap = new Snap(lenis, { type: "proximity", distanceThreshold: "50%", debounce: 260, duration: 0.9 });
    // "end" as well as "start" so a section taller than the screen (very short viewports)
    // can still be read to its bottom instead of snapping back to its top.
    const remove = snap.addElements(Array.from(document.querySelectorAll<HTMLElement>("[data-snap]")), {
      align: ["start", "end"],
    });
    return () => {
      remove();
      snap.destroy();
    };
  }, [lenis, reduced]);

  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion() ?? false;
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        smoothWheel: !reduced,
        anchors: { offset: 0, duration: reduced ? 0 : 1.4 },
        stopInertiaOnNavigate: true,
      }}
    >
      <SectionSnap reduced={reduced} />
      {/* "user": motion drops transform/layout animations when the OS asks for reduced motion. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ReactLenis>
  );
}
