"use client";

import { useEffect, useRef, useState } from "react";
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
 */
export function useUser(): User {
  const telegram = useTelegram();
  const [appwriteUser, setAppwriteUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasAuthenticated = useRef(false);

  useEffect(() => {
    console.log("[useUser] telegram state:", {
      isInsideTelegram: telegram.isInsideTelegram,
      hasUser: !!telegram.user,
      userId: telegram.user?.id,
    });

    if (!telegram.isInsideTelegram || !telegram.user) {
      console.log("[useUser] Not in Telegram, using mock data");
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

        console.log("[useUser] API response status:", res.status);

        if (!res.ok) {
          const errText = await res.text();
          console.error("[Auth] Failed:", res.status, errText);
          return;
        }

        const data = await res.json();
        console.log("[useUser] API response:", data);

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

  if (telegram.isInsideTelegram && appwriteUser) {
    return appwriteUser;
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
    };
  }

  return mockUser;
}
