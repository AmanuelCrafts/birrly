"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { mockUser } from "@/lib/data";
import type { User } from "@/lib/types";
import { useTelegram } from "./useTelegram";

/**
 * Hook that provides the current user.
 *
 * When inside Telegram:
 *   1. Sends user data to /api/auth/telegram
 *   2. Server creates/retrieves user in Appwrite
 *   3. Returns the real user data
 *
 * When outside Telegram (browser dev):
 *   Falls back to mock data.
 *
 * Supports optimistic balance updates — call `addBalance()` to instantly
 * update the balance on the frontend. The next reload fetches the real
 * data from Appwrite.
 */
export function useUser(): User & { addBalance: (amount: number) => void } {
  const telegram = useTelegram();
  const [appwriteUser, setAppwriteUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasAuthenticated = useRef(false);

  useEffect(() => {
    if (!telegram.isInsideTelegram || !telegram.user) {
      setAppwriteUser(null);
      return;
    }

    if (hasAuthenticated.current) return;
    hasAuthenticated.current = true;

    let cancelled = false;

    async function authenticate() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/auth/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            telegramId: String(telegram.user!.id),
            username: telegram.user!.username || "",
            firstName: telegram.user!.first_name,
          }),
        });

        if (!res.ok) {
          console.error("[Auth] Failed:", res.status);
          return;
        }

        const data = await res.json();
        if (data.user && !cancelled) {
          setAppwriteUser({
            id: data.user.id,
            firstName: data.user.first_name,
            lastName: "",
            username: data.user.username,
            photoUrl: undefined,
            balance: data.user.balance,
            streak: 0,
            createdAt: data.user.created_at,
            isMock: false,
          });
        }
      } catch (err) {
        console.error("[Auth] Error:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    authenticate();
    return () => { cancelled = true; };
  }, [telegram.isInsideTelegram, telegram.user]);

  const addBalance = useCallback((amount: number) => {
    setAppwriteUser((prev) => {
      if (!prev) return prev;
      return { ...prev, balance: prev.balance + amount };
    });
  }, []);

  if (telegram.isInsideTelegram && appwriteUser) {
    return { ...appwriteUser, addBalance };
  }

  if (telegram.isInsideTelegram && isLoading && telegram.user) {
    return {
      id: String(telegram.user.id),
      firstName: telegram.user.first_name,
      lastName: "",
      username: telegram.user.username,
      photoUrl: undefined,
      balance: 0,
      streak: 0,
      createdAt: new Date().toISOString(),
      isMock: false,
      addBalance: () => {},
    };
  }

  return { ...mockUser, addBalance: () => {} };
}
