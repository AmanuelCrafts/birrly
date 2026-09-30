"use client";

import { useTelegram } from "@/hooks/useTelegram";
import { useUser } from "@/hooks/useUser";

/**
 * Temporary debug overlay showing auth state.
 * Remove this once the integration is working.
 */
export function AuthDebug() {
  const telegram = useTelegram();
  const user = useUser();

  return (
    <div className="fixed top-2 right-2 z-50 max-w-[200px] rounded-xl border-2 border-red-500/50 bg-black/90 p-3 text-[10px] font-mono text-white shadow-lg">
      <div className="mb-1 font-bold text-red-400">DEBUG</div>
      <div>TG: {telegram.isInsideTelegram ? "YES" : "NO"}</div>
      <div>User: {telegram.user?.first_name || "none"}</div>
      <div>ID: {telegram.user?.id || "none"}</div>
      <div>Balance: {user?.balance ?? "..."}</div>
      <div>Source: {user?.isMock ? "mock" : "appwrite"}</div>
    </div>
  );
}
