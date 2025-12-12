
// Follow this setup guide to deploy: https://supabase.com/docs/guides/functions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"
import { GoogleGenAI } from "https://esm.sh/@google/genai@1.32.0"

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Authenticate User
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    // 2. Parse Request
    const { fileData, mimeType, options } = await req.json()

    // 3. Initialize Gemini (Server-side key)
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) throw new Error('Missing Gemini API Key')
    
    const ai = new GoogleGenAI({ apiKey });

    // 4. Construct Prompt
    let complexityInstruction = 'Standard detail.';
    if (options.complexity === 'Minimal') complexityInstruction = 'Very concise, bullet points only.';
    if (options.complexity === 'Advanced') complexityInstruction = 'Detailed, include context and nuance.';

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

    // 5. Call AI
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: {
          parts: [
            { inlineData: { mimeType: mimeType, data: fileData } },
            { text: prompt },
          ],
        },
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const flashcards = JSON.parse(text);

    return new Response(JSON.stringify(flashcards), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
