export function OutsideTelegramScreen() {
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
    </div>
  );
}
