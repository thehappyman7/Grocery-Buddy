import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { input, type } = await req.json();
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Only handle dish analysis now
    if (type !== 'dish') {
      return new Response(JSON.stringify({
        error: "Only dish analysis is supported",
        name: "Analysis Failed",
        ingredients: [],
        instructions: [],
        servings: 1,
        cookingTime: 0,
        difficulty: "Unknown"
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `Analyze the dish "${input}" and provide a detailed breakdown in JSON format:
    {
      "name": "Exact dish name",
      "ingredients": ["list", "of", "all", "ingredients", "needed"],
      "instructions": ["step 1", "step 2", "step 3", "etc"],
      "servings": number,
      "cookingTime": number (in minutes),
      "difficulty": "Easy/Medium/Hard"
    }
    
    IMPORTANT: For ingredients, provide ONLY the basic ingredient names without any quantities, units, or preparation details. 
    Examples: 
    - Use "chicken" instead of "2 lbs chicken breast, diced"
    - Use "onion" instead of "1 large onion, chopped"
    - Use "rice" instead of "2 cups basmati rice, washed"
    - Use "salt" instead of "1 tsp salt"
    Be thorough with ingredients - include spices, oils, garnishes, everything needed. Use common names for ingredients.`;

    console.log('Making request to Gemini API for dish:', input);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
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
          temperature: 0.1,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', data);

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const text = data.candidates[0].content.parts[0].text;
    console.log('Generated text:', text);

    // Extract JSON from the response
    let analysisResult;
    try {
      // Try to find JSON in the response
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        // Fallback: try to parse the entire response as JSON
        analysisResult = JSON.parse(text);
      }
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      // Fallback response
      analysisResult = {
        name: input,
        ingredients: ["Unable to parse ingredients", "Please try again"],
        instructions: ["Analysis failed", "Please try a different dish"],
        servings: 2,
        cookingTime: 30,
        difficulty: "Medium"
      };
    }

    console.log('Final analysis result:', analysisResult);

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-dish function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      name: "Analysis Failed",
      ingredients: ["Error occurred", "Please try again"],
      instructions: ["Unable to analyze", "Please check your input and try again"],
      servings: 1,
      cookingTime: 0,
      difficulty: "Unknown"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});