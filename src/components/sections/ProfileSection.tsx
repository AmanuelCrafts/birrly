"use client";

import { Flame, Calendar, History, Users, ArrowDownToLine } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStat } from "@/components/profile/ProfileStat";
import { ComingSoonCard } from "@/components/profile/ComingSoonCard";
import { formatBirr, formatDate } from "@/lib/utils";
import type { User } from "@/lib/types";

interface ProfileSectionProps {
  user: User;
}

export function ProfileSection({ user }: ProfileSectionProps) {
  return (
    <div className="animate-fade-in">
      <PageHeader title="👤 Profile" />

      <div className="space-y-4 px-4 pb-4">
        <ProfileHeader user={user} />

        <div className="grid grid-cols-3 gap-2.5">
          <ProfileStat
            label="Balance"
            value={formatBirr(user.balance)}
            icon={<span className="text-sm font-black text-brand-400">Birr</span>}
          />
          <ProfileStat
            label="Streak"
            value={`${user.streak}d`}
            icon={<Flame className="h-3.5 w-3.5" strokeWidth={2.5} />}
          />
          <ProfileStat
            label="Joined"
            value={formatDate(user.createdAt).split(",")[0]}
            icon={<Calendar className="h-3.5 w-3.5" strokeWidth={2.5} />}
          />
        </div>

        <div className="space-y-2.5">
          <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 px-1">
            Coming Soon
          </h3>
          <ComingSoonCard
            title="Transaction History"
            description="View all your earnings and transactions"
            icon={History}
          />
          <ComingSoonCard
            title="Referrals"
            description="Invite friends and earn bonus Birr"
            icon={Users}
          />
          <ComingSoonCard
            title="Withdrawals"
            description="Cash out your Birr balance"
            icon={ArrowDownToLine}
          />
        </div>
      </div>
    </div>
  );
}
