import { Award, GraduationCap } from "lucide-react";
import { Reveal } from "@/components/ui/motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading, serifGold } from "@/components/ui/SectionHeading";
import { certificates, education, experience } from "@/content/experience";

export function Experience() {
  return (
    <Section id="deneyim">
      <div className="container-page section-y flex flex-1 flex-col justify-center">
        <SectionHeading
          index="04"
          label="Deneyim"
          title={[{ text: "Kurumsal servislerden" }, { text: "cebinizdeki ekrana.", className: serifGold }]}
        />

        {/* Phones and tablets: a swipeable row of cards. Desktop: three columns. */}
        <ol className="no-scrollbar -mx-5 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 md:-mx-10 md:mt-[5svh] md:px-10 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-4 lg:overflow-visible lg:px-0">
          {experience.map((role, i) => (
            <Reveal
              as="li"
              key={`${role.title}-${role.period}`}
              delay={i * 0.06}
              className="flex w-[84%] shrink-0 snap-start flex-col rounded-3xl border border-line bg-bg-2/95 p-5 md:w-[46%] md:p-[clamp(1.25rem,3.2svh,1.9rem)] lg:w-auto"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="label tabular-nums">{role.period}</span>
                {role.current && (
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium tracking-wider text-accent uppercase">
                    Şu an
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-xl font-medium tracking-[-0.03em] md:mt-[2svh] md:text-[clamp(1.25rem,2.9svh,1.65rem)]">
                {role.title}
              </h3>
              <p className="mt-1 text-sm text-fg-3">{role.org}</p>
              <p className="mt-3 text-sm leading-relaxed text-pretty text-fg-2 md:mt-[1.8svh] md:text-[clamp(0.875rem,1.9svh,0.95rem)]">
                {role.summary}
              </p>
              {role.highlights && (
                <ul className="mt-[1.8svh] hidden space-y-1.5 lg:xtall:block">
                  {role.highlights.map((h) => (
                    <li key={h} className="flex gap-2.5 text-[13px] leading-snug text-fg-2">
                      <span aria-hidden className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {h}
                    </li>
                  ))}
                </ul>
              )}
              <ul className="mt-auto flex flex-wrap gap-1.5 pt-4 md:pt-[2.4svh]" aria-label="Teknolojiler">
                {role.tags.map((t) => (
                  <li key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-fg-2">
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-5 grid gap-3 text-sm text-fg-3 md:mt-[4svh] md:grid-cols-2 md:gap-6">
          <p className="flex items-start gap-3">
            <GraduationCap size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden />
            <span>
              <span className="text-fg-2">{education.school}</span>, {education.degree}. {education.period}
              <span className="hidden md:inline">. {education.notes.join(", ")}.</span>
            </span>
          </p>
          <p className="flex items-start gap-3 max-md:hidden">
            <Award size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden />
            <span>
              <span className="text-fg-2">Sertifikalar:</span> {certificates.map((c) => c.name).join(", ")}
            </span>
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
