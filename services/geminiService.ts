
import { GoogleGenAI, Type } from "@google/genai";
import { Flashcard, UploadedFile, GenerateOptions } from "../types";
import { supabase } from "./supabaseClient";

// Initialize the client (Client-side Fallback)
// API Key is injected via process.env.API_KEY
// Note: In production, ensuring the Edge Function is deployed hides this key from the browser.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MAX_RETRIES = 2; // Reduced for speed
const RETRY_DELAY_MS = 1000; // Reduced for speed

export const generateFlashcards = async (
  file: UploadedFile,
  options: GenerateOptions,
  abortSignal?: AbortSignal
): Promise<Flashcard[]> => {
  
  // --- STRATEGY 1: SERVER-SIDE (SECURE) ---
  // Try to generate using Supabase Edge Function to keep API keys hidden.
  if (supabase) {
      try {
          // Check if we are in a production-like environment or just prefer server-side
          const { data, error } = await supabase.functions.invoke('generate-flashcards', {
              body: {
                  fileData: file.data,
                  mimeType: file.mimeType,
                  options: options
              }
          });

          if (!error && data) {
              return data as Flashcard[];
          }
          
          // If 404 (Function not found) or other error, we log and proceed to fallback
          // This allows the app to work in 'Dev Mode' without deploying functions
          const msg = error?.message || JSON.stringify(error);
          if (!msg.includes("Failed to send a request")) {
             console.warn("Edge function generation failed, attempting client-side fallback.", error);
          }
      } catch (err) {
          // Silent catch to allow fallback
          // console.warn("Edge function invocation error:", err);
      }
  }

  // --- STRATEGY 2: CLIENT-SIDE (FALLBACK) ---
  
  if (abortSignal?.aborted) throw new Error("Generation cancelled by user.");

  // Concise complexity instruction to save tokens/time
  let complexityInstruction = 'Standard detail.';
  if (options.complexity === 'Minimal') complexityInstruction = 'Very concise, bullet points only.';
  if (options.complexity === 'Advanced') complexityInstruction = 'Detailed, include context and nuance.';

  // If manualContext is present (Pro feature), we instruct the model to focus ONLY on that.
  let contextInstruction = `Task: Generate ${options.count} flashcards from the document.`;
  if (options.manualContext && options.manualContext.trim().length > 0) {
      contextInstruction = `Task: Generate ${options.count} flashcards specifically from the following excerpt provided by the user, using the document as background context only if necessary: "${options.manualContext}".`;
  }

  const prompt = `
      ${contextInstruction}
      Focus: ${options.focus || 'Key concepts'}.
      Detail: ${complexityInstruction}
      
      Output JSON ONLY. Array of objects: { question, answer, difficulty }.
      
      Rules:
      1. Block Math: $$ E=mc^2 $$
      2. Inline Math: $ x $
      3. No hallucination.
    `;

  let lastError: any;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    if (abortSignal?.aborted) throw new Error("Generation cancelled by user.");

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash", // Fastest model
        contents: {
          parts: [
            { inlineData: { mimeType: file.mimeType, data: file.data } },
            { text: prompt },
          ],
        },
        config: {
          responseMimeType: "application/json",
          // Lower temperature for faster, deterministic output
          temperature: 0.3, 
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING },
                difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
              },
              required: ["question", "answer", "difficulty"],
            },
          },
        },
      });

      const text = response.text;
      if (!text) throw new Error("No response.");

      return JSON.parse(text) as Flashcard[];

    } catch (error: any) {
      console.warn(`Attempt ${attempt} failed:`, error);
      lastError = error;
      
      if (error.name === 'AbortError' || abortSignal?.aborted) {
          throw new Error("Generation cancelled by user.");
      }
      
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  }

  throw lastError || new Error("Failed to generate. Please try again.");
};

export const createSupportChat = () => {
  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: `You are Quantum, the FlashAI support agent. concise, helpful.`,
    }
  });
};
