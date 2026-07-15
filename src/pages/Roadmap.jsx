import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Map, CheckCircle2, ChevronRight, Lock, Sparkles, BrainCircuit } from "lucide-react";
import { useCareer } from "../contexts/CareerContext";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import { scaleIn } from "../animations/motion";

export default function Roadmap() {
  const navigate = useNavigate();
  const { activeRoadmap } = useCareer();
  const [expandedStage, setExpandedStage] = useState("");

  if (!activeRoadmap) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Map className="w-16 h-16 text-gray-700 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Roadmap Active</h3>
        <p className="text-gray-400">Take the assessment and let NOVA map your career trajectory.</p>
        <Button onClick={() => navigate('/assessment')} className="mt-6" variant="primary">Start Assessment</Button>
      </div>
    );
  }

  const stages = activeRoadmap.stages || [];

  const getStageProgress = (stage) => {
    if (!stage.tasks || stage.tasks.length === 0) return 0;
    const completed = stage.tasks.filter((t) => t.completed).length;
    return (completed / stage.tasks.length) * 100;
  };

  return (
    <div className="max-w-4xl mx-auto text-left flex flex-col gap-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Map className="text-violet-400 w-8 h-8" />
            AI Career Roadmap
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            This trajectory is fully managed by NOVA. Complete Weekly Tests to advance stages.
          </p>
        </div>
        
        {/* Track Label */}
        <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-xl flex items-center gap-2 shrink-0">
          <BrainCircuit size={14} className="text-violet-400 animate-pulse" />
          <span className="text-xs font-bold text-white">{activeRoadmap.title}</span>
        </div>
      </div>

      {/* Visual Roadmap Path nodes */}
      <div className="flex flex-col gap-8 relative py-4">
        {/* Continuous background connector path */}
        <div className="absolute left-[39px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-violet-500/50 via-indigo-500/20 to-transparent pointer-events-none" />

        {stages.map((stage, idx) => {
          const progress = getStageProgress(stage);
          const isDone = progress === 100;
          const isUnlocked = idx === 0 || getStageProgress(stages[idx - 1]) > 0;
          const isOpen = expandedStage === stage.id || (!expandedStage && isUnlocked && !isDone);

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
                      ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer"
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
                      {stage.tasks?.length || 0} technical competencies. Evaluated by NOVA.
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
                {isOpen && stage.tasks && (
                  <div className="mt-6 border-t border-white/5 pt-4 flex flex-col gap-3">
                    {stage.tasks.map((task) => (
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
                            <span className="font-bold text-[10px] text-emerald-500">
                              VERIFIED
                            </span>
                          ) : (
                            <span className="font-bold text-[10px] text-gray-500">
                              PENDING
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {!isDone && (
                       <div className="mt-4 flex justify-end">
                         <Button onClick={() => navigate('/weekly-tests')} variant="glow" className="text-xs py-2 px-4 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                           Request Stage Evaluation
                         </Button>
                       </div>
                    )}
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
