"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/earn", label: "Earn", icon: "🔥" },
  { href: "/wallet", label: "Wallet", icon: "💰" },
  { href: "/plans", label: "Plans", icon: "🎯" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto w-full max-w-md">
        <div className="mx-3 mb-3 rounded-2xl border border-white/10 bg-ink-900/95 shadow-[0_-4px_24px_rgb(0_0_0/0.4)] backdrop-blur-xl">
          <div className="flex items-center justify-around px-1 py-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5
                    transition-all duration-150
                    ${isActive ? "text-brand-400" : "text-white/35 hover:text-white/60"}
                  `}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-xl bg-brand-500/10" />
                  )}
                  <span className="relative text-lg">{item.icon}</span>
                  <span className="relative text-[9px] font-bold uppercase tracking-wider">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
