import React, { createContext, useContext, useState, useEffect } from "react";
import { mockUserData } from "../data/mockData";
import { useCareer } from "./CareerContext";

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const { activeRoadmap } = useCareer();

  const [xp, setXp] = useState(() => {
    const val = localStorage.getItem("skillnova_xp");
    return val ? parseInt(val) : mockUserData.currentXP;
  });

  const [level, setLevel] = useState(() => {
    const val = localStorage.getItem("skillnova_level");
    return val ? parseInt(val) : mockUserData.level;
  });

  const [careerTrack, setCareerTrack] = useState(() => {
    return localStorage.getItem("skillnova_career_track") || mockUserData.careerTrack;
  });

  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem("skillnova_tasks");
    if (stored) return JSON.parse(stored);
    return [];
  });

  // Whenever activeRoadmap changes, re-sync tasks if it's empty or we want to reset
  useEffect(() => {
    if (activeRoadmap && activeRoadmap.stages) {
      const stored = localStorage.getItem("skillnova_tasks");
      const currentTasks = stored ? JSON.parse(stored) : [];
      
      // If we have an active roadmap but no tasks for it, or if the user generated a new roadmap
      // we need to create tasks. A simple way is to check if our current tasks match the roadmap.
      const allNewTasks = [];
      activeRoadmap.stages.forEach((stage) => {
        stage.tasks.forEach((t) => {
          // See if we already have progress for this task
          const existing = currentTasks.find(oldT => oldT.id === t.id);
          allNewTasks.push({
            ...t,
            stageId: stage.id,
            stageTitle: stage.title,
            completed: existing ? existing.completed : false,
            xp: t.xp || 100
          });
        });
      });
      setTasks(allNewTasks);
    }
  }, [activeRoadmap]);

  const [missions, setMissions] = useState(() => {
    const stored = localStorage.getItem("skillnova_missions");
    return stored ? JSON.parse(stored) : mockUserData.missions;
  });

  const [levelUpNotification, setLevelUpNotification] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("skillnova_xp", xp.toString());
    localStorage.setItem("skillnova_level", level.toString());
    localStorage.setItem("skillnova_tasks", JSON.stringify(tasks));
    localStorage.setItem("skillnova_missions", JSON.stringify(missions));
    localStorage.setItem("skillnova_career_track", careerTrack);
  }, [xp, level, tasks, missions, careerTrack]);

  // Check level progression
  const addXP = (amount) => {
    setXp((prevXP) => {
      const nextXP = prevXP + amount;
      const xpNeeded = level * 1000;
      
      if (nextXP >= xpNeeded) {
        setLevel((prevLvl) => prevLvl + 1);
        setLevelUpNotification(true);
        setTimeout(() => setLevelUpNotification(false), 5000);
        return nextXP - xpNeeded;
      }
      return nextXP;
    });
  };

  const toggleTask = (taskId) => {
    let xpEarned = 0;
    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id === taskId) {
          const completedState = !t.completed;
          xpEarned = completedState ? t.xp : -t.xp;
          
          if (completedState) {
            checkMissionRelation(t.title);
          }
          
          return { ...t, completed: completedState };
        }
        return t;
      })
    );

    if (xpEarned !== 0) {
      addXP(xpEarned);
    }
  };

  const addTask = (title, xpValue = 100, stageId = "custom", stageTitle = "Personal Mission") => {
    const newId = `task-${Date.now()}`;
    const newTask = {
      id: newId,
      title,
      xp: xpValue,
      completed: false,
      stageId,
      stageTitle
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleMission = (missionId) => {
    let xpEarned = 0;
    setMissions((prevMissions) =>
      prevMissions.map((m) => {
        if (m.id === missionId) {
          const completedState = !m.completed;
          xpEarned = completedState ? m.xp : -m.xp;
          return { ...m, completed: completedState };
        }
        return m;
      })
    );
    if (xpEarned !== 0) {
      addXP(xpEarned);
    }
  };

  const checkMissionRelation = (taskTitle) => {
    if (taskTitle.toLowerCase().includes("git")) {
      setMissions((prev) =>
        prev.map((m) => (m.id === "m3" && !m.completed ? { ...m, completed: true } : m))
      );
      addXP(80);
    }
  };

  const switchCareerTrack = (trackId) => {
    setCareerTrack(trackId);
    // Since we rely on activeRoadmap for the tasks now, the actual task switching
    // will happen when activeRoadmap is updated via the CareerContext/API.
    setMissions([
      { id: "m1", title: `Explore foundation concepts for ${trackId}`, xp: 80, completed: false, category: "Roadmap" },
      { id: "m2", title: `Sync with NOVA for a deep dive interview in ${trackId}`, xp: 100, completed: false, category: "Consulting" },
      { id: "m3", title: `Master the first coding challenges of ${trackId}`, xp: 120, completed: false, category: "Roadmap" }
    ]);
  };

  return (
    <TaskContext.Provider
      value={{
        xp,
        level,
        tasks,
        missions,
        careerTrack,
        levelUpNotification,
        setLevelUpNotification,
        toggleTask,
        addTask,
        toggleMission,
        switchCareerTrack
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}

