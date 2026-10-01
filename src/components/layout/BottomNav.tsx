"use client";

import { Home, Coins, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabId = "home" | "earn" | "rank" | "profile";

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "earn", label: "Earn", icon: Coins },
  { id: "rank", label: "Rank", icon: Trophy },
  { id: "profile", label: "Profile", icon: User },
];

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto w-full max-w-md">
        <div className="mx-3 mb-3 rounded-3xl border border-dark-600/50 bg-dark-900/80 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "relative flex flex-col items-center gap-1 rounded-2xl px-4 py-2.5 transition-all duration-200 cursor-pointer",
                    isActive
                      ? "text-purple-400"
                      : "text-lavender-300/50 hover:text-lavender-200"
                  )}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-2xl bg-purple-500/10 border border-purple-500/20" />
                  )}
                  <Icon className="relative h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="relative text-[10px] font-semibold">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
