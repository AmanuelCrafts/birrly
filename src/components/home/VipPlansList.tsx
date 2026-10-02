"use client";

import { Check, Lock } from "lucide-react";
import { cn, formatBirr } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import type { VipPlan } from "@/lib/types";

interface VipPlansListProps {
  plans: VipPlan[];
  currentLevel: number;
  onSelectPlan?: (plan: VipPlan) => void;
  className?: string;
}

export function VipPlansList({
  plans,
  currentLevel,
  onSelectPlan,
  className,
}: VipPlansListProps) {
  const { t } = useLanguage();

  return (
    <div className={cn("space-y-2.5", className)}>
      {plans.map((plan, i) => {
        const isCurrent = plan.level === currentLevel;
        const isLocked = plan.level > currentLevel;

        return (
          <button
            key={plan.level}
            onClick={() => !isLocked && onSelectPlan?.(plan)}
            disabled={isLocked}
            className={cn(
              "animate-slide-up group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200",
              isCurrent
                ? "border-brand-500/40 bg-gradient-to-r from-brand-600/20 to-brand-500/10 shadow-[0_0_20px_rgb(139_92_246/0.1)]"
                : isLocked
                  ? "border-white/5 bg-ink-900/50 opacity-50"
                  : "border-white/10 bg-ink-900/80 hover:border-brand-500/20 hover:bg-ink-800/80 cursor-pointer"
            )}
            style={{ animationDelay: `${(i + 1) * 50}ms` }}
          >
            {/* Current plan badge */}
            {isCurrent && (
              <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-brand-500/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-brand-300">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
                {t("currentPlan")}
              </div>
            )}

            <div className="flex items-center gap-3">
              {/* Icon */}
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl",
                  isCurrent
                    ? "bg-brand-500/20"
                    : isLocked
                      ? "bg-white/5"
                      : "bg-white/5"
                )}
              >
                {isLocked ? (
                  <Lock className="h-4 w-4 text-white/30" />
                ) : (
                  "💎"
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3
                    className={cn(
                      "text-sm font-black",
                      isCurrent ? "text-white" : "text-white/80"
                    )}
                  >
                    {plan.name}
                  </h3>
                  {isCurrent && (
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                  )}
                </div>
                <p className="mt-0.5 text-[11px] font-semibold text-white/40">
                  {formatBirr(plan.deposit)} ETB {t("deposit")}
                </p>
              </div>

              {/* Income */}
              <div className="shrink-0 text-right">
                <p
                  className={cn(
                    "text-sm font-black",
                    isCurrent ? "text-brand-300" : "text-white/70"
                  )}
                >
                  +{formatBirr(plan.dailyIncome)}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/30">
                  ETB/day
                </p>
              </div>
            </div>

            {/* Activities info */}
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-bold text-white/40">
                {plan.dailyActivities} {t("activitiesPerDay")}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
