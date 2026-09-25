import { buildShapes, type ShapeBuffers } from "./shapes";
import type { WorkerResponse } from "./shapes.worker";

/**
 * Generates every shape in a Web Worker (typed arrays are transferred, not copied) and falls
 * back to the main thread where workers are unavailable.
 */
export function loadShapes(count: number): Promise<ShapeBuffers> {
  const onMainThread = () => Promise.resolve(buildShapes(count));
  if (typeof Worker === "undefined") return onMainThread();

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
    worker.postMessage({ count });
  });
}
