import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Compass,
  Map,
  MessageSquare,
  Trophy,
  ArrowRight,
  BookOpen,
  Activity,
  Code
} from "lucide-react";
import StarField from "../components/StarField";
import Button from "../components/ui/Button";
import GlassCard from "../components/ui/GlassCard";
import { slideUp, scaleIn, fadeIn, staggerContainer } from "../animations/motion";

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-[#030014] text-white overflow-x-hidden font-sans">
      {/* Stars backdrop */}
      <StarField density={100} />

      {/* Nebula glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full nebula-purple filter blur-[150px] pointer-events-none opacity-20" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full nebula-blue filter blur-[150px] pointer-events-none opacity-20" />

      {/* 1. Header Navbar */}
      <header className="fixed top-0 inset-x-0 h-18 border-b border-white/5 bg-[#030014]/60 backdrop-blur-md z-50 flex items-center justify-between px-6 md:px-12">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.4)]">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight">
            Skill<span className="text-violet-400">Nova</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400 font-medium">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#journey" className="hover:text-white transition-colors">Journey Mapping</a>
          <a href="#mentor" className="hover:text-white transition-colors">AI Mentor</a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="outline" className="px-4 py-2 text-xs">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button variant="glow" className="px-4 py-2 text-xs">Initialize App</Button>
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-36 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-950/30 border border-violet-500/20 text-violet-300 text-xs font-semibold tracking-wide uppercase mb-6"
        >
          <Sparkles size={12} className="animate-pulse" />
          <span>Next-Generation Career Architect</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-400 max-w-4xl"
        >
          Discover Your Best Career Path with <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-300 to-blue-400">AI Innovation</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-400 text-base sm:text-xl max-w-2xl mt-6 leading-relaxed"
        >
          Create structured skill roadmaps, manage daily development tasks, earn achievements, and consult with **NOVA**—your automated student mentor.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mt-10 justify-center w-full max-w-md"
        >
          <Link to="/register" className="flex-1">
            <Button variant="glow" className="w-full py-3.5 text-sm font-semibold">
              Get Started Free <ArrowRight size={16} />
            </Button>
          </Link>
          <a href="#features" className="flex-1">
            <Button variant="outline" className="w-full py-3.5 text-sm font-semibold">
              Learn Features
            </Button>
          </a>
        </motion.div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            Precision Built for Student Growth
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            Experience an interface optimized for speed, learning, and automated pathfinding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard hover className="flex flex-col gap-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Compass size={20} />
            </div>
            <h3 className="font-bold text-lg text-white">Career Pathfinder</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Take an interactive questionnaire mapping your interests directly to modern engineering and design careers.
            </p>
          </GlassCard>

          <GlassCard hover className="flex flex-col gap-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Map size={20} />
            </div>
            <h3 className="font-bold text-lg text-white">Interactive Roadmaps</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Unlock a visual stage-by-stage learning plan complete with study goals, recommended files, and documentation.
            </p>
          </GlassCard>

          <GlassCard hover className="flex flex-col gap-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Trophy size={20} />
            </div>
            <h3 className="font-bold text-lg text-white">XP & Badges Ecosystem</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Earn XP by executing daily tasks, unlock customizable space badges, and watch your developer profile level up.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* 4. Journey Section */}
      <section id="journey" className="py-20 bg-black/30 border-y border-white/5 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/30 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase mb-4">
              <Activity size={12} />
              <span>Interactive Roadmap Showcase</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-white leading-tight">
              Chart Your Trajectory Step-by-Step
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
              SkillNova structures careers into visual nodes. Check off foundational skills, trigger learning logs, and progress dynamically from core fundamentals to deployment MLOps.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0 text-xs font-bold">1</div>
                <div>
                  <h4 className="font-semibold text-white">Assess & Select Path</h4>
                  <p className="text-gray-400 text-xs mt-0.5">Let our diagnostics reveal your optimal specialization matching your mental models.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0 text-xs font-bold">2</div>
                <div>
                  <h4 className="font-semibold text-white">Execute Daily Checklist</h4>
                  <p className="text-gray-400 text-xs mt-0.5">Focus on 3 key items per day generated dynamically to minimize study choice overhead.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0 text-xs font-bold">3</div>
                <div>
                  <h4 className="font-semibold text-white">Deploy & Level Up</h4>
                  <p className="text-gray-400 text-xs mt-0.5">Submit portfolio tasks, scale your XP level, and sync with industry standards.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Roadmap mockup */}
            <GlassCard className="p-8 border-white/10 shadow-2xl bg-black/60 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Active Track: Software Engineering</span>
                </div>
                <span className="text-xs text-violet-400 font-bold">60% Done</span>
              </div>

              {/* Stage nodes mockup */}
              <div className="flex flex-col gap-6 relative">
                <div className="absolute left-4 top-2 bottom-2 w-[1px] bg-white/5 border-dashed border-l border-white/10" />

                <div className="flex gap-4 relative items-start">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 z-10 text-xs font-bold">✓</div>
                  <div className="text-left">
                    <h4 className="text-sm font-semibold text-white">Foundation & Scripting</h4>
                    <p className="text-xs text-gray-500 mt-0.5">JS scoping, promises, Git commits.</p>
                  </div>
                </div>

                <div className="flex gap-4 relative items-start">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/40 text-violet-400 flex items-center justify-center shrink-0 z-10 text-xs font-bold animate-pulse">2</div>
                  <div className="text-left">
                    <h4 className="text-sm font-semibold text-white">Modern Frontend Frameworks</h4>
                    <p className="text-xs text-violet-300/70 mt-0.5">React Hooks, Context API, Tailwind layout grid.</p>
                  </div>
                </div>

                <div className="flex gap-4 relative items-start opacity-40">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-gray-400 flex items-center justify-center shrink-0 z-10 text-xs font-bold">3</div>
                  <div className="text-left">
                    <h4 className="text-sm font-semibold text-white">Backend Development & APIs</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Node.js endpoints, MongoDB schema pipelines.</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* 5. AI Mentor Preview Section */}
      <section id="mentor" className="py-20 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/30 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase mb-4">
            <MessageSquare size={12} />
            <span>AI Consultation Teaser</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            Meet NOVA, Your Career Mentor
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            Engage with a conversational engine that queries databases, helps debug code snippets, and reviews your skill gaps.
          </p>
        </div>

        {/* Live chat preview mock */}
        <div className="max-w-2xl mx-auto">
          <GlassCard className="p-0 border-white/5 bg-black/60 relative overflow-hidden text-left shadow-2xl">
            {/* Header tab */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center border border-violet-400/20 shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">NOVA Consulting</h4>
                  <span className="text-[9px] text-emerald-400 font-medium">Core AI Activated</span>
                </div>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>
            </div>

            {/* Chats stream mockup */}
            <div className="p-6 flex flex-col gap-4 text-xs md:text-sm">
              <div className="flex gap-3.5 items-start">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center font-bold text-[10px] text-white">US</div>
                <div className="bg-white/5 border border-white/5 px-4 py-2.5 rounded-2xl text-gray-300 max-w-[85%]">
                  How can I practice my terminal command skills?
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shrink-0 shadow-lg">
                  <Code size={13} />
                </div>
                <div className="bg-violet-950/20 border border-violet-500/20 px-4 py-2.5 rounded-2xl text-violet-100 max-w-[85%] leading-relaxed flex flex-col gap-2">
                  <span>I've generated a lesson plan for command lines. Try running:</span>
                  <code className="bg-black/60 border border-white/5 text-violet-300 p-2.5 rounded-lg text-xs font-mono select-all">
                    git commit -m "feat: initialize platform"
                  </code>
                  <span>This will log +120 XP onto your active planner track.</span>
                </div>
              </div>
            </div>

            {/* Input bar mockup */}
            <div className="px-6 py-4 border-t border-white/5 bg-white/1">
              <div className="flex gap-3">
                <input
                  type="text"
                  disabled
                  placeholder="Sign in to chat with NOVA..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-500 outline-hidden"
                />
                <Link to="/register">
                  <Button variant="primary" className="py-2.5 px-4 text-xs font-semibold">
                    Launch App
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* 6. Footer Section */}
      <footer className="border-t border-white/5 py-12 px-6 md:px-12 bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500 font-medium">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white text-xs tracking-tight">
              Skill<span className="text-violet-400">Nova</span>
            </span>
          </div>

          <p>© 2026 SkillNova Inc. "Initializing Your Future."</p>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
