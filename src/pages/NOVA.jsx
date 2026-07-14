import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, AlertCircle, RefreshCw, Code, Layout, TrendingUp } from "lucide-react";
import { useNova } from "../contexts/NovaContext";
import { useTasks } from "../contexts/TaskContext";
import { mockCareers } from "../data/mockCareers";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";

export default function NOVA() {
  const { messages, isTyping, sendMessage, clearChat } = useNova();
  const { careerTrack } = useTasks();
  const [inputText, setInputText] = useState("");
  const chatBottomRef = useRef(null);

  const activeCareer = mockCareers.find((c) => c.id === careerTrack) || mockCareers[0];

  useEffect(() => {
    // Scroll chat feed to bottom on new messages
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText("");
  };

  const handleSuggestion = (promptText) => {
    sendMessage(promptText);
  };

  // Basic formatting helper for markdown links / code blocks in responses
  const renderMessageText = (text) => {
    if (text.includes("```")) {
      const parts = text.split("```");
      return parts.map((part, index) => {
        // odd indices contain code block snippets
        if (index % 2 !== 0) {
          const lines = part.split("\n");
          const language = lines[0] || "javascript";
          const code = lines.slice(1).join("\n");
          return (
            <div key={index} className="my-3 font-mono text-xs bg-black/60 border border-white/5 p-3 rounded-lg overflow-x-auto text-violet-300 relative select-all">
              <span className="absolute top-1 right-2 text-[8px] text-gray-500 font-bold uppercase select-none">{language}</span>
              <pre>{code}</pre>
            </div>
          );
        }
        return renderSimpleText(part);
      });
    }

    if (text.includes("|")) {
      // Very basic table formatter
      const lines = text.split("\n");
      const rows = lines.filter(line => line.trim().startsWith("|") && line.trim().endsWith("|"));
      if (rows.length > 0) {
        return (
          <div className="overflow-x-auto my-3 border border-white/5 rounded-lg">
            <table className="min-w-full text-xs text-left">
              <tbody>
                {rows.map((row, idx) => {
                  const cols = row.split("|").filter(col => col.trim() !== "");
                  return (
                    <tr key={idx} className={idx === 0 ? "bg-white/5 font-bold" : "border-t border-white/5"}>
                      {cols.map((col, colIdx) => (
                        <td key={colIdx} className="px-3 py-2 text-gray-300">{col.trim()}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
    }

    return renderSimpleText(text);
  };

  const renderSimpleText = (text) => {
    // Bold tags parser **bold**
    if (text.includes("**")) {
      const chunks = text.split("**");
      return chunks.map((chunk, idx) => {
        if (idx % 2 !== 0) return <strong key={idx} className="text-white font-bold">{chunk}</strong>;
        return chunk;
      });
    }
    return text;
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 text-left">
      
      {/* 1. Left metadata column (Desktop sidebar overview) */}
      <div className="hidden lg:flex flex-col gap-6 w-72 shrink-0 h-full">
        {/* Core synchronization card */}
        <GlassCard className="p-5 flex flex-col gap-4 text-left">
          <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3">
            <Sparkles size={14} className="text-violet-400" />
            AI Synchronizer
          </h3>
          <div className="flex flex-col gap-3.5 text-xs text-gray-400">
            <div>
              <span className="text-[10px] text-gray-500 font-semibold uppercase">Calibrated Focus</span>
              <p className="font-bold text-white mt-0.5">{activeCareer.title}</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-semibold uppercase">Consultation Mode</span>
              <p className="font-bold text-violet-400 mt-0.5">Interactive Advisor</p>
            </div>
            <div className="border-t border-white/5 pt-3 flex justify-between items-center">
              <span className="text-[10px] text-gray-500 font-semibold">NOVA Core</span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">Online</span>
            </div>
          </div>
        </GlassCard>

        {/* Sync Controls card */}
        <GlassCard className="p-5 flex flex-col gap-4 text-left">
          <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3">
            <AlertCircle size={14} className="text-violet-400" />
            System Controls
          </h3>
          <Button onClick={clearChat} variant="outline" className="w-full text-xs font-semibold py-2.5">
            <RefreshCw size={13} /> Flush Term Cache
          </Button>
        </GlassCard>
      </div>

      {/* 2. Main Chat Panel */}
      <GlassCard className="flex-1 flex flex-col justify-between p-0 overflow-hidden h-full border-white/5 bg-black/60 relative">
        
        {/* Upper title bar */}
        <div className="px-6 py-4 border-b border-white/5 bg-white/2 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center border border-violet-400/20 shadow-[0_0_15px_rgba(124,58,237,0.4)]">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">NOVA Console Interface</h4>
              <span className="text-[9px] text-emerald-400 font-semibold tracking-wide">Sync Active</span>
            </div>
          </div>
          <button onClick={clearChat} className="lg:hidden text-gray-400 hover:text-red-400 p-2 cursor-pointer transition-colors">
            <RefreshCw size={14} />
          </button>
        </div>

        {/* Messages list viewport */}
        <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-5 z-10 min-h-0">
          {messages.map((msg) => {
            const isNova = msg.sender === "nova";

            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 items-start max-w-[85%] ${
                  isNova ? "mr-auto text-left" : "ml-auto flex-row-reverse text-right"
                }`}
              >
                {/* Profile Circle symbol */}
                <div
                  className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-bold text-[10px] text-white shadow-md border ${
                    isNova
                      ? "bg-gradient-to-tr from-violet-600 to-indigo-500 border-violet-400/20 shadow-[0_0_10px_rgba(124,58,237,0.3)] animate-pulse"
                      : "bg-white/10 border-white/5"
                  }`}
                >
                  {isNova ? "N" : "U"}
                </div>
                
                {/* Bubble card */}
                <div
                  className={`px-4.5 py-3 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
                    isNova
                      ? "bg-violet-950/20 border-violet-500/20 text-violet-100"
                      : "bg-white/5 border-white/5 text-gray-300 text-left"
                  }`}
                >
                  {renderMessageText(msg.text)}
                  <span className="block text-[8px] text-gray-600 font-semibold mt-2.5">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3.5 items-start mr-auto">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 border border-violet-400/20 flex items-center justify-center text-white shrink-0 animate-pulse text-[10px] font-bold">
                N
              </div>
              <div className="px-4.5 py-3.5 rounded-2xl border border-violet-500/20 bg-violet-950/20 text-gray-400 text-xs flex items-center gap-1.5 shadow-[0_0_10px_rgba(124,58,237,0.05)]">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Suggestion pills and input form bar */}
        <div className="p-4 border-t border-white/5 bg-white/2 z-10 flex flex-col gap-3">
          
          {/* Quick suggestions */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => handleSuggestion("How can I practice my Git terminal skills?")}
              className="px-3 py-1.5 bg-white/3 border border-white/5 rounded-full text-[10px] font-medium text-gray-400 hover:text-white hover:border-violet-500/30 hover:bg-violet-950/10 shrink-0 cursor-pointer transition-all"
            >
              <Code size={11} className="inline mr-1" /> Practice Git
            </button>
            <button
              onClick={() => handleSuggestion("Give me CSS config rules for responsive glassmorphic cards")}
              className="px-3 py-1.5 bg-white/3 border border-white/5 rounded-full text-[10px] font-medium text-gray-400 hover:text-white hover:border-violet-500/30 hover:bg-violet-950/10 shrink-0 cursor-pointer transition-all"
            >
              <Layout size={11} className="inline mr-1" /> Glassmorphic Layout
            </button>
            <button
              onClick={() => handleSuggestion("What are the average entry salaries for software engineering and AI tracks?")}
              className="px-3 py-1.5 bg-white/3 border border-white/5 rounded-full text-[10px] font-medium text-gray-400 hover:text-white hover:border-violet-500/30 hover:bg-violet-950/10 shrink-0 cursor-pointer transition-all"
            >
              <TrendingUp size={11} className="inline mr-1" /> Salary Metrics
            </button>
          </div>

          {/* Form input */}
          <form onSubmit={handleSend} className="flex gap-3">
            <input
              type="text"
              placeholder="Query NOVA AI Career engine..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-grow px-4.5 py-3 rounded-xl bg-white/5 border border-white/5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-hidden focus:border-violet-500/40 focus:bg-white/10 transition-all duration-300"
              disabled={isTyping}
            />
            <Button type="submit" variant="glow" className="px-5" disabled={isTyping || !inputText.trim()}>
              <Send size={15} />
            </Button>
          </form>
        </div>

      </GlassCard>
    </div>
  );
}
