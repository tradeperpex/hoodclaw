import { ImageResponse } from "next/og";

export const alt = "AgentClaw — one autonomous agent, one token";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#ffffff",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 48,
            border: "1px solid #e5e5e5",
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              border: "2px solid #0a0a0a",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div style={{ width: 28, height: 28, border: "2px solid #0a0a0a", borderRadius: "50%" }} />
            <div
              style={{
                position: "absolute",
                width: 2,
                height: 44,
                background: "#0a0a0a",
                top: 14,
              }}
            />
            <div
              style={{
                position: "absolute",
                width: 44,
                height: 2,
                background: "#0a0a0a",
                left: 14,
              }}
            />
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "#0a0a0a",
            }}
          >
            AgentClaw
          </div>
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#737373",
            }}
          >
            one agent · one token · no human hands
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
