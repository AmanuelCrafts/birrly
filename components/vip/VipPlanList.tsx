import { VipCard } from "./VipCard";

interface VipPlanListProps {
  plans: Array<{
    level: number;
    name: string;
    depositAmount: number;
    dailyIncome: number;
    dailyTasksRequired: number;
  }>;
  currentVipLevel?: number;
}

export function VipPlanList({ plans, currentVipLevel }: VipPlanListProps) {
  return (
    <div className="space-y-2.5">
      {plans.map((plan, i) => (
        <VipCard
          key={plan.level}
          plan={plan}
          isCurrent={plan.level === currentVipLevel}
          index={i}
        />
      ))}
    </div>
  );
}
