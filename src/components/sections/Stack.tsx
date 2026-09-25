"use client";

import { Code2, Cpu, Layers, Server, Smartphone, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/ui/motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading, serifGold } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { marquee, stackGroups } from "@/content/stack";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = { mobil: Smartphone, web: Code2, backend: Server, altyapi: Cpu };

function Marquee() {
  const words = [...marquee, ...marquee];
  return (
    // py + leading keep descenders (p, g, y, j) and accents inside the clipped row
    <div className="marquee-mask flex overflow-hidden py-[0.2em]" aria-hidden>
      <div className="flex shrink-0 animate-marquee items-center gap-8 pr-8 md:gap-14 md:pr-14">
        {words.map((w, i) => (
          <span key={`${w}-${i}`} className="flex items-center gap-8 md:gap-14">
            <span
              className={cn(
                "text-[min(12vw,6.6svh)] leading-[1.2] whitespace-nowrap md:text-[clamp(2.8rem,min(7vw,9svh),7rem)]",
                i % 2
                  ? "font-serif tracking-[-0.03em] text-fg-2"
                  : "font-medium tracking-[-0.05em] text-transparent [-webkit-text-stroke:1px_rgb(243_239_231/0.3)]",
              )}
            >
              {w}
            </span>
            <span className="text-xl text-accent md:text-4xl">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Stack() {
  const [active, setActive] = useState(0);

  return (
    <Section id="yetkinlikler">
      <div className="section-y flex flex-1 flex-col justify-center">
        <div className="container-page">
          <SectionHeading
            index="05"
            label="Yetkinlikler"
            title={[{ text: "Doğru iş için" }, { text: "doğru araç.", className: serifGold }]}
            description="Native iOS'tan web arayüzlerine, Spring Boot servislerinden altyapıya kadar ürünü tek elden taşıyabildiğim bir yelpaze."
            descriptionClassName="hidden tall:block"
          />
        </div>

        <div className="mt-4 md:mt-[3svh]">
          <Marquee />
        </div>

        <div className="container-page mt-4 md:mt-[3svh]">
          {/* Phones: one group at a time behind a segmented control */}
          <div
            role="tablist"
            aria-label="Yetkinlik grupları"
            className="grid grid-cols-4 gap-1 rounded-full border border-line bg-bg-2 p-1 md:max-w-xl lg:hidden"
          >
            {stackGroups.map((g, i) => (
              <button
                key={g.id}
                type="button"
                role="tab"
                id={`tab-${g.id}`}
                aria-selected={active === i}
                aria-controls={`panel-${g.id}`}
                onClick={() => setActive(i)}
                className={cn(
                  "truncate rounded-full px-2 py-2 text-xs transition-colors",
                  active === i ? "bg-fg text-bg" : "text-fg-2",
                )}
              >
                {g.title.split(" ")[0]}
              </button>
            ))}
          </div>

          <div className="mt-3 grid gap-4 lg:mt-0 lg:grid-cols-4">
            {stackGroups.map((g, i) => {
              const Icon = ICONS[g.id] ?? Layers;
              return (
                <Reveal key={g.id} delay={i * 0.07} className={cn(active !== i && "max-lg:hidden")}>
                  <SpotlightCard className="flex h-full flex-col rounded-3xl border border-line bg-bg-2/95 p-5 md:p-[clamp(1.25rem,3svh,1.75rem)]">
                    <div
                      id={`panel-${g.id}`}
                      role="tabpanel"
                      aria-labelledby={`tab-${g.id}`}
                      className="flex h-full flex-col"
                    >
                      <div className="flex items-center justify-between">
                        <span className="grid h-10 w-10 place-items-center rounded-2xl border border-line-strong text-accent">
                          <Icon size={18} aria-hidden />
                        </span>
                        <span className="label tabular-nums">0{i + 1}</span>
                      </div>
                      <h3 className="mt-4 text-xl font-medium tracking-[-0.03em] md:mt-[2.6svh] md:text-[clamp(1.2rem,2.8svh,1.5rem)]">
                        {g.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-fg-2 max-md:short:hidden lg:max-xl:hidden lg:short:hidden">
                        {g.summary}
                      </p>
                      <ul className="mt-auto flex flex-wrap gap-1.5 pt-4 md:pt-[2.6svh]">
                        {g.items.map((item) => (
                          <li
                            key={item}
                            className="rounded-full bg-white/[0.05] px-3 py-1 font-mono text-[11px] text-fg-2"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
