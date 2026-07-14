import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, CheckCircle2, ChevronRight, Activity, Award } from "lucide-react";
import { useCareer } from "../contexts/CareerContext";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";

export default function WeeklyTests() {
  const { activeRoadmap, addTestScore } = useCareer();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [testData, setTestData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);

  // Determine current active stage from roadmap (first incomplete stage, or stage 1)
  const currentStage = activeRoadmap?.stages?.[0] || { title: "Foundation Stage", id: "s1" };

  const generateTest = async () => {
    setIsGenerating(true);
    setTestResult(null);
    setAnswers({});
    try {
      const res = await fetch("http://localhost:5000/api/ai/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          stage: currentStage, 
          careerTitle: activeRoadmap?.title || "Technology"
        })
      });
      const data = await res.json();
      setTestData(data);
    } catch (error) {
      console.error(error);
      alert("Failed to generate weekly test.");
    } finally {
      setIsGenerating(false);
    }
  };

  const submitTest = async () => {
    setIsScoring(true);
    try {
      const res = await fetch("http://localhost:5000/api/ai/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          test: testData,
          answers: answers,
          stageTitle: currentStage.title
        })
      });
      const data = await res.json();
      setTestResult(data);
      addTestScore({ ...data, stageId: currentStage.id, stageTitle: currentStage.title });
    } catch (error) {
      console.error(error);
      alert("Failed to score test.");
    } finally {
      setIsScoring(false);
    }
  };

  const handleAnswer = (qId, val) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  if (!activeRoadmap) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Activity className="w-16 h-16 text-gray-700 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Active Track</h3>
        <p className="text-gray-400">Generate a roadmap first to unlock Weekly AI Tests.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto text-left flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <BrainCircuit className="text-violet-400 w-8 h-8" />
          Weekly AI Evaluation
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Take a dynamically generated test based on your current roadmap stage to adaptive your learning curve.
        </p>
      </div>

      {!testData && !isGenerating && !testResult && (
        <GlassCard className="p-8 text-center flex flex-col items-center gap-6 mt-4 border-violet-500/20" glow="purple">
          <div className="w-16 h-16 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 glow-purple">
            <Activity size={28} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Ready for your Weekly Review?</h3>
            <p className="text-gray-400 text-sm">NOVA will generate a custom test for: <strong className="text-violet-300">{currentStage.title}</strong></p>
          </div>
          <Button onClick={generateTest} variant="glow" className="px-8 font-semibold">
            Generate Weekly Test
          </Button>
        </GlassCard>
      )}

      {isGenerating && (
         <div className="flex flex-col items-center justify-center py-20">
           <div className="w-16 h-16 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 glow-purple mb-4 relative">
             <div className="absolute inset-0 border-2 border-transparent border-t-violet-400 rounded-full animate-spin"></div>
             <BrainCircuit size={28} />
           </div>
           <h3 className="text-xl font-bold text-white mb-2">Compiling Evaluation Matrix...</h3>
           <p className="text-gray-400 text-sm">Generating contextual scenarios and questions.</p>
         </div>
      )}

      {testData && !testResult && !isScoring && (
        <div className="flex flex-col gap-6">
          <GlassCard className="p-6 border-white/10 text-center">
            <h3 className="text-xl font-bold text-white">{testData.title}</h3>
          </GlassCard>

          {testData.questions.map((q, idx) => (
            <GlassCard key={q.id} className="p-6 border-white/5">
              <h4 className="text-sm font-bold text-violet-400 mb-4 uppercase tracking-widest">Question {idx + 1}</h4>
              <p className="text-white text-base mb-6 leading-relaxed">{q.question}</p>
              
              {q.type === 'mcq' ? (
                <div className="flex flex-col gap-3">
                  {q.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleAnswer(q.id, oIdx)}
                      className={`w-full p-4 rounded-xl border text-left text-sm transition-all duration-300 flex items-center justify-between ${
                        answers[q.id] === oIdx 
                          ? "bg-violet-600/20 border-violet-500/50 text-white" 
                          : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      <span>{opt}</span>
                      {answers[q.id] === oIdx && <CheckCircle2 size={16} className="text-violet-400" />}
                    </button>
                  ))}
                </div>
              ) : (
                <textarea
                  rows={4}
                  value={answers[q.id] || ""}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                  placeholder="Type your solution/answer here..."
                  className="w-full p-4 rounded-xl bg-[#0a081c]/50 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 resize-none transition-colors"
                />
              )}
            </GlassCard>
          ))}

          <div className="flex justify-end mt-4">
            <Button onClick={submitTest} variant="glow" className="px-8 font-semibold text-sm">
              Submit for AI Scoring <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      )}

      {isScoring && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 glow-purple mb-4 relative">
             <div className="absolute inset-0 border-2 border-transparent border-t-emerald-400 rounded-full animate-spin"></div>
             <Award size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Analyzing Responses...</h3>
          <p className="text-gray-400 text-sm">Evaluating logic and accuracy to compute readiness score.</p>
        </div>
      )}

      {testResult && (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
            <GlassCard className="p-8 border-emerald-500/20 text-center flex flex-col items-center" glow="none">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-2">
                {testResult.score}%
              </div>
              <h3 className="text-lg font-bold text-white mb-4">Evaluation Complete</h3>
              <p className="text-gray-300 text-sm max-w-md leading-relaxed">{testResult.feedback}</p>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="p-6 border-white/5">
                <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-4">Areas to Improve</h4>
                <ul className="flex flex-col gap-2 list-disc pl-4 text-sm text-amber-300/80">
                  {testResult.weakAreas.map((area, idx) => (
                    <li key={idx}>{area}</li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard className="p-6 border-violet-500/20 glow-purple">
                <h4 className="text-xs font-bold uppercase text-violet-400 tracking-wider mb-4">AI Roadmap Adjustments</h4>
                <ul className="flex flex-col gap-2 list-disc pl-4 text-sm text-gray-300">
                  {testResult.roadmapAdjustments.map((adj, idx) => (
                    <li key={idx}>{adj}</li>
                  ))}
                </ul>
              </GlassCard>
            </div>

            <div className="flex justify-center mt-4">
               <Button onClick={() => setTestResult(null)} variant="secondary" className="px-6 text-xs">
                 Take Another Test
               </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
