import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StarField from "../components/StarField";
import GlobalNovaChat from "../components/GlobalNovaChat";
import { useAuth } from "../contexts/AuthContext";
import { useTasks } from "../contexts/TaskContext";
import { Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout() {
  const { isTransitioning } = useAuth();
  const { levelUpNotification, level } = useTasks();

  return (
    <div className="flex min-h-screen bg-[#030014] text-gray-100 overflow-hidden relative">
      {/* Subtle Starfield background */}
      <StarField warp={isTransitioning} density={60} />

      {/* Smooth decorative backdrop space glows */}
      <div className="absolute top-10 right-10 w-[500px] h-[500px] rounded-full nebula-purple filter blur-[150px] pointer-events-none opacity-20" />
      <div className="absolute bottom-10 left-60 w-[500px] h-[500px] rounded-full nebula-blue filter blur-[150px] pointer-events-none opacity-15" />

      {/* Collapsible sidebar */}
      <Sidebar />

      {/* Main workspace */}
      <div className="flex-1 flex flex-col min-w-0 z-10 h-screen overflow-y-auto">
        <Topbar />
        
        <main className="p-8 flex-grow">
          {/* Transition wrapper for smooth page mounts */}
          <Outlet />
        </main>
      </div>

      {/* Interactive Level Up Alerts */}
      <AnimatePresence>
        {levelUpNotification && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 glass-panel border border-violet-500/30 p-5 rounded-2xl glow-purple max-w-sm flex items-center gap-4 bg-[#0a081c]/90 shadow-2xl"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.6)] shrink-0">
              <Trophy className="text-white w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base tracking-wide">Milestone Unlocked!</h3>
              <p className="text-xs text-gray-300 mt-0.5">
                You progressed to <span className="text-violet-400 font-bold">Level {level}</span>. Keep matching roadmaps to level up!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <GlobalNovaChat />
    </div>
  );
}
