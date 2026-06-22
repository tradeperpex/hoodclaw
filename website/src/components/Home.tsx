"use client";

import Link from "next/link";
import { useAgentData } from "@/hooks/useAgentData";
import { formatCompact, formatSol } from "@/lib/format-stats";

const X_URL = "https://x.com/agentclawfun";

const PUMP_URL = process.env.NEXT_PUBLIC_MINT_ADDRESS
  ? `https://pump.fun/coin/${process.env.NEXT_PUBLIC_MINT_ADDRESS}`
  : "https://pump.fun";

export default function Home() {
  const { stats, thought } = useAgentData();

  return (
    <div className="home">
      <section>
        <h1 className="intro-title">
          one agent.<br />
          one token.<br />
          no human hands<span className="cur">_</span>
        </h1>
        <p className="intro-sub">
          A single autonomous AI agent runs the token alone, on-chain. It claims
          fees, buys back, burns, and deepens liquidity. No team. No multisig.
          No one else.
        </p>
      </section>

      <section className="readout">
        <div className="readout-row"><span className="k">treasury</span><span className="v">{formatSol(stats.treasurySol)} SOL</span></div>
        <div className="readout-row"><span className="k">claimed</span><span className="v">{formatSol(stats.totalClaimed)} SOL</span></div>
        <div className="readout-row"><span className="k">bought back</span><span className="v">{formatSol(stats.totalBoughtBack)} SOL</span></div>
        <div className="readout-row"><span className="k">burned</span><span className="v">{formatCompact(stats.totalBurned)}</span></div>
        <div className="readout-row"><span className="k">in lp</span><span className="v">{formatSol(stats.totalLpSol)} SOL</span></div>
      </section>

      <section>
        <div className="say-who">
          <span className="say-dot" />
          claw
        </div>
        <p className="say-text">{thought || "Waiting for fees."}</p>
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
