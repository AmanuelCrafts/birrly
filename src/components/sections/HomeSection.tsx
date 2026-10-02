"use client";

import { VipStatusCard } from "@/components/home/VipStatusCard";
import { BalanceCard } from "@/components/home/BalanceCard";
import { StreakCard } from "@/components/home/StreakCard";
import { DailyTaskCard } from "@/components/home/DailyTaskCard";
import { VipPlansList } from "@/components/home/VipPlansList";
import { SectionHeader } from "@/components/home/SectionHeader";
import { mockVipPlans } from "@/lib/data";
import { useLanguage } from "@/hooks/useLanguage";
import type { User, VipPlan } from "@/lib/types";

interface HomeSectionProps {
  user: User;
  onEarnClick: () => void;
  onViewVipDetails?: (plan: VipPlan) => void;
  onWithdraw?: () => void;
}

export function HomeSection({
  user,
  onEarnClick,
  onViewVipDetails,
  onWithdraw,
}: HomeSectionProps) {
  const { t } = useLanguage();
  const currentPlan = mockVipPlans.find((p) => p.level === user.vipLevel) ?? mockVipPlans[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("greetingMorning");
    if (hour < 17) return t("greetingAfternoon");
    return t("greetingEvening");
  };

  return (
    <div className="animate-fade-in space-y-5">
      {/* Greeting */}
      <div className="px-4 pt-5">
        <p className="text-xs font-bold text-white/40">
          {getGreeting()},{" "}
          <span className="font-black text-white">{user.firstName}</span>
        </p>
      </div>

      {/* 1. Current VIP — most prominent */}
      <div className="px-4">
        <VipStatusCard
          plan={currentPlan}
          onViewDetails={() => onViewVipDetails?.(currentPlan)}
        />
      </div>

      {/* 2. Balance card */}
      <div className="px-4">
        <BalanceCard
          balance={user.balance}
          todayIncome={user.todayIncome}
          onWithdraw={onWithdraw}
        />
      </div>

      {/* 3. Streak */}
      <div className="px-4">
        <StreakCard streak={user.streak} />
      </div>

      {/* 4. Daily Task */}
      <div className="px-4">
        <DailyTaskCard
          vipLevel={user.vipLevel}
          requiredActivities={currentPlan.dailyActivities}
          completed={user.dailyTasksCompleted}
          onStartTasks={onEarnClick}
        />
      </div>

      {/* 5. VIP Plans */}
      <div className="space-y-3 px-4 pb-4">
        <SectionHeader
          title={t("vipPlans")}
          subtitle={t("upgradeToEarnMore")}
        />
        <VipPlansList
          plans={mockVipPlans}
          currentLevel={user.vipLevel}
          onSelectPlan={onViewVipDetails}
        />
      </div>
    </div>
  );
}
