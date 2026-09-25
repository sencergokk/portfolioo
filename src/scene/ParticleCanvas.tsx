"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { SceneDirector, type SceneState } from "./director";
import { fragmentShader, vertexShader } from "./shaders";
import { buildShapes, loadImageData, type ShapeBuffers } from "./shapes";

const PORTRAIT_MAP = "/scene/portrait-map.png";
const BG = "#070708";

type Pointer = { x: number; y: number; last: number };

function Particles({ shapes, reducedMotion }: { shapes: ShapeBuffers; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const director = useRef<SceneDirector | null>(null);
  const pointer = useRef<Pointer>({ x: 0, y: 0, last: -Infinity });
  const smoothed = useRef({ morph: 0, x: 0, y: 0, scale: 0, alpha: 0, px: 0, py: 0, primed: false });
  const target = useRef<SceneState>({ morph: 0, x: 0, y: 0, scale: 1, alpha: 1 });
  const perf = useRef({ frames: 0, total: 0, downgraded: false });
  const setDpr = useThree((s) => s.setDpr);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(shapes.position, 3));
    g.setAttribute("aPortrait", new THREE.BufferAttribute(shapes.portrait, 3));
    g.setAttribute("aPhone", new THREE.BufferAttribute(shapes.phone, 3));
    g.setAttribute("aGalaxy", new THREE.BufferAttribute(shapes.galaxy, 3));
    g.setAttribute("aScatter", new THREE.BufferAttribute(shapes.scatter, 3));
    g.setAttribute("aRnd", new THREE.BufferAttribute(shapes.rnd, 4));
    g.setAttribute("cPortrait", new THREE.BufferAttribute(shapes.cPortrait, 3));
    g.setAttribute("cPhone", new THREE.BufferAttribute(shapes.cPhone, 3));
    g.setAttribute("cGalaxy", new THREE.BufferAttribute(shapes.cGalaxy, 3));
    g.setAttribute("aSizes", new THREE.BufferAttribute(shapes.sizes, 3));
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
      uTilt: { value: 0.95 },
      uMouse: { value: new THREE.Vector3(9, 9, 0) },
      uMouseStrength: { value: 0 },
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
    const d = director.current;
    if (!m || !g || !d) return;
    const dt = Math.min(delta, 1 / 20);
    const u = m.uniforms;
    const s = smoothed.current;
    const t = d.sample(window.scrollY, target.current);
    const { width: vw, height: vh, dpr } = state.viewport;

    if (!s.primed) {
      Object.assign(s, t, { primed: true });
    }
    const damp = THREE.MathUtils.damp;
    s.morph = damp(s.morph, t.morph, 2.6, dt);
    s.x = damp(s.x, t.x, 2.4, dt);
    s.y = damp(s.y, t.y, 2.4, dt);
    s.scale = damp(s.scale, t.scale, 2.4, dt);
    s.alpha = damp(s.alpha, t.alpha, 3, dt);

    const p = pointer.current;
    const pointerActive = !reducedMotion && performance.now() - p.last < 2200;
    s.px = damp(s.px, pointerActive ? p.x : 0, 2.5, dt);
    s.py = damp(s.py, pointerActive ? p.y : 0, 2.5, dt);

    g.position.set(s.x * vw, s.y * vh, 0);
    const k = s.scale * vh;
    g.scale.setScalar(k);
    const time = u.uTime.value as number;
    g.rotation.y = s.px * 0.22 + (reducedMotion ? 0 : Math.sin(time * 0.17) * 0.07);
    g.rotation.x = -s.py * 0.1;

    // cursor in the group's local space (rotation ignored — small angles)
    (u.uMouse.value as THREE.Vector3).set(((p.x * vw) / 2 - g.position.x) / k, ((p.y * vh) / 2 - g.position.y) / k, 0);
    u.uMouseStrength.value = damp(u.uMouseStrength.value as number, pointerActive ? 1 : 0, 4, dt);

    if (!reducedMotion) {
      u.uTime.value = time + dt;
      u.uIntro.value = Math.min(1, (u.uIntro.value as number) + dt / 2.8);
    }
    u.uMorph.value = s.morph;
    u.uAlpha.value = s.alpha;
    u.uPixelRatio.value = dpr;
    // keep apparent point size stable across screen sizes
    u.uSize.value = 11 * (state.size.height / 900) * (state.size.width < 768 ? 0.85 : 1);

    // one-shot adaptive quality: drop DPR if the first ~2s run slow
    const pf = perf.current;
    if (!pf.downgraded && pf.frames < 120) {
      pf.frames++;
      pf.total += delta;
      if (pf.frames === 120 && pf.total / pf.frames > 1 / 40) {
        pf.downgraded = true;
        setDpr(1);
      }
    }
  });

  return (
    <group ref={group}>
      <points geometry={geometry} frustumCulled={false}>
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
    const count = small || weak ? 14000 : 28000;
    loadImageData(PORTRAIT_MAP)
      .then((map) => {
        if (!cancelled) setShapes(buildShapes(count, map));
      })
      .catch((err) => console.warn("[scene] portrait map failed to load", err));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Canvas
      dpr={[1, 1.75]}
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
