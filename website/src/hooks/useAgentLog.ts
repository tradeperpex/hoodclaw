"use client";

import { useMemo } from "react";
import { useAgentData } from "@/hooks/useAgentData";
import type { AgentFeedEntry } from "@/lib/agent-types";

export interface LogEntry {
  agent: string;
  msg: string;
}

const ACTION_AGENT: Record<string, string> = {
  Claim:   "CLAIM",
  Buyback: "BUYBACK",
  Burn:    "BURN",
  LP:      "LP",
  Thought: "EXEC",
};

function entryToLog(e: AgentFeedEntry): LogEntry {
  const agent = ACTION_AGENT[e.action] ?? "EXEC";
  return { agent, msg: e.detail };
}

export function useAgentLog(): LogEntry[] {
  const { feedEntries } = useAgentData();

  return useMemo(() => {
    if (!feedEntries || feedEntries.length === 0) return [];
    return feedEntries.slice(0, 20).map(entryToLog);
  }, [feedEntries]);
}
