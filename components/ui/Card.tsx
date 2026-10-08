import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glow" | "premium";
}

export function Card({ className = "", variant = "default", children, ...props }: CardProps) {
  const variantClasses = {
    default: "bg-ink-900 border border-white/10",
    glow: "bg-ink-900 border border-brand-500/20 shadow-[0_0_30px_rgb(139_92_246/0.08)]",
    premium:
      "bg-gradient-to-br from-ink-800 to-ink-900 border border-brand-500/30 shadow-[0_0_40px_rgb(139_92_246/0.1)]",
  };

  return (
    <div
      className={`rounded-2xl p-5 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
