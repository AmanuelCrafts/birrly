"use client";

import { Coins } from "lucide-react";
import { BalanceCard } from "@/components/home/BalanceCard";
import { StreakIndicator } from "@/components/home/StreakIndicator";
import { DailyActivity } from "@/components/home/DailyActivity";
import { WatchAdButton } from "@/components/home/WatchAdButton";
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
      <div className="px-4 pt-6">
        <p className="text-xs font-bold text-white/50">
          {getGreeting()},{" "}
          <span className="font-black text-white">{user.firstName}</span>
        </p>
      </div>

      <div className="px-4">
        <BalanceCard balance={user.balance} />
      </div>

      <div className="flex items-center gap-2.5 px-4">
        <StreakIndicator streak={user.streak} />
        <div className="flex-1" />
        <Button
          variant="primary"
          size="md"
          onClick={onEarnClick}
          className="shrink-0"
        >
          <Coins className="h-3.5 w-3.5" strokeWidth={2.5} />
          Earn Birr 💰
        </Button>
      </div>

      <div className="px-4">
        <WatchAdButton />
      </div>

      <div className="px-4">
        <DailyActivity
          onTaskClick={onTaskClick}
          onViewAll={onEarnClick}
        />
      </div>
    </div>
  );
}
