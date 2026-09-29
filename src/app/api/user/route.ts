import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { verifyTelegramInitData, parseTelegramUser } from "@/lib/telegram-verify";

const botToken = process.env.TELEGRAM_BOT_TOKEN;

export async function GET(request: NextRequest) {
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

  const { data: user, error } = await supabaseAdmin
    .from("users")
    .select("id, telegram_id, username, first_name, last_name, photo_url, balance, total_earned, total_withdrawn, account_status, referral_code, created_at, last_active_at")
    .eq("telegram_id", telegramUser.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}
