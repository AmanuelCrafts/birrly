import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get("x-admin-api-key");
  if (!ADMIN_API_KEY || apiKey !== ADMIN_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: users, error } = await supabaseAdmin
    .from("users")
    .select("id, telegram_id, username, first_name, balance, total_earned, total_withdrawn, account_status, created_at, last_active_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ users });
}
