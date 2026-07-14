import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Compass, Check, ArrowRight, RefreshCw, Star } from "lucide-react";
import { useTasks } from "../contexts/TaskContext";
import { assessmentQuestions, mockCareers } from "../data/mockCareers";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";

export default function CareerDiscovery() {
  const { switchCareerTrack, careerTrack } = useTasks();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState({});
  const [result, setResult] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);

  const handleAnswer = (val) => {
    setScores((prev) => ({
      ...prev,
      [val]: (prev[val] || 0) + 1
    }));

    if (currentIdx < assessmentQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Calculate results
      const finalScores = { ...scores, [val]: (scores[val] || 0) + 1 };
      let bestMatch = "software-engineering";
      let highestScore = 0;

      Object.entries(finalScores).forEach(([key, score]) => {
        if (score > highestScore) {
          highestScore = score;
          bestMatch = key;
        }
      });

      const matchedCareer = mockCareers.find((c) => c.id === bestMatch) || mockCareers[0];
      setResult(matchedCareer);
    }
  };

  const resetTest = () => {
    setCurrentIdx(0);
    setScores({});
    setResult(null);
    setHasStarted(false);
  };

  const handleActivateTrack = () => {
    if (result) {
      switchCareerTrack(result.id);
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-left flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Compass className="text-violet-400 w-8 h-8" />
          Career Discovery Engine
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Complete the diagnostic queries to sync your career trajectory and align learning nodes.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!hasStarted ? (
          /* Introduction Screen */
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <GlassCard className="p-8 text-center flex flex-col items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 glow-purple">
                <Compass size={28} className="animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Initialize Career Alignment Diagnostic</h3>
                <p className="text-sm text-gray-400 max-w-md mx-auto mt-2 leading-relaxed">
                  Our system evaluates your interest vectors across architecture, statistical learning model loops, and visual design grids.
                </p>
              </div>
              <Button onClick={() => setHasStarted(true)} variant="glow" className="px-8 font-semibold">
                Start Calibration Matrix
              </Button>
            </GlassCard>
          </motion.div>
        ) : result ? (
          /* Result Screen */
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-6"
          >
            <GlassCard className="p-8 border-violet-500/30 glow-purple" glow="purple">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="text-amber-500 w-5 h-5 animate-pulse" />
                  <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Calibration Finished</span>
                </div>
                <span className="text-xs text-gray-400 font-semibold">Match Score: {result.matchScore}%</span>
              </div>

              <div className="text-left">
                <h3 className="text-2xl font-extrabold text-white">{result.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mt-2">{result.description}</p>
              </div>

              {/* Stats highlights */}
              <div className="grid grid-cols-3 gap-4 my-6">
                <div className="bg-white/3 border border-white/5 p-3 rounded-xl">
                  <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Growth Velocity</span>
                  <span className="text-sm font-bold text-white">{result.growthRate}</span>
                </div>
                <div className="bg-white/3 border border-white/5 p-3 rounded-xl">
                  <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Yield Potential</span>
                  <span className="text-sm font-bold text-white">{result.salary}</span>
                </div>
                <div className="bg-white/3 border border-white/5 p-3 rounded-xl">
                  <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Demand Index</span>
                  <span className="text-sm font-bold text-violet-400">{result.demand}</span>
                </div>
              </div>

              {/* Skill mapping */}
              <div className="text-left mb-8">
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">Target Skill Competencies</h4>
                <div className="flex flex-wrap gap-2.5">
                  {result.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-gray-300 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
                <Button
                  onClick={handleActivateTrack}
                  variant={careerTrack === result.id ? "outline" : "glow"}
                  className="flex-1 font-semibold"
                  disabled={careerTrack === result.id}
                >
                  {careerTrack === result.id ? (
                    <span className="flex items-center gap-1.5">
                      <Check size={16} /> Roadmap Synchronized
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      Activate Learning Roadmap <ArrowRight size={15} />
                    </span>
                  )}
                </Button>
                <Button onClick={resetTest} variant="secondary" className="px-6">
                  <RefreshCw size={15} /> Recalibrate
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          /* Question sequence card */
          <motion.div
            key="question"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <GlassCard className="p-8">
              {/* Top counter */}
              <div className="flex justify-between items-center text-xs text-gray-500 font-semibold mb-6 border-b border-white/5 pb-4">
                <span>QUESTION {currentIdx + 1} OF {assessmentQuestions.length}</span>
                <span className="text-violet-400 font-bold">{Math.round(((currentIdx + 1) / assessmentQuestions.length) * 100)}% Complete</span>
              </div>

              {/* Question Text */}
              <h3 className="text-lg font-bold text-white leading-snug mb-8 text-left">
                {assessmentQuestions[currentIdx].question}
              </h3>

              {/* Options lists */}
              <div className="flex flex-col gap-3">
                {assessmentQuestions[currentIdx].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(opt.value)}
                    className="w-full p-4 rounded-xl bg-white/3 border border-white/5 text-left text-xs md:text-sm text-gray-300 hover:text-white hover:bg-violet-950/10 hover:border-violet-500/35 transition-all duration-300 flex items-center justify-between group cursor-pointer"
                  >
                    <span>{opt.text}</span>
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-violet-400" />
                  </button>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
