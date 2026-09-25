"use client";

import { ArrowUpRight, Check } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionStyle, type MotionValue } from "motion/react";
import { useRef, type ComponentType, type ReactNode } from "react";
import { HaliSahaVisual, KpssVisual, MasalVisual, MOCK_SIZE, TheftVisual } from "@/components/mocks/AppMocks";
import { AppGlyph } from "@/components/ui/AppGlyph";
import { AppleIcon } from "@/components/ui/icons";
import { onSpotlightMove, Reveal, SplitText } from "@/components/ui/motion";
import { ScaleToFit } from "@/components/ui/ScaleToFit";
import { Section } from "@/components/ui/Section";
import { SectionHeading, SectionLabel, serifGold } from "@/components/ui/SectionHeading";
import { catalog, featuredApps, type FeaturedApp } from "@/content/apps";
import { socials } from "@/content/site";
import { accentVars } from "@/lib/utils";

const VISUALS: Record<FeaturedApp["visual"], { Component: ComponentType; size: readonly [number, number] }> = {
  halisaha: { Component: HaliSahaVisual, size: MOCK_SIZE.fan },
  kpss: { Component: KpssVisual, size: MOCK_SIZE.phone },
  theft: { Component: TheftVisual, size: MOCK_SIZE.phone },
  masal: { Component: MasalVisual, size: MOCK_SIZE.phone },
};

/* -------------------------------------------------------------------------- */
/* Intro: the particle phone assembles beside (desktop) or above (mobile) it  */
/* -------------------------------------------------------------------------- */

