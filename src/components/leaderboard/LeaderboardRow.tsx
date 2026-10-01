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
          ? "border-brand-200/60 bg-brand-50/50"
          : "border-surface-200/40 bg-white hover:border-surface-300/60",
        className
      )}
    >
      <div className="flex w-7 shrink-0 items-center justify-center">
        {rank === 1 ? (
          <Crown className="h-4 w-4 text-gold-500" strokeWidth={2.5} />
        ) : (
          <span
            className={cn(
              "text-xs font-bold",
              isTop3 ? "text-gold-500" : "text-surface-400"
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
            isCurrentUser ? "text-brand-600" : "text-surface-800"
          )}
        >
          {user.firstName}
          {isCurrentUser && " (You)"}
        </p>
        {user.username && (
          <p className="text-xs text-surface-400 truncate">@{user.username}</p>
        )}
      </div>

      <div className="shrink-0 text-right">
        <span className="text-sm font-bold text-surface-800">
          {formatBirr(balance)}
        </span>
        <p className="text-[10px] font-medium text-surface-300">Birr</p>
      </div>
    </div>
  );
}
