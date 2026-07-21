import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Map, CheckCircle2, ChevronRight, Lock, Sparkles, BrainCircuit, PlayCircle, BookOpen, PenTool, LayoutTemplate, Briefcase } from "lucide-react";
import { useCareer } from "../contexts/CareerContext";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import { scaleIn } from "../animations/motion";

export default function Roadmap() {
  const navigate = useNavigate();
  const { activeRoadmap, setActiveRoadmap, xp, setXp, projectsFinished, setProjectsFinished } = useCareer();
  
  const [expandedStage, setExpandedStage] = useState("");
  const [expandedModule, setExpandedModule] = useState("");
  const [expandedLesson, setExpandedLesson] = useState("");

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

  const handleToggleTask = (stageId, moduleId, lessonId, taskId) => {
    const newRoadmap = JSON.parse(JSON.stringify(activeRoadmap));
    const stage = newRoadmap.stages.find(s => s.id === stageId);
    const module = stage.modules.find(m => m.id === moduleId);
    const lesson = module.lessons.find(l => l.id === lessonId);
    const task = lesson.tasks.find(t => t.id === taskId);
    
    if (task) {
      task.completed = !task.completed;
      setActiveRoadmap(newRoadmap);
      if (task.completed) {
        setXp(prev => prev + 50); // small xp reward
      }
    }
  };

  const handleToggleProject = (stageId, moduleId, projectId) => {
    const newRoadmap = JSON.parse(JSON.stringify(activeRoadmap));
    const stage = newRoadmap.stages.find(s => s.id === stageId);
    const module = stage.modules.find(m => m.id === moduleId);
    const proj = module.projects.find(p => p.id === projectId);
    
    if (proj) {
      proj.completed = !proj.completed;
      setActiveRoadmap(newRoadmap);
      if (proj.completed) {
        setXp(prev => prev + 200);
        setProjectsFinished(prev => prev + 1);
      }
    }
  };

  const getStageProgress = (stage) => {
    if (!stage.modules || stage.modules.length === 0) return 0;
    
    let totalItems = 0;
    let completedItems = 0;
    
    stage.modules.forEach(m => {
      m.lessons?.forEach(l => {
        l.tasks?.forEach(t => {
          totalItems++;
          if (t.completed) completedItems++;
        });
      });
      m.projects?.forEach(p => {
        totalItems++;
        if (p.completed) completedItems++;
      });
    });
    
    if (totalItems === 0) return 0;
    return (completedItems / totalItems) * 100;
  };

  return (
    <div className="max-w-4xl mx-auto text-left flex flex-col gap-6 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Map className="text-violet-400 w-8 h-8" />
            AI Career Roadmap
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            This trajectory is fully managed by NOVA. Complete Modules to advance.
          </p>
        </div>
        
        <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-xl flex items-center gap-2 shrink-0">
          <BrainCircuit size={14} className="text-violet-400 animate-pulse" />
          <span className="text-xs font-bold text-white">{activeRoadmap.title}</span>
        </div>
      </div>

      <div className="flex flex-col gap-8 relative py-4">
        <div className="absolute left-[39px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-violet-500/50 via-indigo-500/20 to-transparent pointer-events-none" />

        {stages.map((stage, idx) => {
          const progress = getStageProgress(stage);
          const isDone = progress === 100;
          const isUnlocked = idx === 0 || getStageProgress(stages[idx - 1]) >= 80; // Unlock if previous is 80% done
          const isOpen = expandedStage === stage.id || (!expandedStage && isUnlocked && !isDone);

          return (
            <motion.div
              key={stage.id || `stage-${idx}`}
              initial="hidden"
              animate="visible"
              variants={scaleIn}
              className="flex gap-6 relative items-start"
            >
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
                  {isDone ? <CheckCircle2 size={20} /> : isUnlocked ? <Sparkles size={16} className="animate-pulse" /> : <Lock size={15} />}
                </button>
                <div className="absolute -bottom-1 right-0 bg-[#030014] text-[9px] font-bold text-gray-500 border border-white/5 px-1 rounded-sm">
                  L{idx + 1}
                </div>
              </div>

              <GlassCard
                className={`flex-1 border-white/10 transition-all duration-300 ${!isUnlocked && "opacity-55"}`}
                glow={isOpen ? "purple" : "none"}
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => isUnlocked && setExpandedStage(isOpen ? "" : stage.id)}
                >
                  <div className="text-left flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-white tracking-wide truncate">{stage.level}: {stage.title}</h3>
                      <span className="text-[10px] text-gray-500 font-semibold">• {stage.duration}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {stage.modules?.length || 0} Modules to complete
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 shrink-0 select-none">
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Done</span>
                      <span className="text-xs font-bold text-violet-400 mt-0.5">{Math.round(progress)}%</span>
                    </div>
                    <ChevronRight size={18} className={`text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-90 text-violet-400" : ""}`} />
                  </div>
                </div>

                <AnimatePresence>
                  {isOpen && stage.modules && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-6 border-t border-white/5 pt-4 flex flex-col gap-3 overflow-hidden">
                      {stage.modules.map((module) => {
                        const isModuleOpen = expandedModule === module.id;
                        return (
                          <div key={module.id} className="bg-white/2 border border-white/5 rounded-xl p-4">
                            <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedModule(isModuleOpen ? "" : module.id)}>
                              <h4 className="text-sm font-bold text-violet-300 flex items-center gap-2"><LayoutTemplate size={14}/> {module.title}</h4>
                              <ChevronRight size={14} className={`text-gray-500 transition-transform ${isModuleOpen ? 'rotate-90' : ''}`}/>
                            </div>
                            
                            {isModuleOpen && (
                              <div className="mt-4 flex flex-col gap-3 pl-4 border-l border-white/5">
                                {/* Lessons */}
                                {module.lessons?.map(lesson => {
                                  const isLessonOpen = expandedLesson === lesson.id;
                                  return (
                                    <div key={lesson.id} className="bg-black/20 border border-white/5 rounded-lg p-3">
                                      <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedLesson(isLessonOpen ? "" : lesson.id)}>
                                        <h5 className="text-xs font-semibold text-gray-300 flex items-center gap-2"><BookOpen size={12}/> {lesson.title}</h5>
                                        <ChevronRight size={12} className={`text-gray-500 transition-transform ${isLessonOpen ? 'rotate-90' : ''}`}/>
                                      </div>
                                      
                                      {isLessonOpen && (
                                        <div className="mt-3 flex flex-col gap-2">
                                          {/* Free Courses specific to this lesson */}
                                          {lesson.freeCourses && lesson.freeCourses.length > 0 && (
                                            <div className="mb-2 p-2 bg-indigo-950/30 rounded-lg border border-indigo-500/20">
                                              <p className="text-[10px] text-indigo-300 font-bold mb-1 uppercase tracking-wider">Free Resources</p>
                                              {lesson.freeCourses.map((course, i) => (
                                                <a key={i} href="#" className="text-xs flex items-center gap-2 text-indigo-400 hover:text-indigo-300 py-1">
                                                  <PlayCircle size={12}/> {course.title} <span className="text-gray-500">({course.source})</span>
                                                </a>
                                              ))}
                                            </div>
                                          )}
                                          
                                          {/* Checklist tasks */}
                                          {lesson.tasks?.map(task => (
                                            <div key={task.id} onClick={() => handleToggleTask(stage.id, module.id, lesson.id, task.id)} className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-all duration-300 ${task.completed ? "bg-emerald-950/20 border-emerald-500/20 text-gray-500" : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10"}`}>
                                              <div className="flex items-center gap-2">
                                                <CheckCircle2 size={14} className={task.completed ? "text-emerald-500" : "text-gray-600"} />
                                                <span className={task.completed ? "line-through text-gray-500" : ""}>{task.title}</span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}

                                {/* Projects */}
                                {module.projects?.length > 0 && (
                                  <div className="mt-2 flex flex-col gap-2">
                                    <h5 className="text-[10px] text-pink-400 font-bold uppercase tracking-wider pl-1 flex items-center gap-1"><Briefcase size={10}/> Module Projects</h5>
                                    {module.projects.map(proj => (
                                      <div key={proj.id} onClick={() => handleToggleProject(stage.id, module.id, proj.id)} className={`flex items-center justify-between p-3 rounded-lg border text-xs cursor-pointer transition-all duration-300 ${proj.completed ? "bg-emerald-950/20 border-emerald-500/20 text-gray-500" : "bg-pink-950/20 border-pink-500/20 text-pink-300 hover:bg-pink-950/40"}`}>
                                        <div className="flex items-center gap-2">
                                          <CheckCircle2 size={14} className={proj.completed ? "text-emerald-500" : "text-pink-600"} />
                                          <span className={proj.completed ? "line-through text-gray-500" : "font-bold"}>{proj.title} <span className="text-[10px] text-gray-500 font-normal ml-2">({proj.difficulty})</span></span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                      
                      {!isDone && (
                         <div className="mt-4 flex justify-end">
                           <Button onClick={() => navigate('/weekly-tests?stageId=' + stage.id)} variant="glow" className="text-xs py-2 px-4 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                             Take Weekly Evaluation
                           </Button>
                         </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
