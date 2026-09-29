"use client";

import { ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TaskCard } from "./TaskCard";
import { mockTasks } from "@/lib/data";
import type { Task } from "@/lib/types";

interface DailyActivityProps {
  onTaskClick?: (task: Task) => void;
  onViewAll?: () => void;
}

export function DailyActivity({ onTaskClick, onViewAll }: DailyActivityProps) {
  const dailyTasks = mockTasks.slice(0, 3);

  return (
    <Card>
      <CardHeader className="px-4 pt-4 pb-1">
        <CardTitle>Daily Activity</CardTitle>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-400 hover:text-brand-300 transition-colors cursor-pointer"
        >
          View all
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      </CardHeader>
      <CardContent className="space-y-2 px-3 pb-3">
        {dailyTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onTaskClick={onTaskClick}
          />
        ))}
      </CardContent>
    </Card>
  );
}
