import { buildShapes, loadImageData, type ShapeBuffers } from "./shapes";
import type { WorkerResponse } from "./shapes.worker";

/**
 * Samples the portrait map and generates every shape in a Web Worker (typed arrays are
 * transferred, not copied). Falls back to the main thread where workers/OffscreenCanvas are missing.
 */
export function loadShapes(src: string, count: number): Promise<ShapeBuffers> {
  const url = new URL(src, window.location.href).href;
  const onMainThread = () => loadImageData(url).then((map) => buildShapes(count, map));

  if (typeof Worker === "undefined" || typeof OffscreenCanvas === "undefined") return onMainThread();

  return new Promise<ShapeBuffers>((resolve, reject) => {
    let worker: Worker;
    try {
      worker = new Worker(new URL("./shapes.worker.ts", import.meta.url), { type: "module" });
    } catch {
      onMainThread().then(resolve, reject);
      return;
    }
    const fallback = () => {
      worker.terminate();
      onMainThread().then(resolve, reject);
    };
    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      if (!e.data.ok) return fallback();
      worker.terminate();
      resolve(e.data.shapes);
    };
    worker.onerror = fallback;
    worker.postMessage({ url, count });
  });
}
