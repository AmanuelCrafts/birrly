"use client";

import { TrendingUp } from "lucide-react";
import { formatBirr } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface BalanceCardProps {
  balance: number;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <Card className="relative overflow-hidden border-brand-200/40 bg-gradient-to-br from-white via-brand-50/30 to-white">
      {/* Decorative gradient orbs */}
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-brand-200/20 blur-3xl" />
      <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-gold-200/15 blur-2xl" />

      <div className="relative px-6 py-7">
        <p className="text-xs font-semibold uppercase tracking-wider text-surface-400">
          Your Balance
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight text-surface-900">
            {formatBirr(balance)}
          </span>
          <span className="text-lg font-semibold text-brand-600">Birr</span>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-surface-400">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100">
            <TrendingUp className="h-3 w-3 text-brand-600" />
          </div>
          <span>Earn more by completing activities</span>
        </div>
      </div>
    </Card>
  );
}
