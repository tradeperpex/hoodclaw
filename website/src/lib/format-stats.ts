function trimTrailingZeros(value: string): string {
  return value.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
}

/** ETH amounts — max 4 decimals for small balances */
export function formatEth(num: number): string {
  const n = Number(num);
  if (!Number.isFinite(n)) return "0";
  if (n >= 100) return trimTrailingZeros(n.toFixed(2));
  if (n >= 1) return trimTrailingZeros(n.toFixed(3));
  return trimTrailingZeros(n.toFixed(4));
}

/** @deprecated use formatEth — field names still map from API */
export function formatSol(num: number): string {
  return formatEth(num);
}

/** Compact token/count format */
export function formatCompact(num: number): string {
  const n = Number(num);
  if (!Number.isFinite(n)) return "0";
  if (n >= 1_000_000) {
    const scaled = n / 1_000_000;
    return `${trimTrailingZeros(scaled.toFixed(scaled >= 10 ? 1 : 2))}M`;
  }
  if (n >= 1_000) {
    const scaled = n / 1_000;
    return `${trimTrailingZeros(scaled.toFixed(scaled >= 10 ? 0 : 1))}K`;
  }
  if (n >= 1) return trimTrailingZeros(n.toFixed(2));
  return trimTrailingZeros(n.toFixed(4));
}
