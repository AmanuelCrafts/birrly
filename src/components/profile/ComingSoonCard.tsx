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
      <div className="flex items-center gap-3 p-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-white/10 bg-ink-800">
          <Icon className="h-4 w-4 text-white/30" strokeWidth={2.5} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-white truncate">
              {title}
            </h3>
            <ComingSoon className="shrink-0" />
          </div>
          <p className="mt-0.5 text-[10px] font-semibold text-white/30 truncate">
            {description}
          </p>
        </div>

        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/20" strokeWidth={2.5} />
      </div>
    </Card>
  );
}
