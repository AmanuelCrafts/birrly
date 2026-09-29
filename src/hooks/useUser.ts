"use client";

import { useEffect, useMemo, useState } from "react";
import { mockUser } from "@/lib/data";
import type { User } from "@/lib/types";
import { useTelegram } from "./useTelegram";

/**
 * Hook that provides the current user.
 *
 * When inside Telegram:
 *   1. Sends initData to /api/auth/telegram
 *   2. Server verifies initData cryptographically
 *   3. Server creates/updates user in Supabase
 *   4. Returns the verified user data
 *
 * When outside Telegram (browser dev):
 *   Falls back to mock data — no Supabase call is made.
 */
export function useUser(): User {
  const telegram = useTelegram();
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!telegram.isInsideTelegram || !telegram.initData) {
      setSupabaseUser(null);
      return;
    }

    let cancelled = false;

    async function authenticate() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/auth/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData: telegram.initData }),
        });

        if (!res.ok) return;

        const data = await res.json();
        if (data.user && !cancelled) {
          setSupabaseUser({
            id: data.user.id,
            firstName: data.user.first_name,
            lastName: data.user.last_name,
            username: data.user.username,
            photoUrl: data.user.photo_url,
            balance: data.user.balance,
            streak: 0,
            createdAt: data.user.created_at,
            isMock: false,
          });
        }
      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    authenticate();
    return () => { cancelled = true; };
  }, [telegram.isInsideTelegram, telegram.initData]);

  return useMemo(() => {
    if (telegram.isInsideTelegram && supabaseUser) {
      return supabaseUser;
    }
    if (telegram.isInsideTelegram && isLoading && telegram.user) {
      return {
        id: String(telegram.user.id),
        firstName: telegram.user.first_name,
        lastName: telegram.user.last_name,
        username: telegram.user.username,
        photoUrl: telegram.user.photo_url,
        balance: 0,
        streak: 0,
        createdAt: new Date().toISOString(),
        isMock: false,
      };
    }
    return mockUser;
  }, [telegram.isInsideTelegram, telegram.user, supabaseUser, isLoading]);
}
