import type { TelegramContext, TelegramTheme, TelegramUser } from "./types";

/**
 * Telegram Mini Apps SDK wrapper
 *
 * Provides a clean interface to the Telegram Web App SDK.
 * When running outside Telegram (regular browser), returns safe mock data.
 *
 * The Telegram script is loaded in the root layout.
 * See: https://core.telegram.org/bots/webapps
 *
 * SECURITY NOTE:
 * The initData string is stored for future server-side verification.
 * Never trust client-side user data for authentication.
 * Always verify initData on your backend before granting access.
 * See: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: TelegramUser;
          query_id?: string;
        };
        colorScheme: TelegramTheme;
        themeParams: Record<string, string>;
        isExpanded: boolean;
        platform: string;
        version: string;
        ready: () => void;
        expand: () => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        HapticFeedback: {
          impactOccurred: (style: string) => void;
          notificationOccurred: (type: string) => void;
          selectionChanged: () => void;
        };
        onEvent: (eventType: string, callback: () => void) => void;
        offEvent: (eventType: string, callback: () => void) => void;
        sendData: (data: string) => void;
        openLink: (url: string) => void;
        close: () => void;
      };
    };
  }
}

/** Check if the app is running inside Telegram */
export function isInsideTelegram(): boolean {
  if (typeof window === "undefined") return false;
  return !!window.Telegram?.WebApp?.initDataUnsafe?.user;
}

/** Get the Telegram user (null if outside Telegram) */
export function getTelegramUser(): TelegramUser | null {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp?.initDataUnsafe?.user ?? null;
}

/** Get the raw initData string for future server-side verification */
export function getTelegramInitData(): string {
  if (typeof window === "undefined") return "";
  return window.Telegram?.WebApp?.initData ?? "";
}

/** Get the current Telegram color scheme */
export function getTelegramTheme(): TelegramTheme {
  if (typeof window === "undefined") return "dark";
  return window.Telegram?.WebApp?.colorScheme ?? "dark";
}

/** Create a no-op haptic feedback fallback */
function createNoOpHaptic() {
  return {
    impact: (_style: "light" | "medium" | "heavy" | "rigid" | "soft") => {},
    notification: (_type: "error" | "success" | "warning") => {},
    selection: () => {},
  };
}

/**
 * Get the full Telegram context.
 * Returns mock data when running outside Telegram.
 */
export function getTelegramContext(): TelegramContext {
  const inside = isInsideTelegram();
  const tg = typeof window !== "undefined" ? window.Telegram?.WebApp : undefined;

  return {
    user: getTelegramUser(),
    theme: getTelegramTheme(),
    isInsideTelegram: inside,
    colorScheme: getTelegramTheme(),
    initData: getTelegramInitData(),
    hapticFeedback: tg
      ? {
          impact: (style) => tg.HapticFeedback?.impactOccurred(style),
          notification: (type) => tg.HapticFeedback?.notificationOccurred(type),
          selection: () => tg.HapticFeedback?.selectionChanged(),
        }
      : createNoOpHaptic(),
    ready: () => tg?.ready?.(),
    expand: () => tg?.expand?.(),
    setHeaderColor: (color) => tg?.setHeaderColor?.(color),
    setBackgroundColor: (color) => tg?.setBackgroundColor?.(color),
  };
}

/**
 * Initialize the Telegram Web App.
 * Call this once when the app mounts.
 */
export function initTelegram(): void {
  if (typeof window === "undefined") return;
  const tg = window.Telegram?.WebApp;
  if (!tg) return;

  // Tell Telegram the app is ready
  tg.ready();
  // Expand to full height
  tg.expand();

  // Set header and background colors to match the app theme
  const isDark = tg.colorScheme === "dark";
  tg.setHeaderColor(isDark ? "#0A0A0A" : "#F8FAFC");
  tg.setBackgroundColor(isDark ? "#0A0A0A" : "#F8FAFC");
}
