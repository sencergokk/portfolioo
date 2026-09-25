/**
 * Point-cloud generators for the particle scene: the hero "app orbit" and the phone.
 *
 * Every shape emits exactly `count` points so the vertex shader can morph between them by
 * index. Shapes are normalised to ~1 world unit tall and centred on the origin; the scene
 * director scales and positions the group at runtime.
 *
 * Generation is deterministic (seeded PRNG) so the scene looks identical on every load.
 */

import { RINGS } from "./orbit";

export type Rng = () => number;

/** mulberry32: tiny, fast, good-enough seeded PRNG. */
export function createRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type RGB = readonly [number, number, number];

const IVORY: RGB = [0.97, 0.93, 0.86];
const GOLD: RGB = [0.91, 0.7, 0.4];
const TITANIUM: RGB = [0.78, 0.77, 0.75];

const mix = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];
const scale = (c: RGB, k: number): RGB => [c[0] * k, c[1] * k, c[2] * k];
const hex = (h: string): RGB => {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

/** Phone part ids, read by the vertex shader (`aKind`) to animate and light each part. */
export const KIND = {
  frame: 0,
  rim: 1,
  button: 2,
  island: 3,
  status: 4,
  widget: 5,
  widgetText: 6,
  chart: 7,
  icon: 8,
  label: 9,
  dots: 10,
  dock: 11,
  dockIcon: 12,
  homeBar: 13,
  wallpaper: 14,
} as const;

export type ShapeBuffers = {
  count: number;
  position: Float32Array; // required by three for bounds; mirrors the hero xyz
  hero: Float32Array; // vec4: flat ring position (xyz) + ring id (0 = core/dust, 1 = inner, 2 = outer)
  phone: Float32Array;
  scatter: Float32Array;
  rnd: Float32Array; // vec4
  cHero: Float32Array;
  cPhone: Float32Array;
  sizes: Float32Array; // vec2: hero, phone
  kind: Float32Array; // float
  meta: Float32Array; // vec4: per-part animation data (e.g. icon centre)
  normal: Float32Array; // vec3: phone surface normal for lighting
};

/* -------------------------------------------------------------------------- */
/* Hero: two tilted orbit rings, a glowing core and a little star dust         */
/* -------------------------------------------------------------------------- */

function gauss(rng: Rng) {
  const u = Math.max(rng(), 1e-7);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
}

function buildOrbit(count: number, rng: Rng, out: ShapeBuffers) {
  for (let p = 0; p < count; p++) {
    const r = rng();
    let pos: [number, number, number, number];
    let c: RGB;
    let size: number;
    if (r < 0.7) {
      // rings are stored flat (XZ); the shader spins, tilts and rolls them
      const ring = r < 0.29 ? 0 : 1;
      const { radius } = RINGS[ring];
      const a = rng() * Math.PI * 2;
      const rr = radius + gauss(rng) * 0.011;
      pos = [Math.cos(a) * rr, gauss(rng) * 0.0045, Math.sin(a) * rr, ring + 1];
      c = scale(mix(GOLD, IVORY, rng() * 0.55), 0.5 + rng() * 0.25);
      size = 0.85 + rng() * 0.3;
    } else if (r < 0.8) {
      // core: a small, bright sun at the centre of the orbits
      const rad = Math.abs(gauss(rng)) * 0.042;
      const th = rng() * Math.PI * 2;
      const ph = Math.acos(2 * rng() - 1);
      pos = [rad * Math.sin(ph) * Math.cos(th), rad * Math.cos(ph), rad * Math.sin(ph) * Math.sin(th), 0];
      c = scale(mix(IVORY, GOLD, rad / 0.09), 1.1 - rad * 5);
      size = 1.2 + rng() * 0.6;
    } else {
      // dust: a sparse, faint shell around everything
      const rad = 0.35 + rng() * 0.75;
      const th = rng() * Math.PI * 2;
      const ph = Math.acos(2 * rng() - 1);
      pos = [rad * Math.sin(ph) * Math.cos(th), rad * Math.cos(ph) * 0.6, rad * Math.sin(ph) * Math.sin(th), 0];
      c = scale(mix(GOLD, IVORY, rng()), 0.16 + rng() * 0.14);
      size = 0.6 + rng() * 0.4;
    }
    out.hero.set(pos, p * 4);
    out.position.set([pos[0], pos[1], pos[2]], p * 3);
    out.cHero.set(c, p * 3);
    out.sizes[p * 2] = size;
  }
}

/* -------------------------------------------------------------------------- */
/* Phone: an iPhone 15 Pro-proportioned home screen, ~1 unit tall             */
/* -------------------------------------------------------------------------- */

const W = 0.482; // body width (146.6 x 70.6 mm)
const R = 0.08; // body corner radius
const D = 0.056; // body thickness
const BEZEL = 0.0125;
const SW = W - 2 * BEZEL;
const SH = 1 - 2 * BEZEL;
const SR = 0.068;
const Z_GLASS = D / 2 + 0.002;

const COLS = [-0.1455, -0.0485, 0.0485, 0.1455];
const ROWS = [0.172, 0.068, -0.036, -0.14];
const ICON_HALF = 0.0335;
const DOCK_Y = -0.372;

// Home-screen icons use the accent gradients of the apps on the page.
const ICONS: Array<[string, string]> = [
  ["#3f9b52", "#e8b86b"],
  ["#f59e0b", "#ef4444"],
  ["#4f7cff", "#9b8cff"],
  ["#22c55e", "#0ea5e9"],
  ["#a855f7", "#f472b6"],
  ["#fb923c", "#f43f5e"],
  ["#facc15", "#fb923c"],
  ["#6366f1", "#312e81"],
  ["#14b8a6", "#22c55e"],
  ["#22d3ee", "#3b82f6"],
  ["#38bdf8", "#6366f1"],
  ["#f97316", "#dc2626"],
  ["#ec4899", "#f59e0b"],
  ["#0ea5e9", "#8b5cf6"],
  ["#eab308", "#b45309"],
  ["#1a8cff", "#5ac8fa"],
];
const DOCK_ICONS: Array<[string, string]> = [
  ["#34c759", "#248a3d"],
  ["#5ac8fa", "#1a8cff"],
  ["#f5f5f7", "#c7c7cc"],
  ["#ff9f0a", "#ff375f"],
];

/** Point on a rounded rectangle's perimeter (t in [0,1)) plus its outward normal. */
function roundedRect(t: number, w: number, h: number, r: number): [number, number, number, number] {
  const sx = w - 2 * r;
  const sy = h - 2 * r;
  const arc = (Math.PI * r) / 2;
  let d = t * (2 * sx + 2 * sy + 4 * arc);
  const hw = w / 2;
  const hh = h / 2;
  const corner = (cx: number, cy: number, a0: number, dd: number): [number, number, number, number] => {
    const a = a0 - dd / r;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r, Math.cos(a), Math.sin(a)];
  };
  if (d < sx) return [-hw + r + d, hh, 0, 1];
  d -= sx;
  if (d < arc) return corner(hw - r, hh - r, Math.PI / 2, d);
  d -= arc;
  if (d < sy) return [hw, hh - r - d, 1, 0];
  d -= sy;
  if (d < arc) return corner(hw - r, -hh + r, 0, d);
  d -= arc;
  if (d < sx) return [hw - r - d, -hh, 0, -1];
  d -= sx;
  if (d < arc) return corner(-hw + r, -hh + r, -Math.PI / 2, d);
  d -= arc;
  if (d < sy) return [-hw, -hh + r + d, -1, 0];
  d -= sy;
  return corner(-hw + r, hh - r, Math.PI, d);
}

