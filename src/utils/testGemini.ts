export const testGeminiConnection = async () => {
  try {
    console.log('🧪 Testing Gemini API connection...');
    
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('❌ VITE_GEMINI_API_KEY not found in environment variables');
      return;
    }

    console.log('✅ API key found, making request to Gemini...');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "Hello Gemini, are you working? Please respond with a simple 'Yes, I'm working correctly!' message."
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 100,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    const geminiResponse = data.candidates[0].content.parts[0].text;
    
    console.log('🎉 Gemini API Response:', geminiResponse);
    console.log('✅ Gemini connection test successful!');
    
    // Also show an alert for visual feedback
    alert(`Gemini Test Successful!\n\nResponse: ${geminiResponse}`);
    
  } catch (error) {
    console.error('❌ Gemini API test failed:', error);
    alert(`Gemini Test Failed!\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};