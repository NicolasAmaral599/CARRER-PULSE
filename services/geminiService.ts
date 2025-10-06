
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Assume API_KEY is set in the environment
const API_KEY = process.env.API_KEY;

export const isAiAvailable = !!API_KEY;

let ai: GoogleGenAI | null = null;

if (isAiAvailable) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY as string });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
  }
} else {
  console.warn("API_KEY is not set. AI features will not work.");
}


export const generateSummary = async (input: string): Promise<string> => {
  if (!ai) return "API Key not configured. Please set it up to use AI features.";
  try {
    const prompt = `You are an expert resume writer. Write a professional summary for a ${input}. The summary should be vibrant, passionate, and around 3-4 sentences long, highlighting key skills and experience.`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Failed to generate summary. Please try again.";
  }
};

export const generateExperienceBullet = async (responsibility: string, jobTitle: string): Promise<string> => {
   if (!ai) return "API Key not configured. Please set it up to use AI features.";
  try {
    const prompt = `You are an expert resume writer. Convert the following job responsibility into a single, impactful, and quantifiable resume bullet point.
Job Title: "${jobTitle}"
Responsibility: "${responsibility}"
Focus on action, metrics, and results. Do not use quotes in your response. Return only the generated bullet point.`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.95,
      }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating experience bullet:", error);
    return "Failed to generate suggestion. Please try again.";
  }
};

export const generateSkills = async (jobTitle: string, experience: string): Promise<string[]> => {
  if (!ai) return ["API Key not configured."];
  try {
    const prompt = `Based on the job title "${jobTitle}" and the experience "${experience}", suggest 10 relevant hard and soft skills. Return them as a single comma-separated list. For example: "React.js, Team Leadership, Project Management, Effective Communication"`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text.split(',').map(skill => skill.trim());
  } catch (error)    {
    console.error("Error generating skills:", error);
    return ["Failed to generate skills."];
  }
};
