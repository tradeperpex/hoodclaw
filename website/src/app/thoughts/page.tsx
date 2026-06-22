"use client";

import { useAgentData } from "@/hooks/useAgentData";
import type { AgentFeedEntry } from "@/lib/agent-types";

export default function ThoughtsPage() {
  const { feedEntries, thought } = useAgentData();

  const thoughts = feedEntries.filter((e: AgentFeedEntry) => e.action === "Thought");

  return (
    <div className="page">
      <section>
        <div className="page-label">thoughts</div>
        <h1 className="page-title">inside the agent</h1>
        <p className="page-sub">
          Every cycle, the agent observes the market, reasons about what to do, and logs a thought.
        </p>
      </section>

      <section>
        <div className="say-who">
          <span className="say-dot" />
          claw · latest
        </div>
        <p className="say-text">{thought || "waiting for next cycle…"}</p>
      </section>

      <section>
        {thoughts.length === 0 ? (
          <p className="empty">no thoughts recorded yet.</p>
        ) : (
          <div className="feed">
            {thoughts.map((entry: AgentFeedEntry, i) => (
              <div className="feed-row" key={i}>
                <div className="feed-meta">
                  <span>claw</span>
                  <span>{entry.time}</span>
                </div>
                <div className="feed-detail">{entry.detail}</div>
                {entry.strategy && (
                  <div className="feed-meta" style={{ marginTop: 8, marginBottom: 0 }}>
                    <span>strategy: {entry.strategy}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
