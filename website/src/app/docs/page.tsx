export const metadata = {
  title: "Docs — OnlyClaw",
  description: "Technical documentation for OnlyClaw, the single-agent autonomous token system on Solana.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "agent", label: "The Agent" },
  { id: "cycle", label: "Cycle Flow" },
  { id: "sdk", label: "SDK Stack" },
  { id: "state", label: "State & Persistence" },
  { id: "deploy", label: "Deployment" },
];

const CAPS = [
  { name: "Observe", desc: "Reads the creator vault, pool depth, and migration status at the start of every cycle." },
  { name: "Decide", desc: "Picks a weighted allocation strategy — burn-heavy, balanced, LP-focus, full-burn, or full-LP — based on on-chain state." },
  { name: "Buyback", desc: "Executes the purchase via the Pump.fun bonding curve SDK or the PumpSwap AMM, depending on migration status." },
  { name: "Burn", desc: "Permanently removes purchased tokens from supply via Token-2022 burn instructions." },
  { name: "Deepen LP", desc: "Adds liquidity to the pool post-migration when the strategy weights LP allocation." },
  { name: "Reason", desc: "Writes a short reasoning entry after every cycle. Stored and visible on the public dashboard." },
];

export default function DocsPage() {
  return (
    <div className="docs">
      <div className="docs-hero">
        <div className="docs-hero-label">Documentation</div>
          <h1 className="docs-hero-title">How OnlyClaw works</h1>
        <p className="docs-hero-sub">
          Everything you need to understand the single-agent system behind the token.
        </p>
      </div>

      <div className="docs-layout">
        <aside className="docs-toc">
          <div className="docs-toc-label">On this page</div>
          <nav className="docs-toc-nav">
            {TOC.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="docs-toc-link">
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <article className="docs-content">
          <section id="overview">
            <h2>Overview</h2>
            <p>
              OnlyClaw is one autonomous AI agent that manages a token on
              Solana end-to-end. The agent observes the market, reasons about
              allocation, and executes actions on-chain — without human
              intervention.
            </p>
            <p>
              The agent operates in a continuous loop: <strong>observe → reason → act → log</strong>.
              Each cycle runs on a fixed interval and produces verifiable on-chain transactions.
            </p>
          </section>

          <section id="agent">
            <h2>The Agent</h2>
            <p>
              One operator, multiple capabilities. The agent runs the full pipeline alone — no
              committee, no multisig, no co-pilot.
            </p>
            <div className="docs-agent-grid">
              {CAPS.map((c) => (
                <div className="docs-agent" key={c.name}>
                  <div className="docs-agent-name">{c.name}</div>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="cycle">
            <h2>Cycle Flow</h2>
            <div className="docs-steps">
              <div className="docs-step">
                <span className="docs-step-num">01</span>
                <div>
                  <strong>Check vault balance</strong>
                  <p><code>getCreatorVaultBalanceBothPrograms</code> reads pending fees. Below threshold → skip.</p>
                </div>
              </div>
              <div className="docs-step">
                <span className="docs-step-num">02</span>
                <div>
                  <strong>Claim fees</strong>
                  <p><code>collectCoinCreatorFeeInstructions</code> moves accumulated SOL into the agent&apos;s wallet.</p>
                </div>
              </div>
              <div className="docs-step">
                <span className="docs-step-num">03</span>
                <div>
                  <strong>Migration check</strong>
                  <p><code>getMinimumDistributableFee</code> determines bonding curve vs. PumpSwap AMM status.</p>
                </div>
              </div>
              <div className="docs-step">
                <span className="docs-step-num">04</span>
                <div>
                  <strong>Pick strategy</strong>
                  <p>Weighted random selection between burn-heavy, balanced, LP-focus, full-burn, full-LP. Pre-migration → always full buyback.</p>
                </div>
              </div>
              <div className="docs-step">
                <span className="docs-step-num">05</span>
                <div>
                  <strong>Buyback + Burn</strong>
                  <p>The agent buys tokens, measures the delta, then burns exactly the bought amount via <code>createBurnInstruction</code> on Token-2022.</p>
                </div>
              </div>
              <div className="docs-step">
                <span className="docs-step-num">06</span>
                <div>
                  <strong>Optional LP add</strong>
                  <p>Post-migration only. <code>depositInstructions</code> adds liquidity when the chosen strategy weights LP.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="sdk">
            <h2>SDK Stack</h2>
            <div className="docs-sdk-grid">
              <div className="docs-sdk-item">
                <code>@solana/web3.js</code>
                <p>Connection, transaction construction, signing.</p>
              </div>
              <div className="docs-sdk-item">
                <code>@solana/spl-token</code>
                <p>Token-2022 program, burn instructions, ATAs.</p>
              </div>
              <div className="docs-sdk-item">
                <code>@pump-fun/pump-sdk</code>
                <p>Fee collection, bonding curve, buy instructions.</p>
              </div>
              <div className="docs-sdk-item">
                <code>@pump-fun/pump-swap-sdk</code>
                <p>AMM swaps and LP deposits post-migration.</p>
              </div>
            </div>
          </section>

          <section id="state">
            <h2>State &amp; Persistence</h2>
            <p>
              Cycle results — claimed amounts, burns, LP additions, and the agent&apos;s reasoning — are
              written to Supabase. The website reads this state to display the activity feed and the
              latest thought.
            </p>
            <p>
              The agent never stores keys in the database; only aggregated stats, transaction
              signatures, and the latest reasoning entry. All token operations use Token-2022
              (SPL Token 2022 program).
            </p>
          </section>

          <section id="deploy">
            <h2>Deployment</h2>
            <div className="docs-deploy-modes">
              <div className="docs-deploy-mode">
                <h3>Vercel Cron</h3>
                <p>
                  The agent runs as a Vercel Cron job hitting <code>/api/cron</code> every 3 minutes.
                  Authenticated with <code>CRON_SECRET</code>.
                </p>
              </div>
              <div className="docs-deploy-mode">
                <h3>Local + Tunnel</h3>
                <p>
                  Run on your machine, keys never leave. Expose via a tunnel (e.g. ngrok)
                  so the website can trigger cycles remotely.
                </p>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
