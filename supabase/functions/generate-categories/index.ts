import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { country, cuisines, isVegetarian, budget } = await req.json();

    const vegetarianNote = isVegetarian ? ' This person follows a VEGETARIAN diet, so exclude all non-vegetarian categories like meat, fish, poultry, and their derivatives.' : '';
    
    const prompt = `Generate 6-8 grocery ingredient categories for someone living in ${country} who prefers ${cuisines.join(', ')} cuisine(s).${vegetarianNote}

Return ONLY a JSON array of category objects with this exact format:
[
  {
    "name": "Category Name",
    "description": "Brief description of what this category includes",
    "color": "one of: grocery-orange, grocery-green, grocery-blue, grocery-purple, grocery-red"
  }
]

Make categories relevant to ${country} and ${cuisines.join(', ')} cuisine preferences. Include both staples and specialty items for those cuisines.${isVegetarian ? ' Focus on vegetarian ingredients only - no meat, fish, or poultry categories.' : ''}

Examples:
- For Indian: Pulses & Lentils, Spices & Seasonings, Flours & Grains, etc.
- For Italian: Pasta & Grains, Cheeses & Dairy, Herbs & Seasonings, etc.
- For Mexican: Beans & Legumes, Chiles & Spices, Corn & Tortillas, etc.

Return ONLY the JSON array, no other text.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
          responseMimeType: "application/json"
        }
      }),
    });

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts[0]) {
      throw new Error('Invalid response from Gemini API');
    }
    
    const categoriesText = data.candidates[0].content.parts[0].text;
    
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