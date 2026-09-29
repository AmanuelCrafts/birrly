"use client";

import { TrendingUp } from "lucide-react";
import { formatBirr } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface BalanceCardProps {
  balance: number;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <Card className="relative overflow-hidden border-brand-500/30">
      <div className="absolute top-0 right-0 h-8 w-8 bg-brand-500/20" />

      <div className="relative px-5 py-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
          Your Balance
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-4xl font-black tracking-tight text-white">
            {formatBirr(balance)}
          </span>
          <span className="text-lg font-black text-brand-400">Birr</span>
        </div>
        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-white/40">
          <TrendingUp className="h-3.5 w-3.5 text-brand-400" />
          <span>Earn more by completing activities</span>
        </div>
      </div>
    </Card>
  );
}
