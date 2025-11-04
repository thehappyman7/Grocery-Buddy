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
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      throw new Error('AI service not configured');
    }

    // Build prompt based on request type
    let prompt = '';
    const dietaryRestriction = filters.isVegetarian ? 'vegetarian' : 'any dietary preference';
    const cuisineFilter = filters.cuisine === 'all' ? 'any cuisine' : `${filters.cuisine} cuisine`;
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentSeason = getCurrentSeason();

    const userIngredientsClause = userIngredients.length > 0 
      ? `Suggest recipes that can be made using SUBSETS of the following ingredients: ${userIngredients.join(', ')}. Each recipe should use SOME OR MOST of the listed ingredients, but NOT necessarily all of them. Recipes can also include a few common pantry staples not in the list.`
      : '';
    
    switch (type) {
      case 'quick':
        prompt = `Generate exactly 5 quick recipes (under 20 minutes prep time) for ${dietaryRestriction} diet and ${cuisineFilter}. ${userIngredientsClause} Ensure variety in the recipes - different cooking methods and flavor profiles. List only ingredient names (no measurements).`;
        break;
      case 'trending':
        prompt = `Generate exactly 5 currently trending recipes for ${dietaryRestriction} diet and ${cuisineFilter}. ${userIngredientsClause} Ensure each recipe is distinct and uses different combinations of the available ingredients. List only ingredient names (no measurements).`;
        break;
      case 'seasonal':
        prompt = `Generate exactly 5 seasonal recipes featuring ${currentMonth} (${currentSeason} season) produce for ${dietaryRestriction} diet and ${cuisineFilter}. ${userIngredientsClause} Each recipe should highlight different seasonal ingredients and cooking styles. List only ingredient names (no measurements).`;
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
        
        try {
          const ingredientsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
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
                maxOutputTokens: 1000
              }
            })
          });

          if (!ingredientsResponse.ok) {
            const fallbackIngredients = getFallbackIngredients(category || 'general');
            return new Response(JSON.stringify({ 
              ingredients: fallbackIngredients,
              source: 'fallback'
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          const ingredientsData = await ingredientsResponse.json();
          const ingredientsText = ingredientsData.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (!ingredientsText) {
            const fallbackIngredients = getFallbackIngredients(category || 'general');
            return new Response(JSON.stringify({ 
              ingredients: fallbackIngredients,
              source: 'fallback'
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
          
          let ingredients: string[];
          try {
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
            const lines = ingredientsText.split('\n').filter((line: string) => line.trim());
            ingredients = [];
            
            for (const line of lines) {
              const cleaned = line.replace(/^[-*•\d.)\s]+/, '').trim();
              const ingredient = cleaned.split(/[(\-:]/)[0].trim();
              
              if (ingredient && ingredient.length > 0 && ingredient.length < 50 && !ingredient.toLowerCase().includes('recipe')) {
                ingredients.push(ingredient);
              }
            }
            
            if (ingredients.length === 0) {
              ingredients = getFallbackIngredients(category || 'general');
            }
          }

          return new Response(JSON.stringify({ 
            ingredients,
            source: 'gemini'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } catch (error) {
          const fallbackIngredients = getFallbackIngredients(category || 'general');
          
          return new Response(JSON.stringify({ 
            ingredients: fallbackIngredients,
            source: 'fallback'
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

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
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
          maxOutputTokens: 4000
        }
      })
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ recipes: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      return new Response(JSON.stringify({ recipes: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const cleanedJson = generatedText.replace(/```json\n?|\n?```/g, '').trim();
    const recipes = JSON.parse(cleanedJson);

    return new Response(JSON.stringify({ recipes }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ recipes: [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
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