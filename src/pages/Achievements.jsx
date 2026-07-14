import React from "react";
import { Trophy, Zap, Compass, Flame, Cpu, Code, Lock } from "lucide-react";
import { useTasks } from "../contexts/TaskContext";
import { mockUserData } from "../data/mockData";
import GlassCard from "../components/ui/GlassCard";

const iconMap = {
  Zap: Zap,
  Compass: Compass,
  Flame: Flame,
  Cpu: Cpu,
  Code: Code
};

export default function Achievements() {
  const { xp } = useTasks();
  const achievements = mockUserData.achievements;

  return (
    <div className="max-w-4xl mx-auto text-left flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Trophy className="text-violet-400 w-8 h-8" />
          Achievements & Orbit Medals
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Review your unlocked developer badges, technical credentials, and active milestones.
        </p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {achievements.map((badge) => {
          const Icon = iconMap[badge.icon] || Trophy;

          return (
            <GlassCard
              key={badge.id}
              className={`p-6 border transition-all duration-300 relative overflow-hidden text-center flex flex-col items-center gap-4 ${
                badge.unlocked
                  ? "bg-violet-950/15 border-violet-500/20 hover:border-violet-500/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]"
                  : "bg-white/1 border-white/5 opacity-55"
              }`}
            >
              {/* Unlocked background lights */}
              {badge.unlocked && (
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-violet-500/5 rounded-full blur-xl pointer-events-none" />
              )}

              {/* Badge Icon circle */}
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center border relative transition-all duration-300 ${
                  badge.unlocked
                    ? "bg-violet-600/10 border-violet-500/30 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                    : "bg-white/2 border-white/5 text-gray-500"
                }`}
              >
                <Icon size={24} className={badge.unlocked ? "animate-pulse" : ""} />
                
                {/* Lock Overlay Badge */}
                {!badge.unlocked && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-black border border-white/10 flex items-center justify-center text-gray-500 shadow-md">
                    <Lock size={9} />
                  </div>
                )}
              </div>

              {/* Badge Content */}
              <div className="text-center select-none flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white tracking-wide">{badge.title}</h3>
                  <p className="text-xs text-gray-400 mt-2 leading-normal min-h-10">
                    {badge.description}
                  </p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between w-full">
                  <span className="text-[9px] uppercase tracking-widest text-gray-500 font-semibold">Reward</span>
                  <span className={`text-xs font-bold ${badge.unlocked ? "text-violet-400" : "text-gray-500"}`}>
                    +{badge.xp} XP
                  </span>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
