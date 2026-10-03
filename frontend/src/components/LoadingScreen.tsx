import { useNavigate } from "react-router-dom";

export function LoadingScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-ink-950 px-6">
      <div className="animate-bounce-subtle flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-500/20 text-4xl">
        🔐
      </div>
      <p className="text-center text-sm font-bold text-white/60">
        Signing you in...
      </p>
      <button
        onClick={() => navigate("/debug")}
        className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white/50 transition-colors hover:bg-white/10 hover:text-white/70 cursor-pointer"
      >
        🔍 Debug Info
      </button>
    </div>
  );
}
