/// Builds the particle shapes off the main thread so the intro never stutters.
import { buildShapes, type ShapeBuffers } from "./shapes";

type Request = { url: string; count: number };
export type WorkerResponse = { ok: true; shapes: ShapeBuffers } | { ok: false; error: string };

const scope = self as unknown as {
  onmessage: ((e: MessageEvent<Request>) => void) | null;
  postMessage: (msg: WorkerResponse, transfer?: Transferable[]) => void;
};

scope.onmessage = async ({ data }) => {
  try {
    const blob = await (await fetch(data.url)).blob();
    const bitmap = await createImageBitmap(blob);
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("OffscreenCanvas 2D context unavailable");
    ctx.drawImage(bitmap, 0, 0);
    const shapes = buildShapes(data.count, ctx.getImageData(0, 0, bitmap.width, bitmap.height));
    const transfer = Object.values(shapes)
      .filter((v): v is Float32Array => v instanceof Float32Array)
      .map((a) => a.buffer);
    scope.postMessage({ ok: true, shapes }, transfer);
  } catch (err) {
    scope.postMessage({ ok: false, error: String(err) });
  }
};
