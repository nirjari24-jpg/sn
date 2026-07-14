import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Plus, CheckCircle2, Trash2, CalendarDays, BookMarked, Sparkles } from "lucide-react";
import { useTasks } from "../contexts/TaskContext";
import { useCareer } from "../contexts/CareerContext";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { scaleIn } from "../animations/motion";

export default function Planner() {
  const { tasks, toggleTask, addTask } = useTasks();
  const { plannerGoals, setPlannerGoals } = useCareer();
  
  const [title, setTitle] = useState("");
  const [xpVal, setXpVal] = useState(100);
  const [goalType, setGoalType] = useState("daily");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    // Add to specific planner bucket
    const newGoal = {
      id: `goal-${Date.now()}`,
      title: title.trim(),
      xp: parseInt(xpVal) || 100,
      completed: false,
      stageId: "custom",
      stageTitle: "Planner Goal"
    };
    
    setPlannerGoals(prev => ({
      ...prev,
      [goalType]: [newGoal, ...prev[goalType]]
    }));

    // Also add to global tasks for tracking
    addTask(newGoal.title, newGoal.xp, newGoal.stageId, newGoal.stageTitle);
    
    setTitle("");
    setXpVal(100);
  };

  const togglePlannerGoal = (type, goalId) => {
    setPlannerGoals(prev => {
      const updatedList = prev[type].map(g => {
        if (g.id === goalId) {
           // Find it in global tasks and toggle it too
           const globalTask = tasks.find(t => t.title === g.title);
           if (globalTask) toggleTask(globalTask.id);
           return { ...g, completed: !g.completed };
        }
        return g;
      });
      return { ...prev, [type]: updatedList };
    });
  };

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="max-w-5xl mx-auto text-left flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Calendar className="text-violet-400 w-8 h-8" />
          AI Goal Planner
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Set your daily goals, weekly milestones, and monthly targets aligned with your AI Roadmap.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <GlassCard className="p-5 flex flex-col gap-4 text-left">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3">
              <BookMarked size={14} className="text-violet-400" />
              Progress Statistics
            </h3>
            
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-500">Active Goals</span>
                <span className="font-bold text-white">{activeTasks.length} Goals</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-500">Completed Goals</span>
                <span className="font-bold text-emerald-400">{completedTasks.length} Completed</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">Learning Consistency</span>
                <span className="font-bold text-violet-400">
                  {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Add Goal Form */}
          <GlassCard className="p-6">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3 mb-4">
              <Sparkles size={14} className="text-violet-400" />
              New Goal
            </h3>

            <form onSubmit={handleAdd} className="flex flex-col gap-3.5 items-start">
              <div className="w-full text-left">
                <Input
                  label="Goal Title"
                  placeholder="e.g. Master React Hooks"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="w-full text-left flex gap-3">
                <div className="flex-1">
                  <Input
                    label="XP"
                    type="number"
                    value={xpVal}
                    onChange={(e) => setXpVal(e.target.value)}
                    min="50"
                    max="500"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 text-left">
                    Timeline
                  </label>
                  <select 
                    value={goalType}
                    onChange={(e) => setGoalType(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#0a081c]/50 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
              <Button type="submit" variant="glow" className="w-full h-[40px] mt-2">
                <Plus size={16} className="mr-1" /> Add Goal
              </Button>
            </form>
          </GlassCard>
        </div>

        {/* Right column: Buckets */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {["daily", "weekly", "monthly"].map((type) => (
            <div key={type} className="flex flex-col gap-3">
              <h3 className="font-bold text-xs text-gray-400 uppercase tracking-widest pl-1">
                {type === "daily" ? "Today's Target" : type === "weekly" ? "Weekly Milestone" : "Monthly Target"}
              </h3>
              
              <div className="flex flex-col gap-2">
                {plannerGoals[type].length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-500 border border-dashed border-white/5 rounded-xl">
                    No active {type} goals mapped.
                  </div>
                ) : (
                  plannerGoals[type].map((t) => (
                    <motion.div
                      key={t.id}
                      layoutId={t.id}
                      onClick={() => togglePlannerGoal(type, t.id)}
                      className={`p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all duration-300 group flex items-center justify-between ${
                        t.completed ? "border-emerald-500/10 bg-emerald-950/5 text-gray-500" : "border-white/5 bg-white/2 hover:border-violet-500/20 text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3 text-left truncate min-w-0 pr-3">
                        <CheckCircle2 size={16} className={`shrink-0 ${t.completed ? "text-emerald-500" : "text-gray-600 group-hover:text-violet-400"}`} />
                        <div className="truncate">
                          <span className={`font-semibold block truncate ${t.completed ? "line-through" : ""}`}>{t.title}</span>
                        </div>
                      </div>
                      <span className={`font-bold shrink-0 ${t.completed ? "text-emerald-500" : "text-violet-400"}`}>+{t.xp} XP</span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
