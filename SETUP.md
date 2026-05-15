# SingleClaw setup

## 1. Supabase

1. Opret projekt på [supabase.com](https://supabase.com)
2. Gå til SQL Editor og kør:

```sql
create table if not exists agent_stats (
  id text primary key default 'default',
  total_claimed numeric default 0,
  total_creator_share numeric default 0,
  total_burned numeric default 0,
  total_bought_back numeric default 0,
  total_lp_sol numeric default 0,
  treasury_sol numeric default 0,
  thought text default '',
  thought_meta text default '',
  feed_entries jsonb default '[]',
  last_run_at timestamptz,
  updated_at timestamptz default now()
);

alter table agent_stats enable row level security;
create policy "Allow public read" on agent_stats for select using (true);
```

3. Kopiér URL, anon key og service_role key fra Settings → API

## 2. Install

```bash
cd website
npm install
```

Alt kode (website + agent) lever i `website/` mappen. Agenten kører som Vercel Cron job.

## 3. Vercel env vars

Sæt i Vercel → Settings → Environment Variables:

| Variable | Beskrivelse |
|----------|-------------|
| `NEXT_PUBLIC_CREATOR_ADDRESS` | Din wallet |
| `NEXT_PUBLIC_MINT_ADDRESS` | Token mint |
| `MINT_ADDRESS` | Samme som mint |
| `AGENT_PRIVATE_KEY` | Base58 secret key |
| `NEXT_PUBLIC_SUPABASE_URL` | Fra Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Fra Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Fra Supabase (hemmelig) |
| `CRON_SECRET` | Sættes automatisk af Vercel |

Valgfrit:
- `RPC_URL` – custom RPC (fx Helius, QuickNode)
- `KIE_API_KEY` – til AI-genererede agent thoughts

## 4. Deploy

Push til GitHub → Vercel deployer automatisk.

**Vercel root directory:** `website`

Agenten kører automatisk via Vercel Cron (`/api/cron`) hvert 3. minut.

### 429 Too Many Requests?
Gratis Solana RPC har lav rate limit. Brug fx [Helius](https://helius.dev) (gratis tier) eller QuickNode, og sæt `RPC_URL` i Vercel.

---

**Flow:** Vercel Cron → `/api/cron` → agenten kører claim/buyback/burn/LP → skriver til Supabase → website læser fra Supabase.
