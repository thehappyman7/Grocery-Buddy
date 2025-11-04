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
  const { location, cuisines, isVegetarian, budget } = await req.json();
  
  const locationText = location?.city 
    ? `${location.city}, ${location.country}` 
    : location?.country || 'general region';

    const vegetarianNote = isVegetarian ? ' This person follows a VEGETARIAN diet, so exclude all non-vegetarian categories like meat, fish, poultry, and their derivatives.' : '';
    
    const prompt = `Generate 6-8 grocery ingredient categories for someone living in ${locationText} who prefers ${cuisines.join(', ')} cuisine(s).${vegetarianNote}

Return ONLY a JSON array of category objects with this exact format:
[
  {
    "name": "Category Name",
    "description": "Brief description of what this category includes",
    "color": "one of: grocery-orange, grocery-green, grocery-blue, grocery-purple, grocery-red"
  }
]

IMPORTANT: The location (${locationText}) should influence:
- Locally available produce and seasonal ingredients
- Regional specialty items commonly found in local markets
- Traditional ingredients specific to that area

The cuisines (${cuisines.join(', ')}) should influence:
- Spices and seasonings typical to these cooking styles
- Staple ingredients used in these cuisines
- Specialty items needed for authentic recipes

Make categories practical and region-specific for ${locationText}.${isVegetarian ? ' Focus on vegetarian ingredients only - no meat, fish, or poultry categories.' : ''}

Examples:
- For Indian: Pulses & Lentils, Spices & Seasonings, Flours & Grains, etc.
- For Italian: Pasta & Grains, Cheeses & Dairy, Herbs & Seasonings, etc.
- For Mexican: Beans & Legumes, Chiles & Spices, Corn & Tortillas, etc.

Return ONLY the JSON array, no other text.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
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
          maxOutputTokens: 800
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ 
        error: "Failed to generate categories. Please try again.",
        categories: [] 
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return new Response(JSON.stringify({ categories: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const categoriesText = data.candidates[0].content.parts[0].text;
    const cleanedJson = categoriesText.replace(/```json\n?|\n?```/g, '').trim();
    const categories = JSON.parse(cleanedJson);

    return new Response(JSON.stringify({ categories }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ categories: [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});