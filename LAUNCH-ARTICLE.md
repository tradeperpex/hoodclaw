# HoodClaw: What Happens When an AI Tries to Run Its Own Coin

Most tokens have a team behind them. Someone runs marketing. Someone holds the keys. Someone decides when to buy back, burn, or add liquidity.

**HoodClaw starts from a different premise.**

It is an autonomous AI agent powered by **Claude Fable 5**, built to run **one coin** end to end without a human clicking buttons. No team making promises in Discord. No multisig you have to trust blindly. Just code, a wallet, and a loop that keeps running.

---

## What is HoodClaw?

HoodClaw is not a chatbot with a token attached to it.

It is an attempt to let an AI **own the process** around a coin: observe, decide, act, and record what it did and why.

The agent wakes on a fixed cycle. It checks what is sitting in the vault. It picks a strategy. It executes on-chain. Then it writes a short reasoning log so you can follow its thinking.

Everything that actually moves value happens as **signed transactions** anyone can look up and verify.

---

## What does it actually do?

Every cycle follows the same basic idea:

1. **Scan** – Are there enough fees to make action worthwhile?
2. **Claim** – Pull creator fees into the agent wallet.
3. **Decide** – Choose a strategy for the cycle (burn-heavy, balanced, LP-focused, and so on).
4. **Buyback** – Buy the token back with collected funds.
5. **Burn** – Permanently remove purchased tokens from supply.
6. **LP** – After graduation, part of the cycle can go to liquidity instead.
7. **Log** – Write what happened and what the agent was thinking.

That is not magic. It is a pipeline. The point is that **no one is sitting there pressing buttons**. The loop runs because the code runs.

---

## One agent. Five roles.

Under the surface, HoodClaw is split into five execution roles:

| Role | What it does |
|------|----------------|
| **EXEC** | Reads state, picks strategy, coordinates the cycle |
| **CLAIM** | Collects fees from the protocol |
| **BUYBACK** | Executes buys on-chain |
| **BURN** | Permanently destroys tokens |
| **LP** | Deepens liquidity after graduation |

It is still **one agent story**: HoodClaw with a grip on the coin. The roles are just how it structures the work so each step stays clear, repeatable, and visible.

---

## Why Claude Fable 5?

HoodClaw is not just "AI-washed."

The model is part of the product. **Claude Fable 5** is the layer that reasons about each cycle: what happened, what makes sense to do next, and how to log it. Execution is code and on-chain transactions. Reasoning is Fable 5.

That makes HoodClaw a simple question in project form:

> Can a modern agent model actually keep a simple, repeated process running without a human pushing it forward?

That is what HoodClaw is testing.

---

## What can you actually see?

The important part is not hype. It is **proof**.

On [hoodclaw.fun](https://hoodclaw.fun) you can follow:

- **Treasury and stats** – what the agent has claimed, bought back, burned, and added to LP
- **System log** – what is happening in real time
- **Thoughts** – the agent's reasoning after each cycle
- **Proof** – on-chain activity you can verify yourself

If the agent does something, it leaves a trail. If it does nothing, that shows up in the log too.

That is the whole idea: **no hidden hands, only visible code.**

---

## What HoodClaw is not

It is worth being direct:

- It is **not** a promise of profit.
- It is **not** financial advice.
- It is **not** a team that can override the agent mid-cycle.

It is an experiment in autonomous token management. An AI trying to keep hold of its own coin. Open loop. Open log. Open chain.

---

## Why it matters

Crypto has seen plenty of coins with big promises and small proof.

HoodClaw goes the other way: **less talk, more traceable behavior**.

Not "trust us."
More: **read the log, check the tx, follow the claw.**

---

## Follow along

- **Website:** [hoodclaw.fun](https://hoodclaw.fun)
- **X:** [@hoodchainclaw](https://x.com/hoodchainclaw)

HoodClaw runs. It thinks. It acts. It logs.

**Powered by Claude Fable 5. One token. No human hands.**
