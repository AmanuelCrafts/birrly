"use client";

import { useEffect, useState } from "react";
import { getTelegramContext, initTelegram } from "@/lib/telegram";
import type { TelegramContext } from "@/lib/types";

/**
 * Hook that provides the Telegram context.
 * Waits for the Telegram SDK script to load before reading context.
 */
export function useTelegram(): TelegramContext {
  const [context, setContext] = useState<TelegramContext>(() =>
    getTelegramContext()
  );

  useEffect(() => {
    let cancelled = false;

    function checkTelegram() {
      if (cancelled) return;

      if (window.Telegram?.WebApp) {
        initTelegram();
        setContext(getTelegramContext());
      } else {
        // Telegram script hasn't loaded yet — check again shortly
        setTimeout(checkTelegram, 50);
      }
    }

    checkTelegram();

    return () => {
      cancelled = true;
    };
  }, []);

  return context;
}
