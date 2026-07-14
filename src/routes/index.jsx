import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Splash from "../pages/Splash";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CareerDiscovery from "../pages/CareerDiscovery";
import Roadmap from "../pages/Roadmap";
import Planner from "../pages/Planner";
import Progress from "../pages/Progress";
import Achievements from "../pages/Achievements";
import Resources from "../pages/Resources";
import NOVA from "../pages/NOVA";
import Settings from "../pages/Settings";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#030014] text-violet-400 font-semibold tracking-wider text-xs">
        INITIALIZING ORBITS...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Root/Landing Orbits */}
      <Route path="/" element={<Splash />} />
      <Route path="/landing" element={<Landing />} />

      {/* Auth screens wrapper */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Dashboard core workspace */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/career-discovery" element={<CareerDiscovery />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/nova" element={<NOVA />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Fallback Orbits redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
