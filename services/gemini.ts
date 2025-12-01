// services/gemini.ts

// I have removed the GoogleGenAI import entirely.
// This prevents the "process is not defined" crash on Netlify.

export const DEFAULT_SYSTEM_INSTRUCTION = "AI Chat is disabled.";

export const sendChatMessage = async (
  history: {role: string, text: string}[], 
  newMessage: string,
  systemInstruction: string
) => {
  console.log("AI Chat is currently disabled.");
  return "AI Chat is disabled.";
};