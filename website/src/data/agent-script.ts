/**
 * The Agent Company — multi-agent cycle simulation.
 * Five agents work in sequence each cycle: CLAIM → EXEC decides → BUYBACK → BURN → LP
 */

export const CYCLE_INTERVAL_MS = 3000; // 3 sec demo (use 180000 for 3 min prod)

const CREATOR_SHARE = 0.8;
const TREASURY_SHARE = 0.2;
const TOKEN_PRICE = 0.000012;

function getClaimAmount(cycleIndex: number): number {
  const base = 0.3 + cycleIndex * 0.02;
  const variance = 0.9 + (cycleIndex % 5) * 0.03;
  return Math.round(base * variance * 100) / 100;
}

export type CycleAction =
  | { type: "claim";   agent: "CLAIM";   totalSol: number; toTreasury: number }
  | { type: "buyback"; agent: "BUYBACK"; sol: number; tokens: number }
  | { type: "burn";    agent: "BURN";    tokens: number }
  | { type: "addLP";   agent: "LP";      sol: number }
  | { type: "thought"; agent: "EXEC";    text: string; strategy: string };

export type CycleResult = {
  actions: CycleAction[];
  thought: string;
  strategy: string;
};

function getAllocation(cycleIndex: number, isMigrated: boolean): { buyback: number; lp: number; label: string } {
  if (!isMigrated) return { buyback: 1, lp: 0, label: "full-buyback" };

  const variants = [
    { buyback: 0.7, lp: 0.3, label: "burn-heavy" },
    { buyback: 0.9, lp: 0.1, label: "balanced" },
    { buyback: 0.5, lp: 0.5, label: "lp-focus" },
    { buyback: 1.0, lp: 0.0, label: "full-burn" },
    { buyback: 0.6, lp: 0.4, label: "full-lp" },
  ];
  return variants[cycleIndex % variants.length];
}

export function runCycle(cycleIndex: number, isMigrated: boolean): CycleResult {
  const totalClaimed = getClaimAmount(cycleIndex);
  const toTreasury = Math.round(totalClaimed * TREASURY_SHARE * 100) / 100;

  const { buyback: buybackFrac, lp: lpFrac, label: strategy } = getAllocation(cycleIndex, isMigrated);
  const buybackSol = Math.round(toTreasury * buybackFrac * 100) / 100;
  const lpSol = Math.round(toTreasury * lpFrac * 100) / 100;
  const tokens = buybackSol > 0 ? Math.floor(buybackSol / TOKEN_PRICE) : 0;

  const actions: CycleAction[] = [];

  actions.push({ type: "claim", agent: "CLAIM", totalSol: totalClaimed, toTreasury });

  if (buybackSol > 0) {
    actions.push({ type: "buyback", agent: "BUYBACK", sol: buybackSol, tokens });
    actions.push({ type: "burn",    agent: "BURN",    tokens });
  }

  if (lpSol > 0 && isMigrated) {
    actions.push({ type: "addLP", agent: "LP", sol: lpSol });
  }

  let thought = `Claimed ${totalClaimed.toFixed(2)} SOL. ${toTreasury.toFixed(2)} SOL to treasury.`;
  if (buybackSol > 0) {
    thought += ` Strategy: ${strategy}. Routing ${buybackSol.toFixed(2)} SOL to BUYBACK.`;
  }
  if (lpSol > 0 && isMigrated) {
    thought += ` ${lpSol.toFixed(2)} SOL to LP.`;
  }

  actions.push({ type: "thought", agent: "EXEC", text: thought, strategy });

  return { actions, thought, strategy };
}

export const MIGRATED_AFTER_CYCLE = 3;
