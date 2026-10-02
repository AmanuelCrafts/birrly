import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Parses Telegram WebApp initData string into a URLSearchParams object.
 */
export function parseInitData(initData: string): URLSearchParams {
  return new URLSearchParams(initData);
}

/**
 * Verifies Telegram Mini App initData according to the official mechanism.
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 *
 * @returns The verified Telegram user data if valid, null otherwise.
 */
export function verifyTelegramInitData(
  initData: string,
  botToken: string
): Record<string, string> | null {
  const params = parseInitData(initData);
  const hash = params.get("hash");

  if (!hash) {
    return null;
  }

  // Remove hash from params for validation
  params.delete("hash");

  // Build data-check-string: sorted "key=value" pairs joined by \n
  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  // Create HMAC-SHA256 using bot token as key
  const secretKey = createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  const computedHash = createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  // Timing-safe comparison to prevent timing attacks
  const hashBuffer = Buffer.from(hash, "utf-8");
  const computedBuffer = Buffer.from(computedHash, "utf-8");

  if (hashBuffer.length !== computedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(hashBuffer, computedBuffer)) {
    return null;
  }

  // Parse the user data
  const userParam = params.get("user");
  if (!userParam) {
    return null;
  }

  try {
    const user = JSON.parse(userParam) as Record<string, string>;

    // Validate required fields
    if (!user.id || !user.first_name) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

/**
 * Extracts and validates the Telegram user ID from verified init data.
 */
export function extractTelegramUserId(
  verifiedData: Record<string, string>
): string | null {
  const id = verifiedData.id;
  if (!id) {
    return null;
  }
  // Ensure it's a valid numeric string
  if (!/^\d+$/.test(id)) {
    return null;
  }
  return id;
}
