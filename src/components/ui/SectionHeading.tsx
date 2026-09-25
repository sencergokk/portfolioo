import { cn } from "@/lib/utils";
import { Reveal, SplitText, type Segment } from "./motion";

export function SectionLabel({ index, children, className }: { index: string; children: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="label text-accent">{index}</span>
      <span aria-hidden className="h-px w-10 bg-line-strong" />
      <span className="label">{children}</span>
    </div>
  );
}

/** Heading sizes follow the smaller of width and height, so every section fits one screen. */
export const headingSize =
  "text-[min(9.5vw,5.4svh)] leading-[1.02] font-medium tracking-[-0.045em] md:text-[clamp(2.4rem,min(5.8vw,8.6svh),5.5rem)]";

export function SectionHeading({
  index,
  label,
  title,
  description,
  descriptionClassName,
  className,
}: {
  index: string;
  label: string;
  title: Segment[];
  description?: string;
  descriptionClassName?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-4xl", className)}>
      <Reveal>
        <SectionLabel index={index}>{label}</SectionLabel>
      </Reveal>
      <SplitText as="h2" segments={title} className={cn("mt-4 text-balance md:mt-[3svh]", headingSize)} />
      {description && (
        <Reveal delay={0.15} className={descriptionClassName}>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-pretty text-fg-2 md:mt-[2.5svh] md:text-[clamp(1rem,2.2svh,1.25rem)]">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/** Upright display-serif accent used inside headings. */
export const serif = "font-serif font-normal tracking-[-0.025em]";
export const serifGold = `${serif} text-gold`;
