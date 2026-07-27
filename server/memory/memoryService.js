import { ai } from '../config/gemini.js';
import { MEMORY_SUMMARIZATION_PROMPT } from '../prompts/systemPrompts.js';
import { ConversationMemory, ChatHistory, UserProfile } from '../models/schemas.js';
import User from '../models/User.js';

/**
 * Service to manage user memory in MongoDB and summarize it using Gemini when it gets too large.
 */
class MemoryService {
  
  async getMemory(userId) {
    try {
      const data = await ConversationMemory.findOne({ user_id: userId });
      return data || { summary: "New user.", key_facts: {} };
    } catch (error) {
      console.error('Error fetching memory:', error);
      return { summary: "New user.", key_facts: {} };
    }
  }

  async updateMemory(userId, recentContext) {
    const currentMemory = await this.getMemory(userId);
    
    try {
      const prompt = `
        ${MEMORY_SUMMARIZATION_PROMPT}
        
        CURRENT MEMORY:
        ${JSON.stringify(currentMemory)}
        
        RECENT CONTEXT/CONVERSATION:
        ${JSON.stringify(recentContext)}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const resultText = response.text();
      let updatedMemory;
      try {
        updatedMemory = JSON.parse(resultText);
      } catch (e) {
        console.error("Failed to parse memory JSON:", resultText);
        return;
      }

      await ConversationMemory.findOneAndUpdate(
        { user_id: userId },
        {
          summary: updatedMemory.summary,
          key_facts: updatedMemory.key_facts,
          updated_at: new Date()
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error('Error in memory summarization:', err);
    }
  }

  async saveChatMessage(userId, sender, message) {
    try {
      await ChatHistory.create({
        user_id: userId,
        sender,
        message
      });
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  }

  async getChatHistory(userId, limit = 20) {
    try {
      const data = await ChatHistory.find({ user_id: userId })
        .sort({ created_at: -1 })
        .limit(limit);
      
      // Reverse to chronological order
      return data.reverse().map(row => ({
        role: row.sender === 'user' ? 'user' : 'model',
        parts: [{ text: row.message }]
      }));
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  }

  // Fallback function to sync the old big state object if frontend still relies on it
  async syncLegacyState(userId, stateUpdates) {
    try {
      const profile = await User.findById(userId);
      if (!profile?.email) return;

      const oldData = await UserProfile.findOne({ email: profile.email });
      const currentState = oldData?.state || {};
      const newState = { ...currentState, ...stateUpdates };

      await UserProfile.findOneAndUpdate(
        { email: profile.email },
        {
          state: newState,
          last_active: new Date()
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('Error syncing legacy state:', error);
    }
  }
}

export default new MemoryService();
