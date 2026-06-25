import { ImageResponse } from "next/og";

export const alt = "The Agent Company — five autonomous agents, one token";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const AGENTS = ["EXEC", "CLAIM", "BUYBACK", "BURN", "LP"];

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
            gap: 32,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "#0a0a0a",
            }}
          >
            THE AGENT COMPANY
          </div>
          <div
            style={{
              display: "flex",
              gap: 16,
            }}
          >
            {AGENTS.map((a) => (
              <div
                key={a}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "1px",
                  padding: "6px 14px",
                  border: "1px solid #d4d4d4",
                  color: a === "EXEC" ? "#ffffff" : "#0a0a0a",
                  background: a === "EXEC" ? "#0a0a0a" : "transparent",
                }}
              >
                {a}
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: 18,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#737373",
            }}
          >
            five agents · one token · no human hands
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
