"use client";

import { useEffect, useState } from "react";
import { useTelegram } from "@/hooks/useTelegram";
import { useUser } from "@/hooks/useUser";

/**
 * Temporary debug overlay showing auth state.
 * Remove this once the integration is working.
 */
export function AuthDebug() {
  const telegram = useTelegram();
  const user = useUser();
  const [apiStatus, setApiStatus] = useState<string>("waiting");
  const [apiError, setApiError] = useState<string>("");

  useEffect(() => {
    if (!telegram.isInsideTelegram || !telegram.user) {
      setApiStatus("no-telegram");
      return;
    }

    let cancelled = false;

    async function testApi() {
      setApiStatus("calling");
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

        if (!cancelled) {
          setApiStatus(`status:${res.status}`);
          if (!res.ok) {
            const text = await res.text();
            setApiError(text);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setApiStatus("error");
          setApiError(err instanceof Error ? err.message : "unknown");
        }
      }
    }

    testApi();
    return () => { cancelled = true; };
  }, [telegram.isInsideTelegram, telegram.user]);

  return (
    <div className="fixed top-2 right-2 z-50 max-w-[220px] rounded-xl border-2 border-red-500/50 bg-black/90 p-3 text-[10px] font-mono text-white shadow-lg">
      <div className="mb-1 font-bold text-red-400">DEBUG</div>
      <div>TG: {telegram.isInsideTelegram ? "YES" : "NO"}</div>
      <div>User: {telegram.user?.first_name || "none"}</div>
      <div>ID: {telegram.user?.id || "none"}</div>
      <div>Balance: {user?.balance ?? "..."}</div>
      <div>Source: {user?.isMock ? "mock" : "appwrite"}</div>
      <div>API: {apiStatus}</div>
      {apiError && <div className="text-red-400">{apiError}</div>}
    </div>
  );
}
