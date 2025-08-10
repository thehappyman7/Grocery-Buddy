import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { country, cuisines } = await req.json();

    const prompt = `Generate 6-8 grocery ingredient categories for someone living in ${country} who prefers ${cuisines.join(', ')} cuisine(s).

Return ONLY a JSON array of category objects with this exact format:
[
  {
    "name": "Category Name",
    "description": "Brief description of what this category includes",
    "color": "one of: grocery-orange, grocery-green, grocery-blue, grocery-purple, grocery-red"
  }
]

Make categories relevant to ${country} and ${cuisines.join(', ')} cuisine preferences. Include both staples and specialty items for those cuisines.

Examples:
- For Indian: Pulses & Lentils, Spices & Seasonings, Flours & Grains, etc.
- For Italian: Pasta & Grains, Cheeses & Dairy, Herbs & Seasonings, etc.
- For Mexican: Beans & Legumes, Chiles & Spices, Corn & Tortillas, etc.

Return ONLY the JSON array, no other text.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates grocery categories based on location and cuisine preferences. Always return valid JSON arrays only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    const data = await response.json();
    const categoriesText = data.choices[0].message.content;
    
    // Parse the JSON response
    const categories = JSON.parse(categoriesText);

    return new Response(JSON.stringify({ categories }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-categories function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});