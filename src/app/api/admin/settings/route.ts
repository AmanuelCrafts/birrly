import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { invalidateSettingsCache } from "@/lib/settings";

const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get("x-admin-api-key");
  if (!ADMIN_API_KEY || apiKey !== ADMIN_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: settings, error } = await supabaseAdmin
    .from("platform_settings")
    .select("key, value, description");

  if (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ settings });
}

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-admin-api-key");
  if (!ADMIN_API_KEY || apiKey !== ADMIN_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { key?: string; value?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { key, value } = body;
  if (!key || !value) {
    return NextResponse.json({ error: "Missing key or value" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("platform_settings")
    .update({ value, updated_at: new Date().toISOString() })
    .eq("key", key);

  if (error) {
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 });
  }

  invalidateSettingsCache();

  // Log admin action
  await supabaseAdmin.from("admin_audit_logs").insert({
    admin_id: "api",
    action: "UPDATE_SETTING",
    metadata: { key, value },
  });

  return NextResponse.json({ success: true });
}
