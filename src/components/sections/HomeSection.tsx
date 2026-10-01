"use client";

import { BalanceCard } from "@/components/home/BalanceCard";
import { StreakIndicator } from "@/components/home/StreakIndicator";
import { DailyActivity } from "@/components/home/DailyActivity";
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
        <p className="text-sm text-lavender-300/60">
          {getGreeting()},{" "}
          <span className="font-semibold text-white">{user.firstName}</span>
        </p>
      </div>

      <div className="px-5">
        <BalanceCard balance={user.balance} />
      </div>

      {/* Streak — main visual focus */}
      <div className="px-5">
        <StreakIndicator streak={user.streak} />
        <p className="mt-2 text-center text-xs font-medium text-lavender-300/70">
          Earn 2 Birr every day you log in 🎁🔥
        </p>
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
