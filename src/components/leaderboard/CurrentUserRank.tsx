"use client";

import { cn, formatBirr } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { UserAvatar } from "@/components/shared/UserAvatar";
import type { User } from "@/lib/types";

interface CurrentUserRankProps {
  user: User;
  rank: number;
  className?: string;
}

export function CurrentUserRank({ user, rank, className }: CurrentUserRankProps) {
  return (
    <Card
      className={cn(
        "border-brand-200/60 bg-gradient-to-r from-brand-50/80 to-white",
        className
      )}
    >
      <div className="flex items-center gap-2.5 p-3.5">
        <div className="flex w-7 shrink-0 items-center justify-center">
          <span className="text-xs font-bold text-brand-600">#{rank}</span>
        </div>

        <UserAvatar
          firstName={user.firstName}
          lastName={user.lastName}
          id={user.id}
          size="sm"
        />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-brand-600 truncate">
            {user.firstName} (You)
          </p>
          {user.username && (
            <p className="text-xs text-surface-400 truncate">@{user.username}</p>
          )}
        </div>

        <div className="shrink-0 text-right">
          <span className="text-sm font-bold text-surface-800">
            {formatBirr(user.balance)}
          </span>
          <p className="text-[10px] font-medium text-surface-300">Birr</p>
        </div>
      </div>
    </Card>
  );
}
