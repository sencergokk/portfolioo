/**
 * Point-cloud generators for the particle scene.
 *
 * Every shape emits exactly `count` points so the vertex shader can morph between
 * them by index. All shapes are normalised to ~1 world unit tall and centred on the origin;
 * the scene director scales/positions the group at runtime.
 *
 * Generation is deterministic (seeded PRNG) so the scene looks identical on every load.
 */

export type Rng = () => number;

/** mulberry32 — tiny, fast, good-enough seeded PRNG. */
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

function gauss(rng: Rng) {
  // Box–Muller
  const u = Math.max(rng(), 1e-7);
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

type RGB = readonly [number, number, number];

const IVORY: RGB = [0.97, 0.93, 0.86];
const GOLD: RGB = [0.91, 0.7, 0.4];
const BRONZE: RGB = [0.45, 0.3, 0.16];
const EMBER: RGB = [1.0, 0.45, 0.25];

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
const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

export type ShapeBuffers = {
  count: number;
  position: Float32Array; // required by three for bounding volumes; mirrors `portrait`
  portrait: Float32Array;
  phone: Float32Array;
  galaxy: Float32Array;
  scatter: Float32Array;
  rnd: Float32Array; // vec4
  cPortrait: Float32Array;
  cPhone: Float32Array;
  cGalaxy: Float32Array;
  sizes: Float32Array; // vec3: size per shape
};

/* -------------------------------------------------------------------------- */
/* Portrait                                                                    */
/* -------------------------------------------------------------------------- */

/** Stretch the photo's tonal range and lift mid-tones (the source is a low-key selfie). */
const levels = (v: number) => Math.pow(Math.min(1, Math.max(0, (v - 0.04) / 0.82)), 0.8);

/**
 * Importance-samples the pre-processed portrait map.
 * Channels: R = luminance, G = subject mask, B = edge strength (see README / assets pipeline).
 */
function samplePortrait(map: ImageData, count: number, rng: Rng, out: ShapeBuffers) {
  const { width: W, height: H, data } = map;
  const weights = new Float64Array(W * H);
  let total = 0;
  for (let y = 0; y < H; y++) {
    const v = y / (H - 1);
    // Dissolve the cropped shoulders into nothing instead of a hard bottom edge.
    const bottomFade = 1 - smooth(0.78, 1.0, v);
    for (let x = 0; x < W; x++) {
      const u = x / (W - 1);
      const sideFade = smooth(0.0, 0.14, u) * smooth(1.0, 0.86, u);
      const i = (y * W + x) * 4;
      const lum = levels(data[i] / 255);
      const mask = data[i + 1] / 255;
      const edge = data[i + 2] / 255;
      // Dark features (hair, beard) keep a base density so the silhouette survives;
      // edges are boosted so eyes, brows and the beard line stay legible.
      const w = Math.pow(mask, 1.5) * (0.11 + 0.85 * Math.pow(lum, 1.25) + 1.25 * edge) * bottomFade * sideFade;
      total += w;
      weights[y * W + x] = total;
    }
  }

  for (let p = 0; p < count; p++) {
    const target = rng() * total;
    // binary search over the running sum
    let lo = 0;
    let hi = weights.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (weights[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    const px = lo % W;
    const py = (lo / W) | 0;
    const i = lo * 4;
    const lum = levels(data[i] / 255);
    const edge = data[i + 2] / 255;

    const x = (px + rng()) / W - 0.5;
    const y = 0.5 - (py + rng()) / H;
    // Cheap bas-relief: a dome centred on the face + a touch of luminance depth.
    const dx = (x - 0.01) / 0.3;
    const dy = (y - 0.07) / 0.38;
    const dome = Math.max(0, 1 - dx * dx - dy * dy);
    const z = 0.14 * dome + (lum - 0.5) * 0.05 + (rng() - 0.5) * 0.012;

    out.portrait.set([x, y, z], p * 3);

    const base = lum < 0.45 ? mix(scale(BRONZE, 0.7), GOLD, lum / 0.45) : mix(GOLD, IVORY, (lum - 0.45) / 0.55);
    const intensity = 0.38 + 0.6 * lum + 0.25 * edge;
    out.cPortrait.set(scale(base, intensity), p * 3);
    out.sizes[p * 3] = 0.75 + 0.85 * lum + 0.35 * rng();
  }
}

/* -------------------------------------------------------------------------- */
/* Phone                                                                       */
/* -------------------------------------------------------------------------- */

function roundedRectPoint(t: number, w: number, h: number, r: number): [number, number] {
  // t in [0, 1) along the perimeter, clockwise from the top-left straight edge.
  const sx = w - 2 * r;
  const sy = h - 2 * r;
  const arc = (Math.PI * r) / 2;
  const L = 2 * sx + 2 * sy + 4 * arc;
  let d = t * L;
  const hw = w / 2;
  const hh = h / 2;
  const corner = (cx: number, cy: number, a0: number, dd: number): [number, number] => {
    const a = a0 - dd / r;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  };
  if (d < sx) return [-hw + r + d, hh];
  d -= sx;
  if (d < arc) return corner(hw - r, hh - r, Math.PI / 2, d);
  d -= arc;
  if (d < sy) return [hw, hh - r - d];
  d -= sy;
  if (d < arc) return corner(hw - r, -hh + r, 0, d);
  d -= arc;
  if (d < sx) return [hw - r - d, -hh];
  d -= sx;
  if (d < arc) return corner(-hw + r, -hh + r, -Math.PI / 2, d);
  d -= arc;
  if (d < sy) return [-hw, -hh + r + d];
  d -= sy;
  return corner(-hw + r, hh - r, Math.PI, d);
}

/** Uniform point inside a squircle (|x|^4 + |y|^4 <= 1) of the given half-size. */
function squirclePoint(rng: Rng, half: number): [number, number] {
  for (;;) {
    const x = rng() * 2 - 1;
    const y = rng() * 2 - 1;
    if (x ** 4 + y ** 4 <= 1) return [x * half, y * half];
  }
}

// Home-screen tiles use the accent colours of the apps shown on the page.
const TILE_COLORS: RGB[] = ["#3f9b52", "#4f7cff", "#f59e0b", "#a855f7", "#fb923c", "#facc15", "#14b8a6", "#ec4899"].map(
  hex,
);

function buildPhone(count: number, rng: Rng, out: ShapeBuffers) {
  const W = 0.49;
  const H = 1.0;
  const R = 0.078;

  const cols = [-0.15, -0.05, 0.05, 0.15];
  const rows = [0.315, 0.19, 0.065, -0.06, -0.185];
  const icons: Array<[number, number]> = [];
  for (const y of rows) for (const x of cols) icons.push([x, y]);
  const dock: Array<[number, number]> = cols.map((x) => [x, -0.385] as [number, number]);

  for (let p = 0; p < count; p++) {
    const r = rng();
    let x = 0;
    let y = 0;
    let z = 0.004 + (rng() - 0.5) * 0.006;
    let c: RGB = IVORY;
    let size = 0.9;

    if (r < 0.22) {
      // outer frame, front and back edge for thickness
      [x, y] = roundedRectPoint(rng(), W, H, R);
      x += gauss(rng) * 0.0022;
      y += gauss(rng) * 0.0022;
      z = (rng() < 0.5 ? 1 : -1) * 0.02 + (rng() - 0.5) * 0.01;
      c = scale(IVORY, 0.85);
      size = 1.05;
    } else if (r < 0.28) {
      // screen edge
      [x, y] = roundedRectPoint(rng(), W - 0.03, H - 0.03, R - 0.014);
      c = scale(GOLD, 0.45);
      size = 0.7;
    } else if (r < 0.31) {
      // dynamic island
      [x, y] = squirclePoint(rng, 1);
      x = x * 0.055;
      y = 0.452 + y * 0.013;
      c = scale(IVORY, 0.55);
      size = 0.8;
    } else if (r < 0.74) {
      const i = Math.floor(rng() * icons.length);
      const [cx, cy] = icons[i];
      const [ox, oy] = squirclePoint(rng, 0.037);
      x = cx + ox;
      y = cy + oy;
      c = scale(mix(TILE_COLORS[i % TILE_COLORS.length], IVORY, 0.15 + rng() * 0.2), 0.7);
      size = 0.85;
    } else if (r < 0.78) {
      // dock plate outline
      [x, y] = roundedRectPoint(rng(), 0.43, 0.1, 0.045);
      y += -0.385;
      c = scale(IVORY, 0.35);
      size = 0.7;
    } else if (r < 0.88) {
      const i = Math.floor(rng() * dock.length);
      const [cx, cy] = dock[i];
      const [ox, oy] = squirclePoint(rng, 0.035);
      x = cx + ox;
      y = cy + oy;
      c = scale(mix(GOLD, IVORY, rng() * 0.4), 0.75);
      size = 0.85;
    } else if (r < 0.9) {
      // page indicator dots
      const k = Math.floor(rng() * 3);
      x = -0.018 + k * 0.018 + gauss(rng) * 0.002;
      y = -0.29 + gauss(rng) * 0.002;
      c = scale(IVORY, k === 0 ? 0.9 : 0.4);
      size = 0.9;
    } else {
      // faint screen glow
      x = (rng() - 0.5) * (W - 0.05);
      y = (rng() - 0.5) * (H - 0.05);
      c = scale(GOLD, 0.18);
      size = 0.55;
    }

    out.phone.set([x, y, z], p * 3);
    out.cPhone.set(c, p * 3);
    out.sizes[p * 3 + 1] = size * (0.8 + rng() * 0.4);
  }
}

/* -------------------------------------------------------------------------- */
/* Galaxy (flat in XZ; tilt + differential rotation happen in the shader)      */
/* -------------------------------------------------------------------------- */

function buildGalaxy(count: number, rng: Rng, out: ShapeBuffers) {
  const arms = 3;
  for (let p = 0; p < count; p++) {
    let x: number;
    let y: number;
    let z: number;
    let rad: number;
    if (rng() < 0.14) {
      // bulge
      rad = Math.abs(gauss(rng)) * 0.07;
      const th = rng() * Math.PI * 2;
      const ph = Math.acos(2 * rng() - 1);
      x = rad * Math.sin(ph) * Math.cos(th);
      y = rad * Math.cos(ph) * 0.6;
      z = rad * Math.sin(ph) * Math.sin(th);
    } else {
      rad = 0.04 + Math.pow(rng(), 1.5) * 0.8;
      const arm = Math.floor(rng() * arms);
      const angle = (arm / arms) * Math.PI * 2 + rad * 4.8;
      // cubic falloff keeps most stars tight to the arm, a few drift between arms
      const spread = () => Math.pow(rng(), 3) * (rng() < 0.5 ? -1 : 1) * 0.16 * (0.35 + rad);
      x = Math.cos(angle) * rad + spread();
      z = Math.sin(angle) * rad + spread();
      y = spread() * 0.35;
    }
    out.galaxy.set([x, y, z], p * 3);

    const t = Math.min(1, rad / 0.8);
    let c = t < 0.35 ? mix(IVORY, GOLD, t / 0.35) : mix(GOLD, EMBER, (t - 0.35) / 0.65);
    c = scale(c, 0.95 - t * 0.5);
    out.cGalaxy.set(c, p * 3);
    out.sizes[p * 3 + 2] = (1.25 - t * 0.6) * (0.75 + rng() * 0.5);
  }
}

/* -------------------------------------------------------------------------- */

export function buildShapes(count: number, portraitMap: ImageData, seed = 7): ShapeBuffers {
  const rng = createRng(seed);
  const out: ShapeBuffers = {
    count,
    position: new Float32Array(count * 3),
    portrait: new Float32Array(count * 3),
    phone: new Float32Array(count * 3),
    galaxy: new Float32Array(count * 3),
    scatter: new Float32Array(count * 3),
    rnd: new Float32Array(count * 4),
    cPortrait: new Float32Array(count * 3),
    cPhone: new Float32Array(count * 3),
    cGalaxy: new Float32Array(count * 3),
    sizes: new Float32Array(count * 3),
  };

  samplePortrait(portraitMap, count, rng, out);
  buildPhone(count, rng, out);
  buildGalaxy(count, rng, out);

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
  out.position.set(out.portrait);
  return out;
}

export async function loadImageData(src: string): Promise<ImageData> {
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("2D canvas unavailable");
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
