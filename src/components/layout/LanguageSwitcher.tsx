"use client";

import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import type { Language } from "@/lib/i18n";

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "am", label: "አማርኛ", flag: "🇪🇹" },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={cn("flex items-center gap-1 rounded-xl bg-white/5 p-1", className)}>
      <Globe className="ml-1.5 h-3.5 w-3.5 text-white/40" strokeWidth={2.5} />
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={cn(
            "flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer",
            language === lang.code
              ? "bg-brand-500/20 text-brand-300"
              : "text-white/40 hover:text-white/60"
          )}
        >
          <span className="text-xs">{lang.flag}</span>
          {lang.code === "am" ? "አማ" : "EN"}
        </button>
      ))}
    </div>
  );
}
