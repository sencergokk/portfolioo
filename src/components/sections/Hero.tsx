"use client";

import { ArrowDown, ArrowUpRight, FileText } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { LocalTime } from "@/components/ui/LocalTime";
import { Magnetic, SplitText } from "@/components/ui/motion";
import { catalog } from "@/content/apps";
import { site } from "@/content/site";
import { EASE_OUT_EXPO } from "@/lib/utils";

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
    <section id="top" className="relative isolate min-h-[100svh] overflow-hidden">
      <div data-scene="hero" aria-hidden className="absolute top-1/2 left-0 h-px w-px" />

      <div className="container-page relative flex min-h-[100svh] flex-col pt-[50svh] pb-8 md:justify-center md:pt-28 md:pb-28">
        {/* Mobile: the particle portrait owns the top half; copy starts below it. */}
        <div className="flex max-w-[44rem] flex-col">
          <motion.div
            {...fade(0.2)}
            className="glass order-3 mt-7 inline-flex w-fit items-center gap-3 rounded-full py-1.5 pr-4 pl-1.5 md:order-none md:mt-0"
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

          <h1 className="order-1 md:order-none md:mt-9">
            <span className="sr-only">
              {site.name} — {site.role}
            </span>
            <span aria-hidden className="block">
              <SplitText
                immediate
                delay={0.35}
                stagger={0.08}
                segments={[{ text: site.firstName }]}
                className="block text-[clamp(4.6rem,15vw,12.5rem)] leading-[0.82] font-medium tracking-[-0.065em]"
              />
              <SplitText
                immediate
                delay={0.5}
                segments={[{ text: `${site.lastName}.`, className: "text-gold" }]}
                className="block pl-[0.02em] font-serif text-[clamp(4.6rem,15vw,12.5rem)] leading-[0.9] tracking-[-0.035em] md:pl-[0.5em]"
              />
            </span>
          </h1>

          <motion.p
            {...fade(0.75)}
            className="order-2 mt-5 font-serif text-2xl tracking-[-0.015em] text-fg md:order-none md:mt-8 md:text-[2rem]"
          >
            {site.role}
          </motion.p>
          <motion.p
            {...fade(0.85)}
            className="order-4 mt-5 max-w-xl text-base leading-relaxed text-pretty text-fg-2 md:order-none md:mt-4 md:text-lg"
          >
            Gündüzleri Java, Spring Boot ve Next.js ile <span className="text-fg">kurumsal MES ve ERP yazılımları</span>{" "}
            geliştiriyorum; geceleri SwiftUI ile <span className="text-fg">App Store&apos;da yaşayan</span> kendi
            uygulamalarımı tasarlayıp yayınlıyorum.
          </motion.p>

          <motion.div {...fade(1)} className="order-5 mt-8 flex flex-wrap items-center gap-3 md:order-none">
            <Magnetic>
              <a
                href="#uygulamalar"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-fg pr-2 pl-6 text-sm font-medium text-bg transition-colors hover:bg-accent-soft"
              >
                Uygulamalarımı keşfet
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

        {/* meta strip */}
        <motion.dl
          {...fade(1.2)}
          className="mt-12 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 md:absolute md:inset-x-10 md:bottom-8 md:mt-0 md:grid-cols-4 xl:inset-x-14"
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
          <div className="hidden items-end justify-end md:flex">
            <a href="#hakkimda" className="group inline-flex items-center gap-2 text-sm text-fg-2 hover:text-fg">
              Kaydır
              <span className="grid h-8 w-8 place-items-center rounded-full border border-line-strong transition-transform duration-500 group-hover:translate-y-1">
                <ArrowDown size={14} />
              </span>
            </a>
          </div>
        </motion.dl>
      </div>
    </section>
  );
}
