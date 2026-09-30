"use client";

import { useMemo } from "react";
import { mockUser } from "@/lib/data";
import type { User } from "@/lib/types";
import { useTelegram } from "./useTelegram";

/**
 * Hook that provides the current user.
 * Uses mock data for now — no backend connection.
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
      };
    }
    return mockUser;
  }, [telegram.isInsideTelegram, telegram.user]);
}
