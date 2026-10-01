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
        "flex items-center gap-2.5 rounded-2xl border px-3.5 py-3 transition-all duration-150",
        isCurrentUser
          ? "border-purple-500/30 bg-purple-500/5"
          : "border-dark-600/40 bg-dark-800/60 hover:border-dark-500/60",
        className
      )}
    >
      <div className="flex w-7 shrink-0 items-center justify-center">
        {rank === 1 ? (
          <Crown className="h-4 w-4 text-gold-400" strokeWidth={2.5} />
        ) : (
          <span
            className={cn(
              "text-xs font-bold",
              isTop3 ? "text-gold-400" : "text-lavender-300/50"
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
            "text-sm font-semibold truncate",
            isCurrentUser ? "text-purple-400" : "text-white"
          )}
        >
          {user.firstName}
          {isCurrentUser && " (You)"}
        </p>
        {user.username && (
          <p className="text-xs text-lavender-300/50 truncate">@{user.username}</p>
        )}
      </div>

      <div className="shrink-0 text-right">
        <span className="text-sm font-bold text-white">
          {formatBirr(balance)}
        </span>
        <p className="text-[10px] font-medium text-lavender-300/40">Birr</p>
      </div>
    </div>
  );
}
