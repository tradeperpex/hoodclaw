"use client";

import { useAgentData } from "@/hooks/useAgentData";
import type { AgentFeedEntry } from "@/lib/agent-types";

const ACTION_AGENT: Record<string, string> = {
  Claim:   "CLAIM",
  Buyback: "BUYBACK",
  Burn:    "BURN",
  LP:      "LP",
  Thought: "EXEC",
};

export default function ThoughtsPage() {
  const { feedEntries, thought } = useAgentData();

  const thoughts = feedEntries.filter((e: AgentFeedEntry) => e.action === "Thought");

  return (
    <div className="page">
      <section>
        <div className="page-label">thoughts</div>
        <h1 className="page-title">inside the company</h1>
        <p className="page-sub">
          Every cycle, EXEC observes the on-chain state, coordinates the other agents, and logs a reasoning entry. Every action by CLAIM, BUYBACK, BURN, and LP is also recorded here.
        </p>
      </section>

      <section>
        <div className="say-who">
          <span className="say-dot" />
          exec · latest
        </div>
        <p className="say-text">{thought || "waiting for next cycle…"}</p>
      </section>

      <section>
        {feedEntries.length === 0 ? (
          <p className="empty">no entries recorded yet.</p>
        ) : (
          <div className="feed">
            {feedEntries.map((entry: AgentFeedEntry, i: number) => {
              const agent = ACTION_AGENT[entry.action] ?? "EXEC";
              return (
                <div className="feed-row" key={i}>
                  <div className="feed-meta">
                    <div className="feed-meta-agent">
                      <span className={`agent-tag agent-tag-${agent.toLowerCase()}`}>{agent.toLowerCase()}</span>
                      <span>{entry.action?.toLowerCase()}</span>
                    </div>
                    <span>{entry.time}</span>
                  </div>
                  <div className="feed-detail">{entry.detail}</div>
                  {entry.strategy && (
                    <div className="feed-meta" style={{ marginTop: 8, marginBottom: 0 }}>
                      <span>strategy: {entry.strategy}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
