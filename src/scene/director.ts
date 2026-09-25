/**
 * Scroll-driven "director" for the particle scene.
 *
 * Sections declare anchor points in the DOM with `data-scene="<key>"`. When an anchor sits in
 * the vertical centre of the viewport the scene fully matches that key's state; between two
 * anchors the state is interpolated. This keeps choreography declarative and layout-driven,
 * so moving a section in the page never requires touching WebGL code.
 */

export type SceneState = {
  /** 0 = portrait, 1 = phone, 2 = galaxy (fractions blend). */
  morph: number;
  /** Horizontal offset as a fraction of viewport width (0 = centre). */
  x: number;
  /** Vertical offset as a fraction of viewport height (0 = centre, + = up). */
  y: number;
  /** Shape height as a fraction of viewport height. */
  scale: number;
  /** Overall brightness multiplier. */
  alpha: number;
};

export type SceneKey = "hero" | "about" | "apps" | "apps-rest" | "experience" | "contact";

const DESKTOP: Record<SceneKey, SceneState> = {
  hero: { morph: 0, x: 0.2, y: -0.04, scale: 0.9, alpha: 1 },
  about: { morph: 0.5, x: -0.18, y: 0, scale: 1.05, alpha: 0.22 },
  apps: { morph: 1, x: 0.24, y: -0.02, scale: 0.8, alpha: 1 },
  "apps-rest": { morph: 1, x: 0.3, y: 0, scale: 0.75, alpha: 0.16 },
  experience: { morph: 1.5, x: 0.15, y: 0, scale: 1.1, alpha: 0.2 },
  contact: { morph: 2, x: 0.26, y: 0.04, scale: 1.05, alpha: 1 },
};

const MOBILE: Record<SceneKey, SceneState> = {
  hero: { morph: 0, x: 0, y: 0.235, scale: 0.47, alpha: 1 },
  about: { morph: 0.5, x: 0, y: 0, scale: 0.8, alpha: 0.25 },
  apps: { morph: 1, x: 0.18, y: 0.1, scale: 0.55, alpha: 0.5 },
  "apps-rest": { morph: 1, x: 0.2, y: 0, scale: 0.55, alpha: 0.12 },
  experience: { morph: 1.5, x: 0, y: 0, scale: 0.8, alpha: 0.15 },
  contact: { morph: 2, x: 0.1, y: -0.22, scale: 0.75, alpha: 0.6 },
};

type Anchor = { key: SceneKey; scroll: number };

const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

export class SceneDirector {
  private anchors: Anchor[] = [];
  private mobile = false;

  measure() {
    const vh = window.innerHeight;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);
    this.mobile = window.matchMedia("(max-width: 767px)").matches;
    const nodes = document.querySelectorAll<HTMLElement>("[data-scene]");
    const anchors: Anchor[] = [];
    nodes.forEach((node) => {
      const key = node.dataset.scene as SceneKey;
      if (!(key in DESKTOP)) return;
      const top = node.getBoundingClientRect().top + window.scrollY;
      anchors.push({ key, scroll: Math.min(maxScroll, Math.max(0, top - vh / 2)) });
    });
    anchors.sort((a, b) => a.scroll - b.scroll);
    this.anchors = anchors;
  }

  /** Writes the interpolated state for `scrollY` into `out` (no allocations per frame). */
  sample(scrollY: number, out: SceneState) {
    const table = this.mobile ? MOBILE : DESKTOP;
    const a = this.anchors;
    if (a.length === 0) {
      Object.assign(out, table.hero);
      return out;
    }
    if (scrollY <= a[0].scroll) return Object.assign(out, table[a[0].key]);
    const last = a[a.length - 1];
    if (scrollY >= last.scroll) return Object.assign(out, table[last.key]);

    let i = 0;
    while (i < a.length - 2 && scrollY > a[i + 1].scroll) i++;
    const from = table[a[i].key];
    const to = table[a[i + 1].key];
    const span = a[i + 1].scroll - a[i].scroll || 1;
    const t = smootherstep(Math.min(1, Math.max(0, (scrollY - a[i].scroll) / span)));
    out.morph = from.morph + (to.morph - from.morph) * t;
    out.x = from.x + (to.x - from.x) * t;
    out.y = from.y + (to.y - from.y) * t;
    out.scale = from.scale + (to.scale - from.scale) * t;
    out.alpha = from.alpha + (to.alpha - from.alpha) * t;
    return out;
  }
}
