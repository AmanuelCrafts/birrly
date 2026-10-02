"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { VipPlansList } from "@/components/home/VipPlansList";
import { mockVipPlans } from "@/lib/data";
import type { User, VipPlan } from "@/lib/types";

interface PlansSectionProps {
  user: User;
  onSelectPlan?: (plan: VipPlan) => void;
}

export function PlansSection({ user, onSelectPlan }: PlansSectionProps) {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="VIP Plans"
        subtitle="Choose the plan that fits your goals."
      />

      <div className="px-4 pb-4">
        <VipPlansList
          plans={mockVipPlans}
          currentLevel={user.vipLevel}
          onSelectPlan={onSelectPlan}
        />
      </div>
    </div>
  );
}