/** Uniform point inside a rounded rectangle. */
function insideRoundedRect(rng: Rng, w: number, h: number, r: number): [number, number] {
  for (;;) {
    const x = (rng() - 0.5) * w;
    const y = (rng() - 0.5) * h;
    const qx = Math.abs(x) - (w / 2 - r);
    const qy = Math.abs(y) - (h / 2 - r);
    if (qx <= 0 || qy <= 0 || qx * qx + qy * qy <= r * r) return [x, y];
  }
}

/** iOS icon squircle (|x|^5 + |y|^5 <= 1): interior point, or a point on its outline. */
function squircle(rng: Rng, half: number, outline: boolean): [number, number] {
  if (outline) {
    const a = rng() * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    return [Math.sign(c) * Math.pow(Math.abs(c), 0.4) * half, Math.sign(s) * Math.pow(Math.abs(s), 0.4) * half];
  }
  for (;;) {
    const x = rng() * 2 - 1;
    const y = rng() * 2 - 1;
    if (Math.abs(x) ** 5 + Math.abs(y) ** 5 <= 1) return [x * half, y * half];
  }
}

// 5x7 dot-matrix glyphs for the status-bar clock and the widget number.
const GLYPHS: Record<string, string[]> = {
  "1": ["..#..", ".##..", "..#..", "..#..", "..#..", "..#..", ".###."],
  "4": ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."],
  "5": ["#####", "#....", "####.", "....#", "....#", "#...#", ".###."],
  "9": [".###.", "#...#", "#...#", ".####", "....#", "...#.", ".##.."],
  ":": [".....", ".....", "..#..", ".....", "..#..", ".....", "....."],
};

