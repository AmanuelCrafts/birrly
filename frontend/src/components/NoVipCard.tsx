import { useNavigate } from "react-router-dom";

export function NoVipCard() {
  const navigate = useNavigate();

  return (
    <div className="card-premium card-glow p-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
          Your Current VIP
        </p>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-3xl">
          💎
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight text-white/60">
            No Active VIP
          </h2>
          <p className="text-sm font-semibold text-white/30">
            Choose a VIP plan to get started
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate("/plans")}
        className="mt-4 w-full rounded-xl bg-brand-500/10 border border-brand-500/20 px-4 py-2.5 text-xs font-bold text-brand-300 transition-colors hover:bg-brand-500/20 cursor-pointer"
      >
        Browse Plans →
      </button>
    </div>
  );
}
