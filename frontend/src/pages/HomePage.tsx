import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { VipStatusCard } from "../components/VipStatusCard";
import { NoVipCard } from "../components/NoVipCard";

export function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="animate-fade-in min-h-[100dvh] bg-ink-950 px-4 pt-6 pb-8">
      {/* Greeting */}
      <p className="text-xs font-bold text-white/40">
        Welcome back,{" "}
        <span className="font-black text-white">{user.firstName}</span>
      </p>

      {/* VIP Status */}
      <div className="mt-4">
        {user.currentVip ? (
          <VipStatusCard plan={user.currentVip} />
        ) : (
          <NoVipCard />
        )}
      </div>

      {/* User Info Card */}
      <div className="card-premium card-glow mt-4 p-5">
        <div className="flex items-center gap-4">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.firstName}
              className="h-16 w-16 rounded-full border-2 border-brand-500/30 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/20 text-2xl font-black text-brand-400">
              {user.firstName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-lg font-black text-white">
              {user.firstName}
              {user.lastName ? ` ${user.lastName}` : ""}
            </h2>
            {user.username && (
              <p className="text-sm font-semibold text-white/40">@{user.username}</p>
            )}
          </div>
        </div>
      </div>

      {/* Debug Link */}
      <button
        onClick={() => navigate("/debug")}
        className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-white/40 transition-colors hover:bg-white/10 hover:text-white/60 cursor-pointer"
      >
        🔍 Debug Info
      </button>
    </div>
  );
}
