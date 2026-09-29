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
  /** Current balance in BRL (display only — never modified client-side) */
  balance: number;
  /** Current daily login streak in days */
  streak: number;
  /** ISO date string for account creation */
  createdAt: string;
  /** True when using fallback/mock data (not from Telegram) */
  isMock: boolean;
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
  /** Reward amount in BRL */
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
  /** Total BRL earned (lifetime) */
  balance: number;
}

// ─── Transaction ─────────────────────────────────────────────────────────────

export type TransactionType = "earn" | "spend" | "withdraw";
export type TransactionStatus = "completed" | "pending" | "failed";

export interface Transaction {
  id: string;
  type: TransactionType;
  /** Amount in BRL (positive for earn, negative for spend/withdraw) */
  amount: number;
  description: string;
  createdAt: string;
  status: TransactionStatus;
}

// ─── Telegram ────────────────────────────────────────────────────────────────

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export type TelegramTheme = "light" | "dark";

export interface TelegramContext {
  user: TelegramUser | null;
  theme: TelegramTheme;
  isInsideTelegram: boolean;
  colorScheme: TelegramTheme;
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
