import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, CheckCircle2, XCircle, ChevronRight, Activity, Award, Star, TrendingUp, Target, BookOpen, Repeat, Map } from "lucide-react";
import { useCareer } from "../contexts/CareerContext";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";

export default function WeeklyTests() {
  const { activeRoadmap, setActiveRoadmap, addTestScore, weakTopics, strongTopics, testScores, learningStreak, awardBadge } = useCareer();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // We can pass a specific taskId if the user clicked "Take Test" on a specific task
  const targetStageId = searchParams.get("stageId");
  const targetTaskId = searchParams.get("taskId");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [testData, setTestData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [calculatedMetrics, setCalculatedMetrics] = useState(null);

  let currentStage = activeRoadmap?.stages?.[0];
  let currentTask = null;

  if (activeRoadmap) {
    if (targetStageId) {
       currentStage = activeRoadmap.stages.find(s => s.id === targetStageId) || currentStage;
    }
    if (targetTaskId) {
       for (const stage of activeRoadmap.stages) {
         const found = stage.tasks?.find(t => t.id === targetTaskId);
         if (found) {
           currentStage = stage;
           currentTask = found;
           break;
         }
       }
    }
  }

  const targetTitle = currentTask ? `Task: ${currentTask.title}` : (currentStage?.title || "General Evaluation");

  const generateTest = async () => {
    setIsGenerating(true);
    setTestResult(null);
    setAnswers({});
    setStartTime(null);
    setCalculatedMetrics(null);
    try {
      const res = await fetch("http://localhost:5000/api/ai/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          stage: currentStage,
          careerTitle: activeRoadmap?.title || "Technology",
          targetTaskTitle: currentTask?.title,
          weakTopics,
          strongTopics
        })
      });
      const data = await res.json();
      setTestData(data);
      setStartTime(Date.now());
    } catch (error) {
      console.error(error);
      alert("Failed to generate test. Make sure backend is running with Gemini API Key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const submitTest = async () => {
    setIsScoring(true);
    const endTime = Date.now();
    const timeTakenSeconds = Math.round((endTime - startTime) / 1000);
    const minutes = Math.floor(timeTakenSeconds / 60);
    const seconds = timeTakenSeconds % 60;
    const timeTakenStr = `${minutes} min ${seconds} sec`;

    let correctCount = 0;
    testData.questions.forEach(q => {
      if (answers[q.id] === q.correctOptionIndex) correctCount++;
    });
    const percentage = Math.round((correctCount / testData.questions.length) * 100);
    const scoreFraction = `${correctCount} / ${testData.questions.length}`;

    // Get previous test for Progress comparison
    const previousTest = testScores.length > 0 ? testScores[testScores.length - 1] : null;
    const avgScore = testScores.length > 0 ? Math.round(testScores.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / testScores.length) : percentage;
    
    setCalculatedMetrics({ timeTakenStr, percentage, scoreFraction, correctCount, previousTest, avgScore });

    try {
      const res = await fetch("http://localhost:5000/api/ai/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          test: testData,
          answers: answers,
          stageTitle: targetTitle
        })
      });
      const data = await res.json();
      setTestResult(data);
      
      const fullScoreData = { 
        ...data, 
        percentage, 
        correctCount, 
        timeTakenSeconds,
        stageId: currentStage.id, 
        stageTitle: targetTitle 
      };
      
      addTestScore(fullScoreData);
      
      if (data.newBadges) {
        data.newBadges.forEach(b => awardBadge(b));
      }

      // If passing score and this was for a specific task, mark it complete in the roadmap
      if (currentTask && percentage >= 70 && !currentTask.completed) {
         setActiveRoadmap(prev => {
            const newRoadmap = { ...prev };
            newRoadmap.stages = newRoadmap.stages.map(stage => {
              if (stage.id === currentStage.id) {
                return {
                  ...stage,
                  tasks: stage.tasks.map(t => t.id === currentTask.id ? { ...t, completed: true } : t)
                };
              }
              return stage;
            });
            return newRoadmap;
         });
      }

    } catch (error) {
      console.error(error);
      alert("Failed to score test.");
    } finally {
      setIsScoring(false);
    }
  };

  const handleAnswer = (qId, val) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  if (!activeRoadmap) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Activity className="w-16 h-16 text-gray-700 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Active Track</h3>
        <p className="text-gray-400">Generate a roadmap first to unlock Weekly AI Tests.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto text-left flex flex-col gap-6 pb-10">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <BrainCircuit className="text-violet-400 w-8 h-8" />
          Review
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Take a dynamically generated test based on your current roadmap stage to prove competency.
        </p>
      </div>

      {!testData && !isGenerating && !testResult && (
        <GlassCard className="p-8 text-center flex flex-col items-center gap-6 mt-4 border-violet-500/20" glow="purple">
          <div className="w-16 h-16 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 glow-purple">
            <Activity size={28} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Ready for your Review?</h3>
            <p className="text-gray-400 text-sm">NOVA will generate a custom test for: <strong className="text-violet-300">{targetTitle}</strong></p>
          </div>
          <Button onClick={generateTest} variant="glow" className="px-8 font-semibold">
            Generate Test
          </Button>
        </GlassCard>
      )}

      {isGenerating && (
         <div className="flex flex-col items-center justify-center py-20">
           <div className="w-16 h-16 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 glow-purple mb-4 relative">
             <div className="absolute inset-0 border-2 border-transparent border-t-violet-400 rounded-full animate-spin"></div>
             <BrainCircuit size={28} />
           </div>
           <h3 className="text-xl font-bold text-white mb-2">Creating your Test...</h3>
           <p className="text-gray-400 text-sm">Generating contextual scenarios and questions.</p>
         </div>
      )}

      {testData && !testResult && !isScoring && (
        <div className="flex flex-col gap-6">
          <GlassCard className="p-6 border-white/10 text-center">
            <h3 className="text-xl font-bold text-white">{testData.title}</h3>
          </GlassCard>

          {testData.questions.map((q, idx) => (
            <GlassCard key={q.id} className="p-6 border-white/5">
              <h4 className="text-sm font-bold text-violet-400 mb-4 uppercase tracking-widest">Question {idx + 1}</h4>
              <p className="text-white text-base mb-6 leading-relaxed">{q.question}</p>
              
              {q.type === 'mcq' ? (
                <div className="flex flex-col gap-3">
                  {q.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleAnswer(q.id, oIdx)}
                      className={`w-full p-4 rounded-xl border text-left text-sm transition-all duration-300 flex items-center justify-between ${
                        answers[q.id] === oIdx 
                          ? "bg-violet-600/20 border-violet-500/50 text-white" 
                          : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      <span>{opt}</span>
                      {answers[q.id] === oIdx && <CheckCircle2 size={16} className="text-violet-400" />}
                    </button>
                  ))}
                </div>
              ) : (
                <textarea
                  rows={4}
                  value={answers[q.id] || ""}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                  placeholder="Type your solution/answer here..."
                  className="w-full p-4 rounded-xl bg-[#0a081c]/50 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 resize-none transition-colors"
                />
              )}
            </GlassCard>
          ))}

          <div className="flex justify-end mt-4">
            <Button onClick={submitTest} variant="glow" className="px-8 font-semibold text-sm" disabled={Object.keys(answers).length < testData.questions.length}>
              Finish Test <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      )}

      {isScoring && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 glow-purple mb-4 relative">
             <div className="absolute inset-0 border-2 border-transparent border-t-emerald-400 rounded-full animate-spin"></div>
             <Award size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Analyzing Responses...</h3>
          <p className="text-gray-400 text-sm">Evaluating logic and accuracy to compute readiness score.</p>
        </div>
      )}

      {testResult && calculatedMetrics && (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
            
            {/* SECTION 1: Test Summary */}
            <GlassCard className="p-8 border-emerald-500/20 text-center" glow="none">
              <h3 className="text-xl font-bold text-white mb-6">Test Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Score</span>
                  <span className="text-2xl font-extrabold text-white">{calculatedMetrics.scoreFraction}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Percentage</span>
                  <span className="text-2xl font-extrabold text-emerald-400">{calculatedMetrics.percentage}%</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Time Taken</span>
                  <span className="text-2xl font-extrabold text-violet-400">{calculatedMetrics.timeTakenStr}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Difficulty</span>
                  <span className="text-2xl font-extrabold text-blue-400">Mixed</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Status</span>
                  <span className={`text-2xl font-extrabold ${testResult.status === 'Excellent' ? 'text-emerald-400' : testResult.status === 'Good' ? 'text-blue-400' : 'text-amber-400'}`}>{testResult.status}</span>
                </div>
              </div>
            </GlassCard>

            {/* SECTION 2: Question Review */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-white mt-2">Question Review</h3>
              {testData.questions.map((q, idx) => {
                const isCorrect = answers[q.id] === q.correctOptionIndex;
                return (
                  <GlassCard key={q.id} className={`p-6 border-l-4 ${isCorrect ? 'border-l-emerald-500 border-white/5' : 'border-l-red-500 border-white/5'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-sm font-bold text-gray-300">Question {idx + 1}</h4>
                      <span className="text-xs px-2 py-1 bg-white/5 rounded text-gray-400">{q.topic} • {q.difficulty}</span>
                    </div>
                    <p className="text-white text-base mb-4 leading-relaxed">{q.question}</p>
                    
                    <div className="flex flex-col gap-3 mb-4">
                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <span className="text-xs text-emerald-400 font-bold uppercase mb-1 flex items-center gap-1"><CheckCircle2 size={14}/> Correct Answer</span>
                        <span className="text-white text-sm">{q.options[q.correctOptionIndex]}</span>
                      </div>
                      {!isCorrect && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                          <span className="text-xs text-red-400 font-bold uppercase mb-1 flex items-center gap-1"><XCircle size={14}/> Your Answer</span>
                          <span className="text-white text-sm">{q.options[answers[q.id]]}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 bg-[#0a081c]/50 rounded-lg border border-white/5 mt-2">
                       <span className="text-xs text-violet-400 font-bold uppercase mb-2 flex items-center gap-1"><BrainCircuit size={14}/> Explanation</span>
                       <p className="text-sm text-gray-300">{q.explanation}</p>
                    </div>
                  </GlassCard>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SECTION 3: Performance by Topic */}
              <GlassCard className="p-6 border-white/5">
                <h3 className="text-lg font-bold text-white mb-4">Performance by Topic</h3>
                <div className="flex flex-col gap-3">
                  {Object.entries(testResult.topicPerformance || {}).map(([topic, rating]) => (
                    <div key={topic} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                      <span className="text-sm font-semibold text-white">{topic}</span>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} size={14} className={star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-600"} />
                        ))}
                      </div>
                    </div>
                  ))}
                  {(!testResult.topicPerformance || Object.keys(testResult.topicPerformance).length === 0) && (
                    <span className="text-sm text-gray-400">No topic data available.</span>
                  )}
                </div>
              </GlassCard>

              {/* SECTION 4: What You Did Well */}
              <GlassCard className="p-6 border-emerald-500/20 glow-none">
                <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2"><CheckCircle2 size={20}/> What You Did Well</h3>
                <ul className="flex flex-col gap-3">
                  {testResult.positiveObservations?.map((obs, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-emerald-100">
                      <span className="text-emerald-500 mt-0.5">✔</span> {obs}
                    </li>
                  ))}
                  {(!testResult.positiveObservations || testResult.positiveObservations.length === 0) && (
                    <span className="text-sm text-emerald-100/50">Nothing specific to note this time.</span>
                  )}
                </ul>
              </GlassCard>
            </div>

            {/* SECTION 5: Needs More Practice */}
            <GlassCard className="p-6 border-amber-500/20 glow-none">
              <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2"><Target size={20}/> Needs More Practice</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {testResult.weakTopics?.map((topic, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <span className="text-sm font-semibold text-amber-100">• {topic}</span>
                    <Button variant="outline" className="px-3 py-1 text-[10px] bg-amber-500/20 border-amber-500/30 text-amber-300 hover:bg-amber-500/30 whitespace-nowrap">Practice Again</Button>
                  </div>
                ))}
                {(!testResult.weakTopics || testResult.weakTopics.length === 0) && (
                  <span className="text-sm text-gray-400">None! You're doing great.</span>
                )}
              </div>
            </GlassCard>

            {/* SECTION 6: NOVA's Review */}
            <GlassCard className="p-6 border-violet-500/30 glow-purple">
              <h3 className="text-lg font-bold text-violet-400 mb-4 flex items-center gap-2"><BrainCircuit size={20}/> NOVA's Review</h3>
              <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{testResult.mentorReview}</p>
            </GlassCard>

            {/* SECTION 7: Recommended Next Step */}
            <GlassCard className="p-6 border-white/5">
              <h3 className="text-lg font-bold text-white mb-4">Recommended Next Step</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {testResult.recommendedSteps?.map((step, idx) => {
                   const iconMap = {
                     continue: <Map size={24} className="text-blue-400 mb-2"/>,
                     practice_weak: <Target size={24} className="text-amber-400 mb-2"/>,
                     retake_test: <Repeat size={24} className="text-violet-400 mb-2"/>,
                     watch_lesson: <BookOpen size={24} className="text-emerald-400 mb-2"/>,
                     mini_project: <Activity size={24} className="text-pink-400 mb-2"/>
                   };
                   const titleMap = {
                     continue: "Continue Roadmap",
                     practice_weak: "Practice Weak Topics",
                     retake_test: "Retake Test",
                     watch_lesson: "Watch Lesson",
                     mini_project: "Mini Project"
                   };
                   return (
                     <div key={idx} className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors cursor-pointer text-center">
                        {iconMap[step] || <Activity size={24} className="text-gray-400 mb-2"/>}
                        <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-wide">{titleMap[step] || step.replace('_', ' ')}</span>
                     </div>
                   );
                })}
              </div>
            </GlassCard>

            {/* SECTION 8: Progress */}
            <GlassCard className="p-6 border-white/5">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><TrendingUp size={20}/> Progress</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="flex flex-col bg-white/5 p-3 rounded-lg border border-white/5">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Previous Test</span>
                  <span className="text-xl font-bold text-gray-300">{calculatedMetrics.previousTest ? `${calculatedMetrics.previousTest.percentage}%` : 'N/A'}</span>
                </div>
                <div className="flex flex-col bg-white/5 p-3 rounded-lg border border-white/5">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Current Test</span>
                  <span className="text-xl font-bold text-white">{calculatedMetrics.percentage}%</span>
                </div>
                <div className="flex flex-col bg-white/5 p-3 rounded-lg border border-white/5">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Improvement</span>
                  <span className={`text-xl font-bold ${calculatedMetrics.previousTest && calculatedMetrics.percentage >= calculatedMetrics.previousTest.percentage ? 'text-emerald-400' : calculatedMetrics.previousTest ? 'text-red-400' : 'text-gray-400'}`}>
                    {calculatedMetrics.previousTest ? `${calculatedMetrics.percentage - calculatedMetrics.previousTest.percentage > 0 ? '+' : ''}${calculatedMetrics.percentage - calculatedMetrics.previousTest.percentage}%` : 'N/A'}
                  </span>
                </div>
                <div className="flex flex-col bg-white/5 p-3 rounded-lg border border-white/5">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Average Score</span>
                  <span className="text-xl font-bold text-blue-400">{calculatedMetrics.avgScore}%</span>
                </div>
                <div className="flex flex-col bg-white/5 p-3 rounded-lg border border-white/5">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Learning Streak</span>
                  <span className="text-xl font-bold text-orange-400">{learningStreak} Days</span>
                </div>
              </div>
            </GlassCard>

            {/* SECTION 9: Achievements */}
            <GlassCard className="p-6 border-yellow-500/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Award size={20} className="text-yellow-400"/> Achievements</h3>
              <div className="flex flex-wrap gap-4">
                {testResult.newBadges?.map((badge, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-center p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-center min-w-[120px]">
                    <Award size={28} className="text-yellow-400 mb-2"/>
                    <span className="text-[10px] font-bold text-yellow-100 uppercase tracking-wider">{badge.title}</span>
                  </div>
                ))}
                {(!testResult.newBadges || testResult.newBadges.length === 0) && (
                  <span className="text-sm text-gray-400">Keep practicing to earn more badges!</span>
                )}
              </div>
            </GlassCard>

            {/* Actions */}
            <div className="flex justify-center mt-4 gap-4 pb-10">
               {targetTaskId && calculatedMetrics.percentage >= 70 && (
                 <Button onClick={() => navigate("/roadmap")} variant="glow" className="px-8 font-bold">
                   Competency Verified! Return to Roadmap
                 </Button>
               )}
               <Button onClick={() => navigate("/roadmap")} variant="outline" className="px-8 font-bold bg-white/5 border-white/10 hover:bg-white/10 text-white">
                 Back to Roadmap
               </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
