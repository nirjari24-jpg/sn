import aiService from '../services/aiService.js';
import memoryService from '../memory/memoryService.js';

export const chat = async (req, res) => {
  try {
    const { message, systemContext } = req.body;
    
    // Optionally update legacy state if sent
    if (systemContext) {
      const parsedContext = typeof systemContext === 'string' ? JSON.parse(systemContext) : systemContext;
      await memoryService.syncLegacyState(req.userId, parsedContext);
    }
    
    const reply = await aiService.processChat(req.userId, message);
    res.json({ reply });
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ error: 'Failed to process chat' });
  }
};

export const assessmentNext = async (req, res) => {
  try {
    // The frontend sends `answers: { "Q": "A" }`
    const { answers } = req.body;
    const response = await aiService.processAssessmentNext(req.userId, answers);
    
    // If completed, save the profile to Supabase assessment_results
    if (response.isComplete && response.profileAnalysis) {
      const { supabase } = await import('../config/supabase.js');
      await supabase.from('assessment_results').upsert({
        user_id: req.userId,
        answers,
        analysis: response.profileAnalysis
      }, { onConflict: 'user_id' });
    }
    
    res.json(response);
  } catch (error) {
    console.error('Assessment Error:', error);
    res.status(500).json({ error: 'Failed to process assessment' });
  }
};

export const discover = async (req, res) => {
  try {
    const { profile } = req.body;
    const response = await aiService.discoverCareers(req.userId, profile);
    
    // Save to career_recommendations
    const { supabase } = await import('../config/supabase.js');
    await supabase.from('career_recommendations').upsert({
      user_id: req.userId,
      matches: response.matches
    }, { onConflict: 'user_id' });
    
    res.json(response);
  } catch (error) {
    console.error('Discover Error:', error);
    res.status(500).json({ error: 'Failed to discover careers' });
  }
};

export const roadmap = async (req, res) => {
  try {
    const { careerId, careerTitle } = req.body;
    const response = await aiService.generateRoadmap(req.userId, careerTitle || 'Technology');
    
    // Save to roadmaps
    const { supabase } = await import('../config/supabase.js');
    await supabase.from('roadmaps').insert({
      user_id: req.userId,
      career_id: careerId,
      title: response.title || careerTitle,
      stages: response.stages
    });
    
    res.json(response);
  } catch (error) {
    console.error('Roadmap Error:', error);
    res.status(500).json({ error: 'Failed to generate roadmap' });
  }
};

export const planner = async (req, res) => {
  try {
    const { activeRoadmap, xp } = req.body;
    const response = await aiService.generatePlanner(req.userId, activeRoadmap, xp);
    
    const { supabase } = await import('../config/supabase.js');
    await supabase.from('planner').insert({
      user_id: req.userId,
      mission_title: response.missionTitle,
      tip: response.tip,
      tasks: response.tasks
    });

    res.json(response);
  } catch (error) {
    console.error('Planner Error:', error);
    res.status(500).json({ error: 'Failed to generate planner' });
  }
};

export const evaluate = async (req, res) => {
  try {
    const { stage, targetTaskTitle, weakTopics, strongTopics } = req.body;
    const response = await aiService.evaluate(req.userId, stage, targetTaskTitle, weakTopics, strongTopics);
    res.json(response);
  } catch (error) {
    console.error('Evaluate Error:', error);
    res.status(500).json({ error: 'Failed to generate test' });
  }
};

export const score = async (req, res) => {
  try {
    const { test, answers } = req.body;
    const response = await aiService.scoreTest(req.userId, test, answers);
    
    // Optional: save to mock_interviews or learning_progress
    
    res.json(response);
  } catch (error) {
    console.error('Score Error:', error);
    res.status(500).json({ error: 'Failed to score test' });
  }
};
