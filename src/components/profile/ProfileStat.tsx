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
        "flex flex-col items-center gap-1 rounded-xl border-2 border-white/10 bg-ink-900 px-2 py-4 shadow-[4px_4px_0px_#000000]",
        className
      )}
    >
      {icon && <div className="text-brand-400">{icon}</div>}
      <span className="text-base font-black text-white">{value}</span>
      <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">
        {label}
      </span>
    </div>
  );
}
