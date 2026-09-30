"use client";

import { useState } from "react";
import {
  Play,
  Gift,
  Briefcase,
  Users,
  Sparkles,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { cn, formatBirr } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ComingSoon } from "@/components/shared/ComingSoon";
import { showRewardedAd } from "@/lib/monetag";
import { useTelegram } from "@/hooks/useTelegram";
import { useUser } from "@/hooks/useUser";
import type { Task } from "@/lib/types";

const iconMap: Record<string, LucideIcon> = {
  Play,
  Gift,
  Briefcase,
  Users,
  Sparkles,
};

interface TaskCardProps {
  task: Task;
  onTaskClick?: (task: Task) => void;
  className?: string;
}

export function TaskCard({ task, onTaskClick, className }: TaskCardProps) {
  const Icon = iconMap[task.icon] ?? Sparkles;
  const isComingSoon = task.status === "coming_soon";
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const telegram = useTelegram();
  const user = useUser();

  const handleClick = async () => {
    if (isComingSoon || isLoading) return;

    // If this is the Watch & Earn task, show the Monetag ad
    if (task.id === "watch-ad") {
      if (!telegram.isInsideTelegram || !telegram.user) {
        setMessage("Not in Telegram");
        return;
      }
      if (!user) {
        setMessage("User not loaded");
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

    // For other tasks, use the default click handler
    onTaskClick?.(task);
  };

  return (
    <div className="space-y-1">
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-150",
          !isComingSoon && "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] cursor-pointer",
          isComingSoon && "opacity-60",
          isLoading && "opacity-80",
          className
        )}
        onClick={handleClick}
        role={!isComingSoon ? "button" : undefined}
        tabIndex={!isComingSoon ? 0 : undefined}
      >
        <div className="flex items-center gap-3 p-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2",
              isComingSoon
                ? "border-white/10 bg-ink-800"
                : "border-brand-500/30 bg-brand-500/15"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-brand-400" />
            ) : (
              <Icon
                className={cn(
                  "h-4 w-4",
                  isComingSoon ? "text-white/30" : "text-brand-400"
                )}
                strokeWidth={2.5}
              />
            )}
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
              +{formatBirr(task.reward)}
            </span>
            <p className="text-[9px] font-bold uppercase tracking-wider text-white/30">Birr</p>
          </div>
        </div>
      </Card>
      {message && (
        <p
          className={cn(
            "text-center text-xs font-semibold",
            message.includes("Failed") || message.includes("error") || message.includes("limit") || message.includes("Duplicate")
              ? "text-red-400"
              : "text-emerald-400"
          )}
        >
          {message}
        </p>
      )}
    </div>
  );
}
