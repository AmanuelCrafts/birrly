"use client";

import { useEffect, useState } from "react";
import { getTelegramContext, initTelegram } from "@/lib/telegram";
import type { TelegramContext } from "@/lib/types";

/**
 * Hook that provides the Telegram context.
 * Initializes the SDK on mount and returns the context.
 */
export function useTelegram(): TelegramContext {
  const [context, setContext] = useState<TelegramContext>(() =>
    getTelegramContext()
  );

  useEffect(() => {
    initTelegram();
    // Re-read context after init (in case the script loaded late)
    setContext(getTelegramContext());
  }, []);

  return context;
}
