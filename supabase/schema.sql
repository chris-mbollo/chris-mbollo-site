-- subscribers table for Build & Own newsletter
create extension if not exists "pgcrypto";

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text not null default 'site_hero',
  created_at timestamptz not null default now()
);

create index if not exists subscribers_created_at_idx
  on public.subscribers (created_at desc);

-- Row Level Security: block all client access, force service-role writes from serverless
alter table public.subscribers enable row level security;
-- No policies created, which means no anon or authenticated access. Service role bypasses RLS.
