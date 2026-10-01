"use client";

import {
  Play,
  Gift,
  Briefcase,
  Users,
  Sparkles,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { cn, formatBirr } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ComingSoon } from "@/components/shared/ComingSoon";
import { showRewardedAd } from "@/lib/monetag";
import { useTelegram } from "@/hooks/useTelegram";
import { useUser } from "@/hooks/useUser";
import { useAdCounter } from "@/hooks/useAdCounter";
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
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const telegram = useTelegram();
  const user = useUser();
  const { count, limit, isLimitReached, increment } = useAdCounter();

  const handleClick = async () => {
    if (isComingSoon || isLoading) return;

    if (task.id === "watch-ad") {
      if (!telegram.isInsideTelegram || !telegram.user) {
        setMessage("Not in Telegram");
        return;
      }
      if (!user) {
        setMessage("User not loaded");
        return;
      }
      if (isLimitReached) {
        setMessage("Daily limit reached");
        return;
      }

      setIsLoading(true);
      setMessage("");

      try {
        await showRewardedAd();

        const eventId = `ad_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        const res = await fetch("/api/ad-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            telegramId: String(telegram.user.id),
            eventId,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setMessage(data.error || "Failed");
          return;
        }

        setMessage(data.message || `+${data.reward} Birr!`);
        user.addBalance(data.reward);
        increment();

        setTimeout(() => {
          setIsLoading(false);
          setMessage("");
        }, 3000);
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Ad failed");
        setIsLoading(false);
      }
      return;
    }

    onTaskClick?.(task);
  };

  const showAdCounter = task.id === "watch-ad" && !isComingSoon;

  return (
    <div className="space-y-1">
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-200",
          !isComingSoon && !isLimitReached && "hover:shadow-md hover:border-surface-300/60 cursor-pointer",
          (isComingSoon || isLimitReached) && "opacity-50",
          isLoading && "opacity-70",
          className
        )}
        onClick={handleClick}
        role={!isComingSoon ? "button" : undefined}
        tabIndex={!isComingSoon ? 0 : undefined}
      >
        <div className="relative flex items-center gap-3 p-3.5">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors",
              isComingSoon || isLimitReached
                ? "bg-surface-100"
                : "bg-brand-50 group-hover:bg-brand-100"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
            ) : (
              <Icon
                className={cn(
                  "h-4 w-4",
                  isComingSoon || isLimitReached ? "text-surface-300" : "text-brand-500"
                )}
                strokeWidth={2.5}
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-surface-800 truncate">
                {task.title}
              </h3>
              {isComingSoon && <ComingSoon className="shrink-0" />}
            </div>
            <p className="mt-0.5 text-xs text-surface-400 truncate">
              {task.description}
            </p>
            {showAdCounter && (
              <p className="mt-0.5 text-[10px] font-semibold text-brand-500">
                {count}/{limit} ads today
              </p>
            )}
          </div>

          <div className="shrink-0 text-right">
            <span className="text-sm font-bold text-brand-600">
              +{formatBirr(task.reward)}
            </span>
            <p className="text-[10px] font-medium text-surface-300">Birr</p>
          </div>
        </div>
      </Card>
      {message && (
        <p
          className={cn(
            "text-center text-xs font-medium",
            message.includes("Failed") || message.includes("error") || message.includes("limit") || message.includes("Duplicate")
              ? "text-coral-500"
              : "text-brand-600"
          )}
        >
          {message}
        </p>
      )}
    </div>
  );
}
