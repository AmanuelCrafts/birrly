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

  // Get the withdrawal first to refund if needed
  const { data: withdrawal } = await supabaseAdmin
    .from("withdrawals")
    .select("*")
    .eq("id", id)
    .eq("status", "PENDING")
    .maybeSingle();

  if (!withdrawal) {
    return NextResponse.json({ error: "Withdrawal not found or already processed" }, { status: 404 });
  }

  // Update status to rejected
  const { data: updated, error } = await supabaseAdmin
    .from("withdrawals")
    .update({ status: "REJECTED" })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to reject withdrawal" }, { status: 500 });
  }

  // Refund the user
  await supabaseAdmin.rpc("credit_user_balance", {
    p_user_id: withdrawal.user_id,
    p_amount: withdrawal.amount,
    p_type: "WITHDRAWAL_REVERSAL",
    p_reference_id: id,
    p_metadata: { reason: "rejected" },
  });

  await supabaseAdmin.from("admin_audit_logs").insert({
    admin_id: "api",
    action: "REJECT_WITHDRAWAL",
    target_user_id: withdrawal.user_id,
    metadata: { withdrawalId: id, amount: withdrawal.amount },
  });

  return NextResponse.json({ success: true, withdrawal: updated });
}
