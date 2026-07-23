export const mockCareers = [
  {
    id: "software-engineering",
    title: "Software Engineering",
    description: "Build robust, scalable software applications and systems. Architects of the digital world.",
    growthRate: "+22% Year over Year",
    salary: "$115,000 avg",
    demand: "High",
    matchScore: 95,
    skills: ["JavaScript/TypeScript", "React/Node.js", "System Design", "Databases (SQL/NoSQL)", "Data Structures & Algorithms"],
    roadmap: {
      stages: [
        {
          id: "se-foundation",
          title: "Foundation & Scripting",
          duration: "4 weeks",
          tasks: [
            { id: "se-f1", title: "Master JS Fundamentals & Async Programming", xp: 150, completed: true },
            { id: "se-f2", title: "Learn DOM Manipulation & HTML5/CSS3 Layouts", xp: 100, completed: true },
            { id: "se-f3", title: "Complete Git & GitHub Version Control Guide", xp: 120, completed: false }
          ]
        },
        {
          id: "se-frontend",
          title: "Modern Frontend Frameworks",
          duration: "6 weeks",
          tasks: [
            { id: "se-fe1", title: "Learn React Component Lifecycle & Hooks", xp: 200, completed: false },
            { id: "se-fe2", title: "Integrate React Router & Context API", xp: 150, completed: false },
            { id: "se-fe3", title: "Master State Management & Tailwind Styling", xp: 180, completed: false }
          ]
        },
        {
          id: "se-backend",
          title: "Backend Development & APIs",
          duration: "6 weeks",
          tasks: [
            { id: "se-be1", title: "Build RESTful APIs with Node.js & Express", xp: 220, completed: false },
            { id: "se-be2", title: "Learn Database Modeling (SQL vs MongoDB)", xp: 200, completed: false },
            { id: "se-be3", title: "Implement JWT Authentication & Security Headers", xp: 250, completed: false }
          ]
        },
        {
          id: "se-deployment",
          title: "Deployment & System Design",
          duration: "4 weeks",
          tasks: [
            { id: "se-d1", title: "Dockerize a Full-Stack React Application", xp: 300, completed: false },
            { id: "se-d2", title: "Deploy to AWS/Vercel with CI/CD Pipelines", xp: 280, completed: false },
            { id: "se-d3", title: "Design High Availability Systems & Caching", xp: 350, completed: false }
          ]
        }
      ]
    }
  },
  {
    id: "ai-ml-engineering",
    title: "AI & Machine Learning Engineer",
    description: "Design and implement machine learning models, neural networks, and AI algorithms to solve complex tasks.",
    growthRate: "+35% Year over Year",
    salary: "$142,000 avg",
    demand: "Critical",
    matchScore: 88,
    skills: ["Python", "PyTorch / TensorFlow", "Linear Algebra & Calculus", "NLP / Computer Vision", "MLOps"],
    roadmap: {
      stages: [
        {
          id: "ai-foundation",
          title: "Mathematics & Python Basics",
          duration: "5 weeks",
          tasks: [
            { id: "ai-f1", title: "Learn Python OOP & NumPy/Pandas Libraries", xp: 180, completed: true },
            { id: "ai-f2", title: "Review Probability, Statistics & Linear Algebra", xp: 200, completed: false },
            { id: "ai-f3", title: "Clean & Preprocess Messy Real-world Datasets", xp: 150, completed: false }
          ]
        },
        {
          id: "ai-classical-ml",
          title: "Classical Machine Learning",
          duration: "6 weeks",
          tasks: [
            { id: "ai-ml1", title: "Implement Regression & Decision Tree Classifiers", xp: 220, completed: false },
            { id: "ai-ml2", title: "Evaluate Models using ROC, F1-Score & Accuracy", xp: 180, completed: false },
            { id: "ai-ml3", title: "Deploy Models locally using Flask / FastAPI", xp: 240, completed: false }
          ]
        },
        {
          id: "ai-deep-learning",
          title: "Deep Learning & Neural Nets",
          duration: "7 weeks",
          tasks: [
            { id: "ai-dl1", title: "Build CNNs for Image Recognition in PyTorch", xp: 320, completed: false },
            { id: "ai-dl2", title: "Train RNNs & Transformers for Language Tasks", xp: 350, completed: false },
            { id: "ai-dl3", title: "Fine-tune Large Language Models (LLMs)", xp: 400, completed: false }
          ]
        },
        {
          id: "ai-mlops",
          title: "Production AI & MLOps",
          duration: "4 weeks",
          tasks: [
            { id: "ai-o1", title: "Deploy AI Models to Cloud Container Instances", xp: 350, completed: false },
            { id: "ai-o2", title: "Setup MLflow Model Tracking & Monitoring", xp: 280, completed: false }
          ]
        }
      ]
    }
  },
  {
    id: "product-design",
    title: "Product (UI/UX) Designer",
    description: "Design intuitive interfaces, beautiful user experiences, interactive prototypes, and SaaS design systems.",
    growthRate: "+18% Year over Year",
    salary: "$98,000 avg",
    demand: "Medium-High",
    matchScore: 92,
    skills: ["Figma", "Design Systems", "User Research", "Wireframing & Prototyping", "Interaction Design"],
    roadmap: {
      stages: [
        {
          id: "pd-foundation",
          title: "Design Principles & Tools",
          duration: "3 weeks",
          tasks: [
            { id: "pd-f1", title: "Master Figma Vector Tools & Auto Layout", xp: 120, completed: true },
            { id: "pd-f2", title: "Learn Typography Scale & Color Theory", xp: 100, completed: true },
            { id: "pd-f3", title: "Analyze and Deconstruct Premium UI Layouts", xp: 150, completed: false }
          ]
        },
        {
          id: "pd-research",
          title: "User Research & UX Strategy",
          duration: "5 weeks",
          tasks: [
            { id: "pd-r1", title: "Conduct User Interviews & Build Personas", xp: 180, completed: false },
            { id: "pd-r2", title: "Draft User Flow Diagrams & Information Architecture", xp: 150, completed: false },
            { id: "pd-r3", title: "Perform Usability Testing on Low-Fi Wireframes", xp: 200, completed: false }
          ]
        },
        {
          id: "pd-systems",
          title: "Advanced Design Systems",
          duration: "6 weeks",
          tasks: [
            { id: "pd-s1", title: "Build a Scalable Responsive Figma Component Library", xp: 250, completed: false },
            { id: "pd-s2", title: "Create Interactive Micro-interaction Prototypes", xp: 220, completed: false },
            { id: "pd-s3", title: "Define Design Tokens for Dark & Light Themes", xp: 200, completed: false }
          ]
        },
        {
          id: "pd-handover",
          title: "Developer Handover & Portfolio",
          duration: "4 weeks",
          tasks: [
            { id: "pd-h1", title: "Format Figma Specs and Redlines for Devs", xp: 180, completed: false },
            { id: "pd-h2", title: "Publish 2 Full Case Studies on Behance / Portfolio", xp: 300, completed: false }
          ]
        }
      ]
    }
  }
];

