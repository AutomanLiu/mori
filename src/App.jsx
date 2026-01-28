import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Wishes from "./pages/Wishes";
import SettingsPage from "./pages/Settings";
import Layout from "./components/Layout";
import IconDesign from "./pages/IconDesign";
import SplashScreen from "./components/SplashScreen";
import { useLocalStorage } from "./hooks/use-local-storage";

function PrivateRoute({ children }) {
  const [dob] = useLocalStorage("lifebattery_dob", "");
  return dob ? children : <Navigate to="/onboarding" />;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />

        <Route element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        } path="/" />

        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/icon-design" element={<IconDesign />} /> {/* Added Route */}

      </Routes>
    </BrowserRouter>
  );
}
