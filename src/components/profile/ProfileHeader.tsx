"use client";

import { Card } from "@/components/ui/card";
import { UserAvatar } from "@/components/shared/UserAvatar";
import type { User } from "@/lib/types";

interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <Card className="relative overflow-hidden border-dark-600/40">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-violet-500/10 blur-2xl" />

      <div className="relative flex flex-col items-center px-6 py-8">
        <UserAvatar
          firstName={user.firstName}
          lastName={user.lastName}
          id={user.id}
          size="xl"
          className="ring-4 ring-purple-500/20"
        />
        <h2 className="mt-4 text-xl font-bold tracking-tight text-white">
          {user.firstName}
          {user.lastName ? ` ${user.lastName}` : ""}
        </h2>
        {user.username && (
          <p className="mt-1 text-sm text-lavender-300/60">@{user.username}</p>
        )}
        {user.isMock && (
          <span className="mt-3 rounded-full bg-dark-700 border border-dark-600 px-3 py-1 text-[10px] font-semibold text-lavender-300">
            Demo Account
          </span>
        )}
      </div>
    </Card>
  );
}