export const assessmentQuestions = [
  {
    id: 1,
    question: "When starting a project, what excites you the most?",
    options: [
      { text: "Architecting the system design, API routes, and database flows", value: "software-engineering" },
      { text: "Training algorithms, working with big data, and predicting patterns", value: "ai-ml-engineering" },
      { text: "Styling the typography, spacing, layouts, and animations", value: "product-design" },
      { text: "Talking to users, coordinating sprints, and defining the vision", value: "product-management" }
    ]
  },
  {
    id: 2,
    question: "Which of the following environments sounds the most rewarding?",
    options: [
      { text: "Writing modular, clean, readable code and debugging logic", value: "software-engineering" },
      { text: "Optimizing statistical formulas, matrices, and tensor grids", value: "ai-ml-engineering" },
      { text: "Polishing Figma prototypes, color schemes, and hover transitions", value: "product-design" },
      { text: "Drafting PRDs, tracking metrics, and writing roadmap goals", value: "product-management" }
    ]
  },
  {
    id: 3,
    question: "How do you prefer to solve problems?",
    options: [
      { text: "Logically: Writing functional steps and automated tests", value: "software-engineering" },
      { text: "Mathematically: Finding statistical relevance and regression curves", value: "ai-ml-engineering" },
      { text: "Visually: Drawing layouts, wireframes, and user journeys", value: "product-design" },
      { text: "Strategically: Aligning team workflows, scopes, and product launch targets", value: "product-management" }
    ]
  }
];
