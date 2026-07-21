import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Compass,
  Map,
  Calendar,
  BarChart3,
  Trophy,
  BookOpen,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import clsx from "clsx";

const navItems = [
  { path: "/dashboard", label: "Home", icon: LayoutDashboard },
  { path: "/assessment", label: "Find Your Career", icon: Sparkles },
  { path: "/career-discovery", label: "Career Matches", icon: Compass },
  { path: "/roadmap", label: "Roadmap", icon: Map },
  { path: "/planner", label: "Planner", icon: Calendar },
  { path: "/weekly-tests", label: "Weekly Review", icon: BookOpen },
  { path: "/progress", label: "Your Progress", icon: BarChart3 },
  { path: "/portfolio", label: "Portfolio", icon: Trophy },
  { path: "/internships", label: "Internships", icon: Map },
  { path: "/achievements", label: "Achievements", icon: Trophy },
  { path: "/nova", label: "NOVA AI Chat", icon: MessageSquare },
  { path: "/settings", label: "Settings", icon: Settings }
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.div
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="h-screen sticky top-0 left-0 bg-[#0a081c]/70 backdrop-blur-xl border-r border-white/5 flex flex-col justify-between py-6 px-4 z-40 select-none shrink-0"
    >
      <div>
        {/* Header Branding */}
        <div className="flex items-center justify-between mb-8 px-2 relative">
          <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.5)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400"
              >
                Skill<span className="text-violet-400">Nova</span>
              </motion.span>
            )}
          </Link>

          {/* Collapse Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-7 top-1 bg-violet-950/80 border border-white/10 hover:border-violet-500/40 p-1 rounded-md text-gray-400 hover:text-white cursor-pointer transition-colors"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden",
                  isActive
                    ? "bg-violet-950/30 text-white border-l-2 border-violet-500 shadow-[inset_0_0_15px_rgba(168,85,247,0.05)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                )}
              >
                <Icon size={18} className={clsx(isActive ? "text-violet-400" : "group-hover:text-violet-300 transition-colors")} />
                
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}

                {/* Micro tooltip on collapse */}
                {isCollapsed && (
                  <div className="absolute left-16 bg-black border border-white/10 text-white text-[11px] font-semibold tracking-wide py-1 px-2.5 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-950/10 transition-all duration-300 group cursor-pointer"
        >
          <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-medium"
            >
              Sign Out
            </motion.span>
          )}
          {isCollapsed && (
            <div className="absolute left-16 bg-black border border-red-500/20 text-red-400 text-[11px] font-semibold tracking-wide py-1 px-2.5 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
              Sign Out
            </div>
          )}
        </button>
      </div>
    </motion.div>
  );
}
