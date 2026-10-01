"use client";

import { ArrowRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ComingSoon } from "@/components/shared/ComingSoon";

interface ComingSoonCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
}

export function ComingSoonCard({
  title,
  description,
  icon: Icon,
  className,
}: ComingSoonCardProps) {
  return (
    <Card className={`opacity-60 ${className ?? ""}`}>
      <div className="flex items-center gap-3 p-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-100">
          <Icon className="h-4 w-4 text-surface-400" strokeWidth={2.5} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-surface-800 truncate">
              {title}
            </h3>
            <ComingSoon className="shrink-0" />
          </div>
          <p className="mt-0.5 text-xs text-surface-400 truncate">
            {description}
          </p>
        </div>

        <ArrowRight className="h-4 w-4 shrink-0 text-surface-300" />
      </div>
    </Card>
  );
}
