import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, RefreshCw, BrainCircuit, Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useNova } from "../contexts/NovaContext";
import GlassCard from "./ui/GlassCard";
import Button from "./ui/Button";

export default function GlobalNovaChat() {
  const { messages, isTyping, sendMessage, clearChat } = useNova();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputText, setInputText] = useState("");
  const chatBottomRef = useRef(null);
  const location = useLocation();

  // If on the dedicated NOVA page, don't show the global widget
  if (location.pathname === "/nova") {
    return null;
  }

  // Scroll chat feed to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen, isExpanded]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText("");
  };

  const renderMessageText = (text) => {
    if (text.includes("```")) {
      const parts = text.split("```");
      return parts.map((part, index) => {
        if (index % 2 !== 0) {
          const lines = part.split("\n");
          const language = lines[0] || "code";
          const code = lines.slice(1).join("\n");
          return (
            <div key={index} className="my-2 font-mono text-[10px] bg-black/60 border border-white/5 p-2 rounded-lg overflow-x-auto text-violet-300 relative select-all">
              <span className="absolute top-1 right-2 text-[8px] text-gray-500 font-bold uppercase select-none">{language}</span>
              <pre>{code}</pre>
            </div>
          );
        }
        return renderSimpleText(part);
      });
    }
    return renderSimpleText(text);
  };

  const renderSimpleText = (text) => {
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
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center border border-violet-400/20 shadow-[0_0_20px_rgba(124,58,237,0.4)] cursor-pointer"
          >
            <BrainCircuit className="text-white w-6 h-6 animate-pulse" />
            {messages.length > 0 && messages[messages.length - 1].sender === "nova" && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-[#030014]" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.2 } }}
            className={`fixed z-50 ${isExpanded ? 'inset-4 md:inset-10' : 'bottom-6 right-6 w-[380px] h-[600px] max-h-[85vh]'} flex flex-col`}
          >
            <GlassCard className="flex-1 flex flex-col justify-between p-0 overflow-hidden h-full border-violet-500/30 bg-[#0a081c]/95 backdrop-blur-xl shadow-2xl">
              
              {/* Header */}
              <div className="px-4 py-3 border-b border-white/5 bg-white/2 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center border border-violet-400/20 shadow-[0_0_10px_rgba(124,58,237,0.4)]">
                    <BrainCircuit className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide">NOVA Assistant</h4>
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={clearChat} className="text-gray-400 hover:text-white p-1.5 transition-colors" title="Clear Chat">
                    <RefreshCw size={14} />
                  </button>
                  <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-400 hover:text-white p-1.5 transition-colors hidden md:block">
                    {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  </button>
                  <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-red-400 p-1.5 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Messages Viewport */}
              <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-4 z-10 min-h-0 bg-black/20">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-400">
                    <BrainCircuit className="w-12 h-12 text-violet-500/40 mb-3" />
                    <p className="text-sm">Hi! I'm NOVA. I'm always here to listen, help, and check for bugs.</p>
                  </div>
                )}
                
                {messages.map((msg) => {
                  const isNova = msg.sender === "nova";
                  return (
                    <div key={msg.id} className={`flex gap-2.5 items-start max-w-[85%] ${isNova ? "mr-auto text-left" : "ml-auto flex-row-reverse text-right"}`}>
                      <div className={`w-6 h-6 rounded-md shrink-0 flex items-center justify-center font-bold text-[9px] text-white shadow-md border ${
                        isNova ? "bg-gradient-to-tr from-violet-600 to-indigo-500 border-violet-400/20" : "bg-white/10 border-white/5"
                      }`}>
                        {isNova ? "N" : "U"}
                      </div>
                      <div className={`px-3 py-2.5 rounded-2xl border text-xs leading-relaxed ${
                        isNova ? "bg-violet-950/20 border-violet-500/20 text-violet-100 rounded-tl-sm" : "bg-white/5 border-white/5 text-gray-300 text-left rounded-tr-sm"
                      }`}>
                        {renderMessageText(msg.text)}
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex gap-2.5 items-start mr-auto">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-violet-600 to-indigo-500 border border-violet-400/20 flex items-center justify-center text-white shrink-0 animate-pulse text-[9px] font-bold">N</div>
                    <div className="px-3 py-2.5 rounded-2xl border border-violet-500/20 bg-violet-950/20 flex items-center gap-1 rounded-tl-sm">
                      <span className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" />
                      <span className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <span className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-white/5 bg-white/2 z-10">
                <form onSubmit={handleSend} className="flex gap-2 relative">
                  <input
                    type="text"
                    placeholder="Ask NOVA anything..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-grow px-4 py-2.5 rounded-xl bg-[#030014]/50 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:bg-black/40 transition-all pr-10"
                    disabled={isTyping}
                  />
                  <button 
                    type="submit" 
                    disabled={isTyping || !inputText.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-violet-400 hover:text-violet-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>

            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
