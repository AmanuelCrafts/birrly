"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { LeaderboardRow } from "@/components/leaderboard/LeaderboardRow";
import { CurrentUserRank } from "@/components/leaderboard/CurrentUserRank";
import { mockLeaderboard } from "@/lib/data";
import type { User } from "@/lib/types";

interface LeaderboardSectionProps {
  user: User;
}

export function LeaderboardSection({ user }: LeaderboardSectionProps) {
  const currentUserRank = 42;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Leaderboard"
        subtitle="Top earners this month"
      />

      <div className="space-y-2 px-5 pb-4">
        <CurrentUserRank user={user} rank={currentUserRank} />

        <div className="space-y-1.5">
          {mockLeaderboard.map((entry, i) => (
            <div
              key={entry.user.id}
              className="animate-slide-up"
              style={{ animationDelay: `${(i + 1) * 50}ms` }}
            >
              <LeaderboardRow entry={entry} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
