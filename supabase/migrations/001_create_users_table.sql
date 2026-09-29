-- Birrly: Users table for Telegram Mini App accounts

create table public.users (
  id uuid primary key default gen_random_uuid(),
  telegram_id text unique not null,
  username text,
  first_name text,
  last_name text,
  photo_url text,
  balance bigint not null default 0,
  streak integer not null default 0,
  created_at timestamptz not null default now(),
  last_seen timestamptz not null default now()
);

alter table public.users enable row level security;

-- RLS policies: no direct client access.
-- All operations go through server-side API routes using the service role key.
-- Anon users cannot read, insert, update, or delete any user data.
create policy "No anon access" on public.users
  for all to anon
  using (false);

-- Note: The service role bypasses RLS by default, so server-side
-- API routes using SUPABASE_SERVICE_ROLE_KEY will work correctly.
