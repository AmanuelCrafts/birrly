"use client";

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakIndicatorProps {
  streak: number;
  className?: string;
}

export function StreakIndicator({ streak, className }: StreakIndicatorProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-2xl border border-gold-200/60 bg-gradient-to-r from-gold-50 to-gold-100/50 px-3.5 py-2",
        className
      )}
    >
      <Flame className="h-4 w-4 text-gold-500" strokeWidth={2.5} />
      <span className="text-xs font-semibold text-gold-600">
        {streak} day streak
      </span>
    </div>
  );
}
