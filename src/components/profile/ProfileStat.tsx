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
        "flex flex-col items-center gap-1.5 rounded-2xl border border-dark-600/50 bg-dark-800/80 px-3 py-4",
        className
      )}
    >
      {icon && <div className="text-purple-400">{icon}</div>}
      <span className="text-lg font-bold text-white">{value}</span>
      <span className="text-[10px] font-medium text-lavender-300/60">
        {label}
      </span>
    </div>
  );
}
