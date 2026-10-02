"use client";

import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between px-1", className)}>
      <div>
        <h2 className="text-base font-black uppercase tracking-wider text-white/80">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-xs font-semibold text-white/40">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
