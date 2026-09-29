"use client";

import { useEffect, useState } from "react";
import { BottomNav, type TabId } from "@/components/layout/BottomNav";
import { HomeSection } from "@/components/sections/HomeSection";
import { EarnSection } from "@/components/sections/EarnSection";
import { LeaderboardSection } from "@/components/sections/LeaderboardSection";
import { ProfileSection } from "@/components/sections/ProfileSection";
import { AppLoader } from "@/components/ui/skeleton";
import { useTelegram } from "@/hooks/useTelegram";
import { useUser } from "@/hooks/useUser";
import type { Task } from "@/lib/types";

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

  if (!isReady) {
    return <AppLoader />;
  }

  // Not inside Telegram — show message
  if (!telegram.isInsideTelegram) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 px-8 text-center">
        <div className="text-4xl">📱</div>
        <h1 className="text-xl font-black uppercase tracking-tight text-white">
          Birrly
        </h1>
        <p className="text-sm font-semibold text-white/50">
          Open Birrly from your Telegram bot to get started.
        </p>
      </div>
    );
  }

  // Inside Telegram but no user yet — loading
  if (!user) {
    return <AppLoader />;
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col">
      <main className="flex-1 pb-28">
        {activeTab === "home" && (
          <HomeSection
            user={user}
            onEarnClick={handleEarnClick}
            onTaskClick={handleTaskClick}
          />
        )}
        {activeTab === "earn" && (
          <EarnSection onTaskClick={handleTaskClick} />
        )}
        {activeTab === "rank" && (
          <LeaderboardSection user={user} />
        )}
        {activeTab === "profile" && (
          <ProfileSection user={user} />
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
