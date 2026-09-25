/// Builds the particle shapes off the main thread so the intro never stutters.
import { buildShapes, type ShapeBuffers } from "./shapes";

type Request = { count: number };
export type WorkerResponse = { ok: true; shapes: ShapeBuffers } | { ok: false; error: string };

const scope = self as unknown as {
  onmessage: ((e: MessageEvent<Request>) => void) | null;
  postMessage: (msg: WorkerResponse, transfer?: Transferable[]) => void;
};

scope.onmessage = ({ data }) => {
  try {
    const shapes = buildShapes(data.count);
    const transfer = Object.values(shapes)
      .filter((v): v is Float32Array => v instanceof Float32Array)
      .map((a) => a.buffer);
    scope.postMessage({ ok: true, shapes }, transfer);
  } catch (err) {
    scope.postMessage({ ok: false, error: String(err) });
  }
};
