
import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { PlantIdentificationResult, ChatMessage } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let chatInstance: Chat | null = null;

const plantSchema = {
  type: Type.OBJECT,
  properties: {
    commonName: { type: Type.STRING, description: 'The common name of the plant.' },
    scientificName: { type: Type.STRING, description: 'The scientific (Latin) name of the plant.' },
    confidenceScore: { type: Type.NUMBER, description: 'A confidence score from 0 to 1 on the identification accuracy.' },
    careGuide: {
      type: Type.OBJECT,
      properties: {
        watering: { type: Type.STRING, description: 'Brief watering instructions.' },
        sunlight: { type: Type.STRING, description: 'Brief sunlight requirements.' },
        soil: { type: Type.STRING, description: 'Brief soil type recommendations.' },
      },
      required: ['watering', 'sunlight', 'soil'],
    },
  },
  required: ['commonName', 'scientificName', 'confidenceScore', 'careGuide'],
};


export async function identifyPlant(base64Image: string, mimeType: string, language: 'en' | 'ar'): Promise<PlantIdentificationResult> {
  const langPrompt = language === 'ar' 
    ? "قم بالرد باللغة العربية." 
    : "Respond in English.";

  const prompt = `Identify the plant in this image. Provide its common and scientific names, a confidence score for your identification, and a brief care guide covering watering, sunlight, and soil. ${langPrompt}`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: mimeType } },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: plantSchema,
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    // Ensure minimum confidence score
    if (result.confidenceScore < 0.75) {
       throw new Error("Could not identify the plant with high confidence.");
    }

    return result as PlantIdentificationResult;

  } catch (error) {
    console.error("Error identifying plant:", error);
    throw new Error("Failed to identify the plant. The AI model could not process the request.");
  }
}


export function startChatSession(systemInstruction: string): void {
  chatInstance = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: { systemInstruction: systemInstruction },
  });
}

export async function sendMessage(message: string): Promise<string> {
  if (!chatInstance) {
    throw new Error("Chat session not initialized. Call startChatSession first.");
  }
  try {
    const response = await chatInstance.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw new Error("Failed to get a response from the assistant.");
  }
}
