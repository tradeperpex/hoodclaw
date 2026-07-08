"use client";

import { useEffect, useMemo, useState } from "react";
import { useLiveAgentData } from "@/hooks/useLiveAgentData";
import type { AgentFeedEntry } from "@/lib/agent-types";
import { BRAND_NAME, AGENT_MODEL } from "@/lib/brand";
import { formatCompact, formatSol } from "@/lib/format-stats";

const ACTION_AGENT: Record<string, string> = {
  Claim: "CLAIM",
  "Claimed fees": "CLAIM",
  Buyback: "BUYBACK",
  Burn: "BURN",
  "Burned tokens": "BURN",
  "Added LP": "LP",
  LP: "LP",
  Thought: "EXEC",
  Scanned: "EXEC",
};

function shortSig(sig: string) {
  return sig.slice(0, 4) + "…" + sig.slice(-4);
}

function formatWhen(iso: string | null, fallback: Date | null) {
  const raw = iso ?? fallback?.toISOString() ?? null;
  if (!raw) return "waiting…";
  try {
    return new Date(raw).toLocaleString("da-DK", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return raw;
  }
}

function secondsSince(date: Date | null, now: number) {
  if (!date) return null;
  return Math.max(0, Math.floor((now - date.getTime()) / 1000));
}

function FeedRow({ entry, index }: { entry: AgentFeedEntry; index: number }) {
  const agent = ACTION_AGENT[entry.action] ?? entry.agent ?? "EXEC";
  const isThought = entry.action === "Thought";

  return (
    <div className={`live-feed-row${isThought ? " live-feed-row-thought" : ""}`} key={`${entry.time}-${index}`}>
      <div className="live-feed-meta">
        <span className={`agent-tag agent-tag-${agent.toLowerCase()}`}>{agent.toLowerCase()}</span>
        <span className="live-feed-action">{entry.action?.toLowerCase() ?? "event"}</span>
        <span className="live-feed-time">{entry.time}</span>
      </div>
      <p className="live-feed-detail">{entry.detail}</p>
      {entry.strategy ? <p className="live-feed-strategy">strategy: {entry.strategy}</p> : null}
      {entry.sig ? (
        <a
          href={`https://solscan.io/tx/${entry.sig}`}
          target="_blank"
          rel="noopener noreferrer"
          className="feed-link"
        >
          {shortSig(entry.sig)} ↗
        </a>
      ) : null}
    </div>
  );
}

export default function LivePage() {
  const { stats, thought, thoughtMeta, feedEntries, updatedAt, lastFetched, loading, error } =
    useLiveAgentData();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, []);

  const ago = secondsSince(lastFetched, now);
  const actions = useMemo(
    () => (feedEntries ?? []).filter((e) => e.action !== "Thought"),
    [feedEntries],
  );
  const thoughts = useMemo(
    () => (feedEntries ?? []).filter((e) => e.action === "Thought"),
    [feedEntries],
  );
  const terminal = useMemo(() => {
    const rows = (feedEntries ?? []).slice(0, 30);
    if (rows.length === 0) {
      return [{ agent: "EXEC", msg: loading ? "connecting to agent state…" : "no feed entries yet." }];
    }
    return rows.map((e) => ({
      agent: ACTION_AGENT[e.action] ?? "EXEC",
      msg: e.detail,
    }));
  }, [feedEntries, loading]);

  return (
    <div className="live-page">
      <header className="live-header">
        <div className="live-header-main">
          <div className="live-badge">
            <span className="live-dot" aria-hidden="true" />
            live
          </div>
          <div>
            <h1 className="live-title">agent monitor</h1>
            <p className="live-sub">
              {BRAND_NAME} · {AGENT_MODEL} · auto refresh every 5s
            </p>
          </div>
        </div>
        <div className="live-meta">
          <div className="live-meta-row">
            <span className="k">client</span>
            <span className="v">{ago === null ? "…" : `${ago}s ago`}</span>
          </div>
          <div className="live-meta-row">
            <span className="k">server</span>
            <span className="v">{formatWhen(updatedAt, lastFetched)}</span>
          </div>
          {error ? (
            <div className="live-meta-row live-meta-error">
              <span className="k">error</span>
              <span className="v">{error}</span>
            </div>
          ) : null}
        </div>
      </header>

      <section className="live-stats">
        <div className="live-stat live-stat-hero">
          <span className="live-stat-k">treasury</span>
          <span className="live-stat-v">{formatSol(stats.treasurySol)}</span>
          <span className="live-stat-u">SOL</span>
        </div>
        <div className="live-stat">
          <span className="live-stat-k">claimed</span>
          <span className="live-stat-v">{formatCompact(stats.totalClaimed)}</span>
        </div>
        <div className="live-stat">
          <span className="live-stat-k">creator share</span>
          <span className="live-stat-v">{formatCompact(stats.totalCreatorShare)}</span>
        </div>
        <div className="live-stat">
          <span className="live-stat-k">buyback</span>
          <span className="live-stat-v">{formatCompact(stats.totalBoughtBack)}</span>
        </div>
        <div className="live-stat">
          <span className="live-stat-k">burned</span>
          <span className="live-stat-v">{formatCompact(stats.totalBurned)}</span>
        </div>
        <div className="live-stat">
          <span className="live-stat-k">lp sol</span>
          <span className="live-stat-v">{formatSol(stats.totalLpSol)}</span>
        </div>
      </section>

      <div className="live-grid">
        <section className="live-panel live-panel-thought">
          <div className="live-panel-head">
            <span className="live-panel-label">current thought</span>
            <span className="live-panel-meta">{thoughtMeta}</span>
          </div>
          <p className="live-thought">{thought}</p>
        </section>

        <section className="live-panel live-panel-terminal">
          <div className="live-panel-head">
            <span className="live-panel-label">system log</span>
            <span className="live-panel-meta">{terminal.length} lines</span>
          </div>
          <div className="terminal live-terminal">
            {terminal.map((line, i) => (
              <div className="terminal-line" key={i}>
                <span className="terminal-agent">{line.agent}</span>
                <span className="terminal-msg">{line.msg}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="live-panel">
        <div className="live-panel-head">
          <span className="live-panel-label">feed</span>
          <span className="live-panel-meta">
            {feedEntries.length} entries · {actions.length} actions · {thoughts.length} thoughts
          </span>
        </div>
        {feedEntries.length === 0 ? (
          <p className="empty">{loading ? "loading feed…" : "no feed entries yet."}</p>
        ) : (
          <div className="live-feed">
            {feedEntries.map((entry, i) => (
              <FeedRow entry={entry} index={i} key={`feed-${i}`} />
            ))}
          </div>
        )}
      </section>

      <p className="live-foot">
        secret monitor · not linked from public site
      </p>
    </div>
  );
}
