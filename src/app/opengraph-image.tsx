import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { catalog } from "@/content/apps";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Read once at module scope; these never depend on the request.
const [geist, display, portrait] = await Promise.all([
  readFile(join(process.cwd(), "assets/fonts/Geist-Medium.ttf")),
  readFile(join(process.cwd(), "assets/fonts/PlayfairDisplay-Regular.ttf")),
  readFile(join(process.cwd(), "public/images/sencer-portrait.png"), "base64"),
]);

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#070708",
        color: "#f3efe7",
        fontFamily: "Geist",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -120,
          top: -80,
          width: 820,
          height: 820,
          borderRadius: 9999,
          background: "radial-gradient(circle, rgba(232,184,107,0.32), rgba(232,184,107,0) 62%)",
        }}
      />
      <img
        src={`data:image/png;base64,${portrait}`}
        width={600}
        height={600}
        alt=""
        style={{ position: "absolute", right: 10, bottom: -30 }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: 700,
          height: 220,
          background: "linear-gradient(to top, #070708, rgba(7,7,8,0))",
        }}
      />
      {/* soften the portrait's cropped left edge */}
      <div
        style={{
          position: "absolute",
          right: 440,
          top: 0,
          width: 180,
          height: 630,
          background: "linear-gradient(to right, #070708, rgba(7,7,8,0))",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", padding: "56px 72px", width: 720, height: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, color: "#bcb6aa" }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#4ade80" }} />
          {`${site.availability} · ${site.location}`}
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 30 }}>
          <div style={{ fontSize: 136, lineHeight: 0.9, letterSpacing: -7 }}>{site.firstName}</div>
          <div
            style={{
              fontFamily: "Playfair Display",
              fontSize: 150,
              lineHeight: 0.95,
              color: "#e8b86b",
              marginLeft: 70,
              letterSpacing: -3,
            }}
          >
            {`${site.lastName}.`}
          </div>
        </div>
        <div style={{ fontFamily: "Playfair Display", fontSize: 42, marginTop: 20 }}>{site.role}</div>
        <div
          style={{ display: "flex", alignItems: "center", gap: 14, marginTop: "auto", fontSize: 22, color: "#bcb6aa" }}
        >
          {[`${catalog.length} iOS uygulaması`, "SwiftUI", "Next.js", "Spring Boot"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                flexShrink: 0,
                whiteSpace: "nowrap",
                padding: "8px 18px",
                borderRadius: 999,
                border: "1px solid rgba(243,239,231,0.18)",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Geist", data: geist, style: "normal", weight: 500 },
        { name: "Playfair Display", data: display, style: "normal", weight: 400 },
      ],
    },
  );
}
