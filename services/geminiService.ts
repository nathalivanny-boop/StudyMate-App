
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function summarizeNote(content: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize the following study notes concisely into key bullet points:\n\n${content}`,
    });
    return response.text || "Failed to generate summary.";
  } catch (error) {
    console.error("Summary generation error:", error);
    return "An error occurred while summarizing.";
  }
}

export async function generateQuiz(content: string): Promise<QuizQuestion[]> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a 5-question multiple choice quiz based on the following notes. Return the result in JSON format. \n\nNOTES: ${content}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              correctAnswer: { 
                type: Type.INTEGER,
                description: "The index of the correct option (0-3)"
              }
            },
            required: ["question", "options", "correctAnswer"]
          }
        }
      }
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Quiz generation error:", error);
    return [];
  }
}

export async function getStudyAdvice(subject: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide three practical study tips specifically for the subject: ${subject}.`,
    });
    return response.text || "Focus and persistence are key!";
  } catch (error) {
    return "Keep studying hard!";
  }
}

/**
 * Real-Time Conversational Sync Engine (WhatsApp Style)
 * Rules: Mirror length, casual persona, no assumptions, max 3 sentences.
 */
export async function getChatResponse(history: ChatMessage[], identity: string, groupContext?: string): Promise<string> {
  try {
    const lastUserMessage = history.filter(m => m.sender === 'me').pop()?.text || "";
    
    const systemInstruction = `You are a Real-Time Chat Engine acting as ${identity}, a student peer. 
    Speak exactly like you are texting on WhatsApp.

    CORE BEHAVIORAL RULES:
    1. DYNAMIC SCALING: Match the length of the user's message. If they say "hey", you say "hey!". If they send a sentence, send one back.
    2. WHATSAPP PERSONA: Use casual language, occasional lowercase, and keep it human. Avoid perfect punctuation. (e.g., "sounds good", "ya for sure", "idk yet").
    3. CONTEXTUAL MEMORY: Use the provided history to stay logical. If they ask about something mentioned 2 texts ago, you know what it is.
    4. NO ASSUMPTIONS: Do NOT bring up studies, modules, or complex topics (like behavioral economics) unless the user mentions them first in this message.
    5. OUTPUT LIMIT: Strictly keep responses under 3 sentences. Most should be 1 sentence or a few words.
    6. GROUP CONTEXT: ${groupContext ? `You're in the "${groupContext}" group chat.` : 'This is a private 1-on-1 chat.'}

    CRITICAL: Never admit you are an AI. Never offer "help" like a bot. Just talk like a friend.`;

    const contents = history.map(m => ({
      role: m.sender === 'me' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    if (contents.length === 0) {
      contents.push({ role: 'user', parts: [{ text: 'hey' }] });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.9, // Higher for more natural/unpredictable human-like speech
        maxOutputTokens: 100,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    // Final safety: Force lowercase for "human" feel if short
    let text = response.text || "yo";
    if (text.length < 20 && Math.random() > 0.5) {
      text = text.toLowerCase();
    }

    return text;
  } catch (error) {
    console.error("Sync Engine Error:", error);
    return "signal is bad here, wait";
  }
}
