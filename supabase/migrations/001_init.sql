-- AgentClaw initial schema (same as ../schema.sql)

create table if not exists public.agent_stats (
  id                  text primary key default 'default',
  total_claimed       numeric not null default 0,
  total_creator_share numeric not null default 0,
  total_burned        numeric not null default 0,
  total_bought_back   numeric not null default 0,
  total_lp_sol        numeric not null default 0,
  treasury_sol        numeric not null default 0,
  thought             text not null default 'Waiting for fees.',
  thought_meta        text not null default '— AgentClaw',
  feed_entries        jsonb not null default '[]'::jsonb,
  last_run_at         timestamptz,
  updated_at          timestamptz not null default now()
);

insert into public.agent_stats (id)
values ('default')
on conflict (id) do nothing;

alter table public.agent_stats enable row level security;

drop policy if exists "agent_stats_public_read" on public.agent_stats;
create policy "agent_stats_public_read"
  on public.agent_stats
  for select
  using (true);
