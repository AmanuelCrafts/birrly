import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold uppercase tracking-wide transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 disabled:pointer-events-none disabled:opacity-40 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer select-none border-2",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-500 text-ink-950 border-ink-950 shadow-[4px_4px_0px_#000000] hover:bg-brand-400",
        secondary:
          "bg-ink-800 text-white border-white/20 shadow-[4px_4px_0px_#000000] hover:bg-ink-700 hover:border-white/30",
        gold:
          "bg-gold-500 text-ink-950 border-ink-950 shadow-[4px_4px_0px_#000000] hover:bg-gold-400",
        danger:
          "bg-coral-500 text-white border-ink-950 shadow-[4px_4px_0px_#000000] hover:bg-coral-400",
        ghost:
          "bg-transparent text-white/70 border-transparent shadow-none hover:text-white hover:bg-white/5",
        outline:
          "bg-transparent text-brand-400 border-brand-500/50 shadow-[4px_4px_0px_#000000] hover:bg-brand-500/10",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-12 px-5 text-sm",
        lg: "h-14 px-7 text-base",
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
