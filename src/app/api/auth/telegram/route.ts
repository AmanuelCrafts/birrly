import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { verifyTelegramInitData, parseTelegramUser } from "@/lib/telegram-verify";

const botToken = process.env.TELEGRAM_BOT_TOKEN;

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request: NextRequest) {
  if (!botToken) {
    return NextResponse.json({ error: "Server configuration missing" }, { status: 500 });
  }

  let body: { initData?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { initData } = body;
  if (!initData || typeof initData !== "string") {
    return NextResponse.json({ error: "Missing initData" }, { status: 400 });
  }

  const verifiedData = verifyTelegramInitData(initData, botToken);
  if (!verifiedData) {
    return NextResponse.json({ error: "Invalid initData" }, { status: 401 });
  }

  const telegramUser = parseTelegramUser(verifiedData);
  if (!telegramUser) {
    return NextResponse.json({ error: "Could not parse user" }, { status: 401 });
  }

  const telegramId = telegramUser.id;

  // Find existing user
  const { data: existingUser, error: findError } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("telegram_id", telegramId)
    .maybeSingle();

  if (findError) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  if (existingUser) {
    // Update existing user
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        username: telegramUser.username ?? null,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name ?? null,
        photo_url: telegramUser.photo_url ?? null,
        last_active_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingUser.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }

    return NextResponse.json({ user: updatedUser, isNew: false });
  }

  // Create new user
  const referralCode = generateReferralCode();
  const { data: newUser, error: createError } = await supabaseAdmin
    .from("users")
    .insert({
      telegram_id: telegramId,
      username: telegramUser.username ?? null,
      first_name: telegramUser.first_name,
      last_name: telegramUser.last_name ?? null,
      photo_url: telegramUser.photo_url ?? null,
      referral_code: referralCode,
      balance: 0,
      total_earned: 0,
      total_withdrawn: 0,
      account_status: "NORMAL",
    })
    .select()
    .single();

  if (createError) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }

  return NextResponse.json({ user: newUser, isNew: true });
}
