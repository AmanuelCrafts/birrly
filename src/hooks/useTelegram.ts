"use client";

import { useEffect, useRef, useState } from "react";
import { getTelegramContext, initTelegram } from "@/lib/telegram";
import type { TelegramContext } from "@/lib/types";

export function useTelegram(): TelegramContext {
  const [context, setContext] = useState<TelegramContext>(() =>
    getTelegramContext()
  );
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    let cancelled = false;

    function checkTelegram() {
      if (cancelled) return;

      if (window.Telegram?.WebApp) {
        initTelegram();
        setContext(getTelegramContext());
      } else {
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
