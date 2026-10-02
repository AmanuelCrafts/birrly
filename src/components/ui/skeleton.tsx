import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-xl border-2 border-white/10 bg-ink-800", className)}
      {...props}
    />
  );
}

/** Skeleton loader for the initial app load */
export function AppLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] gap-6">
      <div className="h-16 w-16 rounded-2xl border-2 border-brand-500 bg-brand-500/20 animate-bounce-subtle" />
      <div className="h-5 w-32 rounded-lg border-2 border-white/10 bg-ink-800 animate-pulse" />
    </div>
  );
}
