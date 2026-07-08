import type { AgentState } from "@/lib/agent-types";

export const EMPTY_AGENT_STATE: AgentState = {
  thought: "Waiting for fees.",
  thoughtMeta: "· HoodClaw · Robinhood Chain",
  feedEntries: [],
  updatedAt: null,
  stats: {
    treasurySol: 0,
    totalClaimed: 0,
    totalCreatorShare: 0,
    totalBurned: 0,
    totalBoughtBack: 0,
    totalLpSol: 0,
  },
};
