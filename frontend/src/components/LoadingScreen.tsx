export function LoadingScreen() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-ink-950 px-6">
      <div className="animate-bounce-subtle flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-500/20 text-4xl">
        🔐
      </div>
      <p className="text-center text-sm font-bold text-white/60">
        Signing you in...
      </p>
    </div>
  );
}
