"use client";

import { cn, formatBRL } from "@/lib/utils";
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
        "border-brand-500/40 bg-brand-500/[0.08]",
        className
      )}
    >
      <div className="flex items-center gap-2.5 p-3">
        <div className="flex w-7 shrink-0 items-center justify-center">
          <span className="text-xs font-black text-brand-400">#{rank}</span>
        </div>

        <UserAvatar
          firstName={user.firstName}
          lastName={user.lastName}
          id={user.id}
          size="sm"
        />

        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-brand-400 truncate">
            {user.firstName} (You)
          </p>
          {user.username && (
            <p className="text-[10px] font-semibold text-white/30 truncate">@{user.username}</p>
          )}
        </div>

        <div className="shrink-0 text-right">
          <span className="text-xs font-black text-white">
            {formatBRL(user.balance)}
          </span>
          <p className="text-[9px] font-bold uppercase tracking-wider text-white/30">BRL</p>
        </div>
      </div>
    </Card>
  );
}
