"use client";

import { cn } from "@/lib/utils";

interface ProfileStatProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  className?: string;
}

export function ProfileStat({ label, value, icon, className }: ProfileStatProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-2xl border border-surface-200/60 bg-white px-3 py-4 shadow-sm",
        className
      )}
    >
      {icon && <div className="text-brand-500">{icon}</div>}
      <span className="text-lg font-bold text-surface-900">{value}</span>
      <span className="text-[10px] font-medium text-surface-400">
        {label}
      </span>
    </div>
  );
}
