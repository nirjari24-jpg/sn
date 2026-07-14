import React, { createContext, useContext, useState, useEffect } from "react";

const NovaContext = createContext(null);

export function NovaProvider({ children }) {
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

  const generateAnswer = (userText) => {
    const text = userText.toLowerCase();
    
    if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
      return "Hello! I am standing by to assist with your educational milestones. What technical tracks or portfolios are we mapping out today?";
    }
    
    if (text.includes("git") || text.includes("github")) {
      return "Git is your digital ledger. Here are the core commands to commit to memory:\n\n```bash\n# Initialize a repository\ngit init\n\n# Stage changes for commit\ngit add .\n\n# Commit with a structured message\ngit commit -m \"feat: initialize core routing structure\"\n\n# Push to origin repository\ngit push origin main\n```\nWould you like me to add a Git-related mission to your daily task planner?";
    }

    if (text.includes("glassmorphism") || text.includes("css") || text.includes("tailwind")) {
      return "To achieve our premium Dark Space glassmorphism, use this Tailwind CSS mix:\n\n```html\n<div class=\"bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6\">\n  <!-- Premium Glass Content -->\n</div>\n```\n*This adds background blur, transparent white borders, and soft padding for that expensive SaaS aesthetic.*";
    }

    if (text.includes("salary") || text.includes("money") || text.includes("earn")) {
      return "According to our career matrices, here are the average yields for senior specializations:\n\n| Technical Focus | Average Entry | Growth Rate | Demand Index |\n| :--- | :--- | :--- | :--- |\n| AI & ML Engineering | $142,000 | +35% YoY | Critical |\n| Software Architecture | $135,000 | +22% YoY | High |\n| Product Design (UX) | $98,000 | +18% YoY | High |\n\nWhich of these trajectories fits your personal creative vision?";
    }

    if (text.includes("roadmap") || text.includes("study") || text.includes("learn")) {
      return "Your roadmap is structured into 4 distinct phases:\n1. **Foundation**: Build core scripting and layout logic.\n2. **Specialization**: Master modern React framework components.\n3. **Backend Integration**: Create secure databases and REST/GraphQL APIs.\n4. **Infrastructure & MLOps**: Configure Docker, CI/CD pipelines, and cloud hosting.\n\nGo to the **Roadmap** view in the sidebar to visualize this tree interactive grid!";
    }

    // Default response
    return "Fascinating query. To build momentum, I recommend looking at your **Today's Missions** on the Dashboard or completing the **Career Discovery** assessment to unlock tailored resources. What specific coding language or framework shall we dissect next?";
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate AI response stream
    setTimeout(() => {
      const fullResponse = generateAnswer(text);
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
        currentLength += Math.min(5, fullResponse.length - currentLength);
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
      }, 15);
    }, 1200);
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
