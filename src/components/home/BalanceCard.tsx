"use client";

import { TrendingUp, Wallet } from "lucide-react";
import { formatBirr } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";

interface BalanceCardProps {
  balance: number;
  todayIncome: number;
  onWithdraw?: () => void;
}

export function BalanceCard({ balance, todayIncome, onWithdraw }: BalanceCardProps) {
  const { t } = useLanguage();
  const canWithdraw = balance > 0;

  return (
    <div className="card-premium card-glow p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
        {t("availableBalance")}
      </p>

      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-4xl font-black tracking-tight text-white">
          {formatBirr(balance)}
        </span>
        <span className="text-lg font-bold text-brand-400">ETB</span>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
        <TrendingUp className="h-4 w-4" strokeWidth={2.5} />
        <span>{t("todaysIncome")}: +{formatBirr(todayIncome)} ETB</span>
      </div>

      <Button
        variant="gold"
        size="md"
        onClick={onWithdraw}
        disabled={!canWithdraw}
        className="mt-4 w-full"
      >
        <Wallet className="h-4 w-4" strokeWidth={2.5} />
        {t("withdraw")}
      </Button>
    </div>
  );
}
