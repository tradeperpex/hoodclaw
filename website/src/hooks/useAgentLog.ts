"use client";

import { useEffect, useState } from "react";
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

const BOOT_LOG: LogEntry[] = [
  { agent: "EXEC",    msg: "all agents online. standing by." },
  { agent: "CLAIM",   msg: "monitoring fee accumulation." },
  { agent: "BUYBACK", msg: "ready to execute buybacks." },
  { agent: "BURN",    msg: "burn queue empty." },
  { agent: "LP",      msg: "watching graduation status." },
];

export function useAgentLog(): LogEntry[] {
  const { feedEntries } = useAgentData();
  const [log, setLog] = useState<LogEntry[]>(BOOT_LOG);

  useEffect(() => {
    if (!feedEntries || feedEntries.length === 0) return;

    const live = feedEntries
      .slice(0, 20)
      .map(entryToLog);

    setLog(live.length > 0 ? live : BOOT_LOG);
  }, [feedEntries]);

  return log;
}
