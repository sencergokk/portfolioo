"use client";

import { useLenis } from "lenis/react";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/ui/icons";
import { nav, site, socials } from "@/content/site";
import { cn, EASE_OUT_EXPO } from "@/lib/utils";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  // Active section highlight.
  useEffect(() => {
    const sections = nav.map((n) => document.getElementById(n.id)).filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Freeze page scroll behind the mobile menu; close on Escape.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis]);

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[70] h-px origin-left bg-gradient-to-r from-accent via-ember to-accent"
        style={{ scaleX: progress }}
      />
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          className={cn(
            "absolute inset-0 -z-10 transition-opacity duration-500",
            "bg-gradient-to-b from-bg/95 via-bg/70 to-transparent",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        />
        <nav aria-label="Ana menü" className="container-page flex h-[72px] items-center justify-between gap-6">
          <a href="#top" className="group flex items-center gap-3" aria-label={`${site.name} — başa dön`}>
            <span className="relative grid h-9 w-9 place-items-center rounded-full border border-line-strong bg-bg-2 font-serif text-lg text-accent transition-colors group-hover:border-accent/60">
              S
            </span>
            <span className="hidden text-sm leading-tight sm:block">
              <span className="block font-medium text-fg">{site.name}</span>
              <span className="block text-fg-3">iOS & Web</span>
            </span>
          </a>

          <ul className="glass hidden items-center gap-1 rounded-full p-1.5 md:flex">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={cn(
                    "relative isolate block rounded-full px-4 py-2 text-sm transition-colors",
                    active === item.id ? "text-bg" : "text-fg-2 hover:text-fg",
                  )}
                  aria-current={active === item.id ? "true" : undefined}
                >
                  {active === item.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-fg"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={`mailto:${site.email}`}
              className="hidden h-10 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-medium text-bg transition-[background-color,transform] hover:bg-accent-soft active:scale-[0.97] md:inline-flex"
            >
              Bana yaz <ArrowUpRight size={16} />
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="glass relative grid h-11 w-11 place-items-center rounded-full md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            >
              <span className="relative block h-3 w-5">
                <span
                  className={cn(
                    "absolute left-0 h-[1.5px] w-5 bg-fg transition-transform duration-300",
                    open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 h-[1.5px] w-5 bg-fg transition-transform duration-300",
                    open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0",
                  )}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menü"
            className="fixed inset-0 z-40 flex flex-col bg-bg/[0.98] px-5 pt-28 pb-10 md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          >
            <ul className="flex flex-col gap-1">
              {nav.map((item, i) => (
                <li key={item.id} className="overflow-hidden">
                  <motion.a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-2 text-5xl font-medium tracking-[-0.04em]"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.1 + i * 0.05 }}
                  >
                    <span className="label text-accent">0{i + 1}</span>
                    {item.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <div className="mt-auto space-y-6">
              <a href={`mailto:${site.email}`} className="block font-serif text-2xl text-fg">
                {site.email}
              </a>
              <div className="flex gap-3">
                {[
                  { ...socials.github, Icon: GitHubIcon },
                  { ...socials.linkedin, Icon: LinkedInIcon },
                  { ...socials.x, Icon: XIcon },
                ].map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass grid h-12 w-12 place-items-center rounded-full text-fg-2"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
