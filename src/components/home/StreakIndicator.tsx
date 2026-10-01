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
        "relative flex items-center gap-3 rounded-3xl border border-gold-500/30 bg-gradient-to-r from-gold-500/10 via-dark-800 to-purple-500/10 px-5 py-4",
        className
      )}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gold-500/5 to-purple-500/5 animate-glow-pulse" />

      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-500 shadow-lg shadow-gold-500/30">
        <Flame className="h-6 w-6 text-dark-900 animate-flame" strokeWidth={2.5} />
      </div>

      <div className="relative">
        <p className="text-2xl font-bold text-white">
          {streak} <span className="text-sm font-semibold text-gold-400">day{streak !== 1 ? "s" : ""}</span>
        </p>
        <p className="text-xs text-lavender-300">Keep it going! 🔥</p>
      </div>

      <div className="ml-auto text-right">
        <p className="text-xs font-semibold text-purple-300">Daily Reward</p>
        <p className="text-lg font-bold text-gold-400">+2 💰</p>
      </div>
    </div>
  );
}
