import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export const getVisionModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

export const getTextModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};
