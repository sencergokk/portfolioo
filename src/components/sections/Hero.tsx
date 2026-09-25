"use client";

import { ArrowDown, ArrowUpRight, FileText } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { LocalTime } from "@/components/ui/LocalTime";
import { Magnetic, SplitText } from "@/components/ui/motion";
import { Section } from "@/components/ui/Section";
import { catalog } from "@/content/apps";
import { site } from "@/content/site";
import { EASE_OUT_EXPO } from "@/lib/utils";

const nameSize = "text-[min(19vw,10.5svh)] md:text-[clamp(5rem,min(13vw,18svh),12rem)]";

export function Hero() {
  const reduced = useReducedMotion();
  // Keep initial/animate stable across hydration (useReducedMotion is null on the server);
  // reduced-motion users just get an instant transition.
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: reduced ? { duration: 0 } : { duration: 1.2, ease: EASE_OUT_EXPO, delay },
  });

  return (
    <Section id="top" scene="hero" className="overflow-hidden">
      {/* Mobile: the particle portrait owns the top of the screen and the copy sits below it. */}
      <div className="container-page relative flex flex-1 flex-col justify-end pt-[44svh] pb-[max(1.25rem,4svh)] md:justify-center md:pt-[max(5.5rem,9svh)] md:pb-[max(6rem,13svh)]">
        <div className="flex max-w-[46rem] flex-col">
          <motion.div
            {...fade(0.2)}
            className="glass order-3 mt-4 inline-flex w-fit items-center gap-3 rounded-full py-1.5 pr-4 pl-1.5 max-md:hidden max-md:tall:inline-flex md:order-none md:mt-0"
          >
            <span className="relative h-8 w-8 overflow-hidden rounded-full bg-bg-3 ring-1 ring-line-strong">
              <Image src={site.photo.cutout} alt="" fill sizes="32px" className="object-cover object-top" priority />
            </span>
            <span className="flex items-center gap-2 text-[13px] text-fg-2">
              <span
                className="relative inline-block h-2 w-2 animate-pulse-dot rounded-full bg-emerald-400"
                aria-hidden
              />
              {site.availability}
              <span className="text-fg-3">·</span>
              <span className="text-fg-3">{site.location}</span>
            </span>
          </motion.div>

          <h1 className="order-1 md:order-none md:mt-[4svh]">
            <span className="sr-only">
              {site.name}, {site.role}
            </span>
            <span aria-hidden className="block">
              <SplitText
                immediate
                delay={0.35}
                stagger={0.08}
                segments={[{ text: site.firstName }]}
                className={`block leading-[0.84] font-medium tracking-[-0.065em] ${nameSize}`}
              />
              <SplitText
                immediate
                delay={0.5}
                segments={[{ text: `${site.lastName}.`, className: "text-gold" }]}
                className={`block pl-[0.02em] font-serif leading-[0.95] tracking-[-0.035em] md:pl-[0.5em] ${nameSize}`}
              />
            </span>
          </h1>

          <motion.p
            {...fade(0.75)}
            className="order-2 mt-3 font-serif text-[1.35rem] tracking-[-0.015em] text-fg md:order-none md:mt-[3svh] md:text-[clamp(1.4rem,3.2svh,2rem)]"
          >
            {site.role}
          </motion.p>
          <motion.p
            {...fade(0.85)}
            className="order-4 mt-3 max-w-xl text-[15px] leading-relaxed text-pretty text-fg-2 md:order-none md:mt-[1.8svh] md:text-[clamp(1rem,2.1svh,1.125rem)]"
          >
            {site.intro}
          </motion.p>

          <motion.div {...fade(1)} className="order-5 mt-5 flex items-center gap-3 md:order-none md:mt-[3.5svh]">
            <Magnetic>
              <a
                href="#uygulamalar"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-fg pr-2 pl-5 text-sm font-medium text-bg transition-colors hover:bg-accent-soft md:pl-6"
              >
                <span className="md:hidden">Uygulamalar</span>
                <span className="hidden md:inline">Uygulamalarımı keşfet</span>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-bg text-fg transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={16} />
                </span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={site.resume}
                target="_blank"
                rel="noopener"
                className="glass inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm text-fg-2 transition-colors hover:text-fg"
              >
                <FileText size={16} /> Özgeçmiş
              </a>
            </Magnetic>
          </motion.div>
        </div>

        {/* meta strip (desktop) */}
        <motion.dl
          {...fade(1.2)}
          className="absolute inset-x-10 bottom-[max(1.5rem,3.5svh)] hidden grid-cols-4 gap-x-6 border-t border-line pt-[2.2svh] md:grid xl:inset-x-14"
        >
          <div>
            <dt className="label">Odak</dt>
            <dd className="mt-1.5 text-sm text-fg">{site.focus}</dd>
          </div>
          <div>
            <dt className="label">App Store</dt>
            <dd className="mt-1.5 text-sm text-fg">{catalog.length} uygulama yayında</dd>
          </div>
          <div>
            <dt className="label">Ankara</dt>
            <dd className="mt-1.5 text-sm text-fg tabular-nums">
              <LocalTime timeZone={site.timeZone} /> <span className="text-fg-3">GMT+3</span>
            </dd>
          </div>
          <div className="flex items-end justify-end">
            <a href="#hakkimda" className="group inline-flex items-center gap-2 text-sm text-fg-2 hover:text-fg">
              Kaydır
              <span className="grid h-8 w-8 place-items-center rounded-full border border-line-strong transition-transform duration-500 group-hover:translate-y-1">
                <ArrowDown size={14} />
              </span>
            </a>
          </div>
        </motion.dl>
      </div>
    </Section>
  );
}
