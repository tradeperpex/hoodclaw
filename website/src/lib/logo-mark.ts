/** Robinhood app-icon square: neon chartreuse + black */
export const HOOD_NEON = "#CCFF00";
export const HOOD_BLACK = "#000000";

export const LOGO_BG = HOOD_NEON;
export const LOGO_CLAW = HOOD_BLACK;
export const LOGO_CLAW_MID = HOOD_BLACK;
export const LOGO_RADIUS = 20;

export const LOGO_MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" role="img" aria-label="HoodClaw">
  <rect width="100" height="100" rx="${LOGO_RADIUS}" fill="${LOGO_BG}"/>
  <path d="M28 74 L40 30" stroke="${LOGO_CLAW}" stroke-width="9" stroke-linecap="round"/>
  <path d="M50 78 L50 26" stroke="${LOGO_CLAW_MID}" stroke-width="9" stroke-linecap="round"/>
  <path d="M72 74 L60 30" stroke="${LOGO_CLAW}" stroke-width="9" stroke-linecap="round"/>
</svg>`;
