export const mockUserData = {
  name: "Alex Mercer",
  email: "alex@skillnova.ai",
  level: 3,
  currentXP: 1450,
  nextLevelXP: 2500,
  careerTrack: "software-engineering", // default matching career
  achievements: [
    { id: "first-step", title: "Ignition", description: "Completed your first daily learning mission.", xp: 100, icon: "Zap", unlocked: true },
    { id: "pathfinder", title: "Pathfinder", description: "Completed the Career Discovery assessment.", xp: 150, icon: "Compass", unlocked: true },
    { id: "consistent", title: "Orbit Streak", description: "Maintained a 5-day task logging streak.", xp: 250, icon: "Flame", unlocked: false },
    { id: "nova-master", title: "Nebula Sync", description: "Had your first intensive consulting session with NOVA.", xp: 150, icon: "Cpu", unlocked: true },
    { id: "expert-coder", title: "Code Master", description: "Successfully finished Stage 1 of the Software Engineering roadmap.", xp: 500, icon: "Code", unlocked: false }
  ],
  missions: [
    { id: "m1", title: "Log 45 minutes of active study on Git fundamentals", xp: 80, completed: false, category: "Roadmap" },
    { id: "m2", title: "Ask NOVA about 'How to implement glassmorphism in React'", xp: 50, completed: false, category: "Consulting" },
    { id: "m3", title: "Complete Git & GitHub Version Control Guide task", xp: 120, completed: false, category: "Roadmap" }
  ],
  milestones: [
    { week: "Mon", xp: 120 },
    { week: "Tue", xp: 240 },
    { week: "Wed", xp: 180 },
    { week: "Thu", xp: 320 },
    { week: "Fri", xp: 200 },
    { week: "Sat", xp: 290 },
    { week: "Sun", xp: 100 }
  ]
};

export const motivationalQuotes = [
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Make it simple, but significant.", author: "Don Draper" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "The details are not the details. They make the design.", author: "Charles Eames" }
];
