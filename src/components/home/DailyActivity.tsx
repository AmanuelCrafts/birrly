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
      <CardHeader className="px-5 pt-5 pb-2">
        <CardTitle>Daily Activity</CardTitle>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-500 transition-colors cursor-pointer"
        >
          View all
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </CardHeader>
      <CardContent className="space-y-2.5 px-4 pb-4">
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
