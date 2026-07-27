import { supabase } from '../config/supabase.js';
import { ai } from '../config/gemini.js';
import { MEMORY_SUMMARIZATION_PROMPT } from '../prompts/systemPrompts.js';

/**
 * Service to manage user memory in Supabase and summarize it using Gemini when it gets too large.
 */
class MemoryService {
  
  async getMemory(userId) {
    const { data, error } = await supabase
      .from('conversation_memory')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching memory:', error);
    }
    
    return data || { summary: "New user.", key_facts: {} };
  }

  async updateMemory(userId, recentContext) {
    const currentMemory = await this.getMemory(userId);
    
    // We only summarize every X interactions in a real prod app to save tokens,
    // but for this implementation we will summarize on important milestones
    // or just append to it. For this hackathon version, let's do a fast AI summarization.

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

      const { error } = await supabase
        .from('conversation_memory')
        .upsert({
          user_id: userId,
          summary: updatedMemory.summary,
          key_facts: updatedMemory.key_facts,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) {
        console.error('Error saving updated memory:', error);
      }
    } catch (err) {
      console.error('Error in memory summarization:', err);
    }
  }

  async saveChatMessage(userId, sender, message) {
    const { error } = await supabase
      .from('chat_history')
      .insert({
        user_id: userId,
        sender,
        message
      });
      
    if (error) console.error('Error saving chat:', error);
  }

  async getChatHistory(userId, limit = 20) {
    const { data, error } = await supabase
      .from('chat_history')
      .select('sender, message, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
    
    // Reverse to chronological order
    return data.reverse().map(row => ({
      role: row.sender === 'user' ? 'user' : 'model',
      parts: [{ text: row.message }]
    }));
  }

  // Fallback function to sync the old big state object if frontend still relies on it
  async syncLegacyState(userId, stateUpdates) {
    // First try to get the profile email (since old table uses email as PK)
    const { data: profile } = await supabase.from('profiles').select('email').eq('id', userId).single();
    if (!profile?.email) return;

    // Get current state
    const { data: oldData } = await supabase.from('user_profiles').select('state').eq('email', profile.email).single();
    
    const currentState = oldData?.state || {};
    const newState = { ...currentState, ...stateUpdates };

    await supabase.from('user_profiles').upsert({
      email: profile.email,
      state: newState,
      last_active: new Date().toISOString()
    });
  }
}

export default new MemoryService();
