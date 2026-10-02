"use client";

import { Home, Coins, Wallet, Target, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabId = "home" | "earn" | "wallet" | "plans" | "profile";

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "earn", label: "Earn", icon: Coins },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "plans", label: "Plans", icon: Target },
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
        <div className="mx-3 mb-3 rounded-2xl border border-white/10 bg-ink-900/95 shadow-[0_-4px_24px_rgb(0_0_0/0.4)] backdrop-blur-xl">
          <div className="flex items-center justify-around px-1 py-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "relative flex flex-col items-center gap-0.5 rounded-xl px-2.5 py-1.5 transition-all duration-150 cursor-pointer",
                    isActive
                      ? "text-brand-400"
                      : "text-white/35 hover:text-white/60"
                  )}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-xl bg-brand-500/10" />
                  )}
                  <Icon className="relative h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="relative text-[9px] font-bold uppercase tracking-wider">
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
