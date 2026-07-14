import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import StarField from "../components/StarField";
import { useAuth } from "../contexts/AuthContext";

export default function Splash() {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Increment loading progress smoothly
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Random incremental hops to feel realistic
        return prev + Math.floor(Math.random() * 8) + 4;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      // Delay navigation slightly for a beautiful fade experience
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          navigate("/dashboard");
        } else {
          navigate("/landing");
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [progress, isAuthenticated, navigate]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#030014]">
      {/* Stars Backdrop */}
      <StarField warp={progress === 100} density={150} />

      {/* Nebula ambient light */}
      <div className="absolute w-[400px] h-[400px] rounded-full nebula-purple filter blur-[100px] opacity-40 animate-pulse-glow" />

      {/* Main Logo & Tagline */}
      <div className="relative z-10 flex flex-col items-center select-none text-center">
        {/* Animated icon glow */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-[0_0_40px_rgba(124,58,237,0.6)] mb-6 border border-violet-400/20"
        >
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
        </motion.div>

        {/* Text Logo */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-2"
        >
          Skill<span className="text-violet-400 text-glow-purple">Nova</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-sm font-semibold tracking-widest text-violet-300/60 uppercase mb-12"
        >
          "Initializing Your Future."
        </motion.p>

        {/* Loader bar container */}
        <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
          />
        </div>

        {/* Loading text feedback */}
        <motion.span
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-xs text-gray-500 font-medium tracking-wide mt-4 uppercase"
        >
          {progress < 100 ? "Loading Core Systems..." : "Syncing Star Systems..."}
        </motion.span>
      </div>

      {/* Interactive flash screen overlay on load completed */}
      {progress === 100 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          className="absolute inset-0 bg-white pointer-events-none z-50"
        />
      )}
    </div>
  );
}
