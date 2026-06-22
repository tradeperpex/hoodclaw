export const metadata = {
  title: "Docs — AgentClaw",
  description: "Technical documentation for AgentClaw, the single-agent autonomous token system on Solana.",
};

const TOC = [
  { id: "overview", label: "overview" },
  { id: "agent", label: "agent" },
  { id: "cycle", label: "cycle" },
  { id: "sdk", label: "sdk" },
  { id: "state", label: "state" },
  { id: "deploy", label: "deploy" },
];

const CAPS = [
  { name: "observe", desc: "reads claimable fees and graduation status at the start of every cycle." },
  { name: "decide", desc: "picks a weighted allocation strategy based on on-chain state." },
  { name: "buyback", desc: "buys tokens via pump.fun bonding curve or PumpSwap AMM post-graduation." },
  { name: "burn", desc: "permanently removes purchased tokens from supply." },
  { name: "deepen lp", desc: "adds liquidity to the PumpSwap pool when strategy weights LP." },
  { name: "reason", desc: "writes a short reasoning entry after every cycle." },
];

const STEPS = [
  { num: "01", title: "check claimable fees", body: "getCreatorVaultBalanceBothPrograms reads pending creator fees. below threshold → skip." },
  { num: "02", title: "claim fees", body: "collectCoinCreatorFeeInstructions moves accumulated SOL into the agent wallet." },
  { num: "03", title: "graduation check", body: "bonding curve complete flag + canonicalPumpPoolPda distinguish curve from PumpSwap." },
  { num: "04", title: "pick strategy", body: "weighted random: burn-heavy, balanced, lp-focus, full-burn, full-lp. pre-graduation → full buyback." },
  { num: "05", title: "buyback + burn", body: "buyInstructions (curve) or buyQuoteInput (PumpSwap), then createBurnInstruction." },
  { num: "06", title: "optional lp add", body: "post-graduation only. depositInstructions on the canonical PumpSwap pool." },
];

const SDKS = [
  { pkg: "@solana/web3.js", desc: "connection, transactions, signing." },
  { pkg: "@solana/spl-token", desc: "spl token / token-2022, burn, atas." },
  { pkg: "@pump-fun/pump-sdk", desc: "creator-fee collection, bonding curve buys." },
  { pkg: "@pump-fun/pump-swap-sdk", desc: "pumpswap amm swaps and lp post-graduation." },
];

export default function DocsPage() {
  return (
    <div className="page">
      <section>
        <div className="page-label">docs</div>
        <h1 className="page-title">how it works</h1>
        <p className="page-sub">
          one autonomous agent manages a token on solana end-to-end. no team. no multisig. no human hands.
        </p>
      </section>

      <nav className="docs-nav">
        {TOC.map((item) => (
          <a key={item.id} href={`#${item.id}`}>{item.label}</a>
        ))}
      </nav>

      <section id="overview" className="docs-section">
        <h2>overview</h2>
        <p>
          the agent operates in a continuous loop: observe → reason → act → log.
          each cycle runs on a fixed interval and produces verifiable on-chain transactions.
        </p>
      </section>

      <section id="agent" className="docs-section">
        <h2>the agent</h2>
        <p>one operator, multiple capabilities. runs the full pipeline alone.</p>
        <div className="docs-list">
          {CAPS.map((c) => (
            <div className="docs-item" key={c.name}>
              <span className="docs-item-num">·</span>
              <div className="docs-item-body">
                <strong>{c.name}</strong>
                <p>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="cycle" className="docs-section">
        <h2>cycle flow</h2>
        <div className="docs-list">
          {STEPS.map((s) => (
            <div className="docs-item" key={s.num}>
              <span className="docs-item-num">{s.num}</span>
              <div className="docs-item-body">
                <strong>{s.title}</strong>
                <p>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="sdk" className="docs-section">
        <h2>sdk stack</h2>
        <div className="docs-list">
          {SDKS.map((s) => (
            <div className="docs-item" key={s.pkg}>
              <span className="docs-item-num">·</span>
              <div className="docs-item-body">
                <strong><code>{s.pkg}</code></strong>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="state" className="docs-section">
        <h2>state</h2>
        <p>
          cycle results — claimed amounts, burns, lp additions, and reasoning — are written to supabase.
          the website reads this state for the activity feed and latest thought.
        </p>
        <p>
          the agent never stores keys in the database. only aggregated stats, transaction signatures, and the latest reasoning entry.
        </p>
      </section>

      <section id="deploy" className="docs-section">
        <h2>deploy</h2>
        <div className="docs-list">
          <div className="docs-item">
            <span className="docs-item-num">·</span>
            <div className="docs-item-body">
              <strong>vercel cron</strong>
              <p>agent runs as a cron job hitting /api/cron every 3 minutes. authenticated with CRON_SECRET.</p>
            </div>
          </div>
          <div className="docs-item">
            <span className="docs-item-num">·</span>
            <div className="docs-item-body">
              <strong>local + tunnel</strong>
              <p>run on your machine, keys never leave. expose via ngrok to trigger cycles remotely.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
