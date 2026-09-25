/**
 * Morphing point-cloud shaders.
 *
 * uMorph: 0 = portrait, 1 = phone. Each particle starts its transition with a random delay
 * (aRnd) so the shapes "pour" into each other instead of cross-fading, and a swirl term peaks
 * mid-transition so the in-between reads as a living nebula.
 *
 * The phone is animated entirely on the GPU using its part id (aKind, see KIND in shapes.ts):
 * a lit titanium frame, a Dynamic Island that opens for a live activity, an icon launch wave,
 * a breathing widget chart, a drifting aurora wallpaper and a glass glint.
 */

export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uIntro;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uAlpha;
  uniform vec3 uMouse;
  uniform float uMouseStrength;
  uniform float uScrollVel;

  attribute vec3 aPortrait;
  attribute vec3 aPhone;
  attribute vec3 aScatter;
  attribute vec4 aRnd;
  attribute vec3 cPortrait;
  attribute vec3 cPhone;
  attribute vec2 aSizes;
  attribute float aKind;
  attribute vec4 aMeta;
  attribute vec3 aNormal;

  varying vec3 vColor;
  varying float vAlpha;

  bool isKind(float k) { return abs(aKind - k) < 0.5; }

  void main() {
    float t1 = smoothstep(0.0, 1.0, clamp((uMorph - aRnd.y * 0.45) / 0.55, 0.0, 1.0));

    // ---------------------------------------------------------------- phone
    vec3 ph = aPhone;
    vec3 pc = cPhone;
    float phoneSize = aSizes.y;

    // Dynamic Island live activity: opens for ~3s every 8s
    float cyc = mod(uTime + 2.0, 8.0);
    float open = smoothstep(0.0, 0.45, cyc - 1.0) * (1.0 - smoothstep(0.0, 0.45, cyc - 4.0));
    if (isKind(3.0)) {
      vec2 o = ph.xy - aMeta.xy;
      o *= vec2(1.0 + open * 1.4, 1.0 + open * 1.3);
      ph.xy = aMeta.xy + o - vec2(0.0, open * 0.011);
      pc *= mix(1.0, 0.12 + 1.6 * open, aMeta.z);
    }
    // icons: a launch wave sweeps diagonally across the grid every 6s
    if (isKind(8.0) || isKind(12.0)) {
      float front = mod(uTime / 6.0, 1.0) * 1.9 - 0.75;
      float wave = exp(-pow((aMeta.x * 0.8 - aMeta.y - front) / 0.075, 2.0));
      ph.xy = aMeta.xy + (ph.xy - aMeta.xy) * (1.0 + wave * 0.16);
      ph.z += wave * 0.035;
      pc *= 1.0 + wave * 0.75;
    }
    // widget sparkline keeps moving
    if (isKind(7.0)) {
      ph.y = aMeta.y + aMeta.z * sin(aMeta.x * 11.0 - uTime * 1.8) * (0.4 + aMeta.x) + (aRnd.x - 0.5) * 0.003;
    }
    // aurora wallpaper drifts
    if (isKind(14.0)) {
      pc *= 0.65 + 0.7 * (0.5 + 0.5 * sin(aMeta.x * 9.0 + aMeta.y * 5.0 + uTime * 0.6));
    }
    // titanium frame and buttons are lit by a key light, so they flare as the phone turns
    if (aKind < 2.5) {
      vec3 n = normalize(normalMatrix * aNormal);
      vec3 L = normalize(vec3(-0.45, 0.65, 0.62));
      float diff = max(dot(n, L), 0.0);
      float spec = pow(max(dot(reflect(-L, n), vec3(0.0, 0.0, 1.0)), 0.0), 16.0);
      pc = pc * (0.3 + 0.95 * diff) + spec * 0.55;
    } else {
      // glass glint travelling across the screen
      float g = mod(uTime * 0.32, 3.2) - 1.1;
      pc += exp(-pow((ph.x * 0.8 + ph.y - g) / 0.035, 2.0)) * 0.24;
    }

    // ---------------------------------------------------------------- morph
    vec3 p = mix(aPortrait, ph, t1);

    float transit = sin(t1 * 3.14159);
    vec3 swirl = vec3(
      sin(uTime * 0.6 + aRnd.x * 6.2831 + p.y * 4.0),
      cos(uTime * 0.5 + aRnd.y * 6.2831 + p.x * 4.0),
      sin(uTime * 0.4 + aRnd.z * 6.2831)
    );
    p += swirl * (transit * (0.08 + aRnd.w * 0.22) + uScrollVel * (0.012 + aRnd.w * 0.03));

    // idle shimmer (kept small on the phone so its edges stay crisp)
    p += 0.0045 * (1.0 - 0.75 * t1) * vec3(
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

    vec3 col = mix(cPortrait, pc, t1);

    // portrait only: a warm scan-light every ~12s and a depth cue on the relief
    float portrait = 1.0 - t1;
    float sweep = 1.25 - mod(uTime * 0.21, 2.5);
    float band = exp(-pow((p.y * 0.92 + p.x * 0.38 - sweep) / 0.035, 2.0)) * portrait * ti;
    col += band * vec3(1.0, 0.76, 0.42) * 0.6;
    col *= mix(1.0, mix(0.62, 1.12, clamp(p.z * 3.2 + 0.5, 0.0, 1.0)), portrait);
    col += f * vec3(0.35, 0.26, 0.14);
    vColor = col;

    float size = mix(aSizes.x, phoneSize, t1);
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
