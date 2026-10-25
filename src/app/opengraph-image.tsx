import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.taglines[0]}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Social share card: name, tagline and the four brand dots.
export default function OpengraphImage() {
  const dots = ["#fbb03b", "#e54141", "#2d99ea", "#22b573"];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 110px",
          background: "#fafafa",
          color: "#0f0606",
        }}
      >
        <div style={{ display: "flex", gap: 18, marginBottom: 36 }}>
          {dots.map((c) => (
            <div key={c} style={{ width: 34, height: 34, borderRadius: 999, background: c }} />
          ))}
        </div>
        <div style={{ fontSize: 128, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>{site.name}</div>
        <div style={{ fontSize: 44, color: "#9b9696", marginTop: 20 }}>{site.taglines[0]}</div>
        <div style={{ fontSize: 30, color: "#9b9696", marginTop: 8 }}>{site.location}</div>
      </div>
    ),
    size,
  );
}
