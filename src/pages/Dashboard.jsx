import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  Trophy,
  Flame,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Clock,
  Plus,
  Quote
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTasks } from "../contexts/TaskContext";
import { mockCareers } from "../data/mockCareers";
import { motivationalQuotes } from "../data/mockData";
import GlassCard from "../components/ui/GlassCard";
import ProgressRing from "../components/ui/ProgressRing";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { scaleIn } from "../animations/motion";

export default function Dashboard() {
  const { user } = useAuth();
  const {
    xp,
    level,
    tasks,
    missions,
    careerTrack,
    toggleTask,
    addTask,
    toggleMission
  } = useTasks();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [activeQuote, setActiveQuote] = useState({ text: "", author: "" });
  
  // Find current track details
  const activeCareer = mockCareers.find((c) => c.id === careerTrack) || mockCareers[0];

  useEffect(() => {
    // Select a random quote
    const randIdx = Math.floor(Math.random() * motivationalQuotes.length);
    setActiveQuote(motivationalQuotes[randIdx]);
  }, []);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle.trim(), 120, "custom", "Daily Task");
    setNewTaskTitle("");
  };

  // Calculate percentage of tasks completed
  const totalTasks = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const progressPercentage = totalTasks > 0 ? (completedTasksCount / totalTasks) * 100 : 0;

  // Level progression stats
  const xpNeeded = level * 1000;
  const levelProgress = (xp / xpNeeded) * 100;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.08 }
        }
      }}
      className="flex flex-col gap-6 text-left"
    >
      {/* Upper Header Welcome banner */}
      <motion.div variants={scaleIn}>
        <GlassCard className="p-6 bg-gradient-to-r from-violet-950/20 via-indigo-950/20 to-black/40 border-violet-500/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-full bg-radial-gradient(circle_at_100%_0%,rgba(139,92,246,0.1),transparent_70%) pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-violet-400 font-semibold text-xs tracking-wider uppercase">
                <Sparkles size={13} className="animate-pulse" />
                <span>Synchronized Trajectory</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Welcome back, {user?.name || "Explorer"}
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-xl">
                Your career specialization coordinates are locking onto <span className="text-violet-300 font-semibold">{activeCareer.title}</span>. Keep logging hours to unlock badges.
              </p>
            </div>
            
            {/* Level bar layout inside welcome */}
            <div className="w-full md:w-72 bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-semibold">Level {level} Ascent</span>
                <span className="text-violet-300 font-bold">{xp} / {xpNeeded} XP</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-700 ease-out"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Grid Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Today's Missions */}
        <motion.div variants={scaleIn}>
          <GlassCard className="h-full flex flex-col justify-between" glow="purple">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <Flame className="text-orange-500 w-4.5 h-4.5" />
                  Today's Missions
                </h3>
                <span className="text-[10px] bg-orange-950/40 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full font-semibold">Daily</span>
              </div>

              <div className="flex flex-col gap-3">
                {missions.map((mission) => (
                  <div
                    key={mission.id}
                    onClick={() => toggleMission(mission.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                      mission.completed
                        ? "bg-emerald-950/10 border-emerald-500/20 text-gray-400"
                        : "bg-white/2 border-white/5 hover:border-violet-500/20 text-white"
                    }`}
                  >
                    <CheckCircle2
                      size={17}
                      className={`shrink-0 mt-0.5 transition-colors ${
                        mission.completed ? "text-emerald-500" : "text-gray-600"
                      }`}
                    />
                    <div className="flex-1 text-left">
                      <p className={`text-xs font-semibold leading-tight ${mission.completed && "line-through text-gray-500"}`}>
                        {mission.title}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold">{mission.category}</span>
                        <span className={`text-[10px] font-bold ${mission.completed ? "text-emerald-500" : "text-violet-400"}`}>
                          +{mission.xp} XP
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* 2. Interactive Roadmap Progress */}
        <motion.div variants={scaleIn}>
          <GlassCard className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="text-violet-400 w-4.5 h-4.5" />
                  Roadmap Progress
                </h3>
                <span className="text-[10px] text-gray-400 font-bold">Track Active</span>
              </div>

              <div className="flex items-center justify-around gap-4 py-2">
                <ProgressRing percentage={progressPercentage} size={110} />
                <div className="flex flex-col gap-2.5 text-left">
                  <div>
                    <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Career Domain</span>
                    <h4 className="text-sm font-bold text-white truncate max-w-40">{activeCareer.title}</h4>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Completed Steps</span>
                    <h4 className="text-sm font-bold text-violet-400">{completedTasksCount} / {totalTasks} Skills</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 mt-4">
              <Link to="/roadmap" className="w-full">
                <Button variant="outline" className="w-full py-2.5 text-xs font-semibold">
                  Open Interactive Map <ArrowRight size={13} />
                </Button>
              </Link>
            </div>
          </GlassCard>
        </motion.div>

        {/* 3. Daily Planner Task Add List */}
        <motion.div variants={scaleIn}>
          <GlassCard className="h-full flex flex-col justify-between" glow="blue">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="text-blue-400 w-4.5 h-4.5" />
                  Task Planner
                </h3>
                <span className="text-[10px] bg-blue-950/40 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-semibold">Log</span>
              </div>

              {/* Add mini form */}
              <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
                <Input
                  type="text"
                  placeholder="Insert custom milestone..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1"
                  style={{ padding: "8px 12px" }}
                />
                <Button type="submit" variant="secondary" className="px-3">
                  <Plus size={16} />
                </Button>
              </form>

              {/* Scrollable list */}
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                {tasks.slice(0, 5).map((t) => (
                  <div
                    key={t.id}
                    onClick={() => toggleTask(t.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all duration-300 ${
                      t.completed
                        ? "bg-emerald-950/5 border-emerald-500/10 text-gray-500"
                        : "bg-white/2 border-white/5 hover:border-violet-500/20 text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate max-w-44 text-left">
                      <CheckCircle2 size={15} className={t.completed ? "text-emerald-500" : "text-gray-600"} />
                      <span className={`truncate ${t.completed && "line-through text-gray-600"}`}>{t.title}</span>
                    </div>
                    <span className={`font-bold shrink-0 text-[10px] ${t.completed ? "text-emerald-500" : "text-violet-400"}`}>
                      +{t.xp} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-white/5 pt-4 mt-4 shrink-0">
              <Link to="/planner" className="w-full">
                <Button variant="outline" className="w-full py-2.5 text-xs font-semibold">
                  Open Planner Schedule <ArrowRight size={13} />
                </Button>
              </Link>
            </div>
          </GlassCard>
        </motion.div>

        {/* 4. NOVA Consultation box */}
        <motion.div variants={scaleIn}>
          <GlassCard className="h-full flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="text-violet-400 w-4.5 h-4.5" />
                  NOVA Consulting
                </h3>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <p className="text-xs text-gray-400 leading-relaxed text-left">
                "Ready to synchronize. Query my database for system frameworks, scripting tools, or mock interview logs."
              </p>
              
              <div className="p-3 bg-white/2 border border-white/5 rounded-xl text-left">
                <span className="text-[9px] uppercase tracking-wider font-bold text-gray-500">Suggested prompt:</span>
                <p className="text-xs text-violet-300 font-semibold mt-1">"How can I practice my terminal command skills?"</p>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 mt-4">
              <Link to="/nova" className="w-full">
                <Button variant="primary" className="w-full py-2.5 text-xs font-semibold animate-pulse-glow">
                  Initialize Sync Terminal <ArrowRight size={13} />
                </Button>
              </Link>
            </div>
          </GlassCard>
        </motion.div>

        {/* 5. Achievements Showcase */}
        <motion.div variants={scaleIn}>
          <GlassCard className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <Trophy className="text-amber-500 w-4.5 h-4.5" />
                  Achievements
                </h3>
                <span className="text-[10px] text-gray-400 font-bold">Inventory</span>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {user?.achievements?.slice(0, 4).map((badge) => (
                  <div
                    key={badge.id}
                    className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all duration-300 group relative ${
                      badge.unlocked
                        ? "bg-violet-950/20 border-violet-500/30 text-white shadow-[0_0_10px_rgba(139,92,246,0.1)]"
                        : "bg-white/2 border-white/5 text-gray-500 opacity-40"
                    }`}
                  >
                    <Trophy size={20} className={badge.unlocked ? "text-violet-400" : "text-gray-600"} />
                    <span className="text-[9px] font-bold mt-1.5 truncate max-w-full leading-tight">{badge.title}</span>
                    
                    {/* Tooltip detail description */}
                    <div className="absolute bottom-11 bg-black border border-white/10 text-white text-[9px] font-medium p-2 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 w-28 text-center shadow-lg leading-tight">
                      {badge.description} <br />
                      <span className="text-violet-400 font-bold mt-1 inline-block">+{badge.xp} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 mt-4">
              <Link to="/achievements" className="w-full">
                <Button variant="outline" className="w-full py-2.5 text-xs font-semibold">
                  Open Badge Showcase <ArrowRight size={13} />
                </Button>
              </Link>
            </div>
          </GlassCard>
        </motion.div>

        {/* 6. Motivational Quote Card */}
        <motion.div variants={scaleIn}>
          <GlassCard className="h-full flex flex-col justify-between">
            <div className="flex flex-col gap-4 text-left">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <Clock className="text-emerald-400 w-4.5 h-4.5" />
                  Upcoming Deadlines
                </h3>
                <span className="text-[10px] text-red-400 border border-red-500/10 bg-red-950/20 px-2 py-0.5 rounded-full font-bold">Alert</span>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-2 bg-white/2 border border-white/5 rounded-xl text-xs">
                  <div>
                    <h5 className="font-semibold text-white">Stage 1 Completion</h5>
                    <p className="text-[10px] text-gray-500 mt-0.5">Software Engineering track</p>
                  </div>
                  <span className="text-[10px] font-bold text-violet-400">2 Days Left</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-white/2 border border-white/5 rounded-xl text-xs">
                  <div>
                    <h5 className="font-semibold text-white">Figma Component Spec</h5>
                    <p className="text-[10px] text-gray-500 mt-0.5">Product Design submission</p>
                  </div>
                  <span className="text-[10px] font-bold text-violet-400">5 Days Left</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex gap-2.5 items-start text-xs text-gray-400 mt-4 text-left italic">
              <Quote size={18} className="text-violet-400 shrink-0 mt-0.5" />
              <div>
                <p>"{activeQuote.text}"</p>
                <span className="text-[10px] text-gray-600 font-bold not-italic mt-1 inline-block">— {activeQuote.author}</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

      </div>
    </motion.div>
  );
}
