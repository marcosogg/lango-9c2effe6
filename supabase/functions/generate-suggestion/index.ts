import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, messages } = await req.json();

    // If messages array is provided, generate a chat suggestion
    if (messages) {
      const lastMessages = messages.slice(-3); // Get last 3 messages for context
      const prompt = `Based on this conversation, suggest a helpful response:
        ${lastMessages.map(m => `${m.is_user ? 'User' : 'Assistant'}: ${m.content}`).join('\n')}`;

      const openai = new OpenAIApi(
        new Configuration({
          apiKey: Deno.env.get('OPENAI_API_KEY'),
        })
      );

      const completion = await openai.createChatCompletion({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt }
        ],
      });

      const suggestion = completion.data.choices[0].message?.content || "";
      
      return new Response(JSON.stringify({ suggestion }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If topic is provided, generate quiz questions
    if (topic) {
      const openai = new OpenAIApi(
        new Configuration({
          apiKey: Deno.env.get('OPENAI_API_KEY'),
        })
      );

      const prompt = `Generate 10 multiple choice questions about ${topic}. Each question should have one correct answer and three wrong answers. Format the response as a JSON array where each object has the structure: { "question": "...", "correct_answer": "...", "wrong_answers": ["...", "...", "..."] }. Make the questions engaging and fun, suitable for a quiz game. Ensure the wrong answers are plausible but clearly incorrect.`;

      const completion = await openai.createChatCompletion({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant that generates educational content." },
          { role: "user", content: prompt }
        ],
      });

      const response = completion.data.choices[0].message?.content || "";
      console.log("OpenAI response:", response);

      try {
        const questions = JSON.parse(response);
        return new Response(JSON.stringify(questions), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError);
        throw new Error("Failed to parse generated questions");
      }
    }

    throw new Error("Either 'topic' or 'messages' parameter is required");

  } catch (error) {
    console.error("Error in generate-suggestion function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});