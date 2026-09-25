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
 * iOS-style squircle tile. Uses the real app icon when available, otherwise a
 * gradient + glyph rendition in the app's accent colours.
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
  const radius = Math.round(size * 0.235);
  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center overflow-hidden", className)}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: `linear-gradient(145deg, ${accent.from}, ${accent.to})`,
        boxShadow: `inset 0 1px 0 rgb(255 255 255 / 0.25), inset 0 -8px 16px rgb(0 0 0 / 0.18), 0 10px 30px -12px ${accent.from}`,
      }}
    >
      {icon ? (
        <Image src={icon} alt={alt} width={size * 2} height={size * 2} className="h-full w-full object-cover" />
      ) : (
        <Icon
          aria-hidden
          className="text-white drop-shadow-[0_1px_2px_rgb(0_0_0/0.25)]"
          size={Math.round(size * 0.46)}
          strokeWidth={1.9}
        />
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ borderRadius: radius, boxShadow: "inset 0 0 0 1px rgb(255 255 255 / 0.12)" }}
      />
    </span>
  );
}
