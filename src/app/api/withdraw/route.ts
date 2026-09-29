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

  let body: { amount?: number; paymentMethod?: string; paymentAccount?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { amount, paymentMethod, paymentAccount } = body;

  if (!amount || typeof amount !== "number" || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  if (!paymentMethod || !paymentAccount) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  // Get user
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id, balance, account_status, created_at")
    .eq("telegram_id", telegramUser.id)
    .maybeSingle();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Check account status
  if (user.account_status === "RESTRICTED" || user.account_status === "SUSPENDED") {
    return NextResponse.json({ error: "Account restricted" }, { status: 403 });
  }

  // Get settings
  const settings = await getSettings();

  // Validate minimum withdrawal
  if (amount < settings.MIN_WITHDRAWAL) {
    return NextResponse.json(
      { error: `Minimum withdrawal is ${settings.MIN_WITHDRAWAL} Birr` },
      { status: 400 }
    );
  }

  // Validate balance
  if (amount > user.balance) {
    return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
  }

  // Check account age
  const accountAgeDays = (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24);
  if (accountAgeDays < settings.MIN_ACCOUNT_AGE_DAYS) {
    return NextResponse.json(
      { error: `Account must be at least ${settings.MIN_ACCOUNT_AGE_DAYS} days old` },
      { status: 400 }
    );
  }

  // Check for pending withdrawals
  const { data: pendingWithdrawal } = await supabaseAdmin
    .from("withdrawals")
    .select("id")
    .eq("user_id", user.id)
    .in("status", ["PENDING", "APPROVED", "PROCESSING"])
    .maybeSingle();

  if (pendingWithdrawal) {
    return NextResponse.json({ error: "You have a pending withdrawal" }, { status: 400 });
  }

  // Create withdrawal request
  const { data: withdrawal, error } = await supabaseAdmin
    .from("withdrawals")
    .insert({
      user_id: user.id,
      amount,
      payment_method: paymentMethod,
      payment_account: paymentAccount,
      status: "PENDING",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create withdrawal" }, { status: 500 });
  }

  // Debit user balance
  const { error: debitError } = await supabaseAdmin.rpc("debit_user_balance", {
    p_user_id: user.id,
    p_amount: amount,
    p_type: "WITHDRAWAL",
    p_reference_id: withdrawal.id,
    p_metadata: { paymentMethod, paymentAccount },
  });

  if (debitError) {
    // Rollback: mark withdrawal as failed
    await supabaseAdmin
      .from("withdrawals")
      .update({ status: "FAILED" })
      .eq("id", withdrawal.id);

    return NextResponse.json({ error: "Failed to process withdrawal" }, { status: 500 });
  }

  return NextResponse.json({ success: true, withdrawal });
}
