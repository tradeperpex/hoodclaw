"use client";

import { useEffect, useState } from "react";
import type { AgentFeedEntry } from "@/lib/agent-types";

const TYPE_MAP: Record<string, { label: string; color: string; bg: string }> = {
  "Claimed fees":  { label: "Claim",   color: "#059669", bg: "rgba(5,150,105,0.08)" },
  "Buyback":       { label: "Buyback", color: "#2563EB", bg: "rgba(37,99,235,0.08)" },
  "Burned tokens": { label: "Burn",    color: "#DC2626", bg: "rgba(220,38,38,0.08)" },
  "Added LP":      { label: "LP",      color: "#7C3AED", bg: "rgba(124,58,237,0.08)" },
  "Scanned":       { label: "Scan",    color: "#9CA3AF", bg: "rgba(156,163,175,0.06)" },
};

function shortenSig(sig: string): string {
  return sig.slice(0, 6) + "…" + sig.slice(-6);
}

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

  const actionEntries = entries.filter((e) => e.action !== "Thought");
  const txEntries = actionEntries.filter((e) => e.sig);
  const burns = actionEntries.filter((e) => e.action === "Burned tokens").length;
  const buybacks = actionEntries.filter((e) => e.action === "Buyback").length;

  return (
    <div className="prf">
      {/* Hero */}
      <div className="prf-hero">
        <span className="prf-hero-eyebrow">On-Chain Proof</span>
        <h1 className="prf-hero-title">
          Every action,<br /><em>verified.</em>
        </h1>
        <p className="prf-hero-sub">
          Every transaction the agent has ever executed — recorded on Solana
          and verifiable by anyone. Click any signature to inspect it on Solscan.
        </p>
      </div>

      {/* Stats strip */}
      <div className="prf-stats">
        <div className="prf-stat">
          <span className="prf-stat-num">{txEntries.length}</span>
          <span className="prf-stat-label">Verified Txs</span>
        </div>
        <div className="prf-stat-divider" />
        <div className="prf-stat">
          <span className="prf-stat-num">{actionEntries.length}</span>
          <span className="prf-stat-label">Total Actions</span>
        </div>
        <div className="prf-stat-divider" />
        <div className="prf-stat">
          <span className="prf-stat-num">{burns}</span>
          <span className="prf-stat-label">Burns</span>
        </div>
        <div className="prf-stat-divider" />
        <div className="prf-stat">
          <span className="prf-stat-num">{buybacks}</span>
          <span className="prf-stat-label">Buybacks</span>
        </div>
      </div>

      {/* Feed */}
      {loading ? (
        <div className="prf-empty">Loading transactions...</div>
      ) : actionEntries.length === 0 ? (
        <div className="prf-empty">
          <p className="prf-empty-title">No transactions yet</p>
          <p>The agent will start logging on-chain actions here after the first cycle completes. Each transaction is verified on Solana and linked directly to Solscan.</p>
        </div>
      ) : (
        <div className="prf-feed">
          {actionEntries.map((entry, i) => {
            const mapped = TYPE_MAP[entry.action] ?? { label: entry.action, color: "#9CA3AF", bg: "rgba(156,163,175,0.06)" };
            return (
              <div className="prf-card" key={i}>
                <div className="prf-card-top">
                  <span className="prf-card-badge" style={{ color: mapped.color, background: mapped.bg }}>
                    {mapped.label}
                  </span>
                  <span className="prf-card-time">{entry.time}</span>
                </div>
                <p className="prf-card-detail">{entry.detail}</p>
                {entry.sig && (
                  <a
                    href={`https://solscan.io/tx/${entry.sig}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="prf-card-sig"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    {shortenSig(entry.sig)}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
