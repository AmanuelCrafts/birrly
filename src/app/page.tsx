"use client";

import { useEffect, useState } from "react";
import { BottomNav, type TabId } from "@/components/layout/BottomNav";
import { HomeSection } from "@/components/sections/HomeSection";
import { EarnSection } from "@/components/sections/EarnSection";
import { WalletSection } from "@/components/sections/WalletSection";
import { PlansSection } from "@/components/sections/PlansSection";
import { ProfileSection } from "@/components/sections/ProfileSection";
import { AppLoader } from "@/components/ui/skeleton";
import { useTelegram } from "@/hooks/useTelegram";
import { useUser } from "@/hooks/useUser";
import type { Task, VipPlan } from "@/lib/types";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const telegram = useTelegram();
  const user = useUser();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleTaskClick = (_task: Task) => {
    telegram.hapticFeedback.impact("light");
  };

  const handleEarnClick = () => {
    telegram.hapticFeedback.impact("medium");
    setActiveTab("earn");
  };

  const handleTabChange = (tab: TabId) => {
    telegram.hapticFeedback.selection();
    setActiveTab(tab);
  };

  const handleViewVipDetails = (_plan: VipPlan) => {
    telegram.hapticFeedback.impact("light");
    setActiveTab("plans");
  };

  const handleWithdraw = () => {
    telegram.hapticFeedback.notification("success");
  };

  if (!isReady) {
    return <AppLoader />;
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col">
      <main className="flex-1 pb-28">
        {activeTab === "home" && (
          <HomeSection
            user={user}
            onEarnClick={handleEarnClick}
            onViewVipDetails={handleViewVipDetails}
            onWithdraw={handleWithdraw}
          />
        )}
        {activeTab === "earn" && (
          <EarnSection onTaskClick={handleTaskClick} />
        )}
        {activeTab === "wallet" && (
          <WalletSection user={user} />
        )}
        {activeTab === "plans" && (
          <PlansSection
            user={user}
            onSelectPlan={handleViewVipDetails}
          />
        )}
        {activeTab === "profile" && (
          <ProfileSection user={user} />
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
