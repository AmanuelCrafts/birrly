/**
 * Telegram WebApp SDK type declarations.
 * The actual SDK is loaded via script tag in index.html.
 */
export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
      language_code?: string;
    };
  };
  colorScheme: "light" | "dark";
  themeParams: Record<string, string>;
  isExpanded: boolean;
  ready: () => void;
  expand: () => void;
  close: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  onEvent: (eventType: string, callback: () => void) => void;
  offEvent: (eventType: string, callback: () => void) => void;
  sendData: (data: string) => void;
  openLink: (url: string) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  HapticFeedback: {
    impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
    selectionChanged: () => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

/**
 * Gets the Telegram WebApp instance, or null if not inside Telegram.
 */
export function getTelegramWebApp(): TelegramWebApp | null {
  return window.Telegram?.WebApp ?? null;
}

/**
 * Checks if the app is running inside Telegram.
 */
export function isInsideTelegram(): boolean {
  return getTelegramWebApp() !== null;
}

/**
 * Initializes the Telegram WebApp SDK.
 * Returns null if not inside Telegram.
 */
export function initTelegram(): TelegramWebApp | null {
  const tg = getTelegramWebApp();
  if (!tg) return null;

  tg.ready();
  tg.expand();
  tg.setHeaderColor("#0B0817");
  tg.setBackgroundColor("#0B0817");

  return tg;
}

/**
 * Gets the Telegram init data string.
 * Returns empty string if not available.
 */
export function getTelegramInitData(): string {
  const tg = getTelegramWebApp();
  return tg?.initData ?? "";
}
