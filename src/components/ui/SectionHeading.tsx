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

export function SectionHeading({
  index,
  label,
  title,
  description,
  className,
}: {
  index: string;
  label: string;
  title: Segment[];
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-4xl", className)}>
      <Reveal>
        <SectionLabel index={index}>{label}</SectionLabel>
      </Reveal>
      <SplitText
        as="h2"
        segments={title}
        className="mt-6 text-[clamp(2.6rem,6.2vw,5.75rem)] leading-[0.98] font-medium tracking-[-0.045em] text-balance"
      />
      {description && (
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-fg-2 md:text-xl">{description}</p>
        </Reveal>
      )}
    </div>
  );
}

/** Upright display-serif accent used inside headings. */
export const serif = "font-serif font-normal tracking-[-0.025em]";
export const serifGold = `${serif} text-gold`;
