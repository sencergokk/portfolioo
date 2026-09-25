"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { createElement, useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import { cn, EASE_OUT_EXPO } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Reveal — fade/rise when scrolled into view (transform + opacity only)       */
/* -------------------------------------------------------------------------- */

const revealTags = { div: motion.div, li: motion.li, span: motion.span } as const;

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  amount = 0.25,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
  as?: keyof typeof revealTags;
}) {
  const reduced = useReducedMotion();
  const Tag = revealTags[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={reduced ? { duration: 0 } : { duration: 1.1, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/* SplitText — word-by-word masked rise, screen-reader friendly                */
/* -------------------------------------------------------------------------- */

export type Segment = { text: string; className?: string };

export function SplitText({
  segments,
  as = "span",
  className,
  delay = 0,
  stagger = 0.045,
  immediate = false,
}: {
  segments: Segment[] | string;
  as?: "span" | "p" | "div" | "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
  stagger?: number;
  /** Animate on mount instead of on scroll-into-view (above-the-fold copy). */
  immediate?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduced = useReducedMotion();
  const segs = typeof segments === "string" ? [{ text: segments }] : segments;
  const label = segs.map((s) => s.text).join(" ");
  const show = immediate || inView;

  let index = 0;
  const words = segs.flatMap((seg, si) =>
    seg.text.split(" ").map((word, wi) => {
      const i = index++;
      return (
        <span key={`${si}-${wi}`}>
          {/* The mask is padded on every side (and pulled back with negative margins) so accents
              like İ/Ö and descenders like ş/ç/ğ/y are never clipped once the word has risen. */}
          <span className="-mx-[0.08em] -mt-[0.25em] -mb-[0.2em] inline-block overflow-hidden px-[0.08em] pt-[0.25em] pb-[0.2em] align-top">
            <motion.span
              className={cn("inline-block", seg.className)}
              initial={{ y: "140%", rotate: 4 }}
              animate={show ? { y: "0%", rotate: 0 } : undefined}
              transition={
                reduced ? { duration: 0 } : { duration: 1.15, ease: EASE_OUT_EXPO, delay: delay + i * stagger }
              }
            >
              {word}
            </motion.span>
          </span>{" "}
        </span>
      );
    }),
  );

  return createElement(
    as,
    { className },
    <span className="sr-only">{label}</span>,
    <span ref={ref} aria-hidden>
      {words}
    </span>,
  );
}

/* -------------------------------------------------------------------------- */
/* Magnetic — element leans toward the cursor                                  */
/* -------------------------------------------------------------------------- */

export function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const x = useSpring(0, { stiffness: 180, damping: 14, mass: 0.35 });
  const y = useSpring(0, { stiffness: 180, damping: 14, mass: 0.35 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={cn("inline-block", className)}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Counter — counts up once in view                                            */
/* -------------------------------------------------------------------------- */

export function Counter({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration: 2, ease: EASE_OUT_EXPO });
    return () => controls.stop();
  }, [inView, reduced, value, mv]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
      <motion.span aria-hidden>{text}</motion.span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Spotlight — pointer-tracking glow for cards (pairs with .spotlight CSS)     */
/* -------------------------------------------------------------------------- */

export function onSpotlightMove(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}
