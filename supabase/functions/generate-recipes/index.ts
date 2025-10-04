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
        prompt = `List exactly 10 common grocery ingredients that belong to the category "${category}".

CRITICAL INSTRUCTIONS:
- ONLY return a JSON array of short ingredient names (strings). Example: ["Turmeric","Cumin","Coriander","Cardamom","Black Pepper","Cinnamon","Cloves","Nutmeg","Bay Leaves","Mustard Seeds"]
- DO NOT return recipes, instructions, quantities, or extra text.
- DO NOT include measurements, units, or parenthetical descriptions.
- If you cannot confidently produce 10 items, return as many correct items as you can in the same JSON array.

Return ONLY the JSON array, nothing else.`;
        
        console.log(`Calling Lovable AI Gateway for ${category} ingredients...`);

        try {
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
                  content: 'You are a grocery shopping assistant that returns ONLY ingredient names in JSON format.'
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
            
            if (ingredientsResponse.status === 429 || ingredientsResponse.status === 402) {
              // Use fallback for rate limit or payment issues
              console.log('Rate limit/payment issue, using fallback ingredients');
              const fallbackIngredients = getFallbackIngredients(category || 'general');
              return new Response(JSON.stringify({ 
                ingredients: fallbackIngredients,
                source: 'fallback',
                message: 'Showing default ingredients'
              }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              });
            }
            
            throw new Error(`AI Gateway error: ${ingredientsResponse.status}`);
          }

          const ingredientsData = await ingredientsResponse.json();
          const ingredientsText = ingredientsData.choices[0]?.message?.content;
          
          if (!ingredientsText) {
            throw new Error('No content in AI response');
          }

          console.log('Raw AI response for ingredients:', ingredientsText);
          
          // Attempt to parse JSON
          let ingredients: string[];
          try {
            // Clean markdown code blocks
            const cleanedJson = ingredientsText.replace(/```json\n?|\n?```/g, '').trim();
            const parsed = JSON.parse(cleanedJson);
            
            if (Array.isArray(parsed)) {
              ingredients = parsed
                .filter((item: any) => typeof item === 'string')
                .map((item: string) => item.trim())
                .filter((item: string) => item.length > 0 && item.length < 50);
            } else {
              throw new Error('Response is not an array');
            }
          } catch (parseError) {
            console.error('JSON parse failed, attempting secondary parse:', parseError);
            
            // Secondary parse: extract from plain text
            const lines = ingredientsText.split('\n').filter((line: string) => line.trim());
            ingredients = [];
            
            for (const line of lines) {
              // Remove bullets, numbers, dashes, and extra whitespace
              const cleaned = line.replace(/^[-*•\d.)\s]+/, '').trim();
              // Remove anything in parentheses or after common separators
              const ingredient = cleaned.split(/[(\-:]/)[0].trim();
              
              if (ingredient && ingredient.length > 0 && ingredient.length < 50 && !ingredient.toLowerCase().includes('recipe')) {
                ingredients.push(ingredient);
              }
            }
            
            if (ingredients.length === 0) {
              console.error('Secondary parse failed, using fallback');
              ingredients = getFallbackIngredients(category || 'general');
              
              return new Response(JSON.stringify({ 
                ingredients,
                source: 'fallback',
                message: 'Showing default ingredients'
              }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              });
            }
            
            console.log('Extracted ingredients from text:', ingredients);
          }

          console.log(`Generated ${ingredients.length} ingredients for ${category}`);

          return new Response(JSON.stringify({ 
            ingredients,
            source: 'lovable'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } catch (error) {
          console.error('Error fetching ingredients:', error);
          const fallbackIngredients = getFallbackIngredients(category || 'general');
          
          return new Response(JSON.stringify({ 
            ingredients: fallbackIngredients,
            source: 'fallback',
            message: 'Showing default ingredients'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
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

function getFallbackIngredients(category: string): string[] {
  const fallbacks: Record<string, string[]> = {
    'Spices & Seasonings': [
      'Turmeric', 'Cumin', 'Coriander', 'Black Pepper', 'Red Chili Powder',
      'Garam Masala', 'Cardamom', 'Cinnamon', 'Cloves', 'Bay Leaves'
    ],
    'Vegetables & Herbs': [
      'Tomatoes', 'Onions', 'Garlic', 'Ginger', 'Green Chilies',
      'Cilantro', 'Curry Leaves', 'Potatoes', 'Cauliflower', 'Spinach'
    ],
    'Staples & Grains': [
      'Rice', 'Wheat Flour', 'Lentils', 'Chickpeas', 'Basmati Rice',
      'All-Purpose Flour', 'Semolina', 'Rice Flour', 'Red Lentils', 'Split Peas'
    ],
    'Dairy & Proteins': [
      'Milk', 'Yogurt', 'Paneer', 'Eggs', 'Butter',
      'Ghee', 'Cream', 'Cheese', 'Chicken', 'Fish'
    ],
    'Oils & Condiments': [
      'Vegetable Oil', 'Mustard Oil', 'Olive Oil', 'Sesame Oil', 'Coconut Oil',
      'Salt', 'Sugar', 'Vinegar', 'Soy Sauce', 'Tamarind Paste'
    ],
    'Snacks & Beverages': [
      'Tea', 'Coffee', 'Biscuits', 'Chips', 'Nuts',
      'Dried Fruits', 'Cookies', 'Instant Noodles', 'Juice', 'Soft Drinks'
    ],
    'general': [
      'Rice', 'Flour', 'Oil', 'Salt', 'Sugar',
      'Onions', 'Tomatoes', 'Garlic', 'Ginger', 'Potatoes'
    ]
  };
  
  return fallbacks[category] || fallbacks['general'];
}