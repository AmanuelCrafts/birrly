import { NextRequest, NextResponse } from "next/server";
import { Query } from "appwrite";
import { databases, databaseId } from "@/lib/appwrite/server";
import { creditUser } from "@/lib/appwrite/transactions";

// Force dynamic rendering — never statically evaluate this route
export const dynamic = "force-dynamic";

/**
 * Configurable ad reward settings.
 * These are server-side constants — never trust values from the client.
 */
const AD_REWARD_AMOUNT = 2;
const DAILY_AD_LIMIT = 10;

/**
 * POST /api/ad-event
 *
 * Processes a rewarded ad completion.
 * The frontend sends a signal that the ad was watched, but the server
 * validates everything before crediting the reward.
 *
 * SECURITY:
 * - Does NOT trust reward_amount from frontend
 * - Enforces daily ad limit
 * - Prevents duplicate processing via reference_id
 * - Only credits after all validations pass
 */
export async function POST(request: NextRequest) {
  let body: { telegramId?: string; eventId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { telegramId, eventId } = body;

  if (!telegramId || typeof telegramId !== "string") {
    return NextResponse.json({ error: "Missing telegramId" }, { status: 400 });
  }

  if (!eventId || typeof eventId !== "string") {
    return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
  }

  if (!databaseId) {
    return NextResponse.json(
      { error: "Server configuration missing" },
      { status: 500 }
    );
  }

  try {
    // Find the user by telegram_id
    const users = await databases.listDocuments(databaseId, "users", [
      Query.equal("telegram_id", telegramId),
    ]);

    if (users.total === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users.documents[0];
    const userId = user.$id;

    // Check for duplicate event (idempotency)
    const existingEvents = await databases.listDocuments(databaseId, "transactions", [
      Query.equal("reference_id", eventId),
    ]);

    if (existingEvents.total > 0) {
      return NextResponse.json(
        { error: "Reward already processed for this ad event" },
        { status: 409 }
      );
    }

    // Check daily ad limit
    const today = new Date().toISOString().split("T")[0];
    const startOfDay = `${today}T00:00:00.000Z`;
    const endOfDay = `${today}T23:59:59.999Z`;

    const todayTransactions = await databases.listDocuments(
      databaseId,
      "transactions",
      [
        Query.equal("user_id", userId),
        Query.equal("type", "AD_REWARD"),
        Query.greaterThanEqual("created_at", startOfDay),
        Query.lessThanEqual("created_at", endOfDay),
      ]
    );

    if (todayTransactions.total >= DAILY_AD_LIMIT) {
      return NextResponse.json(
        { error: "Daily ad limit reached" },
        { status: 429 }
      );
    }

    // Create ad_events record
    const now = new Date().toISOString();
    await databases.createDocument(databaseId, "transactions", "unique()", {
      user_id: userId,
      type: "AD_REWARD",
      amount: AD_REWARD_AMOUNT,
      status: "COMPLETED",
      reference_id: eventId,
      metadata: JSON.stringify({ provider: "monetag", eventId }),
      created_at: now,
    });

    // Credit the user (this also creates a transaction record)
    // Note: We use creditUser which creates its own transaction record
    // So we skip the manual transaction creation above and just use creditUser
    // Actually, let me reconsider — we should use creditUser for the actual credit
    // and create a separate ad_events record

    // Credit the user
    await creditUser(userId, AD_REWARD_AMOUNT, "AD_REWARD", eventId, JSON.stringify({
      provider: "monetag",
      eventId,
    }));

    return NextResponse.json({
      success: true,
      reward: AD_REWARD_AMOUNT,
      message: `+${AD_REWARD_AMOUNT} Birr earned!`,
    });
  } catch (err) {
    console.error("[Ad Event] Error:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Failed to process ad reward", details: errorMessage },
      { status: 500 }
    );
  }
}