function textCells(text: string, x0: number, yTop: number, h: number): Array<[number, number, number]> {
  const cell = h / 7;
  const cells: Array<[number, number, number]> = [];
  let x = x0;
  for (const ch of text) {
    GLYPHS[ch].forEach((row, r) =>
      [...row].forEach((c, k) => {
        if (c === "#") cells.push([x + (k + 0.5) * cell, yTop - (r + 0.5) * cell, cell]);
      }),
    );
    x += cell * (ch === ":" ? 4 : 6);
  }
  return cells;
}

const CLOCK = textCells("9:41", -0.19, 0.461, 0.017);
const WIDGET_NUMBER = textCells("15", -0.172, 0.378, 0.066);

type Part = keyof typeof KIND | "back" | "bezel" | "screenEdge" | "glyph";

/** Share of the phone's point budget per part (cumulative thresholds). */
const PARTS: Array<[number, Part]> = [
  [0.14, "frame"],
  [0.165, "rim"],
  [0.18, "back"],
  [0.2, "bezel"],
  [0.215, "screenEdge"],
  [0.227, "button"],
  [0.252, "island"],
  [0.272, "status"],
  [0.305, "widget"],
  [0.322, "widgetText"],
  [0.345, "chart"],
  [0.61, "icon"],
  [0.645, "glyph"],
  [0.672, "label"],
  [0.678, "dots"],
  [0.715, "dock"],
  [0.8, "dockIcon"],
  [0.81, "homeBar"],
  [1, "wallpaper"],
];

