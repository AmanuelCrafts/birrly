-- Birrly Backend Schema
-- Full production-ready database schema

-- ─── Users ───────────────────────────────────────────────────────────────────

create table public.users (
  id uuid primary key default gen_random_uuid(),
  telegram_id text unique not null,
  username text,
  first_name text,
  last_name text,
  photo_url text,
  referral_code text unique not null,
  referred_by uuid references public.users(id),
  balance bigint not null default 0,
  total_earned bigint not null default 0,
  total_withdrawn bigint not null default 0,
  account_status text not null default 'NORMAL' check (account_status in ('NORMAL', 'REVIEW', 'RESTRICTED', 'SUSPENDED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_active_at timestamptz not null default now()
);

create index idx_users_telegram_id on public.users(telegram_id);
create index idx_users_referral_code on public.users(referral_code);
create index idx_users_referred_by on public.users(referred_by);
create index idx_users_account_status on public.users(account_status);

-- ─── Transactions ─────────────────────────────────────────────────────────────

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id),
  type text not null check (type in ('DEPOSIT', 'AD_REWARD', 'REFERRAL_REWARD', 'WITHDRAWAL', 'WITHDRAWAL_REVERSAL', 'ADJUSTMENT')),
  amount bigint not null,
  status text not null default 'COMPLETED' check (status in ('PENDING', 'COMPLETED', 'FAILED', 'REVERSED')),
  reference_id text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index idx_transactions_user_id on public.transactions(user_id);
create index idx_transactions_type on public.transactions(type);
create index idx_transactions_reference_id on public.transactions(reference_id);
create index idx_transactions_created_at on public.transactions(created_at);

-- ─── Deposits ─────────────────────────────────────────────────────────────────

create table public.deposits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id),
  amount bigint not null,
  payment_method text not null,
  payment_reference text,
  status text not null default 'PENDING' check (status in ('PENDING', 'CONFIRMED', 'FAILED', 'CANCELLED')),
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);

create index idx_deposits_user_id on public.deposits(user_id);
create index idx_deposits_status on public.deposits(status);
create index idx_deposits_payment_reference on public.deposits(payment_reference);

-- ─── Ad Events ────────────────────────────────────────────────────────────────

create table public.ad_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id),
  ad_provider text not null,
  event_id text unique not null,
  reward_amount bigint not null,
  status text not null default 'PENDING' check (status in ('PENDING', 'CREDITED', 'REJECTED', 'DUPLICATE')),
  created_at timestamptz not null default now()
);

create index idx_ad_events_user_id on public.ad_events(user_id);
create index idx_ad_events_event_id on public.ad_events(event_id);
create index idx_ad_events_provider on public.ad_events(ad_provider);
create index idx_ad_events_created_at on public.ad_events(created_at);

-- ─── Referrals ────────────────────────────────────────────────────────────────

create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.users(id),
  referred_user_id uuid not null references public.users(id),
  qualification_status text not null default 'PENDING' check (qualification_status in ('PENDING', 'QUALIFIED', 'REJECTED')),
  reward_amount bigint not null default 0,
  created_at timestamptz not null default now(),
  qualified_at timestamptz,
  unique(referrer_id, referred_user_id)
);

create index idx_referrals_referrer_id on public.referrals(referrer_id);
create index idx_referrals_referred_user_id on public.referrals(referred_user_id);

-- ─── Withdrawals ──────────────────────────────────────────────────────────────

create table public.withdrawals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id),
  amount bigint not null,
  payment_method text not null,
  payment_account text not null,
  status text not null default 'PENDING' check (status in ('PENDING', 'APPROVED', 'PROCESSING', 'COMPLETED', 'REJECTED', 'FAILED')),
  reviewed_by uuid,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

create index idx_withdrawals_user_id on public.withdrawals(user_id);
create index idx_withdrawals_status on public.withdrawals(status);

-- ─── Daily User Stats ─────────────────────────────────────────────────────────

create table public.daily_user_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id),
  date date not null default current_date,
  ads_completed integer not null default 0,
  rewards_earned bigint not null default 0,
  referral_rewards bigint not null default 0,
  created_at timestamptz not null default now(),
  unique(user_id, date)
);

create index idx_daily_user_stats_user_id on public.daily_user_stats(user_id);
create index idx_daily_user_stats_date on public.daily_user_stats(date);

-- ─── Admin Audit Logs ─────────────────────────────────────────────────────────

create table public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id text not null,
  action text not null,
  target_user_id uuid references public.users(id),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index idx_admin_audit_logs_admin_id on public.admin_audit_logs(admin_id);
create index idx_admin_audit_logs_target_user_id on public.admin_audit_logs(target_user_id);
create index idx_admin_audit_logs_created_at on public.admin_audit_logs(created_at);

-- ─── Platform Settings ────────────────────────────────────────────────────────

create table public.platform_settings (
  key text primary key,
  value text not null,
  description text,
  updated_at timestamptz not null default now()
);

-- Insert default settings
insert into public.platform_settings (key, value, description) values
  ('MAX_DAILY_ADS', '20', 'Maximum ad views per user per day'),
  ('REWARD_PER_AD', '1', 'Reward amount per ad view in Birr'),
  ('MIN_WITHDRAWAL', '150', 'Minimum withdrawal amount in Birr'),
  ('MIN_ACCOUNT_AGE_DAYS', '7', 'Minimum account age in days for withdrawal'),
  ('REFERRAL_REWARD', '10', 'Reward amount for successful referral in Birr'),
  ('DAILY_AD_COOLDOWN_SECONDS', '30', 'Minimum seconds between ad views');

-- ─── Ad Revenue ───────────────────────────────────────────────────────────────

create table public.ad_revenue (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  date date not null default current_date,
  impressions integer not null default 0,
  revenue bigint not null default 0,
  created_at timestamptz not null default now(),
  unique(provider, date)
);

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table public.users enable row level security;
alter table public.transactions enable row level security;
alter table public.deposits enable row level security;
alter table public.ad_events enable row level security;
alter table public.referrals enable row level security;
alter table public.withdrawals enable row level security;
alter table public.daily_user_stats enable row level security;
alter table public.admin_audit_logs enable row level security;
alter table public.platform_settings enable row level security;
alter table public.ad_revenue enable row level security;

-- RLS: No direct client access to any table. All operations go through
-- server-side API routes using the service role key.
create policy "No anon access on users" on public.users for all to anon using (false);
create policy "No anon access on transactions" on public.transactions for all to anon using (false);
create policy "No anon access on deposits" on public.deposits for all to anon using (false);
create policy "No anon access on ad_events" on public.ad_events for all to anon using (false);
create policy "No anon access on referrals" on public.referrals for all to anon using (false);
create policy "No anon access on withdrawals" on public.withdrawals for all to anon using (false);
create policy "No anon access on daily_user_stats" on public.daily_user_stats for all to anon using (false);
create policy "No anon access on admin_audit_logs" on public.admin_audit_logs for all to anon using (false);
create policy "No anon access on platform_settings" on public.platform_settings for all to anon using (false);
create policy "No anon access on ad_revenue" on public.ad_revenue for all to anon using (false);
