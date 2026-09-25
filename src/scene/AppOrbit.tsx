"use client";

import { useEffect, useImperativeHandle, useMemo, useRef, type Ref } from "react";
import * as THREE from "three";
import { catalog } from "@/content/apps";
import { createIconTexture } from "./iconTextures";
import { ICON_SIZE, RINGS, ringPoint, type RingTilt } from "./orbit";

/** Everything the icons need from the particle scene for one frame. */
export type OrbitFrame = {
  time: number;
  dt: number;
  /** Current spin angle of each ring (radians). */
  angles: readonly [number, number];
  tilts: readonly [RingTilt, RingTilt];
  /** 0..1: scene brightness times "still in the hero". */
  visibility: number;
  /** 0..1 intro progress (shared with the particles). */
  intro: number;
  /** Pointer in NDC; `active` is false when idle or on reduced motion. */
  pointer: { x: number; y: number; active: boolean };
  camera: THREE.Camera;
  reducedMotion: boolean;
};

export type OrbitHandle = {
  /** Positions every icon for this frame and returns how "caught" the orbit is (0..1, hover). */
  update(frame: OrbitFrame): number;
};

// iOS-like icon tile: a rounded square slab with a soft bevel. The cap is the texture's full
// extent, the bevel reads as a glassy coloured rim when the tile turns.
const HALF = 0.47;
const CORNER = 0.2;
const BEVEL = 0.03;

function createTileGeometry() {
  const s = new THREE.Shape();
  const h = HALF;
  const r = CORNER;
  s.moveTo(-h + r, -h);
  s.lineTo(h - r, -h);
  s.quadraticCurveTo(h, -h, h, -h + r);
  s.lineTo(h, h - r);
  s.quadraticCurveTo(h, h, h - r, h);
  s.lineTo(-h + r, h);
  s.quadraticCurveTo(-h, h, -h, h - r);
  s.lineTo(-h, -h + r);
  s.quadraticCurveTo(-h, -h, -h + r, -h);

  const g = new THREE.ExtrudeGeometry(s, {
    depth: 0.05,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: BEVEL,
    bevelSegments: 4,
    curveSegments: 8,
  });
  g.center();
  // caps get uv = xy; map the cap's extent onto the whole texture
  const pos = g.getAttribute("position");
  const uv = g.getAttribute("uv");
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, pos.getX(i) / (2 * HALF) + 0.5, pos.getY(i) / (2 * HALF) + 0.5);
  }
  uv.needsUpdate = true;
  g.computeVertexNormals();
  return g;
}

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
const backOut = (t: number) => {
  const c = 1.9;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

type Slot = { ring: 0 | 1; index: number; seed: number };

/** First ring holds the first apps of the catalog (the featured ones), the outer ring the rest. */
const SLOTS: Slot[] = catalog.map((_, i) => {
  const ring = i < RINGS[0].count ? 0 : 1;
  return { ring, index: ring === 0 ? i : i - RINGS[0].count, seed: i * 1.7 + 0.3 };
});

export function AppOrbit({ ref }: { ref: Ref<OrbitHandle> }) {
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const hover = useRef<number[]>(catalog.map(() => 0));

  const geometry = useMemo(() => createTileGeometry(), []);
  const materials = useMemo(
    () =>
      catalog.map((app) => {
        const map = createIconTexture(app);
        const cap = new THREE.MeshPhysicalMaterial({
          map,
          // a touch of self-illumination, like a screen, keeps glyphs white in a dark scene
          emissive: 0xffffff,
          emissiveMap: map,
          emissiveIntensity: 0.14,
          roughness: 0.4,
          metalness: 0,
          clearcoat: 1,
          clearcoatRoughness: 0.12,
          transparent: true,
        });
        const rim = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(app.accent.from).lerp(new THREE.Color(app.accent.to), 0.5).multiplyScalar(0.8),
          roughness: 0.22,
          metalness: 0.2,
          clearcoat: 1,
          clearcoatRoughness: 0.05,
          transparent: true,
        });
        const pair: [THREE.MeshPhysicalMaterial, THREE.MeshPhysicalMaterial] = [cap, rim];
        return pair;
      }),
    [],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      for (const [cap, rim] of materials) {
        cap.map?.dispose();
        cap.dispose();
        rim.dispose();
      }
    },
    [geometry, materials],
  );

  useImperativeHandle(ref, () => {
    const world = new THREE.Vector3();
    const point = [0, 0, 0];
    const identity = new THREE.Matrix4();
    const rimBase = materials.map(([, rim]) => rim.color.clone());
    const TAU = Math.PI * 2;

    return {
      update(f) {
        let caught = 0;
        const fade = f.visibility;
        // as the hero scrolls away the icons are drawn into the core
        const gather = 1 - smoothstep(0.35, 1, fade);

        for (let i = 0; i < SLOTS.length; i++) {
          const mesh = meshes.current[i];
          if (!mesh) continue;
          const slot = SLOTS[i];
          const [cap, rim] = materials[i];

          if (fade < 0.01) {
            mesh.visible = false;
            continue;
          }
          mesh.visible = true;

          const { radius, count } = RINGS[slot.ring];
          const theta = (slot.index / count) * TAU + f.angles[slot.ring];
          const [x, y, z] = ringPoint(theta, radius * (1 - 0.7 * gather), f.tilts[slot.ring], point);

          // icons on the far side of the orbit sink back and dim, like the ring particles
          const depth = smoothstep(-0.2, 0.2, z);

          // hover: project to NDC (last frame's matrices, which is plenty for a hit test)
          world
            .set(x, y, z)
            .applyMatrix4(mesh.parent?.matrixWorld ?? identity)
            .project(f.camera);
          const dx = world.x - f.pointer.x;
          const dy = (world.y - f.pointer.y) * 0.6;
          const near = f.pointer.active && fade > 0.5 ? smoothstep(0.075, 0.035, Math.hypot(dx, dy)) : 0;
          hover.current[i] = THREE.MathUtils.damp(hover.current[i], near, 8, f.dt);
          const h = hover.current[i];
          caught = Math.max(caught, h);

          const pop = f.reducedMotion ? 1 : backOut(smoothstep(0.3 + i * 0.025, 0.72 + i * 0.025, f.intro));
          const scale = ICON_SIZE * (0.78 + 0.26 * depth) * (1 + 0.28 * h) * pop * (1 - 0.6 * gather);
          // sit just in front of the ring so the depth test hides the ring particles under the tile
          mesh.position.set(x, y, z + 0.035 + h * 0.05);
          mesh.scale.setScalar(Math.max(scale, 1e-4));

          const t = f.reducedMotion ? 0 : f.time;
          mesh.rotation.set(
            Math.sin(t * 0.55 + slot.seed) * 0.22 * (1 - h) - 0.06,
            Math.cos(t * 0.47 + slot.seed * 1.3) * 0.3 * (1 - h),
            Math.sin(t * 0.36 + slot.seed * 0.7) * 0.07 * (1 - h),
          );

          const light = (0.64 + 0.36 * depth) * (1 + 0.12 * h);
          cap.color.setScalar(light);
          rim.color.copy(rimBase[i]).multiplyScalar(light);
          cap.opacity = rim.opacity = fade;
        }
        return caught;
      },
    };
  }, [materials]);

  return (
    <group>
      {catalog.map((app, i) => (
        <mesh
          key={app.slug}
          ref={(m) => {
            meshes.current[i] = m;
          }}
          geometry={geometry}
          material={materials[i]}
        />
      ))}
    </group>
  );
}
