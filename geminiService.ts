
import { GoogleGenAI, Type } from "@google/genai";
import { Song, RecommendationResponse } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMusicRecommendations = async (theme: string): Promise<RecommendationResponse> => {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are a professional music curator specialized in commute playlists (subway, bus).
    Your task is to recommend exactly 7 songs based on the user's provided theme or genre.
    
    CRITICAL RULES:
    1. Provide exactly 7 songs.
    2. Ratio: 5 songs must be Korean (K-Pop, K-Indie, K-Ballad, etc.) and 2 songs must be International (Western Pop, J-Pop, etc.). This ensures roughly a 70:30 ratio.
    3. The songs should be suitable for a commute environment (energetic enough to wake up, or relaxing enough for a peaceful ride).
    4. Provide the response in JSON format.
    5. The "reason" for recommendation should be in Korean.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: `Theme: ${theme}`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          themeDescription: {
            type: Type.STRING,
            description: "A short catchy description of today's commute playlist in Korean."
          },
          songs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                artist: { type: Type.STRING },
                isKorean: { type: Type.BOOLEAN },
                reason: { type: Type.STRING, description: "One sentence why this fits the commute in Korean." },
                genre: { type: Type.STRING }
              },
              required: ["title", "artist", "isKorean", "reason", "genre"]
            }
          }
        },
        required: ["songs", "themeDescription"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as RecommendationResponse;
};
