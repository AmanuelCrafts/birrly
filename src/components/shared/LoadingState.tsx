import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  count?: number;
  className?: string;
}

/** Generic loading state for lists */
export function LoadingState({ count = 3, className }: LoadingStateProps) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-2xl border-2 border-white/10 bg-ink-900 p-4 shadow-[4px_4px_0px_#000000]">
          <Skeleton className="h-11 w-11 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
