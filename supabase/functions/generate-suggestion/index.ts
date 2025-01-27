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
    console.log('Received request with topic:', topic);
    console.log('Messages:', messages);

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
          content: "You are a helpful assistant. Based on the conversation context, suggest a relevant and engaging message that the user could send next. Keep suggestions concise, natural, and contextually appropriate."
        },
        {
          role: "user",
          content: `Based on this topic: "${topic}" and these previous messages: ${JSON.stringify(messages)}, suggest a natural next message the user could send. Keep it concise and conversational.`
        }
      ],
    });

    const suggestion = completion.data.choices[0].message?.content;
    console.log('Generated suggestion:', suggestion);

    if (!suggestion) {
      throw new Error('No suggestion generated');
    }

    return new Response(
      JSON.stringify({ suggestion }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
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