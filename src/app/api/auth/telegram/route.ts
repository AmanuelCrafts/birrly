import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyTelegramInitData, parseTelegramUser } from "@/lib/telegram-verify";

/**
 * POST /api/auth/telegram
 *
 * Verifies Telegram initData server-side and creates/updates the user in Supabase.
 *
 * SECURITY:
 * - Bot token is read from server-side env var only
 * - initData is verified cryptographically before any user data is trusted
 * - Service role key is used server-side only (never exposed to client)
 * - RLS is enabled on the users table
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const botToken = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(request: NextRequest) {
  // Check server-side env vars
  if (!supabaseUrl || !supabaseServiceKey || !botToken) {
    return NextResponse.json(
      { error: "Server configuration missing" },
      { status: 500 }
    );
  }

  // Parse request body
  let body: { initData?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { initData } = body;
  if (!initData || typeof initData !== "string") {
    return NextResponse.json(
      { error: "Missing initData" },
      { status: 400 }
    );
  }

  // Verify initData cryptographically
  const verifiedData = verifyTelegramInitData(initData, botToken);
  if (!verifiedData) {
    return NextResponse.json(
      { error: "Invalid initData — verification failed" },
      { status: 401 }
    );
  }

  // Parse user from verified data
  const telegramUser = parseTelegramUser(verifiedData);
  if (!telegramUser) {
    return NextResponse.json(
      { error: "Could not parse user from initData" },
      { status: 401 }
    );
  }

  // Create Supabase client with service role key (server-side only)
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const telegramId = telegramUser.id;

  // Try to find existing user
  const { data: existingUser, error: findError } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("telegram_id", telegramId)
    .maybeSingle();

  if (findError) {
    return NextResponse.json(
      { error: "Database error", details: findError.message },
      { status: 500 }
    );
  }

  if (existingUser) {
    // User exists — update profile info and last_seen
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        username: telegramUser.username ?? null,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name ?? null,
        photo_url: telegramUser.photo_url ?? null,
        last_seen: new Date().toISOString(),
      })
      .eq("id", existingUser.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update user", details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ user: updatedUser, isNew: false });
  }

  // User doesn't exist — create new account
  const { data: newUser, error: createError } = await supabaseAdmin
    .from("users")
    .insert({
      telegram_id: telegramId,
      username: telegramUser.username ?? null,
      first_name: telegramUser.first_name,
      last_name: telegramUser.last_name ?? null,
      photo_url: telegramUser.photo_url ?? null,
      balance: 0,
      streak: 0,
    })
    .select()
    .single();

  if (createError) {
    return NextResponse.json(
      { error: "Failed to create user", details: createError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ user: newUser, isNew: true });
}
