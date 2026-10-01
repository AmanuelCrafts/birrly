import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-brand-50 text-brand-700 border border-brand-200/60",
        gold: "bg-gold-50 text-gold-600 border border-gold-200/60",
        muted: "bg-surface-100 text-surface-500 border border-surface-200/60",
        danger: "bg-coral-50 text-coral-500 border border-coral-100",
        sky: "bg-sky-50 text-sky-500 border border-sky-100",
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
