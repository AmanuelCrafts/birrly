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
        <div className="mx-3 mb-3 rounded-2xl border-2 border-white/15 bg-ink-900/95 backdrop-blur-xl shadow-[0_0_0_2px_#000000,0_8px_0px_0px_#000000]">
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "relative flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all duration-150 cursor-pointer",
                    isActive
                      ? "text-brand-400"
                      : "text-white/40 hover:text-white/70"
                  )}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-xl border-2 border-brand-500/40 bg-brand-500/10" />
                  )}
                  <Icon className="relative h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="relative text-[10px] font-bold uppercase tracking-wider">
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
