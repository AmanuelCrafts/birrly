"use client";

import { Crown } from "lucide-react";
import { cn, formatBirr } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/UserAvatar";
import type { LeaderboardEntry } from "@/lib/types";

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
  className?: string;
}

export function LeaderboardRow({ entry, isCurrentUser, className }: LeaderboardRowProps) {
  const { rank, user, balance } = entry;
  const isTop3 = rank <= 3;

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-xl border-2 px-3 py-2.5 transition-all duration-150",
        isCurrentUser
          ? "border-brand-500/40 bg-brand-500/10"
          : "border-white/5 bg-ink-900/50 hover:border-white/10",
        className
      )}
    >
      <div className="flex w-7 shrink-0 items-center justify-center">
        {rank === 1 ? (
          <Crown className="h-4 w-4 text-gold-400" strokeWidth={2.5} />
        ) : (
          <span
            className={cn(
              "text-xs font-black",
              isTop3 ? "text-gold-400" : "text-white/30"
            )}
          >
            {rank}
          </span>
        )}
      </div>

      <UserAvatar
        firstName={user.firstName}
        lastName={user.lastName}
        id={user.id}
        size="sm"
      />

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-xs font-bold truncate",
            isCurrentUser ? "text-brand-400" : "text-white"
          )}
        >
          {user.firstName}
          {isCurrentUser && " (You)"}
        </p>
        {user.username && (
          <p className="text-[10px] font-semibold text-white/30 truncate">@{user.username}</p>
        )}
      </div>

      <div className="shrink-0 text-right">
        <span className="text-xs font-black text-white">
          {formatBirr(balance)}
        </span>
        <p className="text-[9px] font-bold uppercase tracking-wider text-white/30">Birr</p>
      </div>
    </div>
  );
}
