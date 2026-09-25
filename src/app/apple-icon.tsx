import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const display = await readFile(join(process.cwd(), "assets/fonts/PlayfairDisplay-Regular.ttf"));

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 50% 35%, #1d1a14, #070708 70%)",
        color: "#e8b86b",
        fontFamily: "Playfair Display",
        fontSize: 132,
        paddingBottom: 10,
      }}
    >
      S
    </div>,
    { ...size, fonts: [{ name: "Playfair Display", data: display, style: "normal", weight: 400 }] },
  );
}
