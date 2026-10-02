"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { BalanceCard } from "@/components/home/BalanceCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { mockTransactions } from "@/lib/data";
import { formatBirr, formatDate } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import type { User } from "@/lib/types";

interface WalletSectionProps {
  user: User;
}

export function WalletSection({ user }: WalletSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`💰 ${t("walletTitle")}`}
        subtitle={t("walletSubtitle")}
      />

      <div className="space-y-4 px-4 pb-4">
        <BalanceCard
          balance={user.balance}
          todayIncome={user.todayIncome}
        />

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="px-4 pt-4 pb-1">
            <CardTitle>{t("recentTransactions")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 px-2 pb-3">
            {mockTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/5"
              >
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    tx.type === "earn"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-coral-500/10 text-coral-400"
                  )}
                >
                  {tx.type === "earn" ? (
                    <ArrowDownLeft className="h-4 w-4" strokeWidth={2.5} />
                  ) : (
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    {tx.description}
                  </p>
                  <p className="text-[10px] font-semibold text-white/30">
                    {formatDate(tx.createdAt)}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-sm font-black",
                    tx.type === "earn" ? "text-emerald-400" : "text-coral-400"
                  )}
                >
                  {tx.type === "earn" ? "+" : "-"}
                  {formatBirr(Math.abs(tx.amount))}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
