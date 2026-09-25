"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Counter, Reveal, SplitText } from "@/components/ui/motion";
import { SectionLabel, serifGold } from "@/components/ui/SectionHeading";
import { education } from "@/content/experience";
import { about } from "@/content/about";
import { site } from "@/content/site";

export function About() {
  const figure = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: figure, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["6%", "-6%"]);
  const glowY = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-10%", "12%"]);

  return (
    <section id="hakkimda" className="relative py-28 md:py-40">
      <div data-scene="about" aria-hidden className="absolute top-[35%] left-0 h-px w-px" />
      <div className="container-page grid gap-14 md:grid-cols-12 md:gap-10 lg:gap-16">
        {/* Portrait */}
        <div className="md:col-span-5">
          <div className="md:sticky md:top-28">
            <Reveal>
              <figure
                ref={figure}
                className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-line bg-bg-2"
              >
                {/* backdrop: warm light + fine grid */}
                <motion.div
                  aria-hidden
                  style={{ y: glowY }}
                  className="absolute inset-[-20%] bg-[radial-gradient(45%_40%_at_55%_38%,rgb(232_184_107/0.35),transparent_70%),radial-gradient(35%_30%_at_30%_80%,rgb(255_138_76/0.14),transparent_70%)]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(var(--color-line-strong)_1px,transparent_1px),linear-gradient(90deg,var(--color-line-strong)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)]"
                />
                <motion.div style={{ y: imgY }} className="absolute inset-x-0 -bottom-[4%] top-[6%]">
                  <Image
                    src={site.photo.cutout}
                    alt={site.photo.alt}
                    fill
                    sizes="(min-width: 768px) 40vw, 92vw"
                    className="object-cover object-bottom"
                  />
                </motion.div>
                {/* warm rim-light tint on the monochrome portrait */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(200deg,rgb(232_184_107/0.28),transparent_45%)] mix-blend-soft-light"
                />
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg-2 via-bg-2/60 to-transparent"
                />
                <figcaption className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="font-serif text-3xl leading-tight tracking-[-0.02em]">{site.name}</p>
                    <p className="mt-2 label">{site.role}</p>
                  </div>
                  <p className="label text-right">
                    {site.location.split(",")[0]}
                    <br />
                    TR
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>

        {/* Story */}
        <div className="md:col-span-7 md:pt-4">
          <Reveal>
            <SectionLabel index="01">Hakkımda</SectionLabel>
          </Reveal>
          <SplitText
            as="h2"
            className="mt-7 text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.08] font-medium tracking-[-0.035em] text-balance"
            stagger={0.02}
            segments={about.headline.map((h) => ({ text: h.text, className: "em" in h ? serifGold : undefined }))}
          />

          <div className="mt-10 grid gap-6 text-base leading-relaxed text-pretty text-fg-2 md:text-lg">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line">
            {about.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06} className="bg-bg-2/95 p-6 md:p-8">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <Counter
                    value={s.value}
                    suffix={s.suffix}
                    className="block text-5xl font-medium tracking-[-0.05em] tabular-nums md:text-6xl"
                  />
                  <span className="mt-3 block text-sm text-fg-3">{s.label}</span>
                </dd>
              </Reveal>
            ))}
          </dl>

          <div className="mt-16">
            <Reveal>
              <h3 className="label">Nasıl çalışırım</h3>
            </Reveal>
            <ol className="mt-6 divide-y divide-line border-y border-line">
              {about.principles.map((p, i) => (
                <Reveal
                  as="li"
                  key={p.title}
                  delay={i * 0.05}
                  className="grid grid-cols-[3rem_1fr] gap-x-4 py-6 md:grid-cols-[3.5rem_14rem_1fr]"
                >
                  <span className="label pt-1 text-accent">0{i + 1}</span>
                  <p className="text-lg font-medium tracking-tight">{p.title}</p>
                  <p className="col-start-2 mt-1 text-fg-2 md:col-start-3 md:mt-0">{p.body}</p>
                </Reveal>
              ))}
            </ol>
          </div>

          <Reveal className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-fg-3">
            <span>
              <span className="text-fg-2">{education.school}</span> · {education.degree} · {education.period}
            </span>
            {education.notes.map((n) => (
              <span key={n} className="inline-flex items-center gap-2">
                <span aria-hidden className="h-1 w-1 rounded-full bg-accent" />
                {n}
              </span>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
