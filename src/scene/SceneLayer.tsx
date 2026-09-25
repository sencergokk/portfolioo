"use client";

import { useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useState, useSyncExternalStore } from "react";

// three.js + R3F stay out of the critical bundle; the page is fully readable without them.
const ParticleCanvas = dynamic(() => import("./ParticleCanvas"), { ssr: false });

let webglSupport: boolean | undefined;
function detectWebGL() {
  if (webglSupport === undefined) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}
const noopSubscribe = () => () => {};

export function SceneLayer() {
  const supported = useSyncExternalStore(noopSubscribe, detectWebGL, () => false);
  const reducedMotion = useReducedMotion() ?? false;
  const [ready, setReady] = useState(false);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Static backdrop: shown before WebGL is ready and when it's unavailable. */}
      <div className="scene-fallback absolute inset-0" />
      {supported && (
        <div
          className="absolute inset-0 transition-opacity duration-[1600ms] ease-out"
          style={{ opacity: ready ? 1 : 0 }}
        >
          <ParticleCanvas reducedMotion={reducedMotion} onReady={() => setReady(true)} />
        </div>
      )}
      {/* Vignette keeps edges calm and text readable over the particles. */}
      <div className="scene-vignette absolute inset-0" />
    </div>
  );
}
