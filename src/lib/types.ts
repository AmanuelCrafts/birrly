/**
 * Birrly — Core domain types
 *
 * These interfaces define the shape of data throughout the app.
 * They are designed to map directly to Supabase tables in the future.
 * UI components should depend on these types, not on raw data sources.
 */

// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  firstName: string;
  lastName?: string;
  username?: string;
  /** Profile photo URL from Telegram (if available) */
  photoUrl?: string;
  /** Current balance in Birr (display only — never modified client-side) */
  balance: number;
  /** Current daily login streak in days */
  streak: number;
  /** ISO date string for account creation */
  createdAt: string;
  /** True when using fallback/mock data (not from Telegram) */
  isMock: boolean;
  /** Current VIP level (1-7) */
  vipLevel: number;
  /** Today's income in Birr */
  todayIncome: number;
  /** Number of daily tasks completed today */
  dailyTasksCompleted: number;
}

// ─── VIP Plan ─────────────────────────────────────────────────────────

export interface VipPlan {
  level: number;
  name: string;
  /** Required deposit in ETB */
  deposit: number;
  /** Daily income in ETB */
  dailyIncome: number;
  /** Required daily activities/ads */
  dailyActivities: number;
}

// ─── Task ────────────────────────────────────────────────────────────────────

export type TaskStatus = "available" | "coming_soon" | "completed";

export type TaskCategory =
  | "watch"
  | "daily"
  | "sponsored"
  | "invite"
  | "offer";

export interface Task {
  id: string;
  title: string;
  description: string;
  /** Reward amount in Birr */
  reward: number;
  /** Lucide icon name */
  icon: string;
  status: TaskStatus;
  category: TaskCategory;
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    firstName: string;
    lastName?: string;
    username?: string;
  };
  /** Total Birr earned (lifetime) */
  balance: number;
}

// ─── Transaction ─────────────────────────────────────────────────────────────

export type TransactionType = "earn" | "spend" | "withdraw";
export type TransactionStatus = "completed" | "pending" | "failed";

export interface Transaction {
  id: string;
  type: TransactionType;
  /** Amount in Birr (positive for earn, negative for spend/withdraw) */
  amount: number;
  description: string;
  createdAt: string;
  status: TransactionStatus;
}

// ─── Telegram ────────────────────────────────────────────────────────────────

/**
 * Telegram user data from initDataUnsafe.user
 * See: https://core.telegram.org/bots/webapps#webappuser
 */
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  /** URL of the user's profile photo (may not be available in all contexts) */
  photo_url?: string;
  language_code?: string;
  /** Whether the user is a Telegram Premium user */
  is_premium?: boolean;
}

export type TelegramTheme = "light" | "dark";

export interface TelegramContext {
  user: TelegramUser | null;
  theme: TelegramTheme;
  isInsideTelegram: boolean;
  colorScheme: TelegramTheme;
  /**
   * Raw Telegram initData string.
   * SECURITY: This must be verified server-side before being trusted.
   * Do NOT use this for authentication without backend verification.
   * See: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
   */
  initData: string;
  hapticFeedback: {
    impact: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
    notification: (type: "error" | "success" | "warning") => void;
    selection: () => void;
  };
  ready: () => void;
  expand: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
}
