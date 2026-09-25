/**
 * Morphing point-cloud shaders.
 *
 * uMorph: 0 = portrait, 1 = phone, 2 = galaxy. Each particle starts its transition with a
 * random delay (aRnd) so shapes "pour" into each other instead of cross-fading uniformly,
 * and a swirl term peaks mid-transition so the in-between states read as a living nebula.
 * Everything is computed per-vertex on the GPU; the CPU only updates a handful of uniforms.
 */

export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uIntro;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uAlpha;
  uniform float uTilt;
  uniform vec3 uMouse;
  uniform float uMouseStrength;
  uniform float uScrollVel;

  attribute vec3 aPortrait;
  attribute vec3 aPhone;
  attribute vec3 aGalaxy;
  attribute vec3 aScatter;
  attribute vec4 aRnd;
  attribute vec3 cPortrait;
  attribute vec3 cPhone;
  attribute vec3 cGalaxy;
  attribute vec3 aSizes;

  varying vec3 vColor;
  varying float vAlpha;

  vec3 rotY(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
  }
  vec3 rotX(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
  }

  void main() {
    float t1 = smoothstep(0.0, 1.0, clamp((uMorph - aRnd.y * 0.45) / 0.55, 0.0, 1.0));
    float t2 = smoothstep(0.0, 1.0, clamp((uMorph - 1.0 - aRnd.z * 0.45) / 0.55, 0.0, 1.0));

    float r = length(aGalaxy.xz);
    vec3 g = rotY(aGalaxy, uTime * 0.09 / (0.3 + r));
    g = rotX(g, uTilt);

    vec3 p = mix(mix(aPortrait, aPhone, t1), g, t2);

    // swirl while in transit, plus a little looseness while the page scrolls fast
    float transit = sin(t1 * 3.14159) + sin(t2 * 3.14159);
    vec3 swirl = vec3(
      sin(uTime * 0.6 + aRnd.x * 6.2831 + p.y * 4.0),
      cos(uTime * 0.5 + aRnd.y * 6.2831 + p.x * 4.0),
      sin(uTime * 0.4 + aRnd.z * 6.2831)
    );
    p += swirl * (transit * (0.08 + aRnd.w * 0.22) + uScrollVel * (0.012 + aRnd.w * 0.03));

    // idle shimmer
    p += 0.0045 * vec3(
      sin(uTime * 1.3 + aRnd.x * 40.0),
      cos(uTime * 1.1 + aRnd.y * 40.0),
      sin(uTime * 0.9 + aRnd.z * 40.0)
    );

    // intro: rush in from the scatter shell with an ease-out per particle
    float ti = clamp((uIntro - aRnd.w * 0.5) / 0.5, 0.0, 1.0);
    ti = 1.0 - pow(1.0 - ti, 3.0);
    p = mix(aScatter, p, ti);

    // cursor: push particles away and toward the camera
    vec2 d = p.xy - uMouse.xy;
    float dist = length(d);
    float f = smoothstep(0.24, 0.0, dist) * uMouseStrength;
    p.xy += (d / max(dist, 1e-4)) * f * 0.085;
    p.z += f * 0.26;

    vec3 col = mix(mix(cPortrait, cPhone, t1), cGalaxy, t2);

    // a warm scan-light sweeps down the portrait every ~12s (fades out once it morphs)
    float sweep = 1.25 - mod(uTime * 0.21, 2.5);
    float band = exp(-pow((p.y * 0.92 + p.x * 0.38 - sweep) / 0.035, 2.0)) * (1.0 - t1) * ti;
    col += band * vec3(1.0, 0.76, 0.42) * 0.6;
    col += f * vec3(0.35, 0.26, 0.14);

    // depth cue: the front of the relief catches more light than the back
    float depth = clamp(p.z * 3.2 + 0.5, 0.0, 1.0);
    col *= mix(0.62, 1.12, depth);
    vColor = col;

    float size = mix(mix(aSizes.x, aSizes.y, t1), aSizes.z, t2);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * size * uPixelRatio * (1.0 / -mv.z) * (1.0 + f * 0.6 + band * 0.45);

    vAlpha = uAlpha * (0.35 + 0.65 * ti);
  }
`;

export const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d2 = dot(c, c);
    if (d2 > 0.25) discard;
    // bright core + soft halo reads as a glow without a post-processing pass
    float a = exp(-d2 * 38.0) + exp(-d2 * 9.0) * 0.28;
    gl_FragColor = vec4(vColor * a * vAlpha, 1.0);
  }
`;
