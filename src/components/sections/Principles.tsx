import { Reveal } from "@/components/ui/motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading, serifGold } from "@/components/ui/SectionHeading";
import { principles } from "@/content/about";

export function Principles() {
  return (
    <Section id="yaklasim" scene="principles">
      <div className="container-page section-y flex flex-1 flex-col justify-center">
        <SectionHeading
          index="02"
          label="Yaklaşım"
          title={[{ text: "İyi ürün doğru" }, { text: "alışkanlıklarla", className: serifGold }, { text: "başlar." }]}
        />
        <ol className="mt-6 grid grid-cols-2 gap-3 md:mt-[6svh] md:grid-cols-4 md:gap-4">
          {principles.map((p, i) => (
            <Reveal
              as="li"
              key={p.title}
              delay={i * 0.06}
              className="flex flex-col rounded-2xl border border-line bg-bg-2/95 p-4 short:p-3 md:rounded-3xl md:p-[clamp(1.25rem,3.4svh,2rem)]"
            >
              <span className="font-serif text-[1.9rem] leading-none text-gold md:text-[clamp(2.4rem,6svh,3.6rem)]">
                0{i + 1}
              </span>
              <p className="mt-3 text-[15px] font-medium tracking-tight md:mt-[2.4svh] md:text-[clamp(1.05rem,2.4svh,1.3rem)]">
                {p.title}
              </p>
              <p className="mt-1.5 text-[13px] leading-snug text-fg-2 md:mt-[1.4svh] md:text-[clamp(0.9rem,1.9svh,1rem)] md:leading-relaxed">
                {p.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
