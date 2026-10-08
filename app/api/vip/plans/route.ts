import { NextResponse } from "next/server";
import { getAllVIPPlans } from "@/lib/services/vip.service";

export async function GET() {
  try {
    const plans = await getAllVIPPlans();
    return NextResponse.json({ success: true, plans });
  } catch {
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
