import { Card } from "@/components/ui/Card";

export function StreakCard() {
  return (
    <Card className="animate-fade-in">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🔥</span>
        <span className="text-lg font-black text-white">Daily Streak</span>
      </div>
      <p className="mt-3 text-sm font-semibold text-white/40">
        Complete daily activities to build your streak.
      </p>
      <div className="mt-4 flex items-center gap-2">
        <span className="rounded-md bg-white/5 px-2 py-1 text-[10px] font-bold text-white/40">
          Coming soon
        </span>
      </div>
    </Card>
  );
}
