/** ETH amounts — max 4 decimals for small balances */
export function formatEth(num: number): string {
  const n = Number(num);
  if (n >= 100) return n.toFixed(2);
  if (n >= 1) return n.toFixed(3);
  return n.toFixed(4);
}

/** @deprecated use formatEth — field names still map from API */
export function formatSol(num: number): string {
  return formatEth(num);
}

/** Compact token/count format */
export function formatCompact(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
  return Number(num).toFixed(2);
}
