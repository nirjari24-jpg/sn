import React, { useState, useEffect } from "react";
import { Search, Bell, Calendar as CalendarIcon, Sparkles } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTasks } from "../contexts/TaskContext";

export default function Topbar() {
  const { user } = useAuth();
  const { xp, level } = useTasks();
  const [greeting, setGreeting] = useState("Initializing");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good morning");
    else if (hours < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });

  return (
    <header className="w-full h-20 border-b border-white/5 bg-[#030014]/40 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Search Input Bar */}
      <div className="flex items-center gap-6 w-96">
        <div className="relative w-full group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-violet-400 transition-colors" />
          <input
            type="text"
            placeholder="Search commands, skills or lessons..."
            className="w-full pl-11 pr-14 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm text-white placeholder-gray-500 focus:outline-hidden focus:border-violet-500/35 focus:bg-white/10 transition-all duration-300"
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 border border-white/10 bg-white/5 rounded-md px-1.5 py-0.5 pointer-events-none">
            <span className="text-[9px] font-semibold text-gray-400">Ctrl</span>
            <span className="text-[9px] font-semibold text-gray-400">K</span>
          </div>
        </div>
      </div>

      {/* User Stats and Notifications */}
      <div className="flex items-center gap-6">
        {/* Date view */}
        <div className="hidden md:flex items-center gap-2 text-gray-400 text-sm font-medium border-r border-white/5 pr-6">
          <CalendarIcon size={15} className="text-violet-400" />
          <span>{formattedDate}</span>
        </div>

        {/* User Level and XP indicators */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl">
          <div className="w-5 h-5 rounded-full bg-violet-600/30 flex items-center justify-center border border-violet-500/30">
            <Sparkles size={11} className="text-violet-400 animate-pulse" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-gray-400 font-semibold tracking-wide uppercase">Level {level}</span>
            <span className="text-[11px] text-violet-300 font-bold -mt-0.5">{xp} XP</span>
          </div>
        </div>

        {/* Mock Notification Trigger */}
        <button className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 cursor-pointer transition-colors text-gray-400 hover:text-white group">
          <Bell size={17} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-violet-500 ring-2 ring-[#030014] group-hover:scale-110 transition-transform" />
        </button>

        {/* Greeting + Initial Profile Circle */}
        <div className="flex items-center gap-3.5">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-xs text-gray-400 font-medium">{greeting},</span>
            <span className="text-sm text-white font-bold leading-tight">{user?.name || "Explorer"}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-[0_0_15px_rgba(124,58,237,0.3)] border border-violet-400/20">
            {(user?.name || "EX").substring(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
