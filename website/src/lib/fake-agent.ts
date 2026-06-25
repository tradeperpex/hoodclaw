/**
 * The Agent Company — multi-agent cycle simulator.
 * Five agents: CLAIM → EXEC decides → BUYBACK → BURN → LP
 */

import { runCycle, CYCLE_INTERVAL_MS, MIGRATED_AFTER_CYCLE, type CycleAction } from "@/data/agent-script";
import type { AgentFeedEntry, AgentStats, AgentState } from "./agent-types";

export type { AgentFeedEntry, AgentStats, AgentState };

const ACTION_LABELS: Record<string, string> = {
  claim:   "Claim",
  buyback: "Buyback",
  burn:    "Burned tokens",
  addLP:   "Added LP",
  thought: "Thought",
};

function actionToFeedEntry(action: CycleAction, cycleIndex: number): AgentFeedEntry | null {
  const time = `C${cycleIndex + 1}`;
  switch (action.type) {
    case "claim":
      return {
        time,
        action: "Claim",
        detail: `CLAIM collected ${action.totalSol.toFixed(2)} SOL — ${action.toTreasury.toFixed(2)} SOL to treasury`,
      };
    case "buyback":
      return {
        time,
        action: "Buyback",
        detail: `BUYBACK spent ${action.sol.toFixed(2)} SOL → acquired ${action.tokens.toLocaleString()} tokens`,
      };
    case "burn":
      return {
        time,
        action: "Burned tokens",
        detail: `BURN destroyed ${action.tokens.toLocaleString()} tokens permanently`,
      };
    case "addLP":
      return {
        time,
        action: "Added LP",
        detail: `LP deepened pool with ${action.sol.toFixed(2)} SOL`,
      };
    case "thought":
      return {
        time,
        action: "Thought",
        detail: action.text,
        strategy: action.strategy,
      };
    default:
      return null;
  }
}

export function getFakeAgentState(cyclesCompleted: number): AgentState {
  let treasury = 0;
  let totalToTreasury = 0;
  let totalBurned = 0;
  let totalBoughtBack = 0;
  let totalLpSol = 0;

  const feedEntries: AgentFeedEntry[] = [];
  let latestThought = "All agents online. Waiting for first cycle.";

  for (let i = 0; i < cyclesCompleted; i++) {
    const isMigrated = i >= MIGRATED_AFTER_CYCLE;
    const { actions, thought } = runCycle(i, isMigrated);
    latestThought = thought;

    for (const action of actions) {
      const entry = actionToFeedEntry(action, i);
      if (entry) feedEntries.push(entry);

      switch (action.type) {
        case "claim":
          treasury += action.toTreasury;
          totalToTreasury += action.toTreasury;
          break;
        case "buyback":
          treasury -= action.sol;
          totalBoughtBack += action.tokens;
          break;
        case "burn":
          totalBurned += action.tokens;
          break;
        case "addLP":
          treasury -= action.sol;
          totalLpSol += action.sol;
          break;
      }
    }
  }

  const stats: AgentStats = {
    treasurySol:      Math.round(Math.max(0, treasury) * 10) / 10,
    totalClaimed:     Math.round(totalToTreasury * 10) / 10,
    totalCreatorShare: 0,
    totalBurned,
    totalBoughtBack,
    totalLpSol:       Math.round(totalLpSol * 10) / 10,
  };

  const thoughtMeta =
    cyclesCompleted > 0
      ? `— The Agent Company, cycle ${cyclesCompleted}`
      : "— The Agent Company";

  return {
    thought: latestThought,
    thoughtMeta,
    feedEntries,
    updatedAt: null,
    stats,
  };
}

export { CYCLE_INTERVAL_MS };
