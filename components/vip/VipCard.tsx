import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface VipCardProps {
  plan: {
    level: number;
    name: string;
    depositAmount: number;
    dailyIncome: number;
    dailyTasksRequired: number;
  };
  isCurrent?: boolean;
  index?: number;
}

export function VipCard({ plan, isCurrent = false, index = 0 }: VipCardProps) {
  return (
    <Card
      variant={isCurrent ? "premium" : "default"}
      className={`animate-slide-up ${
        isCurrent ? "ring-1 ring-brand-500/40" : ""
      }`}
      style={{ animationDelay: `${(index + 1) * 50}ms` }}
    >
      {isCurrent && (
        <div className="mb-3">
          <Badge variant="default">Current Plan</Badge>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${
            isCurrent ? "bg-brand-500/20" : "bg-white/5"
          }`}
        >
          💎
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-black text-white">{plan.name}</h3>
          <p className="text-[11px] font-semibold text-white/40">
            {plan.depositAmount.toLocaleString()} ETB deposit
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-sm font-black text-brand-300">
            +{plan.dailyIncome.toLocaleString()}
          </p>
          <p className="text-[9px] font-bold uppercase tracking-wider text-white/30">
            ETB/day
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-bold text-white/40">
          🎯 {plan.dailyTasksRequired} daily tasks
        </span>
      </div>
    </Card>
  );
}
