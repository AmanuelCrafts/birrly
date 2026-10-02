import { useAuth } from "../context/AuthContext";

export function HomePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-ink-950 px-6">
      {/* Avatar */}
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.firstName}
          className="h-24 w-24 rounded-full border-2 border-brand-500/30 object-cover"
        />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-500/20 text-3xl font-black text-brand-400">
          {user.firstName.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Name */}
      <h1 className="text-2xl font-black text-white">
        {user.firstName}
        {user.lastName ? ` ${user.lastName}` : ""}
      </h1>

      {/* Username */}
      {user.username && (
        <p className="text-sm font-semibold text-white/40">@{user.username}</p>
      )}

      {/* Welcome badge */}
      <div className="mt-4 rounded-2xl border border-brand-500/20 bg-brand-500/10 px-6 py-3">
        <p className="text-xs font-bold text-brand-300">
          🎉 Welcome to Birrly!
        </p>
        <p className="mt-1 text-[10px] font-semibold text-white/40">
          Phase 1 — Authentication complete
        </p>
      </div>
    </div>
  );
}
