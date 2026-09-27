/**
 * Geometry of the hero "app orbit", shared by the particle shader (rings, comet trails) and
 * the icon meshes (positions on the rings) so both always agree.
 *
 * Rings are defined flat in the XZ plane, then tilted around X and rolled around Z.
 */

export const RINGS = [
  { radius: 0.3, count: 6, speed: 0.12 },
  { radius: 0.52, count: 10, speed: -0.07 },
] as const;

export const ICON_SIZE = 0.14;

export type RingTilt = { tilt: number; roll: number };

/** Steeper, more elliptical orbits on wide screens; flatter tilt on phones so they read in a narrow column. */
export const TILTS: Record<"desktop" | "mobile", readonly [RingTilt, RingTilt]> = {
  desktop: [
    { tilt: 1.12, roll: -0.16 },
    { tilt: 1.22, roll: 0.2 },
  ],
  mobile: [
    { tilt: 0.92, roll: -0.14 },
    { tilt: 1.02, roll: 0.18 },
  ],
};

/** Same math as rotX then rotZ in the vertex shader. Writes into `out` (called per icon, per frame). */
export function ringPoint(theta: number, radius: number, { tilt, roll }: RingTilt, out: number[]) {
  const x = Math.cos(theta) * radius;
  const z0 = Math.sin(theta) * radius;
  const ct = Math.cos(tilt);
  const st = Math.sin(tilt);
  const y1 = -st * z0;
  const z1 = ct * z0;
  const cr = Math.cos(roll);
  const sr = Math.sin(roll);
  out[0] = cr * x - sr * y1;
  out[1] = sr * x + cr * y1;
  out[2] = z1;
  return out;
}
