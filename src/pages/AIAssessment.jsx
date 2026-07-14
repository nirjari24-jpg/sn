import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BrainCircuit, ArrowRight, Loader } from "lucide-react";
import { useCareer } from "../contexts/CareerContext";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";

const aiAssessmentQuestions = [
  { id: "skills", question: "What are your current skills? (Things you are already good at)", type: "text", placeholder: "e.g., writing, basic math, talking to people, using computers..." },
  { id: "interests", question: "What are your main areas of interest? (Things you enjoy doing or want to learn)", type: "text", placeholder: "e.g., technology, art, business, science..." },
  { id: "goals", question: "What are your biggest goals? (What you want to achieve)", type: "text", placeholder: "e.g., get a good job, learn to code, start my own business..." },
  { id: "experience", question: "How much experience do you have in your interests?", type: "choice", options: ["I am just starting (Beginner)", "I know a little bit (Intermediate)", "I have done this a lot (Advanced)"] }
];

export default function AIAssessment() {
  const navigate = useNavigate();
  const { setAssessmentProfile } = useCareer();
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentQ = aiAssessmentQuestions[currentIdx];

  const handleNext = async (val) => {
    const finalVal = val !== undefined ? val : inputValue;
    if (!finalVal) return;

    const newAnswers = { ...answers, [currentQ.id]: finalVal };
    setAnswers(newAnswers);
    setInputValue("");

    if (currentIdx < aiAssessmentQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      await submitAssessment(newAnswers);
    }
  };

  const submitAssessment = async (finalAnswers) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("http://localhost:5000/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers })
      });
      const data = await res.json();
      
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to analyze profile.");
      }

      // Save profile to context
      setAssessmentProfile({
        answers: finalAnswers,
        analysis: data
      });
      
      // Navigate to Career Discovery
      navigate("/career-discovery");
    } catch (err) {
      console.error(err);
      alert("Failed to analyze profile. Make sure the backend is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-left flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <BrainCircuit className="text-violet-400 w-8 h-8" />
          AI Skill Assessment
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Answer a few questions so NOVA AI can perfectly map your current skills to the ideal career paths.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-violet-600/10 border border-violet-500/30 flex items-center justify-center text-violet-400 glow-purple mb-6 relative">
              <div className="absolute inset-0 border-2 border-transparent border-t-violet-400 rounded-full animate-spin"></div>
              <BrainCircuit size={32} className="animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">NOVA is Analyzing Your Profile</h3>
            <p className="text-gray-400 text-sm max-w-md text-center">
              Processing your skills, problem-solving approaches, and goals to find your perfect career matches...
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={`q-${currentIdx}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <GlassCard className="p-8 border-violet-500/20" glow="purple">
              <div className="flex justify-between items-center text-xs text-gray-500 font-semibold mb-6 border-b border-white/5 pb-4">
                <span>QUESTION {currentIdx + 1} OF {aiAssessmentQuestions.length}</span>
                <span className="text-violet-400 font-bold">{Math.round(((currentIdx + 1) / aiAssessmentQuestions.length) * 100)}% Complete</span>
              </div>

              <h3 className="text-xl font-bold text-white leading-snug mb-8 text-left">
                {currentQ.question}
              </h3>

              {currentQ.type === "choice" ? (
                <div className="flex flex-col gap-3">
                  {currentQ.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleNext(opt)}
                      className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-left text-sm text-gray-200 hover:text-white hover:bg-violet-950/20 hover:border-violet-500/40 transition-all duration-300 flex items-center justify-between group cursor-pointer"
                    >
                      <span>{opt}</span>
                      <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-violet-400" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <textarea
                    autoFocus
                    rows={4}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={currentQ.placeholder}
                    className="w-full p-4 rounded-xl bg-[#0a081c]/50 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 resize-none transition-colors"
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => handleNext()} 
                      variant="glow" 
                      className="px-6 font-semibold"
                      disabled={!inputValue.trim()}
                    >
                      Continue <ArrowRight size={16} className="ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
