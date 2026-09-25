import { ArrowUp, ArrowUpRight, FileText } from "lucide-react";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { AppleIcon, GitHubIcon, LinkedInIcon, XIcon } from "@/components/ui/icons";
import { LocalTime } from "@/components/ui/LocalTime";
import { Magnetic, Reveal, SplitText } from "@/components/ui/motion";
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
    <section id="iletisim" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-28 md:pt-36">
      <div data-scene="contact" aria-hidden className="absolute top-[45%] left-0 h-px w-px" />

      <div className="container-page relative flex flex-1 flex-col justify-center">
        <Reveal>
          <SectionLabel index="05">İletişim</SectionLabel>
        </Reveal>
        <SplitText
          as="h2"
          className="mt-8 max-w-6xl text-[clamp(3rem,9vw,8.75rem)] leading-[0.92] font-medium tracking-[-0.055em]"
          segments={[{ text: "Bir sonraki" }, { text: "ürünü", className: serifGold }, { text: "birlikte yapalım." }]}
        />
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-pretty text-fg-2">
            Yeni bir iOS uygulaması, gerçek zamanlı bir Next.js arayüzü ya da henüz sadece bir fikir — yazın, genellikle
            24 saat içinde dönüş yaparım.
          </p>
        </Reveal>

        <Reveal delay={0.3} className="mt-12 flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
          <a
            href={`mailto:${site.email}`}
            className="group relative w-fit font-serif text-[clamp(1.75rem,4.4vw,3.75rem)] leading-none text-fg italic"
          >
            {site.email}
            <span
              aria-hidden
              className="absolute -bottom-2 left-0 h-px w-full origin-left bg-accent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-0 group-hover:origin-right"
            />
          </a>
          <CopyEmail email={site.email} className="w-fit" />
        </Reveal>

        <Reveal delay={0.4} className="mt-12 flex flex-wrap gap-3">
          {links.map(({ href, label, handle, Icon }) => (
            <Magnetic key={label} strength={0.2}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass group inline-flex h-12 items-center gap-3 rounded-full pr-4 pl-2 text-sm text-fg-2 transition-colors hover:text-fg"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white/[0.06]">
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  {label}
                  <span className="hidden text-fg-3 sm:inline"> · {handle}</span>
                </span>
                <ArrowUpRight size={14} className="text-fg-3 transition-transform group-hover:rotate-45" aria-hidden />
              </a>
            </Magnetic>
          ))}
          <Magnetic strength={0.2}>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-bg transition-colors hover:bg-accent-soft"
            >
              <FileText size={16} /> Özgeçmişi indir
            </a>
          </Magnetic>
        </Reveal>
      </div>

      <footer className="container-page relative mt-24 border-t border-line py-8">
        <div className="flex flex-col gap-6 text-sm text-fg-3 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.name}. Next.js ve Three.js ile Ankara&apos;da tasarlandı ve kodlandı.
          </p>
          <div className="flex items-center gap-6">
            <span className="tabular-nums">
              Ankara · <LocalTime timeZone={site.timeZone} className="text-fg-2" />
            </span>
            <a href="#top" className="group inline-flex items-center gap-2 text-fg-2 hover:text-fg">
              Başa dön
              <span className="grid h-8 w-8 place-items-center rounded-full border border-line-strong transition-transform duration-500 group-hover:-translate-y-1">
                <ArrowUp size={14} />
              </span>
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
}
