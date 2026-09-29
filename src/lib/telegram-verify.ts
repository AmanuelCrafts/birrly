import { createHmac, timingSafeEqual } from "crypto";

/**
 * Verify Telegram Mini App initData server-side.
 *
 * This MUST run on the server — never in the browser.
 * The bot token must never be exposed to client-side code.
 *
 * See: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 *
 * @param initData - The raw initData string from Telegram.WebApp.initData
 * @param botToken - Your Telegram bot token (from @BotFather)
 * @returns The parsed user data if verification succeeds, null otherwise
 */
export function verifyTelegramInitData(
  initData: string,
  botToken: string
): Record<string, string> | null {
  if (!initData || !botToken) return null;

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");

  if (!hash) return null;

  // Remove hash from params — it's the signature, not part of the data
  params.delete("hash");

  // Build data_check_string: sort params alphabetically, join as key=value\n
  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  // Create secret key: HMAC-SHA256 of "WebAppData" with bot token as key
  const secretKey = createHmac("sha256", botToken)
    .update("WebAppData")
    .digest();

  // Compute HMAC-SHA256 of data_check_string with secret key
  const computedHash = createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  // Timing-safe comparison to prevent timing attacks
  const hashBuffer = Buffer.from(hash, "utf-8");
  const computedBuffer = Buffer.from(computedHash, "utf-8");

  if (hashBuffer.length !== computedBuffer.length) return null;
  if (!timingSafeEqual(hashBuffer, computedBuffer)) return null;

  // Verification succeeded — return parsed data
  const result: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
}

/**
 * Parse the user JSON from verified initData.
 */
export function parseTelegramUser(
  verifiedData: Record<string, string>
): {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
} | null {
  const userJson = verifiedData.user;
  if (!userJson) return null;

  try {
    const user = JSON.parse(userJson);
    if (!user.id || !user.first_name) return null;
    return {
      id: String(user.id),
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      photo_url: user.photo_url,
      language_code: user.language_code,
    };
  } catch {
    return null;
  }
}
