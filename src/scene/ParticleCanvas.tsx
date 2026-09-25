"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { SceneDirector, type SceneState } from "./director";
import { fragmentShader, vertexShader } from "./shaders";
import { loadShapes } from "./loadShapes";
import type { ShapeBuffers } from "./shapes";

const PORTRAIT_MAP = "/scene/portrait-map.png";
const BG = "#070708";
const MAX_DPR = 1.5;

/**
 * Quality ladder walked down (never up) when frames run long: first resolution, then the
 * number of particles drawn. Shapes are stored in random order, so drawing a prefix of the
 * buffer is an unbiased subsample — the silhouette stays intact, it just gets sparser.
 */
const QUALITY = [
  { dpr: MAX_DPR, budget: 1 },
  { dpr: 1.25, budget: 0.8 },
  { dpr: 1, budget: 0.62 },
  { dpr: 1, budget: 0.45 },
] as const;
const SLOW_FRAME = 1 / 45; // seconds
const WINDOW = 90; // frames per measurement window

type Pointer = { x: number; y: number; last: number };

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

function Particles({ shapes, reducedMotion }: { shapes: ShapeBuffers; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const director = useRef<SceneDirector | null>(null);
  const pointer = useRef<Pointer>({ x: 0, y: 0, last: -Infinity });
  const smoothed = useRef({
    morph: 0,
    x: 0,
    y: 0,
    scale: 0,
    alpha: 0,
    px: 0,
    py: 0,
    mx: 0,
    my: 0,
    scrollVel: 0,
    lastScroll: 0,
    primed: false,
  });
  const target = useRef<SceneState>({ morph: 0, x: 0, y: 0, scale: 1, alpha: 1 });
  const perf = useRef({ level: 0, frames: 0, total: 0, slowWindows: 0, elapsed: 0 });
  const cleared = useRef(false);
  const setDpr = useThree((s) => s.setDpr);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(shapes.position, 3));
    g.setAttribute("aPortrait", new THREE.BufferAttribute(shapes.portrait, 3));
    g.setAttribute("aPhone", new THREE.BufferAttribute(shapes.phone, 3));
    g.setAttribute("aScatter", new THREE.BufferAttribute(shapes.scatter, 3));
    g.setAttribute("aRnd", new THREE.BufferAttribute(shapes.rnd, 4));
    g.setAttribute("cPortrait", new THREE.BufferAttribute(shapes.cPortrait, 3));
    g.setAttribute("cPhone", new THREE.BufferAttribute(shapes.cPhone, 3));
    g.setAttribute("aSizes", new THREE.BufferAttribute(shapes.sizes, 2));
    g.setAttribute("aKind", new THREE.BufferAttribute(shapes.kind, 1));
    g.setAttribute("aMeta", new THREE.BufferAttribute(shapes.meta, 4));
    g.setAttribute("aNormal", new THREE.BufferAttribute(shapes.normal, 3));
    // Positions are computed in the shader, so the static bounds are meaningless — never cull.
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10);
    return g;
  }, [shapes]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uIntro: { value: reducedMotion ? 1 : 0 },
      uSize: { value: 10 },
      uPixelRatio: { value: 1 },
      uAlpha: { value: 1 },
      uMouse: { value: new THREE.Vector3(9, 9, 0) },
      uMouseStrength: { value: 0 },
      uScrollVel: { value: 0 },
    }),
    [reducedMotion],
  );

  useEffect(() => {
    const d = new SceneDirector();
    director.current = d;
    const measure = () => d.measure();
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);

    const onMove = (e: PointerEvent) => {
      const p = pointer.current;
      p.x = (e.clientX / window.innerWidth) * 2 - 1;
      p.y = -((e.clientY / window.innerHeight) * 2 - 1);
      p.last = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  useFrame((state, delta) => {
    const m = material.current;
    const g = group.current;
    const pts = points.current;
    const d = director.current;
    if (!m || !g || !pts || !d) return;
    const dt = Math.min(delta, 1 / 20);
    const u = m.uniforms;
    const s = smoothed.current;
    const scrollY = window.scrollY;
    const t = d.sample(scrollY, target.current);
    const { width: vw, height: vh, dpr } = state.viewport;
    const damp = THREE.MathUtils.damp;

    if (!s.primed) {
      Object.assign(s, t, { primed: true, lastScroll: scrollY });
    }
    s.morph = damp(s.morph, t.morph, 2.6, dt);
    s.x = damp(s.x, t.x, 2.4, dt);
    s.y = damp(s.y, t.y, 2.4, dt);
    s.scale = damp(s.scale, t.scale, 2.4, dt);
    s.alpha = damp(s.alpha, t.alpha, 3, dt);

    // scroll speed (px/s) → 0..1, used to loosen the particles a touch while moving
    const speed = Math.abs(scrollY - s.lastScroll) / Math.max(delta, 1e-3);
    s.lastScroll = scrollY;
    s.scrollVel = damp(s.scrollVel, reducedMotion ? 0 : Math.min(1, speed / 2500), 3, dt);

    const p = pointer.current;
    const pointerActive = !reducedMotion && performance.now() - p.last < 2200;
    s.px = damp(s.px, pointerActive ? p.x : 0, 2.5, dt);
    s.py = damp(s.py, pointerActive ? p.y : 0, 2.5, dt);
    // the "touch" point glides after the cursor instead of snapping to it
    s.mx = damp(s.mx, p.x, 9, dt);
    s.my = damp(s.my, p.y, 9, dt);

    const time = u.uTime.value as number;
    // 0 = portrait, 1 = phone: the phone floats and slowly turns so its titanium frame catches the light
    const phone = smoothstep(0.55, 1, s.morph);
    const idle = reducedMotion ? 0 : 1;
    g.position.set(s.x * vw, s.y * vh + Math.sin(time * 0.8) * 0.012 * vh * phone * idle, 0);
    const k = s.scale * vh;
    g.scale.setScalar(k);
    g.rotation.y =
      s.px * (0.22 + 0.16 * phone) +
      idle * (Math.sin(time * 0.17) * 0.07 * (1 - phone) + Math.sin(time * 0.42) * 0.34 * phone);
    g.rotation.x = -s.py * 0.1 + idle * Math.sin(time * 0.31) * 0.06 * phone;
    g.rotation.z = idle * Math.sin(time * 0.23) * 0.025 * phone;

    // cursor in the group's local space (rotation ignored — small angles)
    (u.uMouse.value as THREE.Vector3).set(
      ((s.mx * vw) / 2 - g.position.x) / k,
      ((s.my * vh) / 2 - g.position.y) / k,
      0,
    );
    u.uMouseStrength.value = damp(u.uMouseStrength.value as number, pointerActive ? 1 : 0, 4, dt);

    if (!reducedMotion) {
      u.uTime.value = time + dt;
      u.uIntro.value = Math.min(1, (u.uIntro.value as number) + dt / 2.8);
    }
    u.uMorph.value = s.morph;
    u.uAlpha.value = s.alpha;
    u.uScrollVel.value = s.scrollVel;
    u.uPixelRatio.value = dpr;
    // keep apparent point size stable across screen sizes
    u.uSize.value = 11 * (state.size.height / 900) * (state.size.width < 768 ? 0.85 : 1);

    // Adaptive quality: after the intro, measure windows of frames and step down on sustained slowness.
    const pf = perf.current;
    pf.elapsed += delta;
    if (pf.elapsed > 3 && pf.level < QUALITY.length - 1 && delta < 0.25) {
      pf.frames++;
      pf.total += delta;
      if (pf.frames === WINDOW) {
        pf.slowWindows = pf.total / WINDOW > SLOW_FRAME ? pf.slowWindows + 1 : 0;
        pf.frames = 0;
        pf.total = 0;
        if (pf.slowWindows >= 2) {
          pf.slowWindows = 0;
          pf.level++;
          setDpr(Math.min(window.devicePixelRatio || 1, QUALITY[pf.level].dpr));
        }
      }
    }

    // When the scene is a dim backdrop behind content, draw fewer particles; nobody can tell.
    const dim = 0.45 + 0.55 * smoothstep(0.12, 0.6, s.alpha);
    pts.geometry.setDrawRange(0, Math.floor(shapes.count * QUALITY[pf.level].budget * dim));

    // Fully faded out (the lower sections): clear once, then stop drawing so the GPU idles.
    if (s.alpha < 0.004 && t.alpha === 0) {
      if (cleared.current) return;
      cleared.current = true;
    } else {
      cleared.current = false;
    }
    state.gl.render(state.scene, state.camera);
  }, 1);

  return (
    <group ref={group}>
      <points ref={points} geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function ParticleCanvas({ reducedMotion, onReady }: { reducedMotion: boolean; onReady?: () => void }) {
  const [shapes, setShapes] = useState<ShapeBuffers | null>(null);

  useEffect(() => {
    let cancelled = false;
    const small = window.matchMedia("(max-width: 767px)").matches;
    const weak = (navigator.hardwareConcurrency ?? 8) <= 4;
    const count = small || weak ? 14000 : 30000;
    loadShapes(PORTRAIT_MAP, count)
      .then((result) => {
        if (!cancelled) setShapes(result);
      })
      .catch((err) => console.warn("[scene] particle shapes failed to load", err));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Canvas
      dpr={[1, MAX_DPR]}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance", stencil: false }}
      camera={{ position: [0, 0, 5], fov: 35, near: 0.1, far: 50 }}
      onCreated={({ gl }) => gl.setClearColor(BG, 1)}
      style={{ position: "absolute", inset: 0 }}
    >
      {shapes && <Particles shapes={shapes} reducedMotion={reducedMotion} />}
      {shapes && onReady && <ReadySignal onReady={onReady} />}
    </Canvas>
  );
}

/** Fires once after the first frame containing particles has rendered. */
function ReadySignal({ onReady }: { onReady: () => void }) {
  const fired = useRef(false);
  useFrame(() => {
    if (fired.current) return;
    fired.current = true;
    requestAnimationFrame(onReady);
  });
  return null;
}
