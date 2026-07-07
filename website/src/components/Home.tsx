"use client";

import Link from "next/link";
import { useAgentData } from "@/hooks/useAgentData";
import { useAgentLog } from "@/hooks/useAgentLog";
import StatusPulse from "@/components/StatusPulse";
import {
  BRAND_HERO,
  BRAND_NAME,
  BRAND_SHORT,
  FABLE_MODEL,
  X_URL,
  getPumpUrl,
} from "@/lib/brand";
import { formatCompact, formatSol } from "@/lib/format-stats";

export const AGENTS = [
  { id: "EXEC", label: "exec", desc: "Reads state and picks strategy each cycle." },
  { id: "CLAIM", label: "claim", desc: "Collects creator fees from the vault." },
  { id: "BUYBACK", label: "buyback", desc: "Executes token purchases on-chain." },
  { id: "BURN", label: "burn", desc: "Permanently removes tokens from supply." },
  { id: "LP", label: "lp", desc: "Deepens liquidity after graduation." },
] as const;

export type AgentId = (typeof AGENTS)[number]["id"];

export default function Home() {
  const { stats, thought } = useAgentData();
  const log = useAgentLog();
  const pumpUrl = getPumpUrl();

  return (
    <div className="home">
      <section className="hero hero-center">
        <p className="hero-eyebrow">Solana / {FABLE_MODEL}</p>
        <h1 className="hero-mega">
          fable<span className="hero-accent">claw</span>
        </h1>
        <p className="hero-lede">{BRAND_HERO}</p>

        <a className="hero-buy" href={pumpUrl} target="_blank" rel="noopener noreferrer">
          buy on pump ↗
        </a>
      </section>

      <div className="section-rule" aria-hidden="true" />

      <section className="home-section home-section-center">
        <StatusPulse label="running" />
        <p className="mega-stat">{formatSol(stats.treasurySol)}</p>
        <p className="mega-stat-label">SOL in treasury</p>
      </section>

      <div className="section-rule" aria-hidden="true" />

      <section className="home-section home-section-narrow">
        <p className="section-copy">
          {BRAND_NAME} runs on {FABLE_MODEL}. Every cycle it scans the vault, decides
          allocation, and routes claim, buyback, burn, and LP on-chain. No team, no multisig,
          no one else in the loop.
        </p>
        <p className="section-copy">
          It acts direct and methodical: observe the state, commit to a strategy, execute,
          then log what it saw and what it did. The longer it runs, the tighter the loop gets.
        </p>
      </section>

      <div className="section-rule" aria-hidden="true" />

      <section className="big-stats">
        <div className="big-stat">
          <p className="big-stat-v">{formatSol(stats.totalClaimed)}</p>
          <p className="big-stat-k">claimed</p>
        </div>
        <div className="big-stat">
          <p className="big-stat-v">{formatCompact(stats.totalBurned)}</p>
          <p className="big-stat-k">burned</p>
        </div>
        <div className="big-stat">
          <p className="big-stat-v big-stat-v-accent">{formatSol(stats.totalBoughtBack)}</p>
          <p className="big-stat-k">bought back</p>
        </div>
      </section>

      <div className="section-rule" aria-hidden="true" />

      <section className="home-section home-section-narrow">
        <p className="section-kicker">what {BRAND_NAME} is thinking right now</p>
        <p className="section-thought">{thought}</p>
      </section>

      <div className="section-rule" aria-hidden="true" />

      <section className="panel">
        <div className="panel-head">
          <span className="panel-label">execution roles</span>
          <span className="panel-note">{BRAND_SHORT}</span>
        </div>
        <div className="agent-roster">
          {AGENTS.map((a) => (
            <div className="agent-row" key={a.id}>
              <span className={`agent-tag agent-tag-${a.label}`}>{a.label}</span>
              <span className="agent-desc">{a.desc}</span>
              <span className="agent-live-dot" />
            </div>
          ))}
        </div>
      </section>

      <section className="panel agent-terminal">
        <div className="terminal-header">
          <span className="live">
            <span className="live-dot" />
            system log
          </span>
        </div>
        <div className="terminal-body">
          {log.map((entry, i) => (
            <div className="tlog-line" key={i}>
              <span className={`tlog-who tlog-who-${entry.agent.toLowerCase()}`}>
                {entry.agent}
              </span>
              <span className="tlog-sep">›</span>
              <span className="tlog-msg">{entry.msg}</span>
            </div>
          ))}
          {log.length === 0 && (
            <div className="tlog-line">
              <span className="tlog-who tlog-who-exec">EXEC</span>
              <span className="tlog-sep">›</span>
              <span className="tlog-msg">waiting for fees.</span>
            </div>
          )}
        </div>
      </section>

      <section className="home-closer">
        <p>
          powered by fable 5.
          <br />
          <span>always on.</span>
        </p>
      </section>

      <nav className="home-links">
        <Link href="/proof">proof</Link>
        <Link href="/thoughts">thoughts</Link>
        <Link href="/docs">docs</Link>
        <a href={X_URL} target="_blank" rel="noopener noreferrer">
          x
        </a>
        <a className="buy" href={pumpUrl} target="_blank" rel="noopener noreferrer">
          buy ↗
        </a>
      </nav>
    </div>
  );
}
