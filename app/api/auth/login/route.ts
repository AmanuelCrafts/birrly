import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation/auth";
import { loginUser } from "@/lib/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input" },
        { status: 400 }
      );
    }

    const result = await loginUser(parsed.data.username, parsed.data.password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: true, user: result.user },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
