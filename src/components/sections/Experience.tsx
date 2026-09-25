"use client";

import { Award, GraduationCap } from "lucide-react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { Reveal } from "@/components/ui/motion";
import { SectionHeading, serifGold } from "@/components/ui/SectionHeading";
import { certificates, education, experience } from "@/content/experience";

export function Experience() {
  const timeline = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: timeline, offset: ["start 70%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <section id="deneyim" className="relative py-28 md:py-40">
      <div data-scene="experience" aria-hidden className="absolute top-1/3 left-0 h-px w-px" />
      <div className="container-page">
        <SectionHeading
          index="03"
          label="Deneyim"
          title={[{ text: "Endüstriyel veriden" }, { text: "cebinizdeki ekrana.", className: serifGold }]}
          description="Kurumsal ekiplerde gerçek zamanlı veriyle çalışan arayüzler geliştiriyor, aynı disiplini kendi ürünlerime taşıyorum."
        />

        <div className="mt-16 grid gap-14 md:mt-24 md:grid-cols-12 md:gap-10">
          <ol ref={timeline} className="relative md:col-span-8">
            <span aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-line md:left-[9px]" />
            <motion.span
              aria-hidden
              style={{ scaleY: reduced ? 1 : fill }}
              className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-gradient-to-b from-accent via-ember to-accent/0 md:left-[9px]"
            />
            {experience.map((role, i) => (
              <Reveal
                as="li"
                key={`${role.company}-${role.period}`}
                delay={i * 0.05}
                className="relative pb-14 pl-10 last:pb-0 md:pl-14"
              >
                <span
                  aria-hidden
                  className={`absolute top-2 left-0 grid h-[15px] w-[15px] place-items-center rounded-full border md:h-[19px] md:w-[19px] ${
                    role.current ? "border-accent bg-accent/20" : "border-line-strong bg-bg"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${role.current ? "animate-pulse-dot bg-accent" : "bg-fg-3"}`}
                  />
                </span>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="label tabular-nums">{role.period}</span>
                  {role.current && (
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium tracking-wider text-accent uppercase">
                      Şu an
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-2xl font-medium tracking-[-0.03em] md:text-[2rem]">{role.title}</h3>
                <p className="mt-1 text-fg-2">
                  {role.company}
                  {role.team && <span className="text-fg-3"> — {role.team}</span>}
                </p>
                <p className="mt-4 max-w-2xl leading-relaxed text-pretty text-fg-2">{role.summary}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Teknolojiler">
                  {role.tags.map((t) => (
                    <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-fg-2">
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ol>

          <aside className="space-y-6 md:col-span-4">
            <div className="md:sticky md:top-28 md:space-y-6">
              <Reveal className="rounded-3xl border border-line bg-bg-2/80 p-6 backdrop-blur-md md:p-7">
                <GraduationCap className="text-accent" size={22} aria-hidden />
                <p className="mt-5 label">Eğitim</p>
                <p className="mt-2 text-xl font-medium tracking-tight">{education.school}</p>
                <p className="mt-1 text-fg-2">{education.degree}</p>
                <p className="mt-3 font-mono text-xs text-fg-3">{education.period}</p>
              </Reveal>
              <Reveal
                delay={0.08}
                className="mt-6 rounded-3xl border border-line bg-bg-2/80 p-6 backdrop-blur-md md:mt-0 md:p-7"
              >
                <Award className="text-accent" size={22} aria-hidden />
                <p className="mt-5 label">Sertifikalar</p>
                <ul className="mt-4 space-y-3">
                  {certificates.map((c) => (
                    <li
                      key={c.name}
                      className="flex items-baseline justify-between gap-4 border-b border-line pb-3 last:border-0 last:pb-0"
                    >
                      <span className="text-sm text-fg">{c.name}</span>
                      <span className="shrink-0 font-mono text-[11px] text-fg-3">{c.issuer}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
