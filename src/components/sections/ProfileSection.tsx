"use client";

import { Flame, Calendar, History, Users, ArrowDownToLine } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStat } from "@/components/profile/ProfileStat";
import { ComingSoonCard } from "@/components/profile/ComingSoonCard";
import { formatBirr, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import type { User } from "@/lib/types";

interface ProfileSectionProps {
  user: User;
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="animate-fade-in">
      <PageHeader title={`👤 ${t("profileTitle")}`} />

      <div className="space-y-4 px-4 pb-4">
        <ProfileHeader user={user} />

        {/* VIP Badge */}
        <div className="flex items-center justify-center">
          <Badge variant="default" className="px-4 py-1.5 text-xs">
            💎 VIP {user.vipLevel}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <ProfileStat
            label={t("balance")}
            value={formatBirr(user.balance)}
            icon={<span className="text-sm font-black text-brand-400">Birr</span>}
          />
          <ProfileStat
            label={t("streak")}
            value={`${user.streak}d`}
            icon={<Flame className="h-3.5 w-3.5" strokeWidth={2.5} />}
          />
          <ProfileStat
            label={t("joined")}
            value={formatDate(user.createdAt).split(",")[0]}
            icon={<Calendar className="h-3.5 w-3.5" strokeWidth={2.5} />}
          />
        </div>

        <div className="space-y-2.5">
          <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 px-1">
            {t("comingSoon")}
          </h3>
          <ComingSoonCard
            title={t("transactionHistory")}
            description={t("transactionHistoryDesc")}
            icon={History}
          />
          <ComingSoonCard
            title={t("referrals")}
            description={t("referralsDesc")}
            icon={Users}
          />
          <ComingSoonCard
            title={t("withdrawals")}
            description={t("withdrawalsDesc")}
            icon={ArrowDownToLine}
          />
        </div>
      </div>
    </div>
  );
}
