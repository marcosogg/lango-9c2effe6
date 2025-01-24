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
    const { topic, count = 10 } = await req.json();
    console.log('Received request with topic:', topic);

    if (!topic) {
      throw new Error('Topic is required');
    }

    const openai = new OpenAIApi(
      new Configuration({
        apiKey: Deno.env.get('OPENAI_API_KEY'),
      })
    );

    console.log('Sending request to OpenAI...');
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates educational quiz questions."
        },
        {
          role: "user",
          content: `Generate ${count} multiple choice questions about ${topic}. Format your response as a JSON array where each object has the structure: { "question": "...", "correct_answer": "...", "wrong_answers": ["...", "...", "..."] }. Make the questions engaging and educational.`
        }
      ],
    });

    const response = completion.data.choices[0].message?.content;
    console.log('Received response from OpenAI');

    if (!response) {
      throw new Error('No response from OpenAI');
    }

    try {
      const questions = JSON.parse(response);
      console.log('Successfully parsed questions');
      
      return new Response(JSON.stringify(questions), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error('Failed to parse generated questions');
    }
  } catch (error) {
    console.error('Error in generate-suggestion function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});