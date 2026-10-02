import { ChevronRight } from "lucide-react";
import type { VipPlan } from "../lib/vip";

interface VipStatusCardProps {
  plan: VipPlan;
  onViewDetails?: () => void;
}

export function VipStatusCard({ plan, onViewDetails }: VipStatusCardProps) {
  return (
    <div className="animate-glow-pulse relative overflow-hidden rounded-3xl bg-vip-gradient p-[1px]">
      <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-ink-950/90 backdrop-blur-xl">
        {/* Background glow effects */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-brand-700/20 blur-3xl" />

        {/* Shimmer overlay */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-shimmer absolute inset-0 bg-shimmer" />
        </div>

        <div className="relative p-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-300/80">
              Your Current VIP
            </p>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
              <span className="animate-dot-pulse h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Active
            </span>
          </div>

          {/* VIP Level */}
          <div className="mt-4 flex items-center gap-4">
            <div className="animate-bounce-subtle flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl shadow-lg">
              💎
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white">
                {plan.name}
              </h2>
              <p className="text-sm font-semibold text-brand-300/80">
                {plan.depositAmount} ETB deposit
              </p>
            </div>
          </div>

          {/* Daily income highlight */}
          <div className="mt-4 rounded-2xl bg-white/5 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
              Daily Income
            </p>
            <p className="mt-0.5 text-2xl font-black text-white">
              +{plan.dailyIncome}{" "}
              <span className="text-sm font-bold text-brand-300">ETB / day</span>
            </p>
          </div>

          {/* Daily tasks */}
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-md bg-white/5 px-2 py-1 text-[10px] font-bold text-white/50">
              🎯 {plan.dailyTasksRequired} daily tasks
            </span>
          </div>

          {/* View details link */}
          <button
            onClick={onViewDetails}
            className="mt-4 flex items-center gap-1 text-xs font-bold text-brand-300 transition-colors hover:text-brand-200 cursor-pointer"
          >
            View {plan.name} details
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
