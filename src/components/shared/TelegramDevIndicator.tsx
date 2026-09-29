"use client";

import { Shield, User as UserIcon } from "lucide-react";
import { useTelegram } from "@/hooks/useTelegram";
import { useUser } from "@/hooks/useUser";

/**
 * Development-only indicator showing detected Telegram user info.
 * Helps verify that Telegram Mini App integration is working correctly.
 *
 * TODO: Remove this component before production release.
 */
export function TelegramDevIndicator() {
  const telegram = useTelegram();
  const user = useUser();

  // Only show in development or when inside Telegram
  if (!telegram.isInsideTelegram) return null;

  return (
    <div className="mx-4 mb-4 rounded-xl border-2 border-dashed border-sky-500/40 bg-sky-500/5 px-4 py-3">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-sky-400">
        <Shield className="h-3.5 w-3.5" />
        Telegram Connected
      </div>
      <div className="mt-2 space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-white/70">
          <UserIcon className="h-3.5 w-3.5 text-white/40" />
          <span>ID: {user.id}</span>
        </div>
        {user.username && (
          <div className="flex items-center gap-2 text-xs font-bold text-white/70">
            <span className="text-white/40">@</span>
            <span>{user.username}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs font-bold text-white/70">
          <span className="text-white/40">Name:</span>
          <span>{user.firstName}{user.lastName ? ` ${user.lastName}` : ""}</span>
        </div>
      </div>
    </div>
  );
}
