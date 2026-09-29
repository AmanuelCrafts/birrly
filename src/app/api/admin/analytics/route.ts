import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get("x-admin-api-key");
  if (!ADMIN_API_KEY || apiKey !== ADMIN_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user stats
  const { data: userStats } = await supabaseAdmin.rpc("get_user_stats");

  // Get ad stats
  const { data: adStats } = await supabaseAdmin.rpc("get_ad_stats");

  // Get revenue stats
  const { data: revenueStats } = await supabaseAdmin.rpc("get_revenue_stats");

  // Get withdrawal stats
  const { data: withdrawalStats } = await supabaseAdmin.rpc("get_withdrawal_stats");

  // Get referral stats
  const { data: referralStats } = await supabaseAdmin.rpc("get_referral_stats");

  return NextResponse.json({
    users: userStats,
    ads: adStats,
    revenue: revenueStats,
    withdrawals: withdrawalStats,
    referrals: referralStats,
  });
}
