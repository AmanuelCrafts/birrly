"use client";

import { Target, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";

interface DailyTaskCardProps {
  vipLevel: number;
  requiredActivities: number;
  completed: number;
  onStartTasks?: () => void;
}

export function DailyTaskCard({
  vipLevel,
  requiredActivities,
  completed,
  onStartTasks,
}: DailyTaskCardProps) {
  const { t } = useLanguage();
  const progress = Math.min((completed / requiredActivities) * 100, 100);
  const isComplete = completed >= requiredActivities;

  return (
    <div className="card-premium card-glow p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-brand-400" strokeWidth={2.5} />
          <span className="text-sm font-bold uppercase tracking-wider text-white/60">
            {t("dailyTask")}
          </span>
        </div>
        <span
          className={cn(
            "text-sm font-black",
            isComplete ? "text-emerald-400" : "text-brand-400"
          )}
        >
          {completed} / {requiredActivities}
        </span>
      </div>

      <p className="mt-1 text-xs font-semibold text-white/40">
        VIP {vipLevel} {t("requiresActivities")}
      </p>

      {/* Progress bar */}
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className={cn(
            "animate-progress-fill h-full rounded-full transition-all duration-700",
            isComplete
              ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
              : "bg-gradient-to-r from-brand-600 to-brand-400"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Action button */}
      <Button
        variant={isComplete ? "secondary" : "primary"}
        size="md"
        onClick={onStartTasks}
        disabled={isComplete}
        className="mt-4 w-full"
      >
        {isComplete ? (
          t("allDoneToday")
        ) : (
          <>
            {t("startTasks")}
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          </>
        )}
      </Button>
    </div>
  );
}
