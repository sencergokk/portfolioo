import Image from "next/image";
import { Counter, Reveal, SplitText } from "@/components/ui/motion";
import { Section } from "@/components/ui/Section";
import { SectionLabel, serifGold } from "@/components/ui/SectionHeading";
import { about } from "@/content/about";
import { site } from "@/content/site";

export function About() {
  return (
    <Section id="hakkimda" scene="about">
      <div className="container-page section-y grid flex-1 content-center items-center gap-5 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12 lg:gap-16">
        {/* Portrait: a full square on phones, a tall card on larger screens */}
        <Reveal>
          <figure className="relative mx-auto aspect-square w-[min(100%,40svh)] overflow-hidden rounded-3xl border border-line bg-bg-2 short:w-[min(100%,32svh)] md:aspect-[4/5] md:max-h-[74svh] md:w-full md:rounded-[28px] md:short:w-full">
            <div
              aria-hidden
              className="absolute inset-[-20%] bg-[radial-gradient(45%_40%_at_55%_38%,rgb(232_184_107/0.35),transparent_70%),radial-gradient(35%_30%_at_30%_80%,rgb(255_138_76/0.14),transparent_70%)]"
            />
            <div
              aria-hidden
              className="absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)] [background-image:linear-gradient(var(--color-line-strong)_1px,transparent_1px),linear-gradient(90deg,var(--color-line-strong)_1px,transparent_1px)] [background-size:44px_44px] opacity-[0.18]"
            />
            <Image
              src={site.photo.cutout}
              alt={site.photo.alt}
              fill
              sizes="(min-width: 768px) 40vw, 92vw"
              className="object-cover md:object-bottom"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(200deg,rgb(232_184_107/0.28),transparent_45%)] mix-blend-soft-light"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg-2 via-bg-2/60 to-transparent"
            />
            <figcaption className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-4 md:inset-x-5 md:bottom-5">
              <p className="font-serif text-xl leading-tight tracking-[-0.02em] md:text-3xl">{site.name}</p>
              <p className="label text-right">Ankara</p>
            </figcaption>
          </figure>
        </Reveal>

        <div>
          <Reveal>
            <SectionLabel index="01">Hakkımda</SectionLabel>
          </Reveal>
          <SplitText
            as="h2"
            className="mt-3 text-[min(6.8vw,3.7svh)] leading-[1.12] font-medium tracking-[-0.035em] text-balance md:mt-[3svh] md:text-[clamp(1.8rem,min(3.3vw,5.4svh),3.4rem)]"
            stagger={0.02}
            segments={about.headline.map((h) => ({ text: h.text, className: "em" in h ? serifGold : undefined }))}
          />
          <Reveal>
            <p className="mt-3 text-[15px] leading-relaxed text-pretty text-fg-2 short:text-sm md:mt-[3svh] md:text-[clamp(1rem,2.1svh,1.15rem)]">
              {about.bio}
            </p>
          </Reveal>

          <dl className="mt-5 grid grid-cols-4 gap-px overflow-hidden rounded-2xl border border-line bg-line md:mt-[4svh] md:rounded-3xl">
            {about.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06} className="bg-bg-2 p-3 md:p-[clamp(1rem,2.6svh,1.75rem)]">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <Counter
                    value={s.value}
                    suffix={s.suffix}
                    className="block text-[1.55rem] leading-none font-medium tracking-[-0.05em] tabular-nums md:text-[clamp(2rem,5svh,3.5rem)]"
                  />
                  <span className="mt-2 block text-[10.5px] leading-tight text-fg-3 md:text-sm">{s.label}</span>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
