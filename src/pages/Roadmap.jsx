import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Map, CheckCircle2, ChevronRight, Lock, Sparkles, BookOpen } from "lucide-react";
import { useTasks } from "../contexts/TaskContext";
import { useCareer } from "../contexts/CareerContext";
import GlassCard from "../components/ui/GlassCard";
import { scaleIn } from "../animations/motion";

export default function Roadmap() {
  const navigate = useNavigate();
  const { tasks, toggleTask } = useTasks();
  const { activeRoadmap } = useCareer();
  const [expandedStage, setExpandedStage] = useState("");

  if (!activeRoadmap) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Map className="w-16 h-16 text-gray-700 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Roadmap Active</h3>
        <p className="text-gray-400">Take the assessment and select a career to generate your AI Roadmap.</p>
      </div>
    );
  }

  const stages = activeRoadmap.stages || [];

  // Group task items by stage
  const getStageTasks = (stageId) => {
    return tasks.filter((t) => t.stageId === stageId);
  };

  const getStageProgress = (stageId) => {
    const stageTasks = getStageTasks(stageId);
    if (stageTasks.length === 0) return 0;
    const completed = stageTasks.filter((t) => t.completed).length;
    return (completed / stageTasks.length) * 100;
  };

  return (
    <div className="max-w-4xl mx-auto text-left flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Map className="text-violet-400 w-8 h-8" />
            Interactive AI Roadmap
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Track your stage milestones and complete coding tasks to unlock developer competencies.
          </p>
        </div>
        
        {/* Track Label */}
        <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-xl flex items-center gap-2 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse" />
          <span className="text-xs font-bold text-white">{activeRoadmap.title}</span>
        </div>
      </div>

      {/* Visual Roadmap Path nodes */}
      <div className="flex flex-col gap-8 relative py-4">
        {/* Continuous background connector path */}
        <div className="absolute left-[39px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-violet-500/50 via-indigo-500/20 to-transparent pointer-events-none" />

        {stages.map((stage, idx) => {
          const stageTasks = getStageTasks(stage.id);
          const progress = getStageProgress(stage.id);
          const isDone = progress === 100;
          const isUnlocked = idx === 0 || getStageProgress(stages[idx - 1].id) > 0; // Unlock if first or previous has progress
          const isOpen = expandedStage === stage.id || (!expandedStage && idx === 0);

          return (
            <motion.div
              key={stage.id}
              initial="hidden"
              animate="visible"
              variants={scaleIn}
              className="flex gap-6 relative items-start"
            >
              {/* Vertical Path Node Circle */}
              <div className="relative shrink-0 z-10 mt-1">
                <button
                  onClick={() => isUnlocked && setExpandedStage(isOpen ? "" : stage.id)}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                    isDone
                      ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                      : isUnlocked
                      ? "bg-violet-950/30 border-violet-500/40 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.15)] cursor-pointer"
                      : "bg-[#0a081c]/50 border-white/5 text-gray-600 cursor-not-allowed"
                  }`}
                  disabled={!isUnlocked}
                >
                  {isDone ? (
                    <CheckCircle2 size={20} />
                  ) : isUnlocked ? (
                    <Sparkles size={16} className="animate-pulse" />
                  ) : (
                    <Lock size={15} />
                  )}
                </button>
                <div className="absolute -bottom-1 right-0 bg-[#030014] text-[9px] font-bold text-gray-500 border border-white/5 px-1 rounded-sm">
                  S{idx + 1}
                </div>
              </div>

              {/* Stage Content Card */}
              <GlassCard
                className={`flex-1 border-white/10 transition-all duration-300 ${
                  !isUnlocked && "opacity-55"
                }`}
                glow={isOpen ? "purple" : "none"}
              >
                {/* Card summary tab */}
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => isUnlocked && setExpandedStage(isOpen ? "" : stage.id)}
                >
                  <div className="text-left flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-white tracking-wide truncate">{stage.title}</h3>
                      <span className="text-[10px] text-gray-500 font-semibold">• {stage.duration}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Contains {stageTasks.length} technical tasks to achieve stage integration.
                    </p>
                  </div>
                  
                  {/* Progress values */}
                  <div className="flex items-center gap-4 shrink-0 select-none">
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Done</span>
                      <span className="text-xs font-bold text-violet-400 mt-0.5">{Math.round(progress)}%</span>
                    </div>
                    <ChevronRight
                      size={18}
                      className={`text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-90 text-violet-400" : ""}`}
                    />
                  </div>
                </div>

                {/* Expanded Tasks list */}
                {isOpen && (
                  <div className="mt-6 border-t border-white/5 pt-4 flex flex-col gap-3">
                    {stageTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-center justify-between p-3.5 rounded-xl border text-xs sm:text-sm transition-all duration-300 ${
                          task.completed
                            ? "bg-emerald-950/10 border-emerald-500/10 text-gray-500"
                            : "bg-white/2 border-white/5 text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3 text-left min-w-0">
                          <CheckCircle2
                            size={16}
                            className={`shrink-0 transition-colors ${
                              task.completed ? "text-emerald-500" : "text-gray-600"
                            }`}
                          />
                          <span className={`truncate ${task.completed && "line-through text-gray-500"}`}>
                            {task.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 shrink-0 pl-3">
                          {task.completed ? (
                            <span className="font-bold text-xs text-emerald-500">
                              +{task.xp} XP
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/weekly-tests?taskId=${task.id}`);
                              }}
                              className="bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-md transition-colors shadow-sm cursor-pointer"
                            >
                              Take Test
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
