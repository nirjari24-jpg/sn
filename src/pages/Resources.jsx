import React from "react";
import { BookOpen, ExternalLink, FileText, Video, GraduationCap, Code } from "lucide-react";
import { useTasks } from "../contexts/TaskContext";
import { mockCareers } from "../data/mockCareers";
import GlassCard from "../components/ui/GlassCard";

const categoryIconMap = {
  docs: FileText,
  video: Video,
  tutorial: GraduationCap,
  sandbox: Code
};

// Curated library database matching career tracks
const resourceDatabase = {
  "software-engineering": [
    { id: "se-r1", title: "Eloquent JavaScript (3rd Edition)", type: "docs", desc: "Comprehensive review of modern variables, async closures, and OOP patterns.", url: "#", stage: "Stage 1: Foundation" },
    { id: "se-r2", title: "Git & GitHub Pro Book", type: "tutorial", desc: "Advanced rebase guides, branching strategies, and upstream pull workflows.", url: "#", stage: "Stage 1: Foundation" },
    { id: "se-r3", title: "Official React Documentation", type: "docs", desc: "Master custom hooks, performance profiling, and state rendering schedules.", url: "#", stage: "Stage 2: Frontend" },
    { id: "se-r4", title: "Designing Data-Intensive Applications", type: "docs", desc: "System architectures, scaling pipelines, indexes, and database caching patterns.", url: "#", stage: "Stage 4: System Design" }
  ],
  "ai-ml-engineering": [
    { id: "ai-r1", title: "Python for Data Analysis (Wes McKinney)", type: "docs", desc: "Complete guide to NumPy matrices, Pandas queries, and cleaning methods.", url: "#", stage: "Stage 1: Math & Python" },
    { id: "ai-r2", title: "3Blue1Brown: Neural Networks Basics", type: "video", desc: "Beautiful geometrical animations explaining backpropagation derivatives.", url: "#", stage: "Stage 2: Deep Learning" },
    { id: "ai-r3", title: "PyTorch Official API Guides", type: "docs", desc: "Learn tensor dimensions, gradient updates, and dataset model wrapper pipelines.", url: "#", stage: "Stage 3: Advanced ML" }
  ],
  "product-design": [
    { id: "pd-r1", title: "Refactoring UI (Adam Wathan)", type: "docs", desc: "Practical lessons on spacing ratios, shadows, text sizes, and hierarchies.", url: "#", stage: "Stage 1: Foundation" },
    { id: "pd-r2", title: "Figma Component Auto-Layout Guide", type: "tutorial", desc: "Master responsive layout matrices, absolute sizing, and nested component states.", url: "#", stage: "Stage 2: Figma Systems" },
    { id: "pd-r3", title: "The Design of Everyday Things (Don Norman)", type: "docs", desc: "Cognitive mappings, user feedback signifiers, and architectural loops.", url: "#", stage: "Stage 3: Research & UX" }
  ]
};

export default function Resources() {
  const { careerTrack } = useTasks();

  const activeCareer = mockCareers.find((c) => c.id === careerTrack) || mockCareers[0];
  const resources = resourceDatabase[careerTrack] || resourceDatabase["software-engineering"];

  return (
    <div className="max-w-4xl mx-auto text-left flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <BookOpen className="text-violet-400 w-8 h-8" />
          Technical Library & Resources
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Curated reference documents, articles, and training materials mapped to your active path.
        </p>
      </div>

      {/* Track info banner */}
      <div className="p-4 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <BookOpen size={16} />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-semibold uppercase block">Active Reference Grid</span>
            <span className="text-xs font-bold text-white leading-tight">{activeCareer.title} Track</span>
          </div>
        </div>
      </div>

      {/* Grid of Resource bookmarks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((res) => {
          const IconComponent = categoryIconMap[res.type] || FileText;

          return (
            <GlassCard key={res.id} hover className="p-5 text-left flex flex-col justify-between h-48">
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                  <span className="text-[9px] uppercase font-bold text-violet-400 tracking-wider">
                    {res.stage}
                  </span>
                  
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-gray-500 border border-white/5 px-2 py-0.5 rounded bg-white/2 uppercase">
                    <IconComponent size={10} /> {res.type}
                  </span>
                </div>
                
                <h3 className="font-bold text-sm text-white tracking-wide truncate">{res.title}</h3>
                <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                  {res.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex justify-end">
                <a
                  href={res.url}
                  className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 font-bold tracking-wide transition-colors cursor-pointer"
                >
                  Retrieve File <ExternalLink size={12} />
                </a>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
