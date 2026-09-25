import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

const display = await readFile(join(process.cwd(), "assets/fonts/PlayfairDisplay-Regular.ttf"));

/** Monogram favicon — same gold serif "S" as the nav mark. */
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 16,
        background: "#0c0c0f",
        border: "2px solid rgba(232,184,107,0.45)",
        color: "#e8b86b",
        fontFamily: "Playfair Display",
        fontSize: 50,
        paddingBottom: 4,
      }}
    >
      S
    </div>,
    { ...size, fonts: [{ name: "Playfair Display", data: display, style: "normal", weight: 400 }] },
  );
}
