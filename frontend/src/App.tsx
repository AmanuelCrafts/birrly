import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoadingScreen } from "./components/LoadingScreen";
import { ErrorScreen } from "./components/ErrorScreen";
import { OutsideTelegramScreen } from "./components/OutsideTelegramScreen";
import { HomePage } from "./pages/HomePage";
import { PlansPage } from "./pages/PlansPage";

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/plans" element={<PlansPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
