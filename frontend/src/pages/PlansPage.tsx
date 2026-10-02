import { useEffect, useState } from "react";
import { getVipPlans, type VipPlan } from "../lib/vip";
import { VipPlanCard } from "../components/VipPlanCard";
import { useAuth } from "../context/AuthContext";

export function PlansPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<VipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await getVipPlans();
        if (response.success && response.data) {
          setPlans(response.data.plans);
        } else {
          setError(response.error?.message ?? "Failed to load plans");
        }
      } catch {
        setError("Failed to load plans");
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  const currentVipLevel = user?.currentVip?.level ?? null;

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-ink-950">
        <div className="animate-bounce-subtle text-2xl">💎</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-ink-950 px-6">
        <p className="text-sm font-bold text-white/60">{error}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-[100dvh] bg-ink-950 px-4 pt-6 pb-8">
      <h1 className="text-2xl font-black uppercase tracking-tight text-white">
        VIP Plans
      </h1>
      <p className="mt-1 text-sm font-semibold text-white/40">
        Choose the plan that fits your goals.
      </p>

      <div className="mt-6 space-y-2.5">
        {plans.map((plan, i) => (
          <VipPlanCard
            key={plan.level}
            plan={plan}
            isCurrent={plan.level === currentVipLevel}
            isLocked={currentVipLevel !== null && plan.level > currentVipLevel}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
