import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-2xl bg-surface-100", className)}
      {...props}
    />
  );
}

/** Skeleton loader for the initial app load */
export function AppLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] gap-5">
      <div className="h-14 w-14 rounded-3xl bg-gradient-to-br from-brand-400 to-brand-500 shadow-lg shadow-brand-500/20 animate-float" />
      <div className="h-4 w-28 rounded-full bg-surface-200 animate-pulse" />
    </div>
  );
}
