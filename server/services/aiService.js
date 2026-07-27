import { ai } from '../config/gemini.js';
import memoryService from '../memory/memoryService.js';
import * as prompts from '../prompts/systemPrompts.js';

class AiService {
  // List of models to try in order of preference
  getModels() {
    return [
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash-lite',
      'gemini-3.0-flash-preview',
      'gemini-3.5-flash',
      'gemini-2.5-flash-lite',
      'gemini-2.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash'
    ];
  }

  async _generateContentWithFallback(requestData) {
    const models = this.getModels();
    let lastError = null;

    for (const modelName of models) {
      try {
        const response = await ai.models.generateContent({
          ...requestData,
          model: modelName
        });
        return response;
      } catch (error) {
        lastError = error;
        // Continue to the next model if it's a 404 or similar error indicating the model isn't available
        console.warn(`Model ${modelName} failed, trying next...`);
      }
    }

    console.error("All models failed.");
    throw lastError || new Error("Failed to generate content with all fallback models.");
  }

  async _generateJsonResponse(prompt, history = []) {
    const contents = [
      ...history,
      { role: 'user', parts: [{ text: prompt }] }
    ];

    const response = await this._generateContentWithFallback({
      contents,
      config: {
        responseMimeType: "application/json",
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      console.error("Failed to parse AI JSON response", response.text);
      throw new Error("Invalid response format from NOVA.");
    }
  }

  async processChat(userId, message) {
    await memoryService.saveChatMessage(userId, 'user', message);

    const memory = await memoryService.getMemory(userId);
    const chatHistory = await memoryService.getChatHistory(userId, 10);

    const contextPrompt = `
      ${prompts.SYSTEM_PERSONA}
      
      USER CONTEXT/MEMORY:
      ${JSON.stringify(memory)}
      
      USER MESSAGE:
      ${message}
      
      Respond in plain text (markdown allowed). Do not respond in JSON for this chat endpoint.
    `;

    const history = chatHistory.slice(0, -1);

    const response = await this._generateContentWithFallback({
      contents: [
        ...history,
        { role: 'user', parts: [{ text: contextPrompt }] }
      ]
    });

    const reply = response.text;
    await memoryService.saveChatMessage(userId, 'nova', reply);

    memoryService.updateMemory(userId, { userMessage: message, novaReply: reply }).catch(e => console.error(e));

    return reply;
  }

  async processAssessmentNext(userId, currentAnswers) {
    const memory = await memoryService.getMemory(userId);

    const prompt = `
      ${prompts.ASSESSMENT_PROMPT}
      
      KNOWN MEMORY:
      ${JSON.stringify(memory)}
      
      CURRENT ASSESSMENT ANSWERS SO FAR:
      ${JSON.stringify(currentAnswers)}
    `;

    return this._generateJsonResponse(prompt);
  }

  async discoverCareers(userId, profileAnalysis) {
    const memory = await memoryService.getMemory(userId);
    const prompt = `
      ${prompts.DISCOVER_CAREERS_PROMPT}
      
      USER PROFILE ANALYSIS:
      ${JSON.stringify(profileAnalysis)}
      
      MEMORY CONTEXT:
      ${JSON.stringify(memory)}
    `;

    return this._generateJsonResponse(prompt);
  }

  async generateRoadmap(userId, careerTitle) {
    const memory = await memoryService.getMemory(userId);
    const prompt = `
      ${prompts.GENERATE_ROADMAP_PROMPT}
      
      TARGET CAREER: ${careerTitle}
      
      MEMORY CONTEXT (Tailor it to their current skill level!):
      ${JSON.stringify(memory)}
    `;

    return this._generateJsonResponse(prompt);
  }

  async generatePlanner(userId, activeRoadmap, xp) {
    const memory = await memoryService.getMemory(userId);
    const prompt = `
      ${prompts.GENERATE_PLANNER_PROMPT}
      
      ACTIVE ROADMAP:
      ${JSON.stringify(activeRoadmap)}
      
      USER XP: ${xp}
      
      MEMORY CONTEXT (Check weak topics to focus on):
      ${JSON.stringify(memory)}
    `;

    return this._generateJsonResponse(prompt);
  }

  async evaluate(userId, stageData, targetTaskTitle, weakTopics, strongTopics) {
    const prompt = `
      ${prompts.EVALUATE_PROMPT}
      
      STAGE DATA:
      ${JSON.stringify(stageData)}
      
      TARGET TASK: ${targetTaskTitle || 'General Stage Review'}
      
      WEAK TOPICS: ${JSON.stringify(weakTopics)}
      STRONG TOPICS: ${JSON.stringify(strongTopics)}
    `;

    return this._generateJsonResponse(prompt);
  }

  async scoreTest(userId, testData, userAnswers) {
    const prompt = `
      ${prompts.SCORE_TEST_PROMPT}
      
      TEST QUESTIONS & CORRECT ANSWERS:
      ${JSON.stringify(testData)}
      
      USER'S SUBMITTED ANSWERS:
      ${JSON.stringify(userAnswers)}
      
      (Note: Evaluate the answers even if they are short text answers, compare them to the explanation/correct option).
    `;

    return this._generateJsonResponse(prompt);
  }
}

export default new AiService();
