"use client";

import {
  Play,
  Gift,
  Briefcase,
  Users,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn, formatBRL } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ComingSoon } from "@/components/shared/ComingSoon";
import type { Task } from "@/lib/types";

const iconMap: Record<string, LucideIcon> = {
  Play,
  Gift,
  Briefcase,
  Users,
  Sparkles,
};

interface EarnTaskCardProps {
  task: Task;
  onTaskClick?: (task: Task) => void;
  className?: string;
}

export function EarnTaskCard({ task, onTaskClick, className }: EarnTaskCardProps) {
  const Icon = iconMap[task.icon] ?? Sparkles;
  const isComingSoon = task.status === "coming_soon";

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-150",
        !isComingSoon && "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] cursor-pointer",
        isComingSoon && "opacity-60",
        className
      )}
      onClick={() => !isComingSoon && onTaskClick?.(task)}
      role={!isComingSoon ? "button" : undefined}
      tabIndex={!isComingSoon ? 0 : undefined}
    >
      <div className="relative flex items-center gap-3 p-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2",
            isComingSoon
              ? "border-white/10 bg-ink-800"
              : "border-brand-500/30 bg-brand-500/15"
          )}
        >
          <Icon
            className={cn(
              "h-4 w-4",
              isComingSoon ? "text-white/30" : "text-brand-400"
            )}
            strokeWidth={2.5}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-white truncate">
              {task.title}
            </h3>
            {isComingSoon && <ComingSoon className="shrink-0" />}
          </div>
          <p className="mt-0.5 text-[10px] font-semibold text-white/40 truncate">
            {task.description}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <span className="text-sm font-black text-brand-400">
            +{formatBRL(task.reward)}
          </span>
          <p className="text-[9px] font-bold uppercase tracking-wider text-white/30">BRL</p>
        </div>
      </div>
    </Card>
  );
}
