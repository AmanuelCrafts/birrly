-- Birrly Database Functions
-- Atomic balance operations with transaction logging

-- ─── Credit User Balance ──────────────────────────────────────────────────────

create or replace function public.credit_user_balance(
  p_user_id uuid,
  p_amount bigint,
  p_type text,
  p_reference_id text default null,
  p_metadata jsonb default '{}'
)
returns void
language plpgsql
security definer
as $$
begin
  -- Validate amount
  if p_amount <= 0 then
    raise exception 'Credit amount must be positive';
  end if;

  -- Update user balance
  update public.users
  set balance = balance + p_amount,
      total_earned = case
        when p_type in ('DEPOSIT', 'AD_REWARD', 'REFERRAL_REWARD') then total_earned + p_amount
        else total_earned
      end,
      updated_at = now()
  where id = p_user_id;

  -- Record transaction
  insert into public.transactions (user_id, type, amount, status, reference_id, metadata)
  values (p_user_id, p_type, p_amount, 'COMPLETED', p_reference_id, p_metadata);
end;
$$;

-- ─── Debit User Balance ───────────────────────────────────────────────────────

create or replace function public.debit_user_balance(
  p_user_id uuid,
  p_amount bigint,
  p_type text,
  p_reference_id text default null,
  p_metadata jsonb default '{}'
)
returns void
language plpgsql
security definer
as $$
begin
  -- Validate amount
  if p_amount <= 0 then
    raise exception 'Debit amount must be positive';
  end if;

  -- Check sufficient balance
  if (select balance from public.users where id = p_user_id) < p_amount then
    raise exception 'Insufficient balance';
  end if;

  -- Update user balance
  update public.users
  set balance = balance - p_amount,
      total_withdrawn = case
        when p_type = 'WITHDRAWAL' then total_withdrawn + p_amount
        else total_withdrawn
      end,
      updated_at = now()
  where id = p_user_id;

  -- Record transaction
  insert into public.transactions (user_id, type, amount, status, reference_id, metadata)
  values (p_user_id, p_type, -p_amount, 'COMPLETED', p_reference_id, p_metadata);
end;
$$;

-- ─── Increment Daily Stats ────────────────────────────────────────────────────

create or replace function public.increment_daily_stats(
  p_user_id uuid,
  p_date date default current_date,
  p_reward bigint default 0
)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.daily_user_stats (user_id, date, ads_completed, rewards_earned)
  values (p_user_id, p_date, 1, p_reward)
  on conflict (user_id, date)
  do update set
    ads_completed = daily_user_stats.ads_completed + 1,
    rewards_earned = daily_user_stats.rewards_earned + p_reward;
end;
$$;

-- ─── Process Referral ─────────────────────────────────────────────────────────

create or replace function public.process_referral(
  p_referred_user_id uuid,
  p_referral_code text
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_referrer_id uuid;
  v_reward bigint;
begin
  -- Find referrer by code
  select id into v_referrer_id
  from public.users
  where referral_code = p_referral_code;

  if v_referrer_id is null then
    return null;
  end if;

  -- Prevent self-referral
  if v_referrer_id = p_referred_user_id then
    return null;
  end if;

  -- Check if user already has a referrer
  if exists (select 1 from public.users where id = p_referred_user_id and referred_by is not null) then
    return null;
  end if;

  -- Get referral reward from settings
  select value::bigint into v_reward
  from public.platform_settings
  where key = 'REFERRAL_REWARD';

  if v_reward is null then
    v_reward := 10;
  end if;

  -- Update referred user
  update public.users
  set referred_by = v_referrer_id
  where id = p_referred_user_id;

  -- Create referral record
  insert into public.referrals (referrer_id, referred_user_id, qualification_status, reward_amount)
  values (v_referrer_id, p_referred_user_id, 'PENDING', v_reward);

  return v_referrer_id;
end;
$$;
