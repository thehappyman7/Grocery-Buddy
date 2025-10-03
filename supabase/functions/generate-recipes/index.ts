import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecipeRequest {
  type: 'quick' | 'trending' | 'seasonal' | 'category';
  filters: {
    isVegetarian: boolean;
    cuisine: string;
    budget: number;
  };
  category?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, filters, category }: RecipeRequest = await req.json();
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      console.error('LOVABLE_API_KEY not configured');
      throw new Error('AI service not configured');
    }

    // Build prompt based on request type
    let prompt = '';
    const dietaryRestriction = filters.isVegetarian ? 'vegetarian' : 'any dietary preference';
    const cuisineFilter = filters.cuisine === 'all' ? 'any cuisine' : `${filters.cuisine} cuisine`;
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentSeason = getCurrentSeason();

    switch (type) {
      case 'quick':
        prompt = `Give me 5 quick recipes that can be prepared under 20 minutes for ${dietaryRestriction} diet and ${cuisineFilter}. List only ingredient names (no measurements).`;
        break;
      case 'trending':
        prompt = `Give me 5 currently trending grocery recipes for ${dietaryRestriction} diet and ${cuisineFilter}. List only ingredient names (no measurements).`;
        break;
      case 'seasonal':
        prompt = `Give me 5 seasonal recipes based on currently available vegetables and fruits for ${currentMonth} (${currentSeason} season), ${dietaryRestriction} diet and ${cuisineFilter}. List only ingredient names (no measurements).`;
        break;
      case 'category':
        prompt = `Give me 5 recipes in the category "${category}" for ${dietaryRestriction} diet and ${cuisineFilter}. List only ingredient names (no measurements).`;
        break;
    }

    prompt += `

Return a JSON array of exactly 5 recipe objects with this structure:
{
  "id": "unique_id",
  "name": "Recipe Name",
  "cuisine": "Indian/Italian/Chinese/Mexican/International",
  "cookingTime": number_in_minutes,
  "difficulty": "Easy/Medium/Hard",
  "image": "https://source.unsplash.com/400x300/?food,recipe-name",
  "ingredients": ["ingredient1", "ingredient2", "ingredient3"],
  "instructions": ["step1", "step2", "step3"],
  "tags": ["tag1", "tag2", "tag3"]
}

Make sure:
- Each recipe has 6-10 realistic ingredients (NAMES ONLY, no measurements)
- Cooking times are accurate and varied
- Instructions are brief but clear (3-5 steps)
- Use diverse cuisines and cooking methods
- Images use realistic food keywords
- Tags describe the dish characteristics
- All recipes are practical and achievable

Return only the JSON array, no other text.`;

    console.log(`Calling Lovable AI Gateway for ${type} recipes...`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful recipe assistant. You generate practical, delicious recipes in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      if (response.status === 402) {
        throw new Error('AI service requires payment. Please add credits to your workspace.');
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    
    // Parse the JSON from the response
    const cleanedJson = generatedText.replace(/```json\n?|\n?```/g, '').trim();
    const recipes = JSON.parse(cleanedJson);

    console.log(`Generated ${recipes.length} ${type} recipes`);

    return new Response(JSON.stringify({ recipes }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating recipes:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate recipes',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}