"use client";

import { Card } from "@/components/ui/card";
import { UserAvatar } from "@/components/shared/UserAvatar";
import type { User } from "@/lib/types";

interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 h-8 w-8 bg-brand-500/15" />
      <div className="absolute bottom-0 left-0 h-5 w-5 bg-gold-500/10" />

      <div className="relative flex flex-col items-center px-5 py-8">
        <UserAvatar
          firstName={user.firstName}
          lastName={user.lastName}
          id={user.id}
          size="lg"
        />
        <h2 className="mt-4 text-xl font-black uppercase tracking-tight text-white">
          {user.firstName}
          {user.lastName ? ` ${user.lastName}` : ""}
        </h2>
        {user.username && (
          <p className="mt-1 text-xs font-bold text-white/40">@{user.username}</p>
        )}
        {user.isMock && (
          <span className="mt-3 rounded-lg border-2 border-gold-500/40 bg-gold-500/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-gold-400">
            Demo Account
          </span>
        )}
      </div>
    </Card>
  );
}
