import { supabaseAdmin } from "./supabase-server";

export interface PlatformSettings {
  MAX_DAILY_ADS: number;
  REWARD_PER_AD: number;
  MIN_WITHDRAWAL: number;
  MIN_ACCOUNT_AGE_DAYS: number;
  REFERRAL_REWARD: number;
  DAILY_AD_COOLDOWN_SECONDS: number;
}

const defaultSettings: PlatformSettings = {
  MAX_DAILY_ADS: 20,
  REWARD_PER_AD: 1,
  MIN_WITHDRAWAL: 150,
  MIN_ACCOUNT_AGE_DAYS: 7,
  REFERRAL_REWARD: 10,
  DAILY_AD_COOLDOWN_SECONDS: 30,
};

let cachedSettings: PlatformSettings | null = null;
let cacheTime = 0;
const CACHE_TTL = 60_000; // 1 minute

export async function getSettings(): Promise<PlatformSettings> {
  const now = Date.now();
  if (cachedSettings && now - cacheTime < CACHE_TTL) {
    return cachedSettings;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("platform_settings")
      .select("key, value");

    if (error) throw error;

    const settings = { ...defaultSettings };
    for (const row of data) {
      const numVal = Number(row.value);
      if (!isNaN(numVal)) {
        (settings as Record<string, number>)[row.key] = numVal;
      }
    }

    cachedSettings = settings;
    cacheTime = now;
    return settings;
  } catch (err) {
    console.error("Failed to load settings, using defaults:", err);
    return defaultSettings;
  }
}

export function invalidateSettingsCache() {
  cachedSettings = null;
  cacheTime = 0;
}
