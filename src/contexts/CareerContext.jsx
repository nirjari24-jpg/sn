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
    xp, badges, weakTopics, strongTopics, totalStudyHours, learningStreak, projectsFinished
  });

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
    xp, badges, weakTopics, strongTopics, totalStudyHours, learningStreak, projectsFinished
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
        clearAllData, switchCareer,
        isLoadingState
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
