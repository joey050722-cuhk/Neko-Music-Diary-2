import { GoogleGenAI, Type } from "@google/genai";
import { OutfitSuggestion, Song } from "../types";

let ai: GoogleGenAI | null = null;
function getAI() {
    if (!ai) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === "undefined") {
            throw new Error("GEMINI_API_KEY is not set. Please configure it in your environment variables.");
        }
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
}

export async function getOutfitSuggestion(song: Song, weather?: string, time?: string, forcedAccessory?: string): Promise<OutfitSuggestion> {
  const accessoryInstruction = forcedAccessory 
    ? `CRITICAL: You MUST use this specific accessory for the cat: "${forcedAccessory}".`
    : `Choose ONE matching accessory for her pet cat from this list: [red_scarf, yellow_hat, pink_bow, cool_sunglasses, green_leaf, flower, headphones, star_glasses, toast, bell].`;

  const prompt = `
    Current Time: ${time || "Unknown"}
    Current Weather Context: ${weather || "Pleasant"}
    Based on the song "${song.title}" by ${song.artist}, which has the mood keywords: ${(song.keywords || []).join(", ")}.
    Provide a "Healing & Cute" (治愈系) outfit suggestion for a girl that fits the current weather and time.
    
    CRITICAL: 
    1. Your suggestion MUST include specific clothing items (e.g., "白色百褶裙", "oversize 连帽衫", "浅色毛衣"). 
    2. Do NOT just give abstract styles like "清新风". Tell her EXACTLY what to wear.
    3. ${accessoryInstruction}
    
    The response must be in JSON format:
    {
      "catAccessory": "string (the ID used)",
      "catAccessoryName": "string (cute name in Chinese, e.g., '治愈红围巾')",
      "humanKeywords": ["string", "string", "string"], (Provide 3 specific style or item keywords)
      "description": "string (A warm, healing description in Chinese including specific clothing pieces and how they fit the song's vibe and weather. Mention the cat's accessory too!)"
    }
  `;

    const aiClient = getAI();
    const response = await aiClient.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            catAccessory: { type: Type.STRING },
            catAccessoryName: { type: Type.STRING },
            humanKeywords: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            description: { type: Type.STRING }
          },
          required: ["catAccessory", "catAccessoryName", "humanKeywords", "description"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
}
