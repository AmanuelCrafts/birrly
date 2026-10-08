import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { connectToDatabase } from "@/lib/mongodb";
import { VIPPlan } from "@/models/VIPPlan";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  await connectToDatabase();

  const currentVipPlan = user.currentVipPlan
    ? await VIPPlan.findById(user.currentVipPlan).lean() as {
        level: number;
        name: string;
        depositAmount: number;
        dailyIncome: number;
        dailyTasksRequired: number;
      } | null
    : null;

  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-md">
      <main className="space-y-4 px-4 pb-28 pt-6">
        <h1 className="animate-fade-in text-2xl font-black uppercase tracking-tight text-white">
          Profile
        </h1>

        <ProfileCard
          user={{
            username: user.username,
            status: user.status,
            createdAt: user.createdAt.toISOString(),
          }}
          hasVip={!!currentVipPlan}
          vipName={currentVipPlan?.name}
        />
      </main>

      <BottomNav />
    </div>
  );
}
