import React from "react";
import { Outlet } from "react-router-dom";
import StarField from "../components/StarField";
import { useAuth } from "../contexts/AuthContext";

export default function AuthLayout() {
  const { isTransitioning } = useAuth();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030014]">
      {/* Animated Starfield Backdrop */}
      <StarField warp={isTransitioning} density={120} />

      {/* Decorative nebula glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full nebula-purple filter blur-[120px] pointer-events-none opacity-50 animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full nebula-blue filter blur-[120px] pointer-events-none opacity-40 animate-pulse-glow" style={{ animationDelay: "2s" }} />

      {/* Centered card viewport */}
      <div className="relative z-10 w-full max-w-md px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
}
