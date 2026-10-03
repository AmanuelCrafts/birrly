import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoadingScreen } from "./components/LoadingScreen";
import { ErrorScreen } from "./components/ErrorScreen";
import { OutsideTelegramScreen } from "./components/OutsideTelegramScreen";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { HomePage } from "./pages/HomePage";
import { PlansPage } from "./pages/PlansPage";
import { DebugPage } from "./pages/DebugPage";

function AppContent() {
  const { state, error, retry } = useAuth();

  if (state === "loading" || state === "authenticating") {
    return <LoadingScreen />;
  }

  if (state === "outside-telegram") {
    return <OutsideTelegramScreen />;
  }

  if (state === "error") {
    return <ErrorScreen message={error ?? "Authentication failed."} onRetry={retry} />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/plans" element={<PlansPage />} />
      <Route path="/debug" element={<DebugPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
