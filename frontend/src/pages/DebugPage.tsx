import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getTelegramWebApp, isInsideTelegram, getTelegramInitData } from "../lib/telegram";
import { getVipPlans } from "../lib/vip";

interface DebugInfo {
  insideTelegram: boolean;
  initDataPresent: boolean;
  initDataLength: number;
  telegramUser: string | null;
  colorScheme: string | null;
  isExpanded: boolean | null;
  authState: string;
  user: string | null;
  apiBase: string;
  backendReachable: boolean | null;
  backendError: string | null;
  vipPlansCount: number | null;
  vipPlansError: string | null;
  timestamp: string;
}

export function DebugPage() {
  const { state, user, error } = useAuth();
  const [debug, setDebug] = useState<DebugInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function gatherDebugInfo() {
      const tg = getTelegramWebApp();
      const insideTelegram = isInsideTelegram();
      const initData = getTelegramInitData();

      let backendReachable: boolean | null = null;
      let backendError: string | null = null;
      let vipPlansCount: number | null = null;
      let vipPlansError: string | null = null;

      try {
        const healthRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || ""}/api/health`,
          { credentials: "include" }
        );
        backendReachable = healthRes.ok;
      } catch (e) {
        backendError = e instanceof Error ? e.message : "Connection failed";
      }

      try {
        const plans = await getVipPlans();
        if (plans.success && plans.data) {
          vipPlansCount = plans.data.plans.length;
        } else {
          vipPlansError = plans.error?.message ?? "Failed to load plans";
        }
      } catch (e) {
        vipPlansError = e instanceof Error ? e.message : "Connection failed";
      }

      setDebug({
        insideTelegram,
        initDataPresent: initData.length > 0,
        initDataLength: initData.length,
        telegramUser: tg?.initDataUnsafe?.user
          ? JSON.stringify({
              id: tg.initDataUnsafe.user.id,
              first_name: tg.initDataUnsafe.user.first_name,
              username: tg.initDataUnsafe.user.username,
            })
          : null,
        colorScheme: tg?.colorScheme ?? null,
        isExpanded: tg?.isExpanded ?? null,
        authState: state,
        user: user
          ? JSON.stringify({
              id: user.id,
              firstName: user.firstName,
              username: user.username,
              currentVip: user.currentVip,
            })
          : null,
        apiBase: import.meta.env.VITE_API_BASE_URL || "(using Vite proxy)",
        backendReachable,
        backendError,
        vipPlansCount,
        vipPlansError,
        timestamp: new Date().toISOString(),
      });
      setLoading(false);
    }

    gatherDebugInfo();
  }, [state, user]);

  if (loading || !debug) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-ink-950">
        <div className="animate-bounce-subtle text-2xl">🔍</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-[100dvh] bg-ink-950 px-4 pt-6 pb-8">
      <h1 className="text-2xl font-black uppercase tracking-tight text-white">
        Debug
      </h1>
      <p className="mt-1 text-sm font-semibold text-white/40">
        Diagnostic information for troubleshooting
      </p>

      <div className="mt-6 space-y-3">
        {/* Telegram Environment */}
        <DebugSection title="Telegram Environment">
          <DebugRow label="Inside Telegram" value={debug.insideTelegram ? "Yes" : "No"} ok={debug.insideTelegram} />
          <DebugRow label="Init Data Present" value={debug.initDataPresent ? "Yes" : "No"} ok={debug.initDataPresent} />
          <DebugRow label="Init Data Length" value={String(debug.initDataLength)} />
          <DebugRow label="Color Scheme" value={debug.colorScheme ?? "N/A"} />
          <DebugRow label="Is Expanded" value={debug.isExpanded !== null ? String(debug.isExpanded) : "N/A"} />
          <DebugRow label="Telegram User" value={debug.telegramUser ?? "N/A"} />
        </DebugSection>

        {/* Authentication */}
        <DebugSection title="Authentication">
          <DebugRow label="Auth State" value={debug.authState} ok={debug.authState === "authenticated"} />
          <DebugRow label="User" value={debug.user ?? "N/A"} />
          {error && <DebugRow label="Error" value={error} ok={false} />}
        </DebugSection>

        {/* Backend Connectivity */}
        <DebugSection title="Backend">
          <DebugRow label="API Base URL" value={debug.apiBase} />
          <DebugRow
            label="Backend Reachable"
            value={debug.backendReachable === true ? "Yes" : debug.backendReachable === false ? "No" : "Unknown"}
            ok={debug.backendReachable === true}
          />
          {debug.backendError && <DebugRow label="Backend Error" value={debug.backendError} ok={false} />}
          <DebugRow
            label="VIP Plans"
            value={debug.vipPlansCount !== null ? `${debug.vipPlansCount} plans loaded` : "Not loaded"}
            ok={debug.vipPlansCount !== null}
          />
          {debug.vipPlansError && <DebugRow label="VIP Plans Error" value={debug.vipPlansError} ok={false} />}
        </DebugSection>

        {/* Timestamp */}
        <DebugSection title="Session">
          <DebugRow label="Timestamp" value={debug.timestamp} />
        </DebugSection>
      </div>
    </div>
  );
}

function DebugSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-premium p-4">
      <h2 className="mb-3 text-xs font-black uppercase tracking-wider text-brand-400">
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function DebugRow({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="shrink-0 text-xs font-semibold text-white/50">{label}</span>
      <span
        className={`text-right text-xs font-bold break-all ${
          ok === true ? "text-emerald-400" : ok === false ? "text-coral-400" : "text-white/80"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
