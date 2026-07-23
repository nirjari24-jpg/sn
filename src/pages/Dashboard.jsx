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
  Quote,
  Target,
  BrainCircuit,
  BookOpen,
  Briefcase
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCareer } from "../contexts/CareerContext";
import { motivationalQuotes } from "../data/mockData";
import GlassCard from "../components/ui/GlassCard";
import ProgressRing from "../components/ui/ProgressRing";
import Button from "../components/ui/Button";
import { scaleIn } from "../animations/motion";

export default function Dashboard() {
  const { user } = useAuth();
  const {
    activeRoadmap,
    dailyMission,
    xp,
    badges,
    testScores,
    assessmentProfile,
    careerReadiness,
    internshipReadiness,
    skillConfidence
  } = useCareer();

  const [activeQuote, setActiveQuote] = useState({ text: "", author: "" });
  
  useEffect(() => {
    const randIdx = Math.floor(Math.random() * motivationalQuotes.length);
    setActiveQuote(motivationalQuotes[randIdx]);
  }, []);

  // Compute AI metrics
  const level = Math.floor(xp / 1000) + 1;
  const xpNeeded = level * 1000;
  const levelProgress = (xp / xpNeeded) * 100;

  const aiScore = assessmentProfile?.analysis?.score || 0;
  const currentStageTitle = activeRoadmap?.stages?.[0]?.title || "Awaiting Setup";
  const tasks = dailyMission?.tasks || [];

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
      className="flex flex-col gap-6 text-left pb-10"
    >
      {/* Upper Header Welcome banner */}
      <motion.div variants={scaleIn}>
        <GlassCard className="p-6 bg-gradient-to-r from-violet-950/20 via-indigo-950/20 to-black/40 border-violet-500/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-full bg-radial-gradient(circle_at_100%_0%,rgba(139,92,246,0.1),transparent_70%) pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-violet-400 font-semibold text-xs tracking-wider uppercase">
                <BrainCircuit size={13} className="animate-pulse" />
                <span>NOVA Synchronized</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Welcome, {user?.name || "Explorer"}
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-xl">
                Your AI Career Mentor has generated your path to becoming a <span className="text-violet-300 font-semibold">{activeRoadmap?.title || "Specialist"}</span>.
              </p>
            </div>
            
            <div className="w-full md:w-72 bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-semibold">Level {level} Mentee</span>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Today's AI Mission */}
        <motion.div variants={scaleIn}>
          <GlassCard className="h-full flex flex-col justify-between" glow="orange">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <Target className="text-orange-500 w-4.5 h-4.5" />
                  Today's Goal
                </h3>
                <span className="text-[10px] bg-orange-950/40 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full font-semibold">AI Generated</span>
              </div>

              {dailyMission ? (
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-semibold text-white mb-2">{dailyMission.missionTitle}</p>
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/2 border border-white/5 text-white">
                      <CheckCircle2 size={17} className="shrink-0 mt-0.5 text-gray-600" />
                      <div className="flex-1 text-left">
                        <p className="text-xs font-semibold leading-tight">{task.title}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold">{task.type}</span>
                          <span className="text-[10px] font-bold text-violet-400">{task.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <p className="text-xs italic text-gray-400 mt-2">"{dailyMission.tip}"</p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-gray-400 mb-4">NOVA is ready to plan your goal for today.</p>
                  <Link to="/planner">
                    <Button variant="outline" className="w-full text-xs">Initialize Plan</Button>
                  </Link>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* 2. Interactive Roadmap Progress */}
        <motion.div variants={scaleIn}>
          <GlassCard className="h-full flex flex-col justify-between" glow="purple">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="text-violet-400 w-4.5 h-4.5" />
                  Career Roadmap
                </h3>
                {activeRoadmap ? (
                  <span className="text-[10px] text-violet-400 font-bold border border-violet-500/20 px-2 py-0.5 rounded-full bg-violet-950/40">Track Active</span>
                ) : (
                  <span className="text-[10px] text-gray-500 font-bold">No Track</span>
                )}
              </div>

              {activeRoadmap ? (
                <div className="flex flex-col gap-4 py-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Current Stage</span>
                      <h4 className="text-sm font-bold text-white truncate">{currentStageTitle}</h4>
                    </div>
                    <span className="text-xs font-bold text-violet-400">{activeRoadmap.stages.length} Stages Total</span>
                  </div>
                  
                  <div className="w-full bg-white/5 rounded-full h-2">
                     <div className="bg-violet-500 h-2 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.5)]" style={{ width: '20%' }}></div>
                  </div>
                  
                  <p className="text-xs text-gray-400">NOVA controls progression based on your weekly evaluation performance.</p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-gray-400 mb-4">No active career mapped.</p>
                  <Link to="/career-discovery">
                    <Button variant="outline" className="w-full text-xs">Discover Careers</Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="border-t border-white/5 pt-4 mt-4">
              <Link to="/roadmap" className="w-full">
                <Button variant="outline" className="w-full py-2.5 text-xs font-semibold">
                  View Roadmap Map <ArrowRight size={13} />
                </Button>
              </Link>
            </div>
          </GlassCard>
        </motion.div>

        {/* 3. AI Profile & Readiness */}
        <motion.div variants={scaleIn}>
          <GlassCard className="h-full flex flex-col justify-between" glow="blue">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="text-blue-400 w-4.5 h-4.5" />
                  Live Intelligence
                </h3>
                <span className="text-[10px] bg-blue-950/40 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-semibold">Live</span>
              </div>

              <div className="flex items-center justify-around gap-4 py-2">
                <ProgressRing percentage={careerReadiness || aiScore} size={110} />
                <div className="flex flex-col gap-2.5 text-left">
                  <div>
                    <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Internship Readiness</span>
                    <h4 className="text-sm font-bold text-white truncate max-w-[140px]">{internshipReadiness || 0}%</h4>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Skill Confidence</span>
                    <h4 className="text-sm font-bold text-violet-400 truncate max-w-[140px]">{skillConfidence || 0}%</h4>
                  </div>
                </div>
              </div>
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
                  Ask NOVA
                </h3>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <p className="text-xs text-gray-400 leading-relaxed text-left">
                "I know everything about your profile, goals, and roadmap. Ask me for guidance, interview prep, or to explain complex concepts."
              </p>
              
              <div className="p-3 bg-white/2 border border-white/5 rounded-xl text-left">
                <span className="text-[9px] uppercase tracking-wider font-bold text-gray-500">Suggested prompt:</span>
                <p className="text-xs text-violet-300 font-semibold mt-1">"Why did you recommend this roadmap for me?"</p>
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
                {badges.length > 0 ? badges.slice(0, 4).map((badge) => (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center p-2 rounded-xl bg-violet-950/20 border-violet-500/30 text-white shadow-[0_0_10px_rgba(139,92,246,0.1)] text-center transition-all duration-300 group relative"
                  >
                    <Trophy size={20} className="text-violet-400" />
                    <span className="text-[9px] font-bold mt-1.5 truncate max-w-full leading-tight">{badge.title}</span>
                    
                    {/* Tooltip detail description */}
                    <div className="absolute bottom-11 bg-black border border-white/10 text-white text-[9px] font-medium p-2 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 w-28 text-center shadow-lg leading-tight">
                      {badge.description}
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-gray-500 col-span-4 text-center py-4">No badges earned yet. Complete your first evaluation!</p>
                )}
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

        {/* 6. Learning & Internships (New Phase) */}
        <motion.div variants={scaleIn}>
          <GlassCard className="h-full flex flex-col justify-between">
            <div className="flex flex-col gap-4 text-left">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="text-emerald-400 w-4.5 h-4.5" />
                  Recommendations
                </h3>
                <span className="text-[10px] text-emerald-400 border border-emerald-500/10 bg-emerald-950/20 px-2 py-0.5 rounded-full font-bold">New</span>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-2 bg-white/2 border border-white/5 rounded-xl text-xs">
                  <div className="flex gap-2 items-center">
                    <BookOpen size={14} className="text-blue-400" />
                    <div>
                      <h5 className="font-semibold text-white">FreeCodeCamp</h5>
                      <p className="text-[10px] text-gray-500 mt-0.5">Top related course</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-violet-400 hover:underline cursor-pointer">View</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-white/2 border border-white/5 rounded-xl text-xs">
                  <div className="flex gap-2 items-center">
                    <Briefcase size={14} className="text-emerald-400" />
                    <div>
                      <h5 className="font-semibold text-white">Remote Internship</h5>
                      <p className="text-[10px] text-gray-500 mt-0.5">Beginner Friendly</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-violet-400 hover:underline cursor-pointer">Apply</span>
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
