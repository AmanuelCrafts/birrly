import { useNavigate } from "react-router-dom";

export function OutsideTelegramScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-ink-950 px-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gold-500/20 text-4xl">
        ✈️
      </div>
      <div className="text-center">
        <h1 className="text-lg font-black text-white">Open in Telegram</h1>
        <p className="mt-2 text-sm font-semibold text-white/50">
          This app must be opened through Telegram.
          <br />
          Please launch it from your Birrly bot.
        </p>
      </div>
      <button
        onClick={() => navigate("/debug")}
        className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white/50 transition-colors hover:bg-white/10 hover:text-white/70 cursor-pointer"
      >
        🔍 Debug Info
      </button>
    </div>
  );
}
