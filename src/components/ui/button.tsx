import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/30 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97] cursor-pointer select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 hover:from-purple-400 hover:to-purple-500 hover:shadow-purple-500/30",
        secondary:
          "bg-dark-800 text-lavender-200 border border-dark-600 hover:bg-dark-700 hover:border-dark-500",
        gold:
          "bg-gradient-to-b from-gold-400 to-gold-500 text-dark-900 shadow-lg shadow-gold-500/25 hover:from-gold-300 hover:to-gold-400",
        danger:
          "bg-gradient-to-b from-coral-400 to-coral-500 text-white shadow-lg shadow-coral-500/25",
        ghost:
          "bg-transparent text-lavender-300 hover:text-white hover:bg-dark-800",
        outline:
          "bg-transparent text-purple-400 border border-purple-500/30 hover:bg-purple-500/10",
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
