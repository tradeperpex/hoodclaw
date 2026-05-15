"use client";

import Link from "next/link";
import { useAgentData } from "@/hooks/useAgentData";
import type { AgentFeedEntry } from "@/lib/agent-types";

const STRATEGY_LABELS: Record<string, { label: string; color: string }> = {
  "burn-heavy":    { label: "Burn Heavy",    color: "var(--red)" },
  "balanced":      { label: "Balanced",      color: "var(--ink2)" },
  "lp-focus":      { label: "LP Focus",      color: "var(--blue)" },
  "full-burn":     { label: "Full Burn",     color: "var(--red)" },
  "full-lp":       { label: "Full LP",       color: "var(--blue)" },
  "bonding-curve": { label: "Bonding Curve", color: "var(--purple)" },
};

export default function ThoughtsPage() {
  const { feedEntries, thought, stats } = useAgentData();

  const thoughts = feedEntries.filter(
    (e: AgentFeedEntry) => e.action === "Thought"
  );

  return (
    <div className="th-page">
      <Link href="/" className="back-link">← Back to home</Link>

      <div className="th-hero">
        <h1 className="th-title">Inside the<br /><em>agent&apos;s mind.</em></h1>
        <p className="th-sub">
          Every cycle, the agent observes the market, reasons about
          what to do, and logs a thought. This page shows every one
          of them — raw, unfiltered, in real-time.
        </p>
      </div>

      {/* Live quote */}
      <div className="th-live-strip">
        <div className="th-live-top">
          <div className="th-live-label">
            <span className="th-live-dot" />
            Live
          </div>
          <div className="th-live-agent">
            <span className="th-live-agent-dot" />
            CLAW
          </div>
        </div>
        <p className="th-live-text">
          {thought || "Agent standing by for next cycle..."}
        </p>
        <div className="th-live-stats">
          <span>{stats.totalClaimed.toFixed(2)} SOL claimed</span>
          <span className="th-live-sep">·</span>
          <span>
            {stats.totalBurned >= 1_000_000
              ? `${(stats.totalBurned / 1_000_000).toFixed(1)}M`
              : stats.totalBurned >= 1_000
                ? `${(stats.totalBurned / 1_000).toFixed(1)}K`
                : stats.totalBurned.toFixed(0)} burned
          </span>
          <span className="th-live-sep">·</span>
          <span>{stats.totalBoughtBack.toFixed(2)} SOL bought back</span>
        </div>
      </div>

      {/* Thought feed */}
      <div className="th-feed">
        {thoughts.length === 0 ? (
          <div className="th-feed-empty">
            <p>No thoughts recorded yet.</p>
            <p>The agent will start logging its reasoning here once the next cycle completes. Each entry is a single short reflection on what just happened on-chain.</p>
          </div>
        ) : (
          <div className="th-feed-grid">
            {thoughts.map((entry: AgentFeedEntry, i: number) => {
              const strat = entry.strategy ? STRATEGY_LABELS[entry.strategy] : null;
              return (
                <div className="th-thought-card" key={i}>
                  <div className="th-thought-top">
                    <div className="th-thought-agent">
                      <span className="th-thought-dot" />
                      CLAW
                    </div>
                    <span className="th-thought-time">{entry.time}</span>
                  </div>
                  <p className="th-thought-text">{entry.detail}</p>
                  {strat && (
                    <div className="th-thought-footer">
                      <span className="th-thought-strat" style={{ color: strat.color }}>
                        Strategy: {strat.label}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
