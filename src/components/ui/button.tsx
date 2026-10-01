import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97] cursor-pointer select-none shadow-sm",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-brand-400 to-brand-500 text-white shadow-brand-500/25 hover:from-brand-300 hover:to-brand-400 hover:shadow-brand-500/30",
        secondary:
          "bg-white text-surface-700 border border-surface-200 shadow-surface-200/50 hover:bg-surface-50 hover:border-surface-300",
        gold:
          "bg-gradient-to-b from-gold-400 to-gold-500 text-white shadow-gold-500/25 hover:from-gold-300 hover:to-gold-400",
        danger:
          "bg-gradient-to-b from-coral-400 to-coral-500 text-white shadow-coral-500/25 hover:from-coral-300 hover:to-coral-400",
        ghost:
          "bg-transparent text-surface-500 shadow-none hover:text-surface-700 hover:bg-surface-100",
        outline:
          "bg-transparent text-brand-600 border border-brand-300 shadow-none hover:bg-brand-50",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-5 text-sm",
        lg: "h-13 px-7 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
