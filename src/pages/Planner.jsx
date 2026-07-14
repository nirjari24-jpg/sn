import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Plus, CheckCircle2, Trash2, CalendarDays, BookMarked, Sparkles } from "lucide-react";
import { useTasks } from "../contexts/TaskContext";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { scaleIn } from "../animations/motion";

export default function Planner() {
  const { tasks, toggleTask, addTask } = useTasks();
  const [title, setTitle] = useState("");
  const [xpVal, setXpVal] = useState(100);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask(title.trim(), parseInt(xpVal) || 100, "custom", "Planner Goal");
    setTitle("");
    setXpVal(100);
  };

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  // Generate calendar days for visual grid
  const days = [
    { label: "Mon", active: false },
    { label: "Tue", active: false },
    { label: "Wed", active: false },
    { label: "Thu", active: true }, // assume today is Thu for visual
    { label: "Fri", active: false },
    { label: "Sat", active: false },
    { label: "Sun", active: false }
  ];

  return (
    <div className="max-w-5xl mx-auto text-left flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Calendar className="text-violet-400 w-8 h-8" />
          Daily Learning Planner
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Organize your daily study schedule, create customized logs, and execute task milestones.
        </p>
      </div>

      {/* Grid: Left Column for Scheduler, Right Column for Add Task & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Visual calendar column */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Weekly visual grid */}
          <GlassCard className="p-5 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3">
              <CalendarDays size={14} className="text-violet-400" />
              Calendar Orbit
            </h3>
            
            <div className="grid grid-cols-7 gap-2">
              {days.map((d) => (
                <div
                  key={d.label}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${
                    d.active
                      ? "bg-violet-600/30 border-violet-500/50 text-white shadow-[0_0_10px_rgba(139,92,246,0.2)] font-bold scale-105"
                      : "bg-white/2 border-white/5 text-gray-500 text-xs font-semibold"
                  }`}
                >
                  <span>{d.label}</span>
                  {d.active && <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1 animate-pulse" />}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Planner summary stats */}
          <GlassCard className="p-5 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3">
              <BookMarked size={14} className="text-violet-400" />
              Task Statistics
            </h3>
            
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-500">Active Tasks</span>
                <span className="font-bold text-white">{activeTasks.length} Goals</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-500">Completed Tasks</span>
                <span className="font-bold text-emerald-400">{completedTasks.length} Completed</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">Backlog Efficiency</span>
                <span className="font-bold text-violet-400">
                  {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right column (Forms and Checklist items) */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Add custom Goal Form */}
          <GlassCard className="p-6">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3 mb-4">
              <Sparkles size={14} className="text-violet-400" />
              Initialize Custom Goal
            </h3>

            <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3.5 items-end">
              <div className="flex-1 w-full text-left">
                <Input
                  label="Goal Title"
                  placeholder="e.g. Master ES6 imports and async loops..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="w-full sm:w-28 text-left">
                <Input
                  label="XP Value"
                  type="number"
                  placeholder="100"
                  value={xpVal}
                  onChange={(e) => setXpVal(e.target.value)}
                  min="50"
                  max="500"
                  required
                />
              </div>
              <Button type="submit" variant="glow" className="h-[43px] px-6">
                <Plus size={16} /> Insert Goal
              </Button>
            </form>
          </GlassCard>

          {/* Active Goals and Completed Checklist */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-xs text-gray-400 uppercase tracking-widest pl-1">Active Checklist</h3>
            
            <div className="flex flex-col gap-2.5">
              {activeTasks.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-500 border border-dashed border-white/5 rounded-xl">
                  No active goals mapped out. Create a custom goal or sync a roadmap track.
                </div>
              ) : (
                activeTasks.map((t) => (
                  <motion.div
                    key={t.id}
                    layoutId={t.id}
                    onClick={() => toggleTask(t.id)}
                    className="p-3.5 rounded-xl border border-white/5 bg-white/2 hover:border-violet-500/20 text-white flex items-center justify-between text-xs sm:text-sm cursor-pointer transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3 text-left truncate min-w-0 pr-3">
                      <CheckCircle2 size={16} className="text-gray-600 group-hover:text-violet-400 shrink-0" />
                      <div className="truncate">
                        <span className="font-semibold block truncate">{t.title}</span>
                        <span className="text-[10px] text-gray-500 mt-0.5 block tracking-wide">{t.stageTitle}</span>
                      </div>
                    </div>
                    <span className="font-bold text-violet-400 shrink-0">+{t.xp} XP</span>
                  </motion.div>
                ))
              )}
            </div>

            {completedTasks.length > 0 && (
              <>
                <h3 className="font-bold text-xs text-gray-500 uppercase tracking-widest pl-1 mt-4">Completed Log</h3>
                <div className="flex flex-col gap-2 opacity-60">
                  {completedTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => toggleTask(t.id)}
                      className="p-3.5 rounded-xl border border-emerald-500/10 bg-emerald-950/5 text-gray-500 flex items-center justify-between text-xs sm:text-sm cursor-pointer transition-all duration-300 hover:border-violet-500/20"
                    >
                      <div className="flex items-center gap-3 text-left truncate min-w-0">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        <span className="font-medium line-through truncate">{t.title}</span>
                      </div>
                      <span className="font-bold text-emerald-500 shrink-0">+{t.xp} XP</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
