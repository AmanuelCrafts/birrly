import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-2xl bg-dark-700", className)}
      {...props}
    />
  );
}

/** Skeleton loader for the initial app load */
export function AppLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] gap-5">
      <div className="h-14 w-14 rounded-3xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg shadow-purple-500/30 animate-float" />
      <div className="h-4 w-28 rounded-full bg-dark-700 animate-pulse" />
    </div>
  );
}
