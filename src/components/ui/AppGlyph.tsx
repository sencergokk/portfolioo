import {
  BookOpen,
  Car,
  ChefHat,
  Droplets,
  GraduationCap,
  Languages,
  Library,
  Moon,
  Pill,
  Scissors,
  ShieldCheck,
  Sparkles,
  Sun,
  Trophy,
  Waves,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";
import type { Accent, GlyphKey } from "@/content/apps";
import { cn } from "@/lib/utils";

const GLYPHS: Record<GlyphKey, LucideIcon> = {
  pitch: Trophy,
  shield: ShieldCheck,
  book: BookOpen,
  sparkles: Sparkles,
  chef: ChefHat,
  sun: Sun,
  car: Car,
  pill: Pill,
  droplets: Droplets,
  waves: Waves,
  moon: Moon,
  scissors: Scissors,
  languages: Languages,
  graduation: GraduationCap,
  library: Library,
};

/**
 * iOS-style squircle tile. Uses the real app icon when available, otherwise a gradient +
 * glyph rendition in the app's accent colours. Size comes from the `--g` custom property,
 * so breakpoints can override it with a class such as `md:[--g:44px]`.
 */
export function AppGlyph({
  glyph,
  accent,
  icon,
  size = 48,
  className,
  alt = "",
}: {
  glyph: GlyphKey;
  accent: Accent;
  icon?: string;
  size?: number;
  className?: string;
  alt?: string;
}) {
  const Icon = GLYPHS[glyph];
  return (
    <span
      className={cn(
        "relative inline-flex size-(--g) shrink-0 items-center justify-center overflow-hidden rounded-[23.5%]",
        className,
      )}
      style={
        {
          "--g": `${size}px`,
          background: `linear-gradient(145deg, ${accent.from}, ${accent.to})`,
          boxShadow: `inset 0 1px 0 rgb(255 255 255 / 0.25), inset 0 -8px 16px rgb(0 0 0 / 0.18), 0 10px 30px -12px ${accent.from}`,
        } as CSSProperties
      }
    >
      {icon ? (
        <Image src={icon} alt={alt} width={128} height={128} sizes="112px" className="h-full w-full object-cover" />
      ) : (
        <Icon aria-hidden className="size-[46%] text-white drop-shadow-[0_1px_2px_rgb(0_0_0/0.25)]" strokeWidth={1.9} />
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.12)]"
      />
    </span>
  );
}
