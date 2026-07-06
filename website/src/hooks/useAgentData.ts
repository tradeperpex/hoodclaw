"use client";

import { useState, useEffect } from "react";
import type { AgentState } from "@/lib/agent-types";

const DEFAULT_POLL_MS = 15_000;

export type AgentDataResult = AgentState & {
  lastFetched: Date | null;
  loading: boolean;
  error: string | null;
};

export function useAgentData(
  pollMs: number = DEFAULT_POLL_MS,
  fresh = false,
): AgentDataResult {
  const [state, setState] = useState<AgentState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const url = fresh ? "/api/agent-stats?fresh=1" : "/api/agent-stats";
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) {
          const err = await res.json().catch(async () => ({ error: await res.text() }));
          throw new Error(err.error || "Error");
        }
        const data = await res.json();
        setState(data);
        setError(null);
        setLastFetched(new Date());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const iv = setInterval(fetchStats, pollMs);
    return () => clearInterval(iv);
  }, [pollMs, fresh]);

  const empty: AgentState = {
    thought: error ? `Error: ${error}` : "Waiting for fees.",
    thoughtMeta: "· FableClaw",
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

  return { ...(state ?? empty), lastFetched, loading, error };
}
