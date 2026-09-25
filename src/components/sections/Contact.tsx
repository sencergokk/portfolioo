import { ArrowUp, ArrowUpRight, FileText } from "lucide-react";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { AppleIcon, GitHubIcon, LinkedInIcon, XIcon } from "@/components/ui/icons";
import { LocalTime } from "@/components/ui/LocalTime";
import { Magnetic, Reveal, SplitText } from "@/components/ui/motion";
import { Section } from "@/components/ui/Section";
import { SectionLabel, serifGold } from "@/components/ui/SectionHeading";
import { site, socials } from "@/content/site";

const links = [
  { ...socials.linkedin, Icon: LinkedInIcon },
  { ...socials.github, Icon: GitHubIcon },
  { ...socials.x, Icon: XIcon },
  { ...socials.appStore, Icon: AppleIcon },
];

export function Contact() {
  const year = new Date().getFullYear();
  return (
    <Section id="iletisim">
      <div className="container-page flex flex-1 flex-col justify-center pt-[max(5.25rem,11svh)] pb-[3svh]">
        <Reveal>
          <SectionLabel index="06">İletişim</SectionLabel>
        </Reveal>
        <SplitText
          as="h2"
          className="mt-4 max-w-6xl text-[min(11.5vw,6.6svh)] leading-[0.98] font-medium tracking-[-0.055em] md:mt-[3.5svh] md:text-[clamp(3rem,min(8.2vw,12svh),8.5rem)]"
          segments={[{ text: "Bir sonraki" }, { text: "ürünü", className: serifGold }, { text: "birlikte yapalım." }]}
        />
        <Reveal delay={0.2}>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-pretty text-fg-2 md:mt-[3.5svh] md:text-[clamp(1rem,2.2svh,1.15rem)]">
            Yeni bir iOS uygulaması, bir Next.js arayüzü ya da henüz sadece bir fikir. Yazın, genellikle 24 saat içinde
            dönüş yaparım.
          </p>
        </Reveal>

        <Reveal delay={0.3} className="mt-6 flex items-center gap-3 md:mt-[5svh] md:gap-6">
          <a
            href={`mailto:${site.email}`}
            className="group relative min-w-0 font-serif text-[min(6.6vw,3.6svh)] leading-tight tracking-[-0.02em] text-fg md:text-[clamp(1.6rem,min(4vw,6svh),3.4rem)]"
          >
            <span className="block truncate">{site.email}</span>
            <span
              aria-hidden
              className="absolute -bottom-1 left-0 h-px w-full origin-left bg-accent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-right group-hover:scale-x-0"
            />
          </a>
          <CopyEmail email={site.email} className="shrink-0" />
        </Reveal>

        <Reveal delay={0.4} className="mt-6 flex flex-wrap items-center gap-2.5 md:mt-[5svh] md:gap-3">
          {links.map(({ href, label, handle, Icon }) => (
            <Magnetic key={label} strength={0.2}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label}: ${handle}`}
                className="glass group inline-flex h-11 items-center gap-3 rounded-full px-3 text-sm text-fg-2 transition-colors hover:text-fg md:h-12 md:pr-4 md:pl-2"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full md:h-8 md:w-8 md:bg-white/[0.06]">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="hidden md:inline">
                  {label}
                  <span className="text-fg-3"> · {handle}</span>
                </span>
                <ArrowUpRight
                  size={14}
                  className="hidden text-fg-3 transition-transform group-hover:rotate-45 md:block"
                  aria-hidden
                />
              </a>
            </Magnetic>
          ))}
          <Magnetic strength={0.2}>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-bg transition-colors hover:bg-accent-soft md:h-12"
            >
              <FileText size={16} /> Özgeçmiş
            </a>
          </Magnetic>
        </Reveal>
      </div>

      <footer className="container-page border-t border-line py-4 md:py-[2.6svh]">
        <div className="flex items-center justify-between gap-4 text-xs text-fg-3 md:text-sm">
          <p>
            © {year} {site.name}
            <span className="hidden md:inline">. Next.js ve Three.js ile Ankara&apos;da tasarlandı ve kodlandı.</span>
          </p>
          <div className="flex items-center gap-4 md:gap-6">
            <span className="tabular-nums">
              Ankara <LocalTime timeZone={site.timeZone} className="text-fg-2" />
            </span>
            <a
              href="#top"
              className="group inline-flex items-center gap-2 text-fg-2 hover:text-fg"
              aria-label="Başa dön"
            >
              <span className="hidden md:inline">Başa dön</span>
              <span className="grid h-8 w-8 place-items-center rounded-full border border-line-strong transition-transform duration-500 group-hover:-translate-y-1">
                <ArrowUp size={14} />
              </span>
            </a>
          </div>
        </div>
      </footer>
    </Section>
  );
}
