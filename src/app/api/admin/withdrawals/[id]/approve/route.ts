import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKey = request.headers.get("x-admin-api-key");
  if (!ADMIN_API_KEY || apiKey !== ADMIN_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data: withdrawal, error } = await supabaseAdmin
    .from("withdrawals")
    .update({ status: "APPROVED", reviewed_by: null })
    .eq("id", id)
    .eq("status", "PENDING")
    .select()
    .single();

  if (error || !withdrawal) {
    return NextResponse.json({ error: "Withdrawal not found or already processed" }, { status: 404 });
  }

  await supabaseAdmin.from("admin_audit_logs").insert({
    admin_id: "api",
    action: "APPROVE_WITHDRAWAL",
    target_user_id: withdrawal.user_id,
    metadata: { withdrawalId: id, amount: withdrawal.amount },
  });

  return NextResponse.json({ success: true, withdrawal });
}
