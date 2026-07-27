import mongoose from 'mongoose';

const conversationMemorySchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  summary: { type: String, default: "New user." },
  key_facts: { type: Object, default: {} },
  updated_at: { type: Date, default: Date.now }
});

const chatHistorySchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  sender: { type: String, required: true },
  message: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const assessmentResultSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  answers: { type: Object, required: true },
  analysis: { type: Object, required: true }
});

const careerRecommendationSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  matches: { type: Array, required: true }
});

const roadmapSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  career_id: { type: String, required: true },
  title: { type: String, required: true },
  stages: { type: Array, required: true }
});

const plannerSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  mission_title: { type: String, required: true },
  tip: { type: String, required: true },
  tasks: { type: Array, required: true }
});

// Legacy profile for sync if needed
const userProfileSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  state: { type: Object, default: {} },
  last_active: { type: Date, default: Date.now }
});

export const ConversationMemory = mongoose.model('ConversationMemory', conversationMemorySchema);
export const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);
export const AssessmentResult = mongoose.model('AssessmentResult', assessmentResultSchema);
export const CareerRecommendation = mongoose.model('CareerRecommendation', careerRecommendationSchema);
export const Roadmap = mongoose.model('Roadmap', roadmapSchema);
export const Planner = mongoose.model('Planner', plannerSchema);
export const UserProfile = mongoose.model('UserProfile', userProfileSchema);
