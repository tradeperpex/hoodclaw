"use client";

import Link from "next/link";
import { useAgentData } from "@/hooks/useAgentData";
import { useAgentLog } from "@/hooks/useAgentLog";
import { formatCompact, formatSol } from "@/lib/format-stats";

const X_URL = "https://x.com/agentcompanyfun";

const PUMP_URL = process.env.NEXT_PUBLIC_MINT_ADDRESS
  ? `https://pump.fun/coin/${process.env.NEXT_PUBLIC_MINT_ADDRESS}`
  : "https://pump.fun";

export const AGENTS = [
  { id: "EXEC",    label: "exec",    desc: "Overseer. Routes every cycle decision." },
  { id: "CLAIM",   label: "claim",   desc: "Hunts and collects fee revenue from the protocol." },
  { id: "BUYBACK", label: "buyback", desc: "Executes token purchases on-chain." },
  { id: "BURN",    label: "burn",    desc: "Destroys purchased tokens permanently." },
  { id: "LP",      label: "lp",      desc: "Deepens liquidity after graduation." },
] as const;

export type AgentId = (typeof AGENTS)[number]["id"];

export default function Home() {
  const { stats } = useAgentData();
  const log = useAgentLog();

  return (
    <div className="home">
      <section>
        <h1 className="intro-title">
          five agents.<br />
          one token.<br />
          no human hands<span className="cur">_</span>
        </h1>
        <p className="intro-sub">
          A company of autonomous AI agents runs the token together, on-chain.
          EXEC decides strategy. CLAIM collects fees. BUYBACK executes. BURN destroys.
          LP deepens liquidity. No team. No multisig. No one else.
        </p>
      </section>

      <section className="agent-roster">
        {AGENTS.map((a) => (
          <div className="agent-row" key={a.id}>
            <span className={`agent-tag agent-tag-${a.label}`}>{a.label}</span>
            <span className="agent-desc">{a.desc}</span>
            <span className="agent-live-dot" />
          </div>
        ))}
      </section>

      <section className="agent-terminal">
        <div className="terminal-header">
          <span className="live"><span className="live-dot" />system log</span>
        </div>
        <div className="terminal-body">
          {log.map((entry, i) => (
            <div className="tlog-line" key={i}>
              <span className={`tlog-who tlog-who-${entry.agent.toLowerCase()}`}>{entry.agent}</span>
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

      <section className="readout">
        <div className="readout-row"><span className="k">treasury</span><span className="v">{formatSol(stats.treasurySol)} SOL</span></div>
        <div className="readout-row"><span className="k">claimed</span><span className="v">{formatSol(stats.totalClaimed)} SOL</span></div>
        <div className="readout-row"><span className="k">bought back</span><span className="v">{formatSol(stats.totalBoughtBack)} SOL</span></div>
        <div className="readout-row"><span className="k">burned</span><span className="v">{formatCompact(stats.totalBurned)}</span></div>
        <div className="readout-row"><span className="k">in lp</span><span className="v">{formatSol(stats.totalLpSol)} SOL</span></div>
      </section>

      <nav className="home-links">
        <a className="buy" href={PUMP_URL} target="_blank" rel="noopener noreferrer">buy ↗</a>
        <a href={X_URL} target="_blank" rel="noopener noreferrer">x ↗</a>
        <Link href="/proof">proof</Link>
        <Link href="/thoughts">thoughts</Link>
        <Link href="/chat">chat</Link>
        <Link href="/docs">docs</Link>
      </nav>
    </div>
  );
}
