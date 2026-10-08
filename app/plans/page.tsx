import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { BottomNav } from "@/components/navigation/BottomNav";
import { VipPlanList } from "@/components/vip/VipPlanList";
import { connectToDatabase } from "@/lib/mongodb";
import { VIPPlan } from "@/models/VIPPlan";

export const dynamic = "force-dynamic";

export default async function PlansPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  await connectToDatabase();

  const plans = await VIPPlan.find({ isActive: true })
    .sort({ level: 1 })
    .lean();

  const currentVipPlan = user.currentVipPlan
    ? await VIPPlan.findById(user.currentVipPlan).lean() as {
        level: number;
        name: string;
        depositAmount: number;
        dailyIncome: number;
        dailyTasksRequired: number;
      } | null
    : null;

  const formattedPlans = plans.map((p) => ({
    level: p.level,
    name: p.name,
    depositAmount: p.depositAmount,
    dailyIncome: p.dailyIncome,
    dailyTasksRequired: p.dailyTasksRequired,
  }));

  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-md">
      <main className="space-y-4 px-4 pb-28 pt-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">
            VIP Plans
          </h1>
          <p className="mt-1 text-sm font-semibold text-white/40">
            Choose the plan that fits your goals.
          </p>
        </div>

        <VipPlanList
          plans={formattedPlans}
          currentVipLevel={currentVipPlan?.level}
        />
      </main>

      <BottomNav />
    </div>
  );
}
