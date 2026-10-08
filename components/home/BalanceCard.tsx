import { Card } from "@/components/ui/Card";

export function BalanceCard() {
  return (
    <Card className="animate-fade-in">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
        Wallet
      </p>
      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500/10 text-3xl">
          💰
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight text-white/60">
            Coming Soon
          </h2>
          <p className="text-sm font-semibold text-white/30">
            Your balance and transaction history will appear here.
          </p>
        </div>
      </div>
    </Card>
  );
}
