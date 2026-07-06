export const BRAND_NAME = "FableClaw";
export const FABLE_MODEL = "Claude Fable 5";
export const BRAND_TAGLINE =
  "Autonomous agent powered by Claude Fable 5. One token. No human hands.";
export const BRAND_SHORT = "Powered by Claude Fable 5.";
export const BRAND_HERO =
  "An autonomous agent on Solana, powered by Claude Fable 5. It observes, decides, and executes every cycle on-chain.";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://thefableclaw.fun";

export const X_URL =
  process.env.NEXT_PUBLIC_X_URL ?? "https://x.com/FableClawFun";

export const X_HANDLE = "@FableClawFun";

export function getPumpUrl(): string {
  return process.env.NEXT_PUBLIC_MINT_ADDRESS
    ? `https://pump.fun/coin/${process.env.NEXT_PUBLIC_MINT_ADDRESS}`
    : "https://pump.fun";
}

export function getMintAddress(): string | null {
  const mint = process.env.NEXT_PUBLIC_MINT_ADDRESS?.trim();
  return mint || null;
}
