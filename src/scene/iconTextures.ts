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
  type IconNode,
} from "lucide";
import * as THREE from "three";
import type { CatalogApp, GlyphKey } from "@/content/apps";

/** Same glyph mapping as `components/ui/AppGlyph.tsx`, as raw nodes we can draw on a canvas. */
const GLYPHS: Record<GlyphKey, IconNode> = {
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

const SIZE = 256;

/**
 * Paints an app icon (accent gradient, soft top light, white lucide glyph) straight onto a 2D
 * canvas. Drawing with Path2D instead of rasterising an SVG keeps the canvas untainted, which
 * WebGL requires for uploads on every browser.
 */
function paintGlyph(app: CatalogApp) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const bg = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  bg.addColorStop(0, app.accent.from);
  bg.addColorStop(1, app.accent.to);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SIZE, SIZE);

  const light = ctx.createRadialGradient(SIZE * 0.3, SIZE * 0.1, 0, SIZE * 0.3, SIZE * 0.1, SIZE * 0.95);
  light.addColorStop(0, "rgba(255,255,255,0.28)");
  light.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // lucide glyphs live in a 24 unit box; draw them at ~46% of the tile like AppGlyph does
  const glyph = SIZE * 0.46;
  ctx.save();
  ctx.translate((SIZE - glyph) / 2, (SIZE - glyph) / 2);
  ctx.scale(glyph / 24, glyph / 24);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.9;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowColor = "rgba(0,0,0,0.25)";
  ctx.shadowOffsetY = 2;
  ctx.shadowBlur = 4;
  for (const [tag, attrs] of GLYPHS[app.glyph]) {
    if (tag === "path") {
      ctx.stroke(new Path2D(String(attrs.d)));
    } else if (tag === "circle") {
      ctx.beginPath();
      ctx.arc(Number(attrs.cx), Number(attrs.cy), Number(attrs.r), 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.restore();
  return canvas;
}

/** Glyph icons are painted synchronously; apps with a real icon paint it over once it loads. */
export function createIconTexture(app: CatalogApp): THREE.Texture {
  const canvas = paintGlyph(app);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  if (app.icon) {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      // same canvas, same size: the GPU texture is updated in place instead of reallocated
      canvas.getContext("2d")?.drawImage(img, 0, 0, SIZE, SIZE);
      texture.needsUpdate = true;
    };
    img.src = app.icon;
  }
  return texture;
}
