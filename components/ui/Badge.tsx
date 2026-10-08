import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "muted" | "success" | "danger";
}

const variantClasses = {
  default: "bg-brand-500/15 text-brand-300 border-brand-500/30",
  gold: "bg-gold-500/15 text-gold-400 border-gold-500/30",
  muted: "bg-white/5 text-white/50 border-white/10",
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  danger: "bg-red-500/15 text-red-400 border-red-500/30",
};

export function Badge({ className = "", variant = "default", children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
