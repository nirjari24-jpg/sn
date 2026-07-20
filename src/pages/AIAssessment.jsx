import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BrainCircuit, ArrowRight, Loader, Send } from "lucide-react";
import { useCareer } from "../contexts/CareerContext";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";

const assessmentQuestions = [
  "Hi! I'm NOVA. I'm here to help you get ready for a great career. Let's start with a simple question: What do you want to become?",
  "Awesome! Have you learned anything about this before?",
  "How much time can you study every day? (e.g., 30 minutes, 2 hours)",
  "What do you enjoy learning the most?",
  "Do you prefer learning by watching videos, reading, or practicing hands-on?",
  "Are you currently studying in school or college?",
  "Finally, how would you describe your current level? (Beginner, Intermediate, or Advanced)"
];

export default function AIAssessment() {
  const navigate = useNavigate();
  const { setAssessmentProfile } = useCareer();
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const messagesEndRef = useRef(null);
  
  // Initialize with first question
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ sender: "nova", text: assessmentQuestions[0] }]);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAnalyzing]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || isAnalyzing) return;

    const userText = inputValue.trim();
    setInputValue("");
    
    // Add user message
    const newMessages = [...messages, { sender: "user", text: userText }];
    setMessages(newMessages);

    if (currentIdx < assessmentQuestions.length - 1) {
      // Add NOVA's next question after a tiny delay for realism
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: "nova", text: assessmentQuestions[currentIdx + 1] }]);
        setCurrentIdx(prev => prev + 1);
      }, 600);
    } else {
      // Finished all questions, trigger analysis
      await submitAssessment(newMessages);
    }
  };

  const submitAssessment = async (finalMessages) => {
    setIsAnalyzing(true);
    try {
      // Format answers for the AI
      const formattedAnswers = {};
      for (let i = 0; i < finalMessages.length; i++) {
        if (finalMessages[i].sender === "nova" && finalMessages[i + 1]?.sender === "user") {
          formattedAnswers[finalMessages[i].text] = finalMessages[i + 1].text;
        }
      }

      const res = await fetch("http://localhost:5000/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: formattedAnswers })
      });
      const data = await res.json();
      
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to analyze profile.");
      }

      // Save profile to context
      setAssessmentProfile({
        answers: formattedAnswers,
        analysis: data
      });
      
      // Navigate to Career Discovery
      navigate("/career-discovery");
    } catch (err) {
      console.error(err);
      alert("Failed to analyze profile. Make sure the backend is running with Gemini API key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      <div className="mb-6 flex-shrink-0">
        <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <BrainCircuit className="text-violet-400 w-8 h-8" />
          Conversational Assessment
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Chat with NOVA so it can build your personalized profile and find your ideal career.
        </p>
      </div>

      <GlassCard className="flex-1 border-violet-500/20 flex flex-col overflow-hidden" glow="purple">
        
        {/* Chat History Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === "user" ? "bg-violet-600" : "bg-[#0a081c] border border-violet-500/50"}`}>
                    {msg.sender === "user" ? <span className="text-xs font-bold text-white">ME</span> : <Sparkles className="w-4 h-4 text-violet-400" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.sender === "user" ? "bg-violet-600/20 border border-violet-500/30 text-white rounded-tr-none" : "bg-[#0a081c]/60 border border-white/10 text-gray-200 rounded-tl-none"}`}>
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#0a081c] border border-violet-500/50 glow-purple">
                  <BrainCircuit className="w-4 h-4 text-violet-400 animate-pulse" />
                </div>
                <div className="p-4 rounded-2xl rounded-tl-none text-sm text-violet-300 bg-[#0a081c]/60 border border-violet-500/30 flex items-center gap-3">
                  <Loader size={16} className="animate-spin" />
                  NOVA is analyzing your responses and generating your career profile...
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/20 border-t border-white/5 flex-shrink-0">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isAnalyzing}
              placeholder={isAnalyzing ? "Analyzing..." : "Type your answer..."}
              className="w-full bg-[#0a081c]/50 border border-white/10 rounded-full py-4 pl-6 pr-14 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isAnalyzing}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white hover:bg-violet-500 disabled:opacity-50 disabled:hover:bg-violet-600 transition-colors cursor-pointer"
            >
              <Send size={18} className="ml-1" />
            </button>
          </form>
        </div>

      </GlassCard>
    </div>
  );
}
