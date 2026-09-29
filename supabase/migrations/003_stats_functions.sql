-- Birrly Stats Functions for Admin Analytics

-- ─── Get User Stats ───────────────────────────────────────────────────────────

create or replace function public.get_user_stats()
returns json
language sql
security definer
as $$
  select json_build_object(
    'totalUsers', (select count(*) from public.users),
    'newUsersToday', (select count(*) from public.users where created_at::date = current_date),
    'activeUsersToday', (select count(*) from public.users where last_active_at::date = current_date),
    'restrictedUsers', (select count(*) from public.users where account_status != 'NORMAL'),
    'totalBalance', (select coalesce(sum(balance), 0) from public.users),
    'totalEarned', (select coalesce(sum(total_earned), 0) from public.users),
    'totalWithdrawn', (select coalesce(sum(total_withdrawn), 0) from public.users)
  );
$$;

-- ─── Get Ad Stats ─────────────────────────────────────────────────────────────

create or replace function public.get_ad_stats()
returns json
language sql
security definer
as $$
  select json_build_object(
    'totalImpressions', (select count(*) from public.ad_events),
    'totalRewards', (select coalesce(sum(reward_amount), 0) from public.ad_events where status = 'CREDITED'),
    'adsToday', (select count(*) from public.ad_events where created_at::date = current_date),
    'avgAdsPerUser', (select coalesce(avg(ads_completed), 0) from public.daily_user_stats where date = current_date)
  );
$$;

-- ─── Get Revenue Stats ────────────────────────────────────────────────────────

create or replace function public.get_revenue_stats()
returns json
language sql
security definer
as $$
  select json_build_object(
    'totalAdRevenue', (select coalesce(sum(revenue), 0) from public.ad_revenue),
    'totalDeposits', (select coalesce(sum(amount), 0) from public.deposits where status = 'CONFIRMED'),
    'totalWithdrawals', (select coalesce(sum(amount), 0) from public.withdrawals where status in ('COMPLETED', 'PROCESSING')),
    'totalRewards', (select coalesce(sum(reward_amount), 0) from public.ad_events where status = 'CREDITED'),
    'outstandingBalances', (select coalesce(sum(balance), 0) from public.users)
  );
$$;

-- ─── Get Withdrawal Stats ─────────────────────────────────────────────────────

create or replace function public.get_withdrawal_stats()
returns json
language sql
security definer
as $$
  select json_build_object(
    'pending', (select count(*) from public.withdrawals where status = 'PENDING'),
    'processing', (select count(*) from public.withdrawals where status = 'PROCESSING'),
    'completed', (select count(*) from public.withdrawals where status = 'COMPLETED'),
    'rejected', (select count(*) from public.withdrawals where status = 'REJECTED'),
    'totalAmount', (select coalesce(sum(amount), 0) from public.withdrawals where status = 'COMPLETED')
  );
$$;

-- ─── Get Referral Stats ───────────────────────────────────────────────────────

create or replace function public.get_referral_stats()
returns json
language sql
security definer
as $$
  select json_build_object(
    'totalReferrals', (select count(*) from public.referrals),
    'qualifiedReferrals', (select count(*) from public.referrals where qualification_status = 'QUALIFIED'),
    'totalReferralRewards', (select coalesce(sum(reward_amount), 0) from public.referrals where qualification_status = 'QUALIFIED')
  );
$$;
