export const BRAND_NAME = "HoodClaw";
export const AGENT_MODEL = "Claude Fable 5";
/** @deprecated use AGENT_MODEL */
export const FABLE_MODEL = AGENT_MODEL;
export const BRAND_TAGLINE =
  "Autonomous claw on Solana. One token. No human hands.";
export const BRAND_SHORT = "Powered by Claude Fable 5.";
export const BRAND_HERO =
  "An autonomous claw on Solana — it watches the vault, decides, and executes every cycle on-chain.";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://hoodclaw.fun";

export const X_URL =
  process.env.NEXT_PUBLIC_X_URL ?? "https://x.com/hoodclaw";

export const X_HANDLE = "@hoodclaw";

export function getPumpUrl(): string {
  return process.env.NEXT_PUBLIC_MINT_ADDRESS
    ? `https://pump.fun/coin/${process.env.NEXT_PUBLIC_MINT_ADDRESS}`
    : "https://pump.fun";
}

export function getMintAddress(): string | null {
  const mint = process.env.NEXT_PUBLIC_MINT_ADDRESS?.trim();
  return mint || null;
}
