import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { verifyTelegramInitData, parseTelegramUser } from "@/lib/telegram-verify";
import { getSettings } from "@/lib/settings";

const botToken = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(request: NextRequest) {
  if (!botToken) {
    return NextResponse.json({ error: "Server configuration missing" }, { status: 500 });
  }

  const initData = request.headers.get("x-telegram-initdata");
  if (!initData) {
    return NextResponse.json({ error: "Missing initData" }, { status: 401 });
  }

  const verifiedData = verifyTelegramInitData(initData, botToken);
  if (!verifiedData) {
    return NextResponse.json({ error: "Invalid initData" }, { status: 401 });
  }

  const telegramUser = parseTelegramUser(verifiedData);
  if (!telegramUser) {
    return NextResponse.json({ error: "Could not parse user" }, { status: 401 });
  }

  let body: { eventId?: string; provider?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { eventId, provider = "monetag" } = body;
  if (!eventId || typeof eventId !== "string") {
    return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
  }

  // Get user
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id, account_status")
    .eq("telegram_id", telegramUser.id)
    .maybeSingle();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.account_status === "RESTRICTED" || user.account_status === "SUSPENDED") {
    return NextResponse.json({ error: "Account restricted" }, { status: 403 });
  }

  // Check for duplicate event
  const { data: existingEvent } = await supabaseAdmin
    .from("ad_events")
    .select("id, status")
    .eq("event_id", eventId)
    .maybeSingle();

  if (existingEvent) {
    return NextResponse.json({ error: "Duplicate event", status: "DUPLICATE" }, { status: 409 });
  }

  // Get settings
  const settings = await getSettings();

  // Check daily limit
  const today = new Date().toISOString().split("T")[0];
  const { data: dailyStats } = await supabaseAdmin
    .from("daily_user_stats")
    .select("ads_completed")
    .eq("user_id", user.id)
    .eq("date", today)
    .maybeSingle();

  const adsCompleted = dailyStats?.ads_completed ?? 0;
  if (adsCompleted >= settings.MAX_DAILY_ADS) {
    return NextResponse.json({ error: "Daily ad limit reached" }, { status: 429 });
  }

  // Check cooldown
  const { data: lastEvent } = await supabaseAdmin
    .from("ad_events")
    .select("created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastEvent) {
    const lastTime = new Date(lastEvent.created_at).getTime();
    const now = Date.now();
    const cooldownMs = settings.DAILY_AD_COOLDOWN_SECONDS * 1000;
    if (now - lastTime < cooldownMs) {
      return NextResponse.json({ error: "Ad cooldown active" }, { status: 429 });
    }
  }

  const rewardAmount = settings.REWARD_PER_AD;

  // Use a database transaction to credit the user
  // Insert ad event
  const { data: adEvent, error: adEventError } = await supabaseAdmin
    .from("ad_events")
    .insert({
      user_id: user.id,
      ad_provider: provider,
      event_id: eventId,
      reward_amount: rewardAmount,
      status: "CREDITED",
    })
    .select()
    .single();

  if (adEventError) {
    return NextResponse.json({ error: "Failed to record ad event" }, { status: 500 });
  }

  // Credit user balance
  const { error: creditError } = await supabaseAdmin.rpc("credit_user_balance", {
    p_user_id: user.id,
    p_amount: rewardAmount,
    p_type: "AD_REWARD",
    p_reference_id: eventId,
    p_metadata: { provider, eventId },
  });

  if (creditError) {
    // Rollback: mark ad event as rejected
    await supabaseAdmin
      .from("ad_events")
      .update({ status: "REJECTED" })
      .eq("id", adEvent.id);

    return NextResponse.json({ error: "Failed to credit reward" }, { status: 500 });
  }

  // Update daily stats
  await supabaseAdmin.rpc("increment_daily_stats", {
    p_user_id: user.id,
    p_date: today,
    p_reward: rewardAmount,
  });

  return NextResponse.json({
    success: true,
    reward: rewardAmount,
    event: adEvent,
  });
}
