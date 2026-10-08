"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ProfileCardProps {
  user: {
    username: string;
    status: string;
    createdAt: string;
  };
  hasVip: boolean;
  vipName?: string;
}

export function ProfileCard({ user, hasVip, vipName }: ProfileCardProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const memberSince = new Date(user.createdAt).getFullYear();

  return (
    <Card className="animate-fade-in">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-500/20 text-3xl font-black text-brand-400">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <h2 className="mt-3 text-xl font-black text-white">{user.username}</h2>
        <p className="text-sm font-semibold text-white/40">@{user.username}</p>

        <div className="mt-3">
          <Badge variant={user.status === "ACTIVE" ? "success" : "danger"}>
            {user.status}
          </Badge>
        </div>
      </div>

      <div className="mt-5 space-y-3 border-t border-white/5 pt-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white/40">Member since</span>
          <span className="text-sm font-bold text-white">{memberSince}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white/40">Current VIP</span>
          <span className="text-sm font-bold text-white">
            {hasVip && vipName ? vipName : "None"}
          </span>
        </div>
      </div>

      <Button
        variant="danger"
        onClick={handleLogout}
        className="mt-5 w-full"
      >
        Log Out
      </Button>
    </Card>
  );
}
