import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { BottomNav } from "@/components/navigation/BottomNav";
import { CurrentVipCard } from "@/components/home/CurrentVipCard";
import { BalanceCard } from "@/components/home/BalanceCard";
import { StreakCard } from "@/components/home/StreakCard";
import { DailyTaskCard } from "@/components/home/DailyTaskCard";
import { VipPlanList } from "@/components/vip/VipPlanList";
import { connectToDatabase } from "@/lib/mongodb";
import { VIPPlan } from "@/models/VIPPlan";

export const dynamic = "force-dynamic";

export default async function HomePage() {
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
          <p className="text-xs font-bold text-white/40">
            Welcome back,{" "}
            <span className="font-black text-white">{user.username}</span>
          </p>
        </div>

        <CurrentVipCard
          hasVip={!!currentVipPlan}
          vip={
            currentVipPlan
              ? {
                  level: currentVipPlan.level,
                  name: currentVipPlan.name,
                  depositAmount: currentVipPlan.depositAmount,
                  dailyIncome: currentVipPlan.dailyIncome,
                  dailyTasksRequired: currentVipPlan.dailyTasksRequired,
                }
              : null
          }
        />

        <BalanceCard />
        <StreakCard />
        <DailyTaskCard />

        <div className="space-y-3 pt-2">
          <h2 className="px-1 text-base font-black uppercase tracking-wider text-white/80">
            VIP Plans
          </h2>
          <VipPlanList
            plans={formattedPlans}
            currentVipLevel={currentVipPlan?.level}
          />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
