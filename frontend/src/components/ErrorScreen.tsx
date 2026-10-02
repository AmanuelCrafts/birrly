interface ErrorScreenProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorScreen({ message, onRetry }: ErrorScreenProps) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-ink-950 px-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-coral-500/20 text-4xl">
        ⚠️
      </div>
      <p className="text-center text-sm font-bold text-white/60">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-400 cursor-pointer"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
