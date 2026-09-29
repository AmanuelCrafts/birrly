"use client";

import { useEffect, useMemo, useState } from "react";
import { mockUser } from "@/lib/data";
import type { User } from "@/lib/types";
import { useTelegram } from "./useTelegram";

export function useUser(): User {
  const telegram = useTelegram();
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [debug, setDebug] = useState<string>("init");

  useEffect(() => {
    if (!telegram.isInsideTelegram || !telegram.initData) {
      setDebug("not-in-telegram");
      setSupabaseUser(null);
      return;
    }

    let cancelled = false;

    async function authenticate() {
      setIsLoading(true);
      setDebug("fetching");
      try {
        const res = await fetch("/api/auth/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData: telegram.initData }),
        });

        setDebug(`status:${res.status}`);

        if (!res.ok) {
          const errText = await res.text();
          console.error("[Auth] Failed:", res.status, errText);
          return;
        }

        const data = await res.json();
        console.log("[Auth] Success:", data);

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
          setDebug(`ok:user-${data.user.id}`);
        }
      } catch (err) {
        console.error("[Auth] Error:", err);
        setDebug(`error:${err instanceof Error ? err.message : "unknown"}`);
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
