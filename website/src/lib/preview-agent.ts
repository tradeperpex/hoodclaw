import type { AgentFeedEntry, AgentState, AgentStats } from "@/lib/agent-types";

export const PREVIEW_STATS: AgentStats = {
  treasurySol: 0.05,
  totalClaimed: 0.18,
  totalCreatorShare: 0.14,
  totalBurned: 842_000,
  totalBoughtBack: 0.11,
  totalLpSol: 0.04,
};

export const PREVIEW_THOUGHT =
  "Vault holds 0.05 ETH on Robinhood Chain. Last cycle I claimed trading fees, routed 0.04 ETH through buyback, and burned 12,400 tokens. LP desk took the rest. Scanning for the next batch.";

const PREVIEW_FEED: AgentFeedEntry[] = [
  {
    time: "2m ago",
    action: "Claimed fees",
    detail: "0.0120 ETH from treasury fees",
    agent: "CLAIM",
  },
  {
    time: "2m ago",
    action: "Buyback",
    detail: "Spent 0.0080 ETH on Uniswap",
    agent: "BUYBACK",
  },
  {
    time: "1m ago",
    action: "Burned tokens",
    detail: "12,400 tokens removed from supply",
    agent: "BURN",
  },
];

export function hasLiveStats(stats: AgentStats): boolean {
  return (
    stats.treasurySol > 0 ||
    stats.totalClaimed > 0 ||
    stats.totalBurned > 0 ||
    stats.totalBoughtBack > 0 ||
    stats.totalLpSol > 0
  );
}

/** Landing stats — live Supabase data when available, otherwise preview values. */
export function resolveAgentState(live: AgentState | null): AgentState {
  if (live && (hasLiveStats(live.stats) || live.feedEntries.length > 0)) {
    return live;
  }

  return {
    thought: live?.thought && live.thought !== "Waiting for fees." ? live.thought : PREVIEW_THOUGHT,
    thoughtMeta: "· HoodClaw · Robinhood Chain",
    feedEntries: live?.feedEntries?.length ? live.feedEntries : PREVIEW_FEED,
    updatedAt: live?.updatedAt ?? new Date().toISOString(),
    stats: live && hasLiveStats(live.stats) ? live.stats : PREVIEW_STATS,
  };
}
