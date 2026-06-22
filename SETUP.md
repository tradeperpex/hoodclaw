# AgentClaw setup

## 1. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** → **New query**
3. Paste and run the entire contents of [`supabase/schema.sql`](supabase/schema.sql)
4. Copy from **Settings → API**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

The schema creates one table (`agent_stats`), seeds a default row, and enables public read-only access. The agent cron writes via `service_role`.

## 2. Environment

```bash
cp website/.env.example website/.env.local
```

Fill in every value in `website/.env.local`. Required for the agent to run:

| Variable | What |
|----------|------|
| `AGENT_PRIVATE_KEY` | Base58 secret — must be pump.fun coin creator wallet |
| `MINT_ADDRESS` | Token mint pubkey |
| `NEXT_PUBLIC_MINT_ADDRESS` | Same mint (website links) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `RPC_URL` | Custom Solana RPC (recommended) |
| `CRON_SECRET` | Any random string locally; Vercel sets this in production |

Optional: `KIE_API_KEY` for AI thoughts + chat. `MIN_CLAIM_SOL` defaults to `0.01`.

## 3. Install & run locally

```bash
cd website
npm install
npm run dev
```

Test the agent cycle manually (with `CRON_SECRET` set in `.env.local`):

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/cron
```

## 4. Deploy (Vercel)

- **Root directory:** `website`
- Add all env vars from `website/.env.example`
- Cron runs `/api/cron` every 3 minutes (see `website/vercel.json`)

---

**Flow:** Vercel Cron → `/api/cron` → agent claims fees / buyback / burn / LP on pump.fun → writes to Supabase → website reads via `/api/agent-stats`.
