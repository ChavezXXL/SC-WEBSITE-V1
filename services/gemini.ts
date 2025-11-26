
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// NOTE: In a real environment, ensure process.env.API_KEY is set.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Default instruction if none provided
export const DEFAULT_SYSTEM_INSTRUCTION = `
You are the "Precision AI Consultant" for SC Precision Deburring. 
Your goal is to help potential customers understand metal finishing processes and guide them to the right service.

Here is the core knowledge base about SC Precision Deburring services:
1. Microscope Deburring: High-magnification (10x-50x) finishing for removing micron-level burrs. Essential for critical aerospace, medical, and fluid control components.
2. Manual Deburring: Expert craftsmanship using precision hand tools. Best for complex geometries, internal passages, and intersecting holes.
3. Blending: Seamless merging of surfaces to remove tool marks and mismatch.
4. Sand Blasting: Surface texturing and cleaning using abrasive media. Good for matte finishes and coating prep.

Tone: Professional, Technical, Helpful, Concise. Like a SpaceX engineer explaining a rocket part.
If asked about pricing, suggest they use the "Request Quote" form as it depends on volume and part complexity.
`;

export const sendChatMessage = async (
  history: {role: string, text: string}[], 
  newMessage: string,
  systemInstruction: string = DEFAULT_SYSTEM_INSTRUCTION
) => {
  try {
    const model = 'gemini-2.5-flash'; 
    
    // Construct the chat history for the API
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
      },
      history: history.map(h => ({
        role: h.role as 'user' | 'model',
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
