"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { EarnTaskCard } from "@/components/earn/EarnTaskCard";
import { mockTasks } from "@/lib/data";
import { useLanguage } from "@/hooks/useLanguage";
import type { Task } from "@/lib/types";

interface EarnSectionProps {
  onTaskClick: (task: Task) => void;
}

export function EarnSection({ onTaskClick }: EarnSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`💰 ${t("earnBirr")}`}
        subtitle={t("earnSubtitle")}
      />

      <div className="space-y-2.5 px-4 pb-4">
        {mockTasks.map((task, i) => (
          <div
            key={task.id}
            className="animate-slide-up"
            style={{ animationDelay: `${(i + 1) * 60}ms` }}
          >
            <EarnTaskCard task={task} onTaskClick={onTaskClick} />
          </div>
        ))}
      </div>
    </div>
  );
}
