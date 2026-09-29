"use client";

import { useMemo } from "react";
import { mockUser } from "@/lib/data";
import type { User } from "@/lib/types";
import { useTelegram } from "./useTelegram";

/**
 * Hook that provides the current user.
 *
 * When inside Telegram, uses the real Telegram user data.
 * When outside Telegram (browser dev), falls back to mock data.
 *
 * TODO: Replace mock fallback with Supabase user fetch when backend is ready.
 * The eventual flow: Telegram user ID → backend verification → Supabase lookup
 */
export function useUser(): User {
  const telegram = useTelegram();

  return useMemo(() => {
    if (telegram.isInsideTelegram && telegram.user) {
      return {
        id: String(telegram.user.id),
        firstName: telegram.user.first_name,
        lastName: telegram.user.last_name,
        username: telegram.user.username,
        // TODO: Fetch real balance from Supabase via backend
        balance: mockUser.balance,
        streak: mockUser.streak,
        createdAt: new Date().toISOString(),
        isMock: false,
      };
    }

    // Fallback for browser development
    return mockUser;
  }, [telegram.isInsideTelegram, telegram.user]);
}
