import { ImageResponse } from "next/og";
import about from "@/content/about.json";

// The link preview for every page (LinkedIn, iMessage, Slack...): the desktop
// look, with a Terminal window showing the name and tagline. Built at build time.
export const alt = `${about.name}: a portfolio you explore like a laptop desktop`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0E1726",
          backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 2px, transparent 2px)",
          backgroundSize: "36px 36px",
          color: "#E8EAED",
        }}
      >
        <div style={{ display: "flex", height: 44, alignItems: "center", padding: "0 28px", gap: 24, fontSize: 20, backgroundColor: "rgba(10,14,22,0.85)" }}>
          <span style={{ fontWeight: 700 }}>hassan</span>
          <span>Terminal</span>
          <span style={{ marginLeft: "auto", color: "#F2A93B", fontWeight: 600 }}>Resume.pdf</span>
        </div>

        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 920,
              borderRadius: 18,
              backgroundColor: "#12161D",
              border: "1px solid #2A3140",
              boxShadow: "0 30px 70px rgba(0,0,0,0.6)",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, height: 56, padding: "0 22px", backgroundColor: "#1B212B" }}>
              {["#E5534B", "#E3A63A", "#3FB15A"].map((color) => (
                <div key={color} style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: color }} />
              ))}
              <span style={{ marginLeft: 18, fontSize: 20, color: "#A9B1BD" }}>hassan@portfolio: ~</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", padding: "34px 40px 44px", gap: 14 }}>
              <span style={{ fontSize: 28, color: "#F2A93B" }}>~ $ whoami</span>
              <span style={{ fontSize: 76, fontWeight: 700, color: "#F6F5F2", lineHeight: 1.05 }}>{about.name}</span>
              <span style={{ fontSize: 30, color: "#D7DCE3", lineHeight: 1.35 }}>{about.tagline}</span>
              <span style={{ fontSize: 26, color: "#F2A93B", marginTop: 10 }}>hassandawy.com</span>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
