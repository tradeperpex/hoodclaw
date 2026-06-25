"use client";

import { useEffect, useState } from "react";
import type { AgentFeedEntry } from "@/lib/agent-types";

function shortSig(sig: string) {
  return sig.slice(0, 4) + "…" + sig.slice(-4);
}

const ACTION_AGENT: Record<string, string> = {
  "Claimed fees": "CLAIM",
  "Claim":        "CLAIM",
  "Buyback":      "BUYBACK",
  "Burned tokens":"BURN",
  "Added LP":     "LP",
  "Scanned":      "EXEC",
};

export default function ProofPage() {
  const [entries, setEntries] = useState<AgentFeedEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/agent-stats")
      .then((r) => r.json())
      .then((data) => {
        setEntries(data.feedEntries ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const actions = entries.filter((e) => e.action !== "Thought");
  const txs = actions.filter((e) => e.sig).length;
  const burns = actions.filter((e) => e.action === "Burned tokens").length;
  const buybacks = actions.filter((e) => e.action === "Buyback").length;

  return (
    <div className="page">
      <section>
        <div className="page-label">proof</div>
        <h1 className="page-title">on-chain activity</h1>
        <p className="page-sub">
          Every transaction the company executes — recorded on Solana and verifiable by anyone. Five agents, every action logged.
        </p>
      </section>

      <section className="readout">
        <div className="readout-row"><span className="k">verified txs</span><span className="v">{txs}</span></div>
        <div className="readout-row"><span className="k">total actions</span><span className="v">{actions.length}</span></div>
        <div className="readout-row"><span className="k">burns</span><span className="v">{burns}</span></div>
        <div className="readout-row"><span className="k">buybacks</span><span className="v">{buybacks}</span></div>
      </section>

      <section>
        {loading ? (
          <p className="empty">loading…</p>
        ) : actions.length === 0 ? (
          <p className="empty">no transactions yet. the agents log every claim, buyback, burn and lp add here once the first cycle completes.</p>
        ) : (
          <div className="feed">
            {actions.map((entry, i) => {
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
                  {entry.sig && (
                    <a
                      href={`https://solscan.io/tx/${entry.sig}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="feed-link"
                    >
                      {shortSig(entry.sig)} ↗
                    </a>
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
