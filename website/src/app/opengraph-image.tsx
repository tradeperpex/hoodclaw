import { ImageResponse } from "next/og";
import { BRAND_NAME, BRAND_SHORT, AGENT_MODEL } from "@/lib/brand";

export const alt = `${BRAND_NAME} · ${AGENT_MODEL} on Robinhood Chain`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ROLES = ["EXEC", "CLAIM", "BUYBACK", "BURN", "LP"];
const HOOD_NEON = "#CCFF00";
const HOOD_BLACK = "#000000";

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
          background: HOOD_NEON,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
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
              color: HOOD_BLACK,
            }}
          >
            {BRAND_NAME}
          </div>
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: HOOD_BLACK,
              opacity: 0.65,
            }}
          >
            {AGENT_MODEL}
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
                  border: `2px solid ${HOOD_BLACK}`,
                  color: a === "EXEC" ? HOOD_NEON : HOOD_BLACK,
                  background: a === "EXEC" ? HOOD_BLACK : "transparent",
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
              color: HOOD_BLACK,
              opacity: 0.45,
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
