import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { initTelegram, getTelegramInitData, isInsideTelegram } from "../lib/telegram";
import { telegramAuth, type ApiUser } from "../lib/api";

type AuthState = "loading" | "authenticating" | "authenticated" | "error" | "outside-telegram";

interface AuthContextType {
  state: AuthState;
  user: ApiUser | null;
  error: string | null;
  retry: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>("loading");
  const [user, setUser] = useState<ApiUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const authenticate = useCallback(async () => {
    // Check if inside Telegram
    if (!isInsideTelegram()) {
      setState("outside-telegram");
      setError("This app must be opened through Telegram.");
      return;
    }

    // Initialize Telegram SDK
    initTelegram();

    const initData = getTelegramInitData();
    if (!initData) {
      setState("error");
      setError("Unable to authenticate with Telegram.");
      return;
    }

    setState("authenticating");
    setError(null);

    try {
      const response = await telegramAuth(initData);

      if (!response.success || !response.data) {
        setState("error");
        setError(
          response.error?.message ??
            "Authentication failed. Please make sure the backend server is running."
        );
        return;
      }

      setUser(response.data.user);
      setState("authenticated");
    } catch (err) {
      setState("error");
      setError(
        "Unable to connect to the server. Please make sure the backend is deployed and running."
      );
    }
  }, []);

  useEffect(() => {
    authenticate();
  }, [authenticate]);

  return (
    <AuthContext.Provider value={{ state, user, error, retry: authenticate }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
