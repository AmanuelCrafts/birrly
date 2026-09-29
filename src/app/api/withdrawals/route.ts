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

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("telegram_id", telegramUser.id)
    .maybeSingle();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { data: withdrawals, error } = await supabaseAdmin
    .from("withdrawals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ withdrawals });
}
