"use client";

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCardProps {
  streak: number;
  className?: string;
}

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function StreakCard({ streak, className }: StreakCardProps) {
  // Determine which day of the week today is (0 = Monday)
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1; // Convert to Monday-based index

  // Days completed: show min(streak, 7) days filled, but cap at today's index for "future" days
  const daysCompleted = Math.min(streak, 7);

  return (
    <div
      className={cn(
        "card-premium relative overflow-hidden p-5",
        className
      )}
    >
      {/* Subtle gold glow */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gold-500/10 blur-2xl" />

      <div className="relative">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-gold-400" strokeWidth={2.5} />
          <span className="text-lg font-black text-white">
            {streak} Day Streak
          </span>
        </div>

        {/* Day indicators */}
        <div className="mt-4 flex justify-between">
          {DAY_LABELS.map((day, i) => {
            const isCompleted = i < daysCompleted;
            const isToday = i === todayIndex;
            const isFuture = i > todayIndex;

            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-bold text-white/30">{day}</span>
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all",
                    isCompleted && "bg-gold-500 text-ink-950 shadow-[0_0_12px_rgb(255_200_0/0.3)]",
                    isToday && !isCompleted && "border-2 border-gold-500/50 text-gold-400",
                    isFuture && "bg-white/5 text-white/20",
                    !isCompleted && !isToday && !isFuture && "bg-white/5 text-white/40"
                  )}
                >
                  {isCompleted ? "✓" : isToday ? "○" : "○"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
