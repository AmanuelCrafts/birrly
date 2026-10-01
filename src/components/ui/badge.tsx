import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-purple-500/15 text-purple-300 border border-purple-500/20",
        gold: "bg-gold-500/15 text-gold-400 border border-gold-500/20",
        muted: "bg-dark-700 text-lavender-300 border border-dark-600",
        danger: "bg-coral-500/15 text-coral-400 border border-coral-500/20",
        sky: "bg-sky-500/15 text-sky-400 border border-sky-500/20",
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