function buildPhone(count: number, rng: Rng, out: ShapeBuffers) {
  for (let p = 0; p < count; p++) {
    // Random (not index-based) part choice keeps any prefix of the buffer an unbiased
    // sample, which the adaptive draw range relies on.
    const r = rng();
    const part = PARTS.find(([limit]) => r < limit)![1];

    let x = 0;
    let y = 0;
    let z = Z_GLASS;
    let n: [number, number, number] = [0, 0, 1];
    let c: RGB = IVORY;
    let size = 0.9;
    let kind: number = KIND.wallpaper;
    let meta: [number, number, number, number] = [0, 0, 0, 0];

    switch (part) {
      case "frame": {
        // titanium band with a rounded cross-section: the normal tilts toward ±z near the edges
        const [px, py, nx, ny] = roundedRect(rng(), W, 1, R);
        const zn = rng() * 2 - 1;
        const bulge = 0.0045 * (1 - zn * zn);
        x = px + nx * bulge;
        y = py + ny * bulge;
        z = (zn * D) / 2;
        const len = Math.hypot(nx, ny, zn * 0.9);
        n = [nx / len, ny / len, (zn * 0.9) / len];
        c = scale(TITANIUM, 0.9);
        size = 1.0;
        kind = KIND.frame;
        break;
      }
      case "rim":
      case "back": {
        const [px, py, nx, ny] = roundedRect(rng(), W - 0.003, 0.997, R - 0.0015);
        const front = part === "rim";
        x = px;
        y = py;
        z = front ? D / 2 : -D / 2;
        n = [nx * 0.6, ny * 0.6, front ? 0.8 : -0.8];
        c = scale(TITANIUM, front ? 0.95 : 0.55);
        kind = KIND.frame;
        break;
      }
      case "bezel": {
        const k = 0.002 + rng() * (BEZEL - 0.002);
        [x, y] = roundedRect(rng(), W - 2 * k, 1 - 2 * k, R - k);
        z = D / 2 + 0.001;
        c = [0.1, 0.1, 0.11];
        size = 0.7;
        kind = KIND.rim;
        break;
      }
      case "screenEdge": {
        [x, y] = roundedRect(rng(), SW, SH, SR);
        c = scale(GOLD, 0.28);
        size = 0.65;
        kind = KIND.rim;
        break;
      }
      case "button": {
        // action button and volume rocker on the left, side button on the right
        const b = rng();
        const side = b < 0.62 ? -1 : 1;
        const [y0, y1] = b < 0.14 ? [0.285, 0.315] : b < 0.38 ? [0.2, 0.25] : b < 0.62 ? [0.13, 0.18] : [0.15, 0.25];
        x = side * (W / 2 + 0.004 + rng() * 0.003);
        y = y0 + rng() * (y1 - y0);
        z = (rng() * 2 - 1) * 0.011;
        n = [side, 0, 0];
        c = scale(TITANIUM, 0.8);
        kind = KIND.button;
        break;
      }
      case "island": {
        // Dynamic Island: outline + fill; the fill only lights up while the live activity is open
        const fill = rng() < 0.55;
        const hw = 0.056;
        const hh = 0.016;
        if (fill) {
          [x, y] = insideRoundedRect(rng, hw * 2, hh * 2, hh);
          c = x < -hw * 0.45 ? [0.25, 0.85, 0.45] : scale(GOLD, 0.9);
        } else {
          [x, y] = roundedRect(rng(), hw * 2, hh * 2, hh);
          c = [0.32, 0.32, 0.36];
        }
        y += 0.452;
        z = Z_GLASS + 0.001;
        meta = [0, 0.452, fill ? 1 : 0, 0];
        kind = KIND.island;
        break;
      }
      case "status": {
        const s = rng();
        if (s < 0.6) {
          const [cx, cy, cell] = CLOCK[Math.floor(rng() * CLOCK.length)];
          x = cx + (rng() - 0.5) * cell * 0.85;
          y = cy + (rng() - 0.5) * cell * 0.85;
        } else if (s < 0.78) {
          const bar = Math.floor(rng() * 4);
          const bh = 0.004 + bar * 0.0028;
          x = 0.112 + bar * 0.0065 + (rng() - 0.5) * 0.003;
          y = 0.4535 + (rng() - 0.5) * bh;
        } else {
          const inside = rng() < 0.45;
          const [bx, by] = roundedRect(rng(), 0.03, 0.013, 0.004);
          x = 0.172 + (inside ? (rng() - 0.6) * 0.022 : bx);
          y = 0.4535 + (inside ? (rng() - 0.5) * 0.007 : by);
        }
        c = scale(IVORY, 0.95);
        size = 0.75;
        kind = KIND.status;
        break;
      }
      case "widget": {
        const edge = rng() < 0.3;
        [x, y] = edge ? roundedRect(rng(), 0.39, 0.172, 0.034) : insideRoundedRect(rng, 0.39, 0.172, 0.034);
        y += 0.318;
        c = edge ? [0.42, 0.4, 0.46] : [0.17, 0.16, 0.2];
        size = edge ? 0.75 : 0.8;
        kind = KIND.widget;
        break;
      }
      case "widgetText": {
        const [cx, cy, cell] = WIDGET_NUMBER[Math.floor(rng() * WIDGET_NUMBER.length)];
        x = cx + (rng() - 0.5) * cell * 0.9;
        y = cy + (rng() - 0.5) * cell * 0.9;
        c = scale(IVORY, 1.05);
        size = 0.95;
        kind = KIND.widgetText;
        break;
      }
      case "chart": {
        // rising sparkline; the shader keeps it moving
        const u = rng();
        x = -0.03 + u * 0.2;
        y = 0.268 + u * 0.075;
        meta = [u, y, 0.009, 0];
        c = mix(GOLD, IVORY, u * 0.6);
        size = 1.0;
        kind = KIND.chart;
        break;
      }
      case "icon":
      case "glyph": {
        const i = Math.floor(rng() * ICONS.length);
        const cx = COLS[i % 4];
        const cy = ROWS[Math.floor(i / 4)];
        if (part === "glyph") {
          // a simple white pictogram in the middle of each icon
          const g = i % 4;
          const a = rng() * Math.PI * 2;
          if (g === 0) [x, y] = [Math.cos(a) * 0.013, Math.sin(a) * 0.013];
          else if (g === 1) [x, y] = [Math.cos(a) * 0.009 * Math.sqrt(rng()), Math.sin(a) * 0.009 * Math.sqrt(rng())];
          else if (g === 2) [x, y] = [(rng() - 0.5) * 0.03, (Math.floor(rng() * 3) - 1) * 0.008];
          else {
            const s = rng();
            [x, y] = [(rng() - 0.5) * 0.026 * (1 - s), -0.011 + s * 0.022];
          }
          c = scale(IVORY, 1.1);
          size = 0.75;
        } else {
          const outline = rng() < 0.22;
          [x, y] = squircle(rng, ICON_HALF, outline);
          const [from, to] = ICONS[i];
          const v = 0.5 - y / (2 * ICON_HALF); // 0 top, 1 bottom
          const highlight = x < 0 && y > ICON_HALF * 0.35 ? 0.25 : 0;
          c = scale(mix(mix(hex(from), hex(to), v), IVORY, highlight), outline ? 1.25 : 1.02);
          size = 0.95;
        }
        x += cx;
        y += cy;
        z = Z_GLASS + 0.002;
        meta = [cx, cy, i / ICONS.length, 0];
        kind = KIND.icon;
        break;
      }
      case "label": {
        const i = Math.floor(rng() * ICONS.length);
        const len = 0.028 + ((i * 7) % 5) * 0.004;
        x = COLS[i % 4] + (rng() - 0.5) * len;
        y = ROWS[Math.floor(i / 4)] - 0.048 + (rng() - 0.5) * 0.003;
        c = scale(IVORY, 0.4);
        size = 0.6;
        kind = KIND.label;
        break;
      }
      case "dots": {
        const k = Math.floor(rng() * 3);
        const a = rng() * Math.PI * 2;
        const rr = Math.sqrt(rng()) * 0.0035;
        x = (k - 1) * 0.015 + Math.cos(a) * rr;
        y = -0.232 + Math.sin(a) * rr;
        c = scale(IVORY, k === 0 ? 1 : 0.35);
        size = 0.8;
        kind = KIND.dots;
        break;
      }
      case "dock": {
        const edge = rng() < 0.25;
        [x, y] = edge ? roundedRect(rng(), 0.43, 0.098, 0.045) : insideRoundedRect(rng, 0.43, 0.098, 0.045);
        y += DOCK_Y;
        c = edge ? [0.44, 0.43, 0.48] : [0.18, 0.18, 0.21];
        size = 0.8;
        kind = KIND.dock;
        break;
      }
      case "dockIcon": {
        const i = Math.floor(rng() * 4);
        const outline = rng() < 0.22;
        [x, y] = squircle(rng, ICON_HALF, outline);
        const v = 0.5 - y / (2 * ICON_HALF);
        const [from, to] = DOCK_ICONS[i];
        c = scale(mix(hex(from), hex(to), v), outline ? 1.2 : 1.0);
        x += COLS[i];
        y += DOCK_Y;
        z = Z_GLASS + 0.002;
        meta = [COLS[i], DOCK_Y, i / 4, 0];
        size = 0.95;
        kind = KIND.dockIcon;
        break;
      }
      case "homeBar": {
        x = (rng() - 0.5) * 0.13;
        y = -0.468 + (rng() - 0.5) * 0.004;
        c = scale(IVORY, 0.95);
        size = 0.8;
        kind = KIND.homeBar;
        break;
      }
      default: {
        // wallpaper: a deep aurora gradient behind everything
        [x, y] = insideRoundedRect(rng, SW, SH, SR);
        const v = 0.5 - y;
        const band = Math.exp(-(((x * 0.9 + y * 0.6 + 0.05) / 0.16) ** 2));
        const top: RGB = [0.18, 0.1, 0.34];
        const mid: RGB = [0.62, 0.34, 0.14];
        const low: RGB = [0.16, 0.08, 0.06];
        const base = v < 0.55 ? mix(top, mid, v / 0.55) : mix(mid, low, (v - 0.55) / 0.45);
        c = scale(mix(base, GOLD, band * 0.5), 0.46 + band * 0.42);
        size = 0.7;
        z = Z_GLASS - 0.002;
        meta = [x, y, 0, 0];
        kind = KIND.wallpaper;
      }
    }

    out.phone.set([x, y, z], p * 3);
    out.cPhone.set(c, p * 3);
    out.normal.set(n, p * 3);
    out.meta.set(meta, p * 4);
    out.kind[p] = kind;
    out.sizes[p * 2 + 1] = size * (0.85 + rng() * 0.3);
  }
}

/* -------------------------------------------------------------------------- */

export function buildShapes(count: number, seed = 7): ShapeBuffers {
  const rng = createRng(seed);
  const out: ShapeBuffers = {
    count,
    position: new Float32Array(count * 3),
    hero: new Float32Array(count * 4),
    phone: new Float32Array(count * 3),
    scatter: new Float32Array(count * 3),
    rnd: new Float32Array(count * 4),
    cHero: new Float32Array(count * 3),
    cPhone: new Float32Array(count * 3),
    sizes: new Float32Array(count * 2),
    kind: new Float32Array(count),
    meta: new Float32Array(count * 4),
    normal: new Float32Array(count * 3),
  };

  buildOrbit(count, rng, out);
  buildPhone(count, rng, out);

  for (let p = 0; p < count; p++) {
    // intro: particles rush in from a wide, deep shell
    const th = rng() * Math.PI * 2;
    const ph = Math.acos(2 * rng() - 1);
    const r = 1.4 + rng() * 1.8;
    out.scatter.set(
      [r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph) * 0.7, r * Math.sin(ph) * Math.sin(th) - 0.6],
      p * 3,
    );
    out.rnd.set([rng(), rng(), rng(), rng()], p * 4);
  }
  return out;
}
