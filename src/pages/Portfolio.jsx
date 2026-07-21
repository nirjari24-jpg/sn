import React from "react";
import { Briefcase, Link as LinkIcon, GitBranch, CheckCircle2 } from "lucide-react";
import { useCareer } from "../contexts/CareerContext";
import GlassCard from "../components/ui/GlassCard";

export default function Portfolio() {
  const { activeRoadmap, projectsFinished } = useCareer();

  // Extract all completed projects from roadmap
  const completedProjects = [];
  if (activeRoadmap?.stages) {
    activeRoadmap.stages.forEach(stage => {
      stage.modules?.forEach(module => {
        module.projects?.forEach(proj => {
          if (proj.completed) {
            completedProjects.push({ ...proj, moduleTitle: module.title });
          }
        });
      });
    });
  }

  return (
    <div className="max-w-4xl mx-auto text-left flex flex-col gap-6 pb-10">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Briefcase className="text-pink-400 w-8 h-8" />
          Auto-Generated Portfolio
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          As you complete projects in your roadmap, they automatically appear here.
        </p>
      </div>

      <div className="flex gap-4 mb-4">
        <GlassCard className="flex-1 py-4 flex flex-col items-center justify-center border-white/5">
          <span className="text-2xl font-bold text-white">{projectsFinished}</span>
          <span className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-semibold">Projects Built</span>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {completedProjects.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
            No projects completed yet. Start building from your roadmap!
          </div>
        ) : (
          completedProjects.map((proj, idx) => (
            <GlassCard key={idx} className="flex flex-col gap-3 border-white/10" glow="pink">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white text-lg">{proj.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{proj.moduleTitle}</p>
                </div>
                <div className="bg-emerald-950/30 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-md border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 size={12}/> Completed
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Demonstrates mastery of {proj.difficulty} concepts learned in this module.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-2 text-xs font-semibold text-white transition-colors flex justify-center items-center gap-2">
                  <GitBranch size={14}/> Add GitHub
                </button>
                <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-2 text-xs font-semibold text-white transition-colors flex justify-center items-center gap-2">
                  <LinkIcon size={14}/> Add Live Demo
                </button>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}
