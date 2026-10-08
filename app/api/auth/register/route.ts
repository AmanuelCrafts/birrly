import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validation/auth";
import { registerUser } from "@/lib/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0];
      return NextResponse.json(
        { success: false, error: firstError?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const result = await registerUser(parsed.data.username, parsed.data.password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: true, user: result.user },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
