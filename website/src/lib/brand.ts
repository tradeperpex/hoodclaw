import { NETWORK_NAME } from "@/lib/chain";

export const BRAND_NAME = "HoodClaw";
export const AGENT_MODEL = "Claude Fable 5";
/** @deprecated use AGENT_MODEL */
export const FABLE_MODEL = AGENT_MODEL;
export const BRAND_TAGLINE =
  "Autonomous claw on Robinhood Chain. One token. No human hands.";
export const BRAND_SHORT = "Powered by Claude Fable 5.";
export const BRAND_HERO =
  "An autonomous claw on Robinhood Chain — it watches the treasury, decides, and executes every cycle on-chain with ETH.";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://thehoodclaw.fun";

export const X_URL =
  process.env.NEXT_PUBLIC_X_URL ?? "https://x.com/hoodchainclaw";

export const X_HANDLE = "@hoodchainclaw";

export { NETWORK_NAME, NETWORK_LABEL, GAS_SYMBOL } from "@/lib/chain";

export function getTokenAddress(): string | null {
  const token = process.env.NEXT_PUBLIC_TOKEN_ADDRESS?.trim();
  return token || null;
}

export function getTradeUrl(): string {
  const token = getTokenAddress();
  if (token) {
    return `https://app.uniswap.org/swap?chain=robinhood&inputCurrency=ETH&outputCurrency=${token}`;
  }
  return "https://app.uniswap.org/explore/tokens/robinhood";
}

/** @deprecated use getTradeUrl */
export function getPumpUrl(): string {
  return getTradeUrl();
}

/** @deprecated use getTokenAddress */
export function getMintAddress(): string | null {
  return getTokenAddress();
}
