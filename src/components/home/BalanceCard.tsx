"use client";

import { TrendingUp } from "lucide-react";
import { formatBirr } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface BalanceCardProps {
  balance: number;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <Card className="relative overflow-hidden border-purple-500/20 bg-gradient-to-br from-dark-800 via-purple-900/20 to-dark-800">
      {/* Glow effects */}
      <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative px-6 py-7">
        <p className="text-xs font-semibold uppercase tracking-wider text-lavender-300">
          Your Balance
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight text-white">
            {formatBirr(balance)}
          </span>
          <span className="text-lg font-semibold text-purple-400">Birr</span>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-lavender-300">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/20">
            <TrendingUp className="h-3 w-3 text-purple-400" />
          </div>
          <span>Earn more by completing activities</span>
        </div>
      </div>
    </Card>
  );
}
