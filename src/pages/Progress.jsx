import React from "react";
import { BarChart3, TrendingUp, Sparkles, Trophy, Award, Target, Activity } from "lucide-react";
import { useTasks } from "../contexts/TaskContext";
import { useCareer } from "../contexts/CareerContext";
import GlassCard from "../components/ui/GlassCard";
import ProgressRing from "../components/ui/ProgressRing";

export default function Progress() {
  const { xp, tasks } = useTasks();
  const { activeRoadmap, testScores } = useCareer();

  // Calculate percentage of tasks completed
  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  // Average test score
  const avgScore = testScores.length > 0 
    ? Math.round(testScores.reduce((acc, curr) => acc + curr.score, 0) / testScores.length)
    : 0;

  // Graph data values (using test scores instead of mock milestones if available)
  // If no test scores yet, show a placeholder
  const chartData = testScores.length > 0 
    ? testScores.slice(-7).map((t, idx) => ({ week: `T${idx + 1}`, score: t.score }))
    : [{ week: "W1", score: 0 }, { week: "W2", score: 0 }, { week: "W3", score: 0 }];

  const maxScore = 100;

  return (
    <div className="max-w-5xl mx-auto text-left flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <BarChart3 className="text-violet-400 w-8 h-8" />
          Progress & Analytics
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Review your weekly test performance, milestone accomplishments, and learning trends.
        </p>
      </div>

      {/* Stats summary row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Total XP */}
        <GlassCard className="p-5">
          <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Total Experience</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-white">{xp}</span>
            <span className="text-xs font-bold text-violet-400">XP</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">Aggregated across all goals.</p>
        </GlassCard>

        {/* Average Score */}
        <GlassCard className="p-5">
          <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Avg Test Score</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-white">{avgScore}%</span>
            <span className="text-xs font-bold text-emerald-400">Accuracy</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">From weekly AI evaluations.</p>
        </GlassCard>

        {/* Completed tasks */}
        <GlassCard className="p-5">
          <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Task Completion</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-white">{completedCount}</span>
            <span className="text-xs font-bold text-violet-400">/{totalTasks} Goals</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">Active items cleared from tracker.</p>
        </GlassCard>

        {/* Career match */}
        <GlassCard className="p-5">
          <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Active Orbit</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-base font-extrabold text-white truncate max-w-full block">
              {activeRoadmap ? activeRoadmap.title : "None Active"}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">Current specialized pathfinder.</p>
        </GlassCard>
      </div>

      {/* Grid Charts / Rings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Activity chart */}
        <GlassCard className="lg:col-span-2 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3 mb-6">
              <Activity size={14} className="text-violet-400" />
              Weekly Test Performance
            </h3>
            
            {/* Chart Grid */}
            <div className="flex items-end justify-around h-48 px-4 relative mt-2">
              {/* Horizontal dotted lines */}
              <div className="absolute inset-x-0 bottom-0 h-[1px] border-b border-white/5 border-dashed" />
              <div className="absolute inset-x-0 bottom-16 h-[1px] border-b border-white/5 border-dashed" />
              <div className="absolute inset-x-0 bottom-32 h-[1px] border-b border-white/5 border-dashed" />
              
              {chartData.map((d, idx) => {
                const heightPct = (d.score / maxScore) * 100;

                return (
                  <div key={idx} className="flex flex-col items-center gap-2.5 z-10 w-1/8 select-none group">
                    <span className="text-[10px] font-bold text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/10 px-1.5 py-0.5 rounded-sm -mt-6 absolute">
                      {d.score}%
                    </span>
                    <div
                      className="w-12 rounded-t-lg bg-gradient-to-t from-emerald-900/20 to-emerald-500/80 group-hover:to-emerald-400 border border-emerald-500/10 group-hover:border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all duration-500"
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
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Roadmap Progress</span>
            <p className="text-sm font-bold text-white">
              {progressPercentage === 100
                ? "Roadmap Completed"
                : `${Math.round(progressPercentage)}% coordinates synchronized`}
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
