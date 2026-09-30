"use client";

import { useState } from "react";
import { Play, Loader2 } from "lucide-react";
import { showRewardedAd } from "@/lib/monetag";
import { useTelegram } from "@/hooks/useTelegram";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";

type AdState = "idle" | "loading" | "showing" | "processing" | "success" | "error";

interface WatchAdButtonProps {
  onRewardEarned?: () => void;
}

export function WatchAdButton({ onRewardEarned }: WatchAdButtonProps) {
  const telegram = useTelegram();
  const user = useUser();
  const [adState, setAdState] = useState<AdState>("idle");
  const [message, setMessage] = useState("");

  const handleWatchAd = async () => {
    if (!telegram.isInsideTelegram || !telegram.user) {
      setAdState("error");
      setMessage("Not in Telegram");
      return;
    }

    if (!user) {
      setAdState("error");
      setMessage("User not loaded");
      return;
    }

    setAdState("loading");
    setMessage("");

    try {
      // Show the Monetag rewarded ad
      setAdState("showing");
      await showRewardedAd();

      // Ad completed — send to server for processing
      setAdState("processing");

      const eventId = `ad_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const res = await fetch("/api/ad-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telegramId: String(telegram.user.id),
          eventId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAdState("error");
        setMessage(data.error || "Failed to process reward");
        return;
      }

      setAdState("success");
      setMessage(data.message || `+${data.reward} Birr earned!`);
      onRewardEarned?.();

      // Reset after 3 seconds
      setTimeout(() => {
        setAdState("idle");
        setMessage("");
      }, 3000);
    } catch (err) {
      setAdState("error");
      setMessage(err instanceof Error ? err.message : "Ad failed to load");
    }
  };

  const isLoading = adState === "loading" || adState === "showing" || adState === "processing";

  return (
    <div className="space-y-2">
      <Button
        variant="primary"
        size="lg"
        onClick={handleWatchAd}
        disabled={isLoading}
        className="w-full"
      >
        {adState === "loading" || adState === "showing" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {adState === "showing" ? "Watching ad..." : "Loading ad..."}
          </>
        ) : adState === "processing" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            Watch Ad — Earn 2 Birr
          </>
        )}
      </Button>
      {message && (
        <p
          className={`text-center text-xs font-semibold ${
            adState === "error" ? "text-red-400" : "text-emerald-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
