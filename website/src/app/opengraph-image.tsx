import { ImageResponse } from "next/og";
import { BRAND_NAME, BRAND_SHORT, FABLE_MODEL } from "@/lib/brand";

export const alt = `${BRAND_NAME} · ${FABLE_MODEL} agent on Solana`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ROLES = ["EXEC", "CLAIM", "BUYBACK", "BURN", "LP"];

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
          background: "#fffbf7",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 48,
            border: "1px solid rgba(194, 65, 12, 0.18)",
            borderRadius: 24,
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
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "#1a1008",
            }}
          >
            {BRAND_NAME}
          </div>
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#e8590c",
            }}
          >
            {FABLE_MODEL}
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            {ROLES.map((a) => (
              <div
                key={a}
                style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "1px",
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(232, 89, 12, 0.24)",
                  color: a === "EXEC" ? "#ffffff" : "#e8590c",
                  background: a === "EXEC" ? "#c2410c" : "transparent",
                }}
              >
                {a}
              </div>
            ))}
          </div>
          <div
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 18,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#a8927e",
            }}
          >
            {BRAND_SHORT}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
