import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('⚠️ Gemini API Key is missing. AI operations will fail.');
}

export const ai = new GoogleGenAI({
  apiKey: apiKey || 'dummy-key',
});
