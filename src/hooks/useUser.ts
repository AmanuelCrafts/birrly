"use client";

import { useMemo } from "react";
import { mockUser } from "@/lib/data";
import type { User } from "@/lib/types";
import { useTelegram } from "./useTelegram";

/**
 * Hook that provides the current user.
 *
 * When inside Telegram, uses the real Telegram user data (display only).
 * When outside Telegram (browser dev), falls back to mock data.
 *
 * NOTE: This is frontend-only. No Supabase/backend connection yet.
 * Balance and streak are mock values until the backend is connected.
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
        photoUrl: telegram.user.photo_url,
        balance: mockUser.balance,
        streak: mockUser.streak,
        createdAt: new Date().toISOString(),
        isMock: false,
        vipLevel: mockUser.vipLevel,
        todayIncome: mockUser.todayIncome,
        dailyTasksCompleted: mockUser.dailyTasksCompleted,
      };
    }

    return mockUser;
  }, [telegram.isInsideTelegram, telegram.user]);
}
