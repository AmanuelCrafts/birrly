import { createHmac, timingSafeEqual } from "crypto";

/**
 * Verify Telegram Mini App initData server-side.
 * MUST run on the server — never in the browser.
 * See: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function verifyTelegramInitData(
  initData: string,
  botToken: string
): Record<string, string> | null {
  if (!initData || !botToken) return null;

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;

  params.delete("hash");

  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = createHmac("sha256", botToken)
    .update("WebAppData")
    .digest();

  const computedHash = createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  const hashBuffer = Buffer.from(hash, "utf-8");
  const computedBuffer = Buffer.from(computedHash, "utf-8");

  if (hashBuffer.length !== computedBuffer.length) return null;
  if (!timingSafeEqual(hashBuffer, computedBuffer)) return null;

  const result: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
}

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
