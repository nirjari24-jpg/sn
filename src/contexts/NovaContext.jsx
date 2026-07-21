import React, { createContext, useContext, useState, useEffect } from "react";
import { useCareer } from "./CareerContext";

const NovaContext = createContext(null);

export function NovaProvider({ children }) {
  const { 
    activeRoadmap, assessmentProfile, testScores, dailyMission, 
    xp, badges, weakTopics, strongTopics, totalStudyHours, 
    learningStreak, projectsFinished 
  } = useCareer();
  
  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem("skillnova_messages");
    if (stored) return JSON.parse(stored);

    return [
      {
        id: "welcome",
        sender: "nova",
        text: "Greetings, cadet. I am **NOVA**, your AI Career Architect. I am initialized and ready to chart your trajectory. Ask me anything about skills, roadmaps, or interview prep.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    localStorage.setItem("skillnova_messages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Keep track of the current messages to use as history
    const currentMessages = [...messages];

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const history = currentMessages.map(m => ({ role: m.sender === 'user' ? 'user' : 'nova', content: m.text }));
      
      let systemContext = "";
      if (activeRoadmap) systemContext += `Current Roadmap: ${activeRoadmap.title}. Progress: ${xp} XP. `;
      if (assessmentProfile) systemContext += `User Profile: Technical Level is ${assessmentProfile.technicalLevel}, Learning Style is ${assessmentProfile.learningStyle}. `;
      if (dailyMission) systemContext += `Today's Mission: ${dailyMission.missionTitle}. `;
      if (testScores.length > 0) systemContext += `Latest Test Score: ${testScores[testScores.length - 1].score}%. `;
      if (weakTopics.length > 0) systemContext += `Weak Topics to focus on: ${weakTopics.join(', ')}. `;
      if (strongTopics.length > 0) systemContext += `Strong Topics mastered: ${strongTopics.join(', ')}. `;
      if (projectsFinished > 0) systemContext += `Projects Completed: ${projectsFinished}. `;
      if (learningStreak > 0) systemContext += `Current Learning Streak: ${learningStreak} days. `;
      if (badges.length > 0) systemContext += `Earned Badges: ${badges.map(b => b.title).join(', ')}. `;

      const res = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history, systemContext })
      });
      
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      const fullResponse = data.reply || "No response generated.";
      
      const systemMsgId = `nova-${Date.now()}`;
      const systemMsg = {
        id: systemMsgId,
        sender: "nova",
        text: "",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages((prev) => [...prev, systemMsg]);
      setIsTyping(false);

      // Stream text chunk by chunk
      let currentLength = 0;
      const interval = setInterval(() => {
        currentLength += Math.min(10, fullResponse.length - currentLength);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === systemMsgId
              ? { ...msg, text: fullResponse.slice(0, currentLength) }
              : msg
          )
        );

        if (currentLength >= fullResponse.length) {
          clearInterval(interval);
        }
      }, 10);

    } catch (err) {
      console.error("NOVA AI Error:", err);
      setIsTyping(false);
      setMessages((prev) => [...prev, {
        id: `nova-${Date.now()}`,
        sender: "nova",
        text: "Error communicating with NOVA AI Server. Please ensure the backend server and Ollama are running.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  const clearChat = () => {
    const welcome = [
      {
        id: "welcome",
        sender: "nova",
        text: "NOVA conversation history flushed. System re-initialized. Ready for career queries.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setMessages(welcome);
  };

  return (
    <NovaContext.Provider
      value={{
        messages,
        isTyping,
        sendMessage,
        clearChat
      }}
    >
      {children}
    </NovaContext.Provider>
  );
}

export function useNova() {
  const context = useContext(NovaContext);
  if (!context) {
    throw new Error("useNova must be used within a NovaProvider");
  }
  return context;
}

