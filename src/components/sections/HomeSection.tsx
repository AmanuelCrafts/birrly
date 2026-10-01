"use client";

import { Coins } from "lucide-react";
import { BalanceCard } from "@/components/home/BalanceCard";
import { StreakIndicator } from "@/components/home/StreakIndicator";
import { DailyActivity } from "@/components/home/DailyActivity";
import { Button } from "@/components/ui/button";
import { getGreeting } from "@/lib/utils";
import type { Task, User } from "@/lib/types";

interface HomeSectionProps {
  user: User;
  onEarnClick: () => void;
  onTaskClick: (task: Task) => void;
}

export function HomeSection({ user, onEarnClick, onTaskClick }: HomeSectionProps) {
  return (
    <div className="animate-fade-in space-y-4">
      <div className="px-5 pt-7">
        <p className="text-sm text-surface-400">
          {getGreeting()},{" "}
          <span className="font-semibold text-surface-900">{user.firstName}</span>
        </p>
      </div>

      <div className="px-5">
        <BalanceCard balance={user.balance} />
      </div>

      <div className="flex items-center gap-2.5 px-5">
        <StreakIndicator streak={user.streak} />
        <div className="flex-1" />
        <Button
          variant="primary"
          size="md"
          onClick={onEarnClick}
          className="shrink-0"
        >
          <Coins className="h-4 w-4" />
          Earn Birr
        </Button>
      </div>

      <div className="px-5">
        <DailyActivity
          onTaskClick={onTaskClick}
          onViewAll={onEarnClick}
        />
      </div>
    </div>
  );
}
