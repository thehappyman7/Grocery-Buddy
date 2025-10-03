import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecipeRequest {
  type: 'quick' | 'trending' | 'seasonal' | 'category' | 'ingredients';
  filters: {
    isVegetarian: boolean;
    cuisine: string;
    budget: number;
  };
  category?: string;
  userIngredients?: string[];
  excludeRecipeIds?: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, filters, category, userIngredients = [], excludeRecipeIds = [] }: RecipeRequest = await req.json();
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

    const userIngredientsClause = userIngredients.length > 0 
      ? `Prioritize recipes using these available ingredients: ${userIngredients.join(', ')}. If not enough ingredients for a complete recipe, suggest recipes requiring minimal extra ingredients beyond this list.`
      : '';
    
    switch (type) {
      case 'quick':
        prompt = `Give me 5 quick recipes that can be prepared under 20 minutes for ${dietaryRestriction} diet and ${cuisineFilter}. ${userIngredientsClause} List only ingredient names (no measurements).`;
        break;
      case 'trending':
        prompt = `Give me 5 currently trending grocery recipes for ${dietaryRestriction} diet and ${cuisineFilter}. ${userIngredientsClause} List only ingredient names (no measurements).`;
        break;
      case 'seasonal':
        prompt = `Give me 5 seasonal recipes based on currently available vegetables and fruits for ${currentMonth} (${currentSeason} season), ${dietaryRestriction} diet and ${cuisineFilter}. ${userIngredientsClause} List only ingredient names (no measurements).`;
        break;
      case 'category':
        prompt = `Give me 5 recipes in the category "${category}" for ${dietaryRestriction} diet and ${cuisineFilter}. List only ingredient names (no measurements).`;
        break;
      case 'ingredients':
        prompt = `List 10 common grocery ingredients that belong to the category "${category}". Return only ingredient names in a simple array (no descriptions, no measurements). Return a JSON array of strings: ["ingredient1", "ingredient2", ...]`;
        
        console.log(`Calling Lovable AI Gateway for ${category} ingredients...`);

        const ingredientsResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
                content: 'You are a helpful grocery assistant. You generate practical ingredient lists in JSON format.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 1000
          })
        });

        if (!ingredientsResponse.ok) {
          const errorText = await ingredientsResponse.text();
          console.error('Lovable AI Gateway error:', ingredientsResponse.status, errorText);
          
          if (ingredientsResponse.status === 429) {
            throw new Error('Rate limit exceeded. Please try again in a moment.');
          }
          if (ingredientsResponse.status === 402) {
            throw new Error('AI service requires payment. Please add credits to your workspace.');
          }
          
          throw new Error(`AI Gateway error: ${ingredientsResponse.status}`);
        }

        const ingredientsData = await ingredientsResponse.json();
        const ingredientsText = ingredientsData.choices[0].message.content;
        
        // Parse the JSON from the response
        const cleanedIngredientsJson = ingredientsText.replace(/```json\n?|\n?```/g, '').trim();
        const ingredients = JSON.parse(cleanedIngredientsJson);

        console.log(`Generated ${ingredients.length} ingredients for ${category}`);

        return new Response(JSON.stringify({ ingredients }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    const ingredientMatchClause = userIngredients.length > 0 
      ? `For each recipe, also include:
- "matchedIngredients": number (count how many of the user's ingredients [${userIngredients.join(', ')}] are used in this recipe)
- "extraIngredientsNeeded": number (count how many additional ingredients beyond the user's list are needed)`
      : '';

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
  "tags": ["tag1", "tag2", "tag3"]${userIngredients.length > 0 ? ',\n  "matchedIngredients": 0,\n  "extraIngredientsNeeded": 0' : ''}
}

Make sure:
- Each recipe has 6-10 realistic ingredients (NAMES ONLY, no measurements)
- Cooking times are accurate and varied
- Instructions are brief but clear (3-5 steps)
- Use diverse cuisines and cooking methods
- Images use realistic food keywords
- Tags describe the dish characteristics
- All recipes are practical and achievable
${ingredientMatchClause}

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