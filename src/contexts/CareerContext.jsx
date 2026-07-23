import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../lib/supabase";

const CareerContext = createContext(null);

export function CareerProvider({ children }) {
  const { user } = useAuth();
  
  // State variables for everything
  const [assessmentProfile, setAssessmentProfile] = useState(null);
  const [recommendedCareers, setRecommendedCareers] = useState([]);
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [testScores, setTestScores] = useState([]);
  const [dailyMission, setDailyMission] = useState(null);
  const [xp, setXp] = useState(0);
  const [badges, setBadges] = useState([]);
  const [weakTopics, setWeakTopics] = useState([]);
  const [strongTopics, setStrongTopics] = useState([]);
  const [totalStudyHours, setTotalStudyHours] = useState(0);
  const [learningStreak, setLearningStreak] = useState(0);
  const [projectsFinished, setProjectsFinished] = useState(0);

  // New Live Intelligence Profile metrics
  const [careerReadiness, setCareerReadiness] = useState(0);
  const [internshipReadiness, setInternshipReadiness] = useState(0);
  const [resumeScore, setResumeScore] = useState(0);
  const [atsScore, setAtsScore] = useState(0);
  const [portfolioScore, setPortfolioScore] = useState(0);
  const [skillConfidence, setSkillConfidence] = useState(0);
  const [weeklyGrowth, setWeeklyGrowth] = useState(0);
  const [monthlyGrowth, setMonthlyGrowth] = useState(0);
  const [riskAreas, setRiskAreas] = useState([]);
  const [nextBestAction, setNextBestAction] = useState("");
  const [estimatedTimeToGoal, setEstimatedTimeToGoal] = useState("");

  const [isLoadingState, setIsLoadingState] = useState(true);

  // Load from backend on mount or when user changes
  useEffect(() => {
    if (!user?.email) {
      setIsLoadingState(false);
      return;
    }
    
    setIsLoadingState(true);
    
    supabase
      .from('user_profiles')
      .select('state')
      .eq('email', user.email)
      .single()
      .then(({ data, error }) => {
        if (error && error.code !== 'PGRST116') {
          console.error("Supabase fetch error:", error);
        }
        if (data && data.state) {
          const dbState = data.state;
          setAssessmentProfile(dbState.assessmentProfile || null);
          setRecommendedCareers(dbState.recommendedCareers || []);
          setActiveRoadmap(dbState.activeRoadmap || null);
          setTestScores(dbState.testScores || []);
          setDailyMission(dbState.dailyMission || null);
          setXp(dbState.xp || 0);
          setBadges(dbState.badges || []);
          setWeakTopics(dbState.weakTopics || []);
          setStrongTopics(dbState.strongTopics || []);
          setTotalStudyHours(dbState.totalStudyHours || 0);
          setLearningStreak(dbState.learningStreak || 0);
          setProjectsFinished(dbState.projectsFinished || 0);

          setCareerReadiness(dbState.careerReadiness || 0);
          setInternshipReadiness(dbState.internshipReadiness || 0);
          setResumeScore(dbState.resumeScore || 0);
          setAtsScore(dbState.atsScore || 0);
          setPortfolioScore(dbState.portfolioScore || 0);
          setSkillConfidence(dbState.skillConfidence || 0);
          setWeeklyGrowth(dbState.weeklyGrowth || 0);
          setMonthlyGrowth(dbState.monthlyGrowth || 0);
          setRiskAreas(dbState.riskAreas || []);
          setNextBestAction(dbState.nextBestAction || "");
          setEstimatedTimeToGoal(dbState.estimatedTimeToGoal || "");
        }
      })
      .catch(err => console.error("Failed to load user state from DB", err))
      .finally(() => setIsLoadingState(false));
  }, [user?.email]);

  // Sync to backend whenever relevant state changes
  const syncStateToDB = useCallback(async (newState) => {
    if (!user?.email) return;
    
    try {
      await supabase
        .from('user_profiles')
        .upsert({ 
          email: user.email, 
          state: newState,
          last_active: new Date().toISOString()
        });
    } catch (err) {
      console.error("Failed to sync state to Supabase", err);
    }
  }, [user?.email]);

  // Helper to get current state snapshot
  const getCurrentStateSnapshot = () => ({
    assessmentProfile, recommendedCareers, activeRoadmap, testScores, dailyMission,
    xp, badges, weakTopics, strongTopics, totalStudyHours, learningStreak, projectsFinished,
    careerReadiness, internshipReadiness, resumeScore, atsScore, portfolioScore, skillConfidence,
    weeklyGrowth, monthlyGrowth, riskAreas, nextBestAction, estimatedTimeToGoal
  });

  useEffect(() => {
    if (!assessmentProfile) return;

    let intReadiness = 0;
    if (activeRoadmap) intReadiness += 20;
    if (projectsFinished > 0) intReadiness += Math.min(40, projectsFinished * 15);
    if (testScores.length > 0) {
      const avgScore = testScores.reduce((acc, curr) => acc + curr.score, 0) / testScores.length;
      if (avgScore > 70) intReadiness += 40;
      else intReadiness += 20;
    }
    setInternshipReadiness(intReadiness);

    const confidence = testScores.length > 0 
      ? Math.round(testScores.reduce((acc, curr) => acc + curr.score, 0) / testScores.length)
      : (assessmentProfile?.analysis?.score || 0);
    setSkillConfidence(confidence);

    setCareerReadiness((assessmentProfile?.analysis?.score || 0) + (activeRoadmap ? 5 : 0));
  }, [activeRoadmap, projectsFinished, testScores, assessmentProfile]);

  // Watch for state changes and sync (using a simple debounce effect is tricky with many variables, 
  // so we'll sync manually on important actions or use an effect)
  useEffect(() => {
    if (!isLoadingState && user?.email) {
      const timeout = setTimeout(() => {
        syncStateToDB(getCurrentStateSnapshot());
      }, 1000); // 1 second debounce
      return () => clearTimeout(timeout);
    }
  }, [
    assessmentProfile, recommendedCareers, activeRoadmap, testScores, dailyMission,
    xp, badges, weakTopics, strongTopics, totalStudyHours, learningStreak, projectsFinished,
    careerReadiness, internshipReadiness, resumeScore, atsScore, portfolioScore, skillConfidence,
    weeklyGrowth, monthlyGrowth, riskAreas, nextBestAction, estimatedTimeToGoal
  ]);

  const clearAllData = () => {
    setAssessmentProfile(null);
    setRecommendedCareers([]);
    setActiveRoadmap(null);
    setTestScores([]);
    setDailyMission(null);
    setXp(0);
    setBadges([]);
    setWeakTopics([]);
    setStrongTopics([]);
    setTotalStudyHours(0);
    setLearningStreak(0);
    setProjectsFinished(0);
    
    setCareerReadiness(0);
    setInternshipReadiness(0);
    setResumeScore(0);
    setAtsScore(0);
    setPortfolioScore(0);
    setSkillConfidence(0);
    setWeeklyGrowth(0);
    setMonthlyGrowth(0);
    setRiskAreas([]);
    setNextBestAction("");
    setEstimatedTimeToGoal("");
  };

  const switchCareer = () => {
    setActiveRoadmap(null);
    setDailyMission(null);
    setTestScores([]);
  };

  const addTestScore = (scoreData) => {
    setTestScores(prev => [...prev, { ...scoreData, date: new Date().toISOString() }]);
    if (scoreData.xpEarned) {
      setXp(prev => prev + scoreData.xpEarned);
    }
    if (scoreData.weakAreas) {
      setWeakTopics(prev => {
        const newSet = new Set([...prev, ...scoreData.weakAreas]);
        return Array.from(newSet).slice(0, 10);
      });
    }
    if (scoreData.strongAreas) {
      setStrongTopics(prev => {
        const newSet = new Set([...prev, ...scoreData.strongAreas]);
        return Array.from(newSet).slice(0, 10);
      });
    }
  };

  const awardBadge = (badge) => {
    if (!badges.find(b => b.id === badge.id)) {
      setBadges(prev => [...prev, badge]);
    }
  };

  return (
    <CareerContext.Provider
      value={{
        assessmentProfile, setAssessmentProfile,
        recommendedCareers, setRecommendedCareers,
        activeRoadmap, setActiveRoadmap,
        testScores, addTestScore,
        dailyMission, setDailyMission,
        xp, setXp,
        badges, awardBadge,
        weakTopics, setWeakTopics,
        strongTopics, setStrongTopics,
        totalStudyHours, setTotalStudyHours,
        learningStreak, setLearningStreak,
        projectsFinished, setProjectsFinished,
        careerReadiness, setCareerReadiness,
        internshipReadiness, setInternshipReadiness,
        resumeScore, setResumeScore,
        atsScore, setAtsScore,
        portfolioScore, setPortfolioScore,
        skillConfidence, setSkillConfidence,
        weeklyGrowth, setWeeklyGrowth,
        monthlyGrowth, setMonthlyGrowth,
        riskAreas, setRiskAreas,
        nextBestAction, setNextBestAction,
        estimatedTimeToGoal, setEstimatedTimeToGoal,
        clearAllData, switchCareer,
        isLoadingState, getCurrentStateSnapshot
      }}
    >
      {children}
    </CareerContext.Provider>
  );
}

export function useCareer() {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error("useCareer must be used within a CareerProvider");
  }
  return context;
}
