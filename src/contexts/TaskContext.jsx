import React, { createContext, useContext, useState, useEffect } from "react";
import { mockUserData } from "../data/mockData";
import { mockCareers } from "../data/mockCareers";

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
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

    // Initial load: grab tasks from Software Engineering mockCareer
    const track = mockUserData.careerTrack;
    const career = mockCareers.find((c) => c.id === track);
    if (career) {
      // Flatten all stages tasks
      const allTasks = [];
      career.roadmap.stages.forEach((stage) => {
        stage.tasks.forEach((t) => {
          allTasks.push({
            ...t,
            stageId: stage.id,
            stageTitle: stage.title
          });
        });
      });
      return allTasks;
    }
    return [];
  });

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
      const xpNeeded = level * 1000; // Level 1: 1000XP, Level 2: 2000XP, Level 3: 3000XP
      
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
          
          // Trigger related mission completion if it matches
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
    // If completed a task containing "Git & GitHub", complete mission "m3"
    if (taskTitle.toLowerCase().includes("git")) {
      setMissions((prev) =>
        prev.map((m) => (m.id === "m3" && !m.completed ? { ...m, completed: true } : m))
      );
      addXP(80);
    }
  };

  const switchCareerTrack = (trackId) => {
    const career = mockCareers.find((c) => c.id === trackId);
    if (career) {
      setCareerTrack(trackId);
      const allTasks = [];
      career.roadmap.stages.forEach((stage) => {
        stage.tasks.forEach((t) => {
          allTasks.push({
            ...t,
            stageId: stage.id,
            stageTitle: stage.title
          });
        });
      });
      setTasks(allTasks);
      // Reset missions or provide new ones
      setMissions([
        { id: "m1", title: `Explore stage 1 foundation concepts for ${career.title}`, xp: 80, completed: false, category: "Roadmap" },
        { id: "m2", title: `Sync with NOVA for a deep dive interview in ${career.title}`, xp: 100, completed: false, category: "Consulting" },
        { id: "m3", title: `Master the first coding challenges of ${career.title}`, xp: 120, completed: false, category: "Roadmap" }
      ]);
    }
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
