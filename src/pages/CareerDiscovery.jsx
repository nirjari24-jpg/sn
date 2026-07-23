import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Check, ArrowRight, RefreshCw, Star, Loader } from "lucide-react";
import { useCareer } from "../contexts/CareerContext";
import { useTasks } from "../contexts/TaskContext";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import { SkeletonCard } from "../components/ui/Skeleton";

export default function CareerDiscovery() {
  const navigate = useNavigate();
  const { assessmentProfile, recommendedCareers, setRecommendedCareers, activeRoadmap, setActiveRoadmap, clearAllData } = useCareer();
  const { switchCareerTrack } = useTasks();
  
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);

  useEffect(() => {
    // If they haven't taken the assessment, send them there
    if (!assessmentProfile) {
      navigate("/assessment");
      return;
    }

    // If we already have recommended careers, don't re-fetch
    if (recommendedCareers && recommendedCareers.length > 0) {
      return;
    }

    // Fetch dynamic careers
    discoverCareers(assessmentProfile);
  }, [assessmentProfile, recommendedCareers, navigate]);

  const discoverCareers = async (profile) => {
    setIsDiscovering(true);
    try {
      const res = await fetch("http://localhost:5000/api/ai/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: profile.analysis })
      });
      const data = await res.json();
      setRecommendedCareers(data.matches || []);
    } catch (error) {
      console.error("Error discovering careers:", error);
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleActivateTrack = async (career) => {
    setIsGeneratingRoadmap(true);
    try {
      const res = await fetch("http://localhost:5000/api/ai/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ careerId: career.id, careerTitle: career.title })
      });
      const data = await res.json();
      
      // Save AI generated roadmap to Context
      setActiveRoadmap(data);
      switchCareerTrack(career.id);
      
      // Navigate to roadmap view
      navigate("/roadmap");
    } catch (error) {
      console.error("Error generating roadmap:", error);
      alert("Failed to generate AI roadmap.");
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const resetTest = () => {
    clearAllData();
    navigate("/assessment");
  };

  return (
    <div className="max-w-4xl mx-auto text-left flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Compass className="text-violet-400 w-8 h-8" />
          AI Career Discovery
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Based on your assessment, NOVA has identified the most optimal career trajectories for you.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {(isDiscovering || isGeneratingRoadmap) ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-6"
          >
            <div className="p-6 text-center lg:text-left">
               <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center lg:justify-start gap-2">
                 <Loader className="animate-spin text-violet-400" size={20} />
                 {isDiscovering ? "Calculating Optimal Trajectories..." : "Synthesizing Personal Roadmap..."}
               </h3>
               <p className="text-gray-400 text-sm">{isDiscovering ? "NOVA is matching your skill signature with industry demand vectors." : "Generating beginner-to-advanced curriculum exclusively for you."}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            {/* Display profile summary briefly */}
            {assessmentProfile && assessmentProfile.analysis && (
              <GlassCard className="p-6 border-white/5 bg-[#0a081c]/50">
                <div className="flex items-center gap-4">
                  <div className="text-center shrink-0">
                     <span className="block text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                        {assessmentProfile.analysis.score}
                     </span>
                     <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Readiness Score</span>
                  </div>
                  <div className="w-px h-12 bg-white/10 mx-2"></div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-1">Your Strengths</h4>
                    <p className="text-sm text-gray-300">{assessmentProfile.analysis.strengths?.join(", ") || "Analyzing strengths..."}</p>
                  </div>
                </div>
              </GlassCard>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedCareers.map((result, idx) => (
                <GlassCard key={idx} className="p-8 border-violet-500/20 glow-purple flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Star className="text-amber-500 w-5 h-5" />
                        <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Top Match</span>
                      </div>
                      <span className="text-xs text-gray-400 font-semibold">Match Score: {result.matchScore}%</span>
                    </div>

                    <div className="text-left mb-6">
                      <h3 className="text-2xl font-extrabold text-white leading-tight">{result.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed mt-3">{result.description}</p>
                    </div>

                    {/* Stats highlights */}
                    <div className="grid grid-cols-1 gap-3 my-6">
                      <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                        <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block mb-1">Growth</span>
                        <span className="text-sm font-bold text-white">{result.growthRate}</span>
                      </div>
                    </div>

                    {/* Skill mapping */}
                    <div className="text-left mb-8">
                      <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.skills && result.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-md bg-violet-950/30 border border-violet-500/30 text-[10px] font-bold text-violet-300 uppercase tracking-wide"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-3 pt-4 border-t border-white/5 mt-auto">
                    <Button
                      onClick={() => handleActivateTrack(result)}
                      variant={activeRoadmap?.id === result.id ? "outline" : "glow"}
                      className="w-full font-semibold"
                    >
                      {activeRoadmap?.id === result.id ? (
                        <span className="flex items-center justify-center gap-1.5">
                          <Check size={16} /> Roadmap Active
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1">
                          Select & Generate Roadmap <ArrowRight size={15} />
                        </span>
                      )}
                    </Button>
                  </div>
                </GlassCard>
              ))}
            </div>

            <div className="flex justify-center mt-4">
               <Button onClick={resetTest} variant="secondary" className="px-6 text-xs">
                 <RefreshCw size={14} className="mr-2" /> Start Over
               </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

