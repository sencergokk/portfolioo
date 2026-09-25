"use client";

import { ArrowUpRight, Check } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "motion/react";
import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import { HaliSahaVisual, KpssVisual, MasalVisual, TheftVisual } from "@/components/mocks/AppMocks";
import { AppGlyph } from "@/components/ui/AppGlyph";
import { AppleIcon } from "@/components/ui/icons";
import { onSpotlightMove, Reveal } from "@/components/ui/motion";
import { SectionHeading, serifGold } from "@/components/ui/SectionHeading";
import { catalog, featuredApps, type CatalogApp, type FeaturedApp } from "@/content/apps";
import { socials } from "@/content/site";
import { accentVars } from "@/lib/utils";

const VISUALS: Record<FeaturedApp["visual"], () => ReactNode> = {
  halisaha: HaliSahaVisual,
  kpss: KpssVisual,
  theft: TheftVisual,
  masal: MasalVisual,
};

export function Apps() {
  return (
    <section id="uygulamalar" className="relative pt-16 pb-28 md:pb-40">
      {/* Intro — the particle phone assembles in the empty right half on desktop. */}
      <div className="container-page relative flex min-h-[70svh] items-center md:min-h-[88svh]">
        <div data-scene="apps" aria-hidden className="absolute top-1/2 left-0 h-px w-px" />
        <SectionHeading
          index="02"
          label="Uygulamalar"
          className="md:max-w-[52%]"
          title={[{ text: "Fikirden" }, { text: "App Store'a,", className: serifGold }, { text: "tek başıma." }]}
          description={`Tasarım, kod, ekonomi dengesi, mağaza görselleri ve yerelleştirme — ${catalog.length} uygulamanın her aşamasını uçtan uca ben yürüttüm. Öne çıkan dördü:`}
        />
      </div>

      <FeaturedStack />

      <AppIndex />
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Sticky stacking cards (desktop): each card pins, then recedes as the next  */
/* one slides over it. On mobile the cards simply flow.                        */
/* -------------------------------------------------------------------------- */

function FeaturedStack() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const total = featuredApps.length;
  return (
    <div ref={ref} className="container-page relative">
      <div data-scene="apps-rest" aria-hidden className="absolute top-0 left-0 h-px w-px" />
      {featuredApps.map((app, i) => (
        <StackItem key={app.slug} index={i} total={total} progress={scrollYProgress}>
          <FeaturedAppCard app={app} index={i} total={total} />
        </StackItem>
      ))}
    </div>
  );
}

function StackItem({
  children,
  index,
  total,
  progress,
}: {
  children: ReactNode;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const reduced = useReducedMotion();
  // Card i pins at progress i/(n-1); the next card fully covers it one step later.
  const step = 1 / Math.max(1, total - 1);
  const depth = total - 1 - index;
  const start = depth > 0 ? index * step : 0;
  const scale = useTransform(progress, [start, 1], [1, reduced ? 1 : 1 - depth * 0.045]);
  const dim = useTransform(progress, [start, Math.min(1, start + step)], [0, reduced || depth === 0 ? 0 : 0.6]);

  return (
    <div className="mb-6 md:sticky md:top-0 md:mb-0 md:flex md:h-[100svh] md:items-center">
      <motion.div
        style={{ "--s": scale, top: `${index * 16}px` } as unknown as MotionStyle}
        className="relative w-full origin-top md:[scale:var(--s)]"
      >
        {children}
        <motion.div
          aria-hidden
          style={{ opacity: dim }}
          className="pointer-events-none absolute inset-0 hidden rounded-[32px] bg-bg md:block"
        />
      </motion.div>
    </div>
  );
}

function FeaturedAppCard({ app, index, total }: { app: FeaturedApp; index: number; total: number }) {
  const Visual = VISUALS[app.visual];
  return (
    <article
      onPointerMove={onSpotlightMove}
      style={accentVars(app.accent.from, app.accent.to)}
      className="spotlight grid overflow-hidden rounded-[32px] border border-line bg-bg-2 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)] md:min-h-[min(40rem,calc(100vh-8rem))] md:grid-cols-[1.05fr_1fr]"
    >
      <div className="flex flex-col p-6 sm:p-8 md:p-12">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="label text-accent tabular-nums">
            0{index + 1} / 0{total}
          </span>
          <span className="label">{app.category}</span>
          <span className="flex gap-1.5">
            {app.platforms.map((p) => (
              <span key={p} className="rounded-full border border-line-strong px-2 py-0.5 text-[11px] text-fg-2">
                {p}
              </span>
            ))}
          </span>
        </div>

        <h3 className="mt-8 text-[clamp(2.4rem,4.5vw,4rem)] leading-[0.95] font-medium tracking-[-0.045em]">
          {app.name}
        </h3>
        {app.storeName && <p className="mt-2 font-mono text-xs text-fg-3">App Store: {app.storeName}</p>}
        <p
          className="mt-5 bg-clip-text py-[0.08em] font-serif text-2xl leading-snug tracking-[-0.015em] text-transparent md:text-[1.7rem]"
          style={{ backgroundImage: "linear-gradient(90deg, var(--a1), var(--a2))" }}
        >
          {app.tagline}
        </p>
        <p className="mt-5 max-w-xl leading-relaxed text-pretty text-fg-2">{app.description}</p>

        <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
          {app.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2.5 text-sm text-fg">
              <span
                className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full"
                style={{ background: "color-mix(in oklab, var(--a1) 22%, transparent)", color: "var(--a1)" }}
              >
                <Check size={10} strokeWidth={3} />
              </span>
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-6 pt-10">
          <ul className="flex flex-wrap gap-1.5" aria-label="Teknolojiler">
            {app.stack.map((s) => (
              <li key={s} className="rounded-full bg-white/[0.05] px-3 py-1 font-mono text-[11px] text-fg-2">
                {s}
              </li>
            ))}
          </ul>
          <a
            href={app.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-11 items-center gap-2 rounded-full border border-line-strong pr-2 pl-4 text-sm transition-colors hover:border-transparent hover:bg-fg hover:text-bg"
          >
            <AppleIcon className="h-4 w-4" />
            App Store
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 transition-transform duration-500 group-hover:rotate-45 group-hover:bg-bg group-hover:text-fg">
              <ArrowUpRight size={14} />
            </span>
          </a>
        </div>
      </div>

      <div className="group relative min-h-[30rem] overflow-hidden border-t border-line md:border-t-0 md:border-l">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 45%, color-mix(in oklab, var(--a1) 32%, transparent), transparent 70%), radial-gradient(50% 40% at 80% 90%, color-mix(in oklab, var(--a2) 22%, transparent), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgb(255_255_255/0.14)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(60%_60%_at_50%_50%,#000,transparent)]"
        />
        <div className="relative flex h-full items-center justify-center p-6 md:p-10">
          <Visual />
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Full catalogue with a cursor-following preview tile                        */
/* -------------------------------------------------------------------------- */

function AppIndex() {
  const [hovered, setHovered] = useState<CatalogApp | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 26, mass: 0.5 });
  const listRef = useRef<HTMLUListElement>(null);

  const onMove = (e: PointerEvent) => {
    const r = listRef.current?.getBoundingClientRect();
    if (!r) return;
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  return (
    <div className="container-page mt-28 md:mt-40">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Reveal>
          <h3 className="text-[clamp(2rem,4vw,3.25rem)] leading-none font-medium tracking-[-0.04em]">
            Tüm uygulamalar <sup className="ml-1 align-super font-mono text-base text-accent">{catalog.length}</sup>
          </h3>
        </Reveal>
        <Reveal delay={0.1}>
          <a
            href={socials.appStore.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-sm text-fg-2 hover:text-fg"
          >
            <AppleIcon className="h-4 w-4" /> Geliştirici sayfası
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </Reveal>
      </div>

      <ul
        ref={listRef}
        onPointerMove={onMove}
        onPointerLeave={() => setHovered(null)}
        className="relative mt-10 border-b border-line"
      >
        {catalog.map((app, i) => (
          <Reveal as="li" key={app.slug} delay={Math.min(i, 6) * 0.04} amount={0.5}>
            <a
              href={app.href}
              target="_blank"
              rel="noopener noreferrer"
              onPointerEnter={() => setHovered(app)}
              onFocus={() => setHovered(null)}
              className="group relative grid grid-cols-[2.25rem_auto_1fr_auto] items-center gap-x-4 border-t border-line py-4 md:grid-cols-[3.5rem_1fr_minmax(0,22rem)_9rem_2rem] md:gap-x-6 md:py-6"
            >
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-[linear-gradient(90deg,transparent,rgb(243_239_231/0.04),transparent)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
              />
              <span className="label tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <AppGlyph glyph={app.glyph} accent={app.accent} icon={app.icon} size={40} className="md:hidden" />
              <span className="flex min-w-0 items-center gap-3">
                <span className="truncate text-lg font-medium tracking-[-0.02em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 md:text-[1.7rem]">
                  {app.name}
                </span>
                {app.featured && (
                  <span className="hidden shrink-0 rounded-full border border-accent/40 px-2 py-0.5 text-[10px] tracking-wider text-accent uppercase lg:inline">
                    Öne çıkan
                  </span>
                )}
              </span>
              <span className="hidden truncate text-sm text-fg-3 transition-colors group-hover:text-fg-2 md:block">
                {app.blurb}
              </span>
              <span className="label hidden md:block">{app.category}</span>
              <ArrowUpRight
                size={18}
                className="justify-self-end text-fg-3 transition-all duration-500 group-hover:rotate-45 group-hover:text-accent"
                aria-hidden
              />
            </a>
          </Reveal>
        ))}

        <AnimatePresence>
          {hovered && (
            <motion.div
              key="preview"
              aria-hidden
              className="pointer-events-none absolute top-0 left-0 z-10 hidden md:block"
              style={{ x: sx, y: sy }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="-translate-x-1/2 -translate-y-[115%]">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={hovered.slug}
                    initial={{ opacity: 0, rotate: -8, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: -4, scale: 1 }}
                    exit={{ opacity: 0, rotate: 6, scale: 0.8 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <AppGlyph glyph={hovered.glyph} accent={hovered.accent} icon={hovered.icon} size={112} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ul>
      <p className="mt-6 text-sm text-fg-3">
        Görseller temsilidir; her uygulamanın güncel hâli App Store sayfasındadır.
      </p>
    </div>
  );
}
