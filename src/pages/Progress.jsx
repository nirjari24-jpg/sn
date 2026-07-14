import React from "react";
import { BarChart3, TrendingUp, Sparkles, Trophy, Award, Target } from "lucide-react";
import { useTasks } from "../contexts/TaskContext";
import { mockUserData } from "../data/mockData";
import { mockCareers } from "../data/mockCareers";
import GlassCard from "../components/ui/GlassCard";
import ProgressRing from "../components/ui/ProgressRing";

export default function Progress() {
  const { xp, level, tasks, careerTrack } = useTasks();

  const activeCareer = mockCareers.find((c) => c.id === careerTrack) || mockCareers[0];

  // Calculate percentage of tasks completed
  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  // Level progress
  const xpNeeded = level * 1000;
  const levelProgress = (xp / xpNeeded) * 100;

  // Graph data values
  const milestoneData = mockUserData.milestones;
  const maxXP = Math.max(...milestoneData.map((d) => d.xp));

  return (
    <div className="max-w-5xl mx-auto text-left flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <BarChart3 className="text-violet-400 w-8 h-8" />
          Progress & Analytics
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Review your weekly study velocities, milestone accomplishments, and learning trends.
        </p>
      </div>

      {/* Stats summary row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Total XP */}
        <GlassCard className="p-5">
          <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Total Experience</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-white">{xp + (level - 1) * 1500}</span>
            <span className="text-xs font-bold text-violet-400">XP</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">Aggregated across all calibration modules.</p>
        </GlassCard>

        {/* Level */}
        <GlassCard className="p-5">
          <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Profile Rank</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-white">Lvl {level}</span>
            <span className="text-xs font-bold text-violet-400">Ascended</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">Next rank calibration at {xpNeeded} XP.</p>
        </GlassCard>

        {/* Completed tasks */}
        <GlassCard className="p-5">
          <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Task Completion</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-white">{completedCount}</span>
            <span className="text-xs font-bold text-emerald-400">/{totalTasks} Goals</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">Active items cleared from your tracker.</p>
        </GlassCard>

        {/* Career match */}
        <GlassCard className="p-5">
          <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Active Orbit</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-base font-extrabold text-white truncate max-w-full block">{activeCareer.title}</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">Current specialized pathfinder coordinates.</p>
        </GlassCard>
      </div>

      {/* Grid Charts / Rings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Activity chart */}
        <GlassCard className="lg:col-span-2 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3 mb-6">
              <TrendingUp size={14} className="text-violet-400" />
              Weekly Development Velocity
            </h3>
            
            {/* Chart Grid */}
            <div className="flex items-end justify-between h-48 px-4 relative mt-2">
              {/* Horizontal dotted lines */}
              <div className="absolute inset-x-0 bottom-0 h-[1px] border-b border-white/5 border-dashed" />
              <div className="absolute inset-x-0 bottom-16 h-[1px] border-b border-white/5 border-dashed" />
              <div className="absolute inset-x-0 bottom-32 h-[1px] border-b border-white/5 border-dashed" />
              
              {milestoneData.map((d) => {
                const heightPct = (d.xp / maxXP) * 80; // scale max height to 80%

                return (
                  <div key={d.week} className="flex flex-col items-center gap-2.5 z-10 w-1/8 select-none group">
                    {/* Tooltip value */}
                    <span className="text-[10px] font-bold text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/10 px-1.5 py-0.5 rounded-sm -mt-6 absolute">
                      {d.xp} XP
                    </span>
                    {/* Bar graphic */}
                    <div
                      className="w-8 rounded-t-lg bg-gradient-to-t from-indigo-600/20 to-violet-500/80 group-hover:to-violet-400 border border-violet-500/10 group-hover:border-violet-400/40 shadow-[0_0_15px_rgba(139,92,246,0.1)] group-hover:shadow-[0_0_20px_rgba(139,92,246,0.25)] transition-all duration-500"
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[10px] text-gray-500 font-semibold">{d.week}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </GlassCard>

        {/* Circular gauge card */}
        <GlassCard className="lg:col-span-1 p-6 flex flex-col items-center justify-between">
          <div className="w-full text-left">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3 mb-6">
              <Target size={14} className="text-violet-400" />
              Integration Quotient
            </h3>
          </div>

          <ProgressRing percentage={progressPercentage} size={130} />

          <div className="flex flex-col gap-1 mt-6 text-center select-none">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Current Calibration</span>
            <p className="text-sm font-bold text-white">
              {progressPercentage === 100
                ? "SaaS Integration Completed"
                : `${Math.round(progressPercentage)}% coordinates synchronized`}
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
