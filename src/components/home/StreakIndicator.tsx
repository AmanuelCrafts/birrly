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
        "flex items-center gap-2 rounded-xl border-2 border-gold-500/40 bg-gold-500/10 px-3 py-1.5",
        className
      )}
    >
      <Flame className="h-3.5 w-3.5 text-gold-400" strokeWidth={2.5} />
      <span className="text-[10px] font-black uppercase tracking-wider text-gold-400">
        {streak} day streak 🔥
      </span>
    </div>
  );
}
