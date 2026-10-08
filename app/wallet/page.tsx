import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Card } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function WalletPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-md">
      <main className="space-y-4 px-4 pb-28 pt-6">
        <h1 className="animate-fade-in text-2xl font-black uppercase tracking-tight text-white">
          Wallet
        </h1>

        <Card className="animate-fade-in">
          <div className="flex flex-col items-center py-8 text-center">
            <span className="text-5xl">💰</span>
            <h2 className="mt-4 text-xl font-black text-white">
              Your wallet is coming soon.
            </h2>
            <p className="mt-1 text-sm font-semibold text-white/40">
              Balance, transactions, deposits, and withdrawals.
            </p>
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
