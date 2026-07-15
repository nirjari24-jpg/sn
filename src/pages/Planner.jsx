import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Plus, CheckCircle2, Trash2, CalendarDays, BookMarked, Sparkles, BrainCircuit, Loader, Target, Flame } from "lucide-react";
import { useCareer } from "../contexts/CareerContext";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import { scaleIn } from "../animations/motion";

export default function Planner() {
  const { activeRoadmap, dailyMission, setDailyMission, xp, assessmentProfile } = useCareer();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMission = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("http://localhost:5000/api/ai/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activeRoadmap,
          assessmentProfile,
          xp
        })
      });
      const data = await res.json();
      
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to generate mission.");
      }

      setDailyMission(data);
    } catch (err) {
      console.error(err);
      alert("Failed to connect to NOVA to generate mission.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-left flex flex-col gap-6 pb-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Calendar className="text-violet-400 w-8 h-8" />
          AI Daily Planner
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Your daily focus generated dynamically by NOVA based on your current roadmap progress.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Generate Card or Current Mission Card */}
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-20 h-20 rounded-full bg-violet-600/10 border border-violet-500/30 flex items-center justify-center text-violet-400 glow-purple mb-6 relative">
                <div className="absolute inset-0 border-2 border-transparent border-t-violet-400 rounded-full animate-spin"></div>
                <BrainCircuit size={32} className="animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">NOVA is Charting Your Trajectory</h3>
              <p className="text-gray-400 text-sm max-w-md text-center">
                Analyzing your XP, stage progress, and learning style to generate the optimal daily tasks...
              </p>
            </motion.div>
          ) : !dailyMission ? (
            <motion.div key="not-generated" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <GlassCard className="p-10 flex flex-col items-center text-center justify-center border-violet-500/20" glow="purple">
                <Target size={48} className="text-gray-600 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No Mission Active</h3>
                <p className="text-gray-400 text-sm max-w-md mx-auto mb-8">
                  You haven't requested your daily mission from NOVA yet. Generating a mission will schedule your focused tasks for the day.
                </p>
                <Button onClick={generateMission} variant="primary" className="px-8 py-3 text-sm animate-pulse-glow">
                  Initialize Daily Mission <Sparkles size={16} className="ml-2" />
                </Button>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div key="active-mission" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <GlassCard className="p-8 border-orange-500/20" glow="orange">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b border-white/5 pb-6 mb-6">
                  <div>
                    <div className="flex items-center gap-2 text-orange-400 font-semibold text-xs tracking-wider uppercase mb-2">
                      <Flame size={14} className="animate-pulse" />
                      <span>Active Operation</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{dailyMission.missionTitle}</h3>
                    <p className="text-sm text-gray-400 mt-2 italic">"{dailyMission.tip}"</p>
                  </div>
                  
                  <Button onClick={generateMission} variant="outline" className="text-xs shrink-0 bg-white/2">
                    Regenerate Mission
                  </Button>
                </div>

                <div className="flex flex-col gap-4">
                  <h4 className="font-bold text-xs text-gray-400 uppercase tracking-widest pl-1">
                    Scheduled Directives
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dailyMission.tasks?.map((task) => (
                      <div
                        key={task.id}
                        className="p-4 rounded-xl border border-white/10 bg-[#0a081c]/50 flex flex-col gap-3"
                      >
                        <div className="flex items-start justify-between">
                          <h5 className="font-bold text-sm text-white">{task.title}</h5>
                          <span className="text-[10px] bg-violet-950/40 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-full font-semibold">
                            {task.duration}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-[10px] text-gray-500 uppercase font-semibold">Type: {task.type}</span>
                          <span className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
                            <CheckCircle2 size={12} /> Pending Verification
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Info Box */}
        <GlassCard className="p-6 bg-white/2 border-white/5">
           <div className="flex items-start gap-4">
             <BrainCircuit size={24} className="text-violet-400 shrink-0" />
             <div className="text-left">
               <h4 className="text-sm font-bold text-white">How NOVA Planner Works</h4>
               <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                 NOVA continuously analyzes your active roadmap, current XP, and learning style. Instead of you creating tasks manually, NOVA prescribes exactly what you need to focus on each day. Complete these directives, then take the Weekly Assessment to prove your competency and advance in the Roadmap.
               </p>
             </div>
           </div>
        </GlassCard>
      </div>
    </div>
  );
}
