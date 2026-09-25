import { Code2, Layers, Server, Smartphone, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/motion";
import { SectionHeading, serifGold } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { marquee, stackGroups } from "@/content/stack";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = { mobil: Smartphone, web: Code2, backend: Server, arac: Layers };

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const words = [...marquee, ...marquee];
  return (
    <div className="marquee-mask flex overflow-hidden" aria-hidden>
      <div
        className={cn(
          "flex shrink-0 animate-marquee items-center gap-10 pr-10 md:gap-16 md:pr-16",
          reverse && "[animation-direction:reverse]",
        )}
      >
        {words.map((w, i) => (
          <span key={`${w}-${i}`} className="flex items-center gap-10 md:gap-16">
            <span
              className={cn(
                "text-[clamp(3rem,9vw,8.5rem)] leading-none whitespace-nowrap",
                i % 2
                  ? "font-serif text-fg-2 italic"
                  : "font-medium tracking-[-0.05em] text-transparent [-webkit-text-stroke:1px_rgb(243_239_231/0.3)]",
              )}
            >
              {w}
            </span>
            <span className="text-2xl text-accent md:text-4xl">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Stack() {
  return (
    <section id="yetkinlikler" className="relative py-28 md:py-40">
      <div className="container-page">
        <SectionHeading
          index="04"
          label="Yetkinlikler"
          title={[{ text: "Doğru iş için" }, { text: "doğru araç.", className: serifGold }]}
          description="Native iOS'tan gerçek zamanlı web arayüzlerine, Spring Boot servislerinden BaaS altyapılarına kadar ürünü tek elden taşıyabildiğim bir yelpaze."
        />
      </div>

      <div className="mt-16 space-y-4 md:mt-24 md:space-y-6">
        <MarqueeRow />
        <MarqueeRow reverse />
      </div>

      <div className="container-page mt-16 grid gap-4 sm:grid-cols-2 md:mt-24 lg:grid-cols-4">
        {stackGroups.map((g, i) => {
          const Icon = ICONS[g.id] ?? Layers;
          return (
            <Reveal key={g.id} delay={i * 0.07}>
              <SpotlightCard className="flex h-full flex-col rounded-3xl border border-line bg-bg-2/85 p-6 backdrop-blur-md md:p-7">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl border border-line-strong text-accent">
                    <Icon size={20} aria-hidden />
                  </span>
                  <span className="label tabular-nums">0{i + 1}</span>
                </div>
                <h3 className="mt-8 text-2xl font-medium tracking-[-0.03em]">{g.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-fg-2">{g.summary}</p>
                <ul className="mt-auto flex flex-wrap gap-1.5 pt-8">
                  {g.items.map((item) => (
                    <li key={item} className="rounded-full bg-white/[0.05] px-3 py-1 font-mono text-[11px] text-fg-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
