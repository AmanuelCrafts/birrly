import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-lg border-2 px-3 py-1 text-xs font-bold uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "bg-brand-500/15 text-brand-400 border-brand-500/30",
        gold: "bg-gold-500/15 text-gold-400 border-gold-500/30",
        muted: "bg-white/5 text-white/50 border-white/10",
        danger: "bg-coral-500/15 text-coral-400 border-coral-500/30",
        sky: "bg-sky-500/15 text-sky-400 border-sky-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
