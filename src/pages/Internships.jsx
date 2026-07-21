import React, { useState, useEffect } from "react";
import { Briefcase, CheckCircle2, Lock, Navigation, Sparkles } from "lucide-react";
import { useCareer } from "../contexts/CareerContext";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";

export default function Internships() {
  const { activeRoadmap, projectsFinished, testScores } = useCareer();
  const [isReady, setIsReady] = useState(false);
  const [readinessScore, setReadinessScore] = useState(0);

  useEffect(() => {
    // Calculate readiness
    let score = 0;
    if (activeRoadmap) {
      score += 20; // Has a roadmap
    }
    if (projectsFinished > 0) {
      score += Math.min(40, projectsFinished * 15);
    }
    if (testScores.length > 0) {
      const avgScore = testScores.reduce((acc, curr) => acc + curr.score, 0) / testScores.length;
      if (avgScore > 70) score += 40;
      else score += 20;
    }
    
    setReadinessScore(score);
    if (score >= 80) {
      setIsReady(true);
    }
  }, [activeRoadmap, projectsFinished, testScores]);

  const mockInternships = [
    { company: "TechNova Inc.", role: "Junior Developer Intern", location: "Remote", skills: "React, Node.js", match: "95%" },
    { company: "DataFlow Systems", role: "Software Engineering Intern", location: "New York (Hybrid)", skills: "Python, SQL", match: "88%" },
    { company: "CloudCore", role: "Frontend Intern", location: "Remote", skills: "JavaScript, UI/UX", match: "82%" }
  ];

  return (
    <div className="max-w-4xl mx-auto text-left flex flex-col gap-6 pb-10">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Navigation className="text-blue-400 w-8 h-8" />
          Internship Finder
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          NOVA evaluates your skill mastery. Once you are ready, opportunities unlock automatically.
        </p>
      </div>

      {!isReady ? (
        <GlassCard className="flex flex-col items-center justify-center py-16 border-white/5 text-center" glow="none">
          <Lock className="w-12 h-12 text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-300 mb-2">Internship Finder Locked</h3>
          <p className="text-gray-500 text-sm max-w-md mb-6">
            You currently have a {readinessScore}% readiness score. Complete more roadmap modules, projects, and weekly tests to reach 80% and unlock real opportunities.
          </p>
          <div className="w-64 h-2 bg-gray-900 rounded-full overflow-hidden">
            <div className="h-full bg-violet-500 transition-all duration-1000" style={{ width: `${readinessScore}%` }}></div>
          </div>
        </GlassCard>
      ) : (
        <div className="flex flex-col gap-6">
          <GlassCard className="border-emerald-500/30 bg-emerald-950/10" glow="emerald">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Sparkles className="text-emerald-400 w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-400">🎉 Congratulations! You are Internship Ready.</h3>
                <p className="text-sm text-gray-400 mt-0.5">NOVA has analyzed your progress and matched you with these opportunities.</p>
              </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockInternships.map((job, idx) => (
              <GlassCard key={idx} className="border-white/10 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white">{job.role}</h4>
                    <p className="text-xs text-blue-400 font-semibold">{job.company}</p>
                  </div>
                  <div className="bg-blue-950/40 text-blue-400 text-[10px] font-bold px-2 py-1 rounded border border-blue-500/20">
                    {job.match} Match
                  </div>
                </div>
                <div className="text-xs text-gray-400 flex flex-col gap-1 mt-2">
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Skills:</strong> {job.skills}</p>
                </div>
                <Button className="mt-4 w-full" variant="glow">Apply Now</Button>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
