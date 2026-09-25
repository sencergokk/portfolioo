/**
 * Morphing point-cloud shaders.
 *
 * uMorph: 0 = hero "app orbit", 1 = phone. Each particle starts its transition with a random
 * delay (aRnd) so the shapes "pour" into each other instead of cross-fading, and a swirl term
 * peaks mid-transition so the in-between reads as a living nebula.
 *
 * Hero: two orbit rings spin (uRingA/uRingB), are tilted and rolled exactly like the icon
 * meshes in AppOrbit.tsx (see orbit.ts), and light up as comet trails behind each icon.
 *
 * Phone: animated on the GPU using its part id (aKind, see KIND in shapes.ts): a lit titanium
 * frame, a Dynamic Island live activity, an icon launch wave, a breathing widget chart, a
 * drifting aurora wallpaper and a glass glint.
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
  uniform vec2 uRing;        // current spin angle of the inner / outer ring
  uniform vec2 uRingDir;     // spin direction (+1 / -1) of each ring
  uniform vec2 uRingCount;   // icons per ring (for the comet trails)
  uniform vec4 uTilt;        // inner tilt, inner roll, outer tilt, outer roll

  attribute vec4 aHero;
  attribute vec3 aPhone;
  attribute vec3 aScatter;
  attribute vec4 aRnd;
  attribute vec3 cHero;
  attribute vec3 cPhone;
  attribute vec2 aSizes;
  attribute float aKind;
  attribute vec4 aMeta;
  attribute vec3 aNormal;

  varying vec3 vColor;
  varying float vAlpha;

  bool isKind(float k) { return abs(aKind - k) < 0.5; }

  vec3 rotX(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
  }
  vec3 rotY(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
  }
  vec3 rotZ(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c * p.x - s * p.y, s * p.x + c * p.y, p.z);
  }

  void main() {
    float t1 = smoothstep(0.0, 1.0, clamp((uMorph - aRnd.y * 0.45) / 0.55, 0.0, 1.0));

    // ---------------------------------------------------------------- hero orbit
    vec3 hp;
    vec3 hc = cHero;
    float heroSize = aSizes.x;
    if (aHero.w < 0.5) {
      // core and dust drift slowly
      hp = rotY(aHero.xyz, uTime * 0.04);
      hc *= 0.8 + 0.4 * sin(uTime * 1.7 + aRnd.x * 30.0);
    } else {
      bool inner = aHero.w < 1.5;
      float spin = inner ? uRing.x : uRing.y;
      float dir = inner ? uRingDir.x : uRingDir.y;
      float n = inner ? uRingCount.x : uRingCount.y;
      float r = length(aHero.xz);
      float base = atan(aHero.z, aHero.x);
      float th = base + spin;
      hp = vec3(cos(th) * r, aHero.y, sin(th) * r);
      hp = rotX(hp, inner ? uTilt.x : uTilt.z);
      hp = rotZ(hp, inner ? uTilt.y : uTilt.w);
      // comet trails: brighten the arc right behind each icon (icons sit at phase 0, the
      // tile itself covers roughly the first 0.2 of a slot and hides what is under it)
      float ph = fract(base * n / 6.2831853);
      float behind = dir > 0.0 ? 1.0 - ph : ph;
      float trail = 1.0 - smoothstep(0.18, 0.8, behind);
      trail *= trail;
      hc += trail * vec3(0.95, 0.72, 0.4) * 0.9;
      heroSize *= 1.0 + trail * 0.7;
    }
    // depth cue: the far side of the orbit recedes
    hc *= mix(0.45, 1.15, smoothstep(-0.45, 0.45, hp.z));

    // ---------------------------------------------------------------- phone
    vec3 ph = aPhone;
    vec3 pc = cPhone;

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
      vec3 nrm = normalize(normalMatrix * aNormal);
      vec3 L = normalize(vec3(-0.45, 0.65, 0.62));
      float diff = max(dot(nrm, L), 0.0);
      float spec = pow(max(dot(reflect(-L, nrm), vec3(0.0, 0.0, 1.0)), 0.0), 16.0);
      pc = pc * (0.3 + 0.95 * diff) + spec * 0.55;
    } else {
      // glass glint travelling across the screen
      float g = mod(uTime * 0.32, 3.2) - 1.1;
      pc += exp(-pow((ph.x * 0.8 + ph.y - g) / 0.035, 2.0)) * 0.24;
    }

    // ---------------------------------------------------------------- morph
    vec3 p = mix(hp, ph, t1);

    float transit = sin(t1 * 3.14159);
    vec3 swirl = vec3(
      sin(uTime * 0.6 + aRnd.x * 6.2831 + p.y * 4.0),
      cos(uTime * 0.5 + aRnd.y * 6.2831 + p.x * 4.0),
      sin(uTime * 0.4 + aRnd.z * 6.2831)
    );
    p += swirl * (transit * (0.08 + aRnd.w * 0.22) + uScrollVel * (0.012 + aRnd.w * 0.03));

    // idle shimmer (kept small on the phone so its edges stay crisp)
    p += 0.004 * (1.0 - 0.75 * t1) * vec3(
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

    vColor = mix(hc, pc, t1) + f * vec3(0.35, 0.26, 0.14);

    float size = mix(heroSize, aSizes.y, t1);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * size * uPixelRatio * (1.0 / -mv.z) * (1.0 + f * 0.6);

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
