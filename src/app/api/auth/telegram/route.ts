import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering — never statically evaluate this route
export const dynamic = "force-dynamic";

// Lazy import to avoid build-time evaluation
const getAppwrite = async () => {
  const { databases, databaseId } = await import("@/lib/appwrite/server");
  return { databases, databaseId };
};

/**
 * POST /api/auth/telegram
 *
 * Registers or retrieves a Telegram user in Appwrite.
 * All Appwrite operations are server-side — API key never exposed to browser.
 */

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request: NextRequest) {
  let body: { telegramId?: string; username?: string; firstName?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { telegramId, username, firstName } = body;

  if (!telegramId || typeof telegramId !== "string") {
    return NextResponse.json({ error: "Missing telegramId" }, { status: 400 });
  }

  if (!firstName || typeof firstName !== "string") {
    return NextResponse.json({ error: "Missing firstName" }, { status: 400 });
  }

  try {
    const { databases, databaseId } = await getAppwrite();

    if (!databaseId) {
      return NextResponse.json(
        { error: "Server configuration missing" },
        { status: 500 }
      );
    }

    // Look up existing user by telegram_id
    const existing = await databases.listDocuments(databaseId, "users", [
      `telegram_id=${telegramId}`,
    ]);

    if (existing.total > 0) {
      // User exists — return their data
      const user = existing.documents[0];
      return NextResponse.json({
        user: {
          id: user.$id,
          telegram_id: user.telegram_id,
          username: user.username || "",
          first_name: user.first_name,
          referral_code: user.referral_code,
          balance: user.balance,
          total_earned: user.total_earned,
          total_withdrawn: user.total_withdrawn,
          account_status: user.account_status,
          created_at: user.$createdAt,
          updated_at: user.$updatedAt,
        },
        isNew: false,
      });
    }

    // User doesn't exist — create new account
    const referralCode = generateReferralCode();
    const now = new Date().toISOString();

    const newUser = await databases.createDocument(databaseId, "users", "unique()", {
      telegram_id: telegramId,
      username: username || "",
      first_name: firstName,
      referral_code: referralCode,
      referred_by: "",
      balance: 0,
      total_earned: 0,
      total_withdrawn: 0,
      account_status: "active",
      created_at: now,
      updated_at: now,
    });

    return NextResponse.json({
      user: {
        id: newUser.$id,
        telegram_id: newUser.telegram_id,
        username: newUser.username || "",
        first_name: newUser.first_name,
        referral_code: newUser.referral_code,
        balance: newUser.balance,
        total_earned: newUser.total_earned,
        total_withdrawn: newUser.total_withdrawn,
        account_status: newUser.account_status,
        created_at: newUser.$createdAt,
        updated_at: newUser.$updatedAt,
      },
      isNew: true,
    });
  } catch (err) {
    console.error("[Telegram Auth] Error:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Authentication failed", details: errorMessage },
      { status: 500 }
    );
  }
}
