const TOC = [
  { id: "overview",  label: "overview" },
  { id: "agents",    label: "agents" },
  { id: "cycle",     label: "cycle" },
  { id: "sdk",       label: "sdk" },
  { id: "state",     label: "state" },
  { id: "deploy",    label: "deploy" },
];

const AGENT_CARDS = [
  {
    id:   "exec",
    tag:  "exec",
    name: "EXEC · The Overseer",
    desc: "Wakes every cycle, reads on-chain state, picks an allocation strategy (burn-heavy, balanced, lp-focus, full-burn, full-LP), and routes orders to the other four agents. Logs a reasoning entry after every cycle.",
  },
  {
    id:   "claim",
    tag:  "claim",
    name: "CLAIM · The Fee Hunter",
    desc: "Monitors the treasury wallet on Robinhood Chain for accumulated trading fees. When balance crosses the threshold, CLAIM collects ETH into the agent wallet.",
  },
  {
    id:   "buyback",
    tag:  "buyback",
    name: "BUYBACK · The Buyer",
    desc: "Receives an ETH amount from EXEC and executes the purchase on Uniswap on Robinhood Chain. Optimizes for slippage and execution quality.",
  },
  {
    id:   "burn",
    tag:  "burn",
    name: "BURN · The Destroyer",
    desc: "Takes tokens bought by BUYBACK and permanently removes them from supply via ERC-20 burn. Irreversible. Every cycle can shrink supply.",
  },
  {
    id:   "lp",
    tag:  "lp",
    name: "LP · The Pooler",
    desc: "When EXEC allocates to LP, this agent adds ETH liquidity to the Uniswap pool on Robinhood Chain and deepens the book.",
  },
];

const STEPS = [
  { num: "01", title: "check claimable fees",  agent: "CLAIM",   body: "Reads pending ETH fees in the treasury. Below threshold → skip cycle." },
  { num: "02", title: "claim fees",             agent: "CLAIM",   body: "Collects accumulated trading fees into the agent wallet on Robinhood Chain." },
  { num: "03", title: "decide strategy",        agent: "EXEC",    body: "Weighted random: burn-heavy, balanced, lp-focus, full-burn, full-lp." },
  { num: "04", title: "route execution",        agent: "EXEC",    body: "Splits the cycle budget across buyback and LP based on pool state and recent volume." },
  { num: "05", title: "buyback",                agent: "BUYBACK", body: "Swaps ETH for tokens on Uniswap. Tokens land in the agent wallet." },
  { num: "06", title: "burn",                   agent: "BURN",    body: "ERC-20 burn permanently removes purchased tokens from supply." },
  { num: "07", title: "optional lp add",        agent: "LP",      body: "Adds ETH liquidity to the Uniswap pool when strategy allocates to LP." },
  { num: "08", title: "log reasoning",          agent: "EXEC",    body: "Reasoning entry written to Supabase. Captures strategy, action taken, and market observation." },
];

const SDKS = [
  { pkg: "viem", desc: "Robinhood Chain RPC, wallet, contract calls." },
  { pkg: "Uniswap v3", desc: "ETH → token swaps and LP on Robinhood Chain." },
  { pkg: "@supabase/supabase-js", desc: "public stats feed and reasoning log." },
];

export default function DocsPage() {
  return (
    <div className="page">
      <section>
        <div className="page-label">docs</div>
        <h1 className="page-title">how it works</h1>
        <p className="page-sub">
          HoodClaw is an autonomous agent powered by Claude Fable 5. It manages one token on Robinhood Chain end-to-end with ETH. No team. No multisig. No human hands.
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
          HoodClaw operates in a continuous loop: observe, decide, claim, buy, burn, deepen, log. Each cycle produces verifiable on-chain transactions on Robinhood Chain. Claude Fable 5 drives the reasoning. Five execution roles handle the on-chain work.
        </p>
      </section>

      <section id="agents" className="docs-section">
        <h2>execution roles</h2>
        <p>One Fable 5 mind. Five specialised on-chain roles. Each owns one step in the pipeline.</p>
        <div className="docs-list">
          {AGENT_CARDS.map((a) => (
            <div className="agent-card" key={a.id}>
              <span className={`agent-tag agent-tag-${a.tag} agent-card-tag`}>{a.tag}</span>
              <div className="agent-card-body">
                <strong>{a.name}</strong>
                <p>{a.desc}</p>
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
                <strong>
                  {s.title}
                  <span style={{ fontWeight: 400, marginLeft: 8 }}>
                    <span className={`agent-tag agent-tag-${s.agent.toLowerCase()}`} style={{ fontSize: 9, padding: "2px 6px" }}>{s.agent.toLowerCase()}</span>
                  </span>
                </strong>
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
          cycle results · claimed amounts, burns, lp additions, and exec reasoning · are written to supabase. the website reads this state for the activity feed and latest thought.
        </p>
        <p>
          the agents never store keys in the database. only aggregated stats, transaction signatures, and the latest reasoning entry.
        </p>
      </section>

      <section id="deploy" className="docs-section">
        <h2>deploy</h2>
        <div className="docs-list">
          <div className="docs-item">
            <span className="docs-item-num">·</span>
            <div className="docs-item-body">
              <strong>vercel cron</strong>
              <p>the company runs as a cron job hitting /api/cron every 3 minutes. authenticated with CRON_SECRET.</p>
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