export function AppsIntro() {
  return (
    <Section id="uygulamalar" scene="apps">
      <div className="container-page section-y flex flex-1 flex-col justify-end pt-[50svh] md:justify-center md:pt-[max(5.25rem,11svh)]">
        <SectionHeading
          index="03"
          label="Uygulamalar"
          className="md:max-w-[50%]"
          title={[{ text: "Fikirden" }, { text: "App Store'a,", className: serifGold }, { text: "tek başıma." }]}
          description={`Tasarımdan koda, oyun ekonomisinden mağaza görsellerine kadar ${catalog.length} uygulamanın her aşamasını kendim yürüttüm. İşte öne çıkan dördü.`}
        />
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Featured apps: one screen per card; each pins, then recedes under the next */
/* -------------------------------------------------------------------------- */

export function FeaturedApps() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const total = featuredApps.length;
  return (
    <div ref={ref} className="relative" aria-label="Öne çıkan uygulamalar">
      {/* snap targets + scene anchors live outside the sticky cards so their positions stay static */}
      {featuredApps.map((app, i) => (
        <div
          key={app.slug}
          data-snap=""
          aria-hidden
          className="pointer-events-none absolute left-0 h-svh w-px"
          style={{ top: `${i * 100}svh` }}
        />
      ))}
      <div data-scene="apps-rest" aria-hidden className="pointer-events-none absolute top-[50svh] left-0 h-px w-px" />
      <div data-scene="off" aria-hidden className="pointer-events-none absolute top-[150svh] left-0 h-px w-px" />
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
    <div
      className="sticky top-0 flex h-svh flex-col"
      style={{ paddingTop: `calc(max(4.75rem, 9svh) + ${index * 10}px)`, paddingBottom: "max(0.9rem, 3svh)" }}
    >
      <div className="container-page flex min-h-0 flex-1 flex-col">
        <motion.div
          style={{ "--s": scale } as unknown as MotionStyle}
          className="relative min-h-0 flex-1 origin-top [scale:var(--s)]"
        >
          {children}
          <motion.div
            aria-hidden
            style={{ opacity: dim }}
            className="pointer-events-none absolute inset-0 rounded-[28px] bg-bg md:rounded-[32px]"
          />
        </motion.div>
      </div>
    </div>
  );
}

function FeaturedAppCard({ app, index, total }: { app: FeaturedApp; index: number; total: number }) {
  const { Component: Visual, size } = VISUALS[app.visual];
  return (
    <article
      onPointerMove={onSpotlightMove}
      style={accentVars(app.accent.from, app.accent.to)}
      className="spotlight flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-bg-2 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)] md:grid md:grid-cols-[1.05fr_1fr] md:rounded-[32px]"
    >
      {/* visual: top on phones, right on larger screens */}
      <div className="relative order-1 min-h-0 flex-1 overflow-hidden border-b border-line md:order-2 md:border-b-0 md:border-l">
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
          className="absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_50%,#000,transparent)] [background-image:radial-gradient(rgb(255_255_255/0.14)_1px,transparent_1px)] [background-size:22px_22px] opacity-30"
        />
        <div className="absolute inset-0 p-4 md:p-[clamp(1.25rem,4svh,2.5rem)]">
          <ScaleToFit width={size[0]} height={size[1]}>
            <Visual />
          </ScaleToFit>
        </div>
      </div>

      <div className="order-2 flex shrink-0 flex-col p-5 md:order-1 md:min-h-0 md:p-[clamp(1.5rem,4.6svh,3rem)]">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="label text-accent tabular-nums">
            0{index + 1} / 0{total}
          </span>
          <span className="label">{app.category}</span>
          <span className="hidden gap-1.5 md:flex">
            {app.platforms.map((p) => (
              <span key={p} className="rounded-full border border-line-strong px-2 py-0.5 text-[11px] text-fg-2">
                {p}
              </span>
            ))}
          </span>
        </div>

        <h3 className="mt-2 text-[min(8.5vw,4.6svh)] leading-[1] font-medium tracking-[-0.045em] md:mt-[3svh] md:text-[clamp(2.2rem,min(4.2vw,6.4svh),4rem)]">
          {app.name}
        </h3>
        {app.storeName && (
          <p className="mt-2 hidden font-mono text-xs text-fg-3 md:block short:md:hidden">App Store: {app.storeName}</p>
        )}
        <p
          className="mt-1.5 bg-clip-text py-[0.08em] font-serif text-[1.05rem] leading-snug tracking-[-0.015em] text-transparent md:mt-[2svh] md:text-[clamp(1.2rem,2.8svh,1.7rem)]"
          style={{ backgroundImage: "linear-gradient(90deg, var(--a1), var(--a2))" }}
        >
          {app.tagline}
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-pretty text-fg-2 max-md:short:hidden md:mt-[2svh] md:line-clamp-3 md:text-[clamp(0.9rem,1.9svh,1rem)]">
          {app.description}
        </p>

        <ul className="mt-[2.6svh] hidden gap-2.5 md:grid md:grid-cols-2 short:md:hidden">
          {app.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2.5 text-[clamp(0.8rem,1.7svh,0.875rem)] text-fg">
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

        <div className="mt-4 flex items-end justify-between gap-4 md:mt-auto md:pt-[3svh]">
          <ul className="hidden flex-wrap gap-1.5 md:flex" aria-label="Teknolojiler">
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
            aria-label={`${app.name} App Store sayfası`}
            className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-line-strong pr-2 pl-4 text-sm transition-colors hover:border-transparent hover:bg-fg hover:text-bg"
          >
            <AppleIcon className="h-4 w-4" />
            App Store
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 transition-transform duration-500 group-hover:rotate-45 group-hover:bg-bg group-hover:text-fg">
              <ArrowUpRight size={14} />
            </span>
          </a>
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Catalog: an iOS home screen on phones, a tile grid on larger screens       */
/* -------------------------------------------------------------------------- */

export function Catalog() {
  return (
    <Section id="katalog" label="Tüm uygulamalar">
      <div className="container-page section-y flex flex-1 flex-col justify-center">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Reveal>
              <SectionLabel index="03">Tüm uygulamalar</SectionLabel>
            </Reveal>
            <SplitText
              as="h2"
              className="mt-3 text-[min(8.5vw,4.6svh)] leading-[1.05] font-medium tracking-[-0.04em] md:mt-[2.5svh] md:text-[clamp(2rem,min(4vw,6svh),3.4rem)]"
              segments={[{ text: `${catalog.length} uygulama,` }, { text: "tek geliştirici.", className: serifGold }]}
            />
          </div>
          <a
            href={socials.appStore.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group hidden items-center gap-2 text-sm text-fg-2 hover:text-fg md:inline-flex"
          >
            <AppleIcon className="h-4 w-4" /> Geliştirici sayfası
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>

        <ul className="mt-5 grid grid-cols-4 gap-x-2 gap-y-[min(3.2svh,1.5rem)] md:mt-[3.5svh] md:grid-cols-5 md:gap-[min(1.8svh,1rem)]">
          {catalog.map((app, i) => (
            <Reveal as="li" key={app.slug} delay={Math.min(i, 10) * 0.03} amount={0.3}>
              <a
                href={app.href}
                target="_blank"
                rel="noopener noreferrer"
                title={`${app.name}: ${app.blurb}`}
                className="group flex h-full flex-col items-center text-center md:items-start md:rounded-2xl md:border md:border-line md:bg-bg-2/95 md:p-[clamp(0.7rem,1.9svh,1.25rem)] md:text-left md:transition-[border-color,transform] md:duration-500 md:hover:-translate-y-1 md:hover:border-line-strong"
              >
                <AppGlyph
                  glyph={app.glyph}
                  accent={app.accent}
                  icon={app.icon}
                  size={58}
                  className="transition-transform duration-500 group-active:scale-95 short:[--g:50px] md:[--g:clamp(2.2rem,5.2svh,3rem)] md:short:[--g:clamp(2.2rem,5.2svh,3rem)]"
                />
                <span className="mt-1.5 line-clamp-1 w-full text-[11px] leading-tight text-fg-2 md:hidden">
                  {app.shortName}
                </span>
                <span className="mt-[1.4svh] hidden w-full items-start justify-between gap-2 md:flex">
                  <span className="line-clamp-2 text-[clamp(0.8rem,1.8svh,0.95rem)] leading-snug font-medium tracking-tight">
                    {app.name}
                  </span>
                  <ArrowUpRight
                    size={14}
                    aria-hidden
                    className="mt-0.5 shrink-0 text-fg-3 transition-all duration-500 group-hover:rotate-45 group-hover:text-accent"
                  />
                </span>
                <span className="mt-1 hidden text-[11px] text-fg-3 md:block">{app.category}</span>
              </a>
            </Reveal>
          ))}
        </ul>

        <a
          href={socials.appStore.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-2 self-center rounded-full border border-line-strong px-4 py-2.5 text-sm text-fg-2 short:mt-3 short:py-2 md:hidden"
        >
          <AppleIcon className="h-4 w-4" /> App Store geliştirici sayfası
        </a>
      </div>
    </Section>
  );
}
