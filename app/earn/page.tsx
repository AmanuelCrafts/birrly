import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Card } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function EarnPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-md">
      <main className="space-y-4 px-4 pb-28 pt-6">
        <h1 className="animate-fade-in text-2xl font-black uppercase tracking-tight text-white">
          Earn
        </h1>

        <Card className="animate-fade-in">
          <div className="flex flex-col items-center py-8 text-center">
            <span className="text-5xl">🔥</span>
            <h2 className="mt-4 text-xl font-black text-white">
              Build your streak.
            </h2>
            <p className="mt-1 text-sm font-semibold text-white/40">
              Complete daily activities. Earn rewards.
            </p>
            <div className="mt-4">
              <span className="rounded-md bg-white/5 px-3 py-1 text-xs font-bold text-white/40">
                Coming soon
              </span>
            </div>
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
