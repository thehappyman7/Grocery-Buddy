export const testGeminiAPI = async () => {
  try {
    console.log('🧪 Testing Gemini API connection from frontend...');
    
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      const errorMsg = '❌ VITE_GEMINI_API_KEY not found in environment variables';
      console.error(errorMsg);
      alert('Gemini API test failed. Check API key or endpoint.\n\nError: API key not configured');
      return;
    }

    console.log('✅ API key found:', apiKey.substring(0, 10) + '...');
    console.log('📡 Making request to Gemini API...');

    const requestBody = {
      contents: [
        {
          parts: [
            { text: "Say hello, Gemini! Just respond with one sentence." }
          ]
        }
      ]
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      }
    );

    console.log('Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini API error response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      
      alert(`Gemini API test failed. Check API key or endpoint.\n\nStatus: ${response.status}\nError: ${errorData.error?.message || errorText}`);
      return;
    }

    const data = await response.json();
    console.log('✅ Raw Gemini API Response:', JSON.stringify(data, null, 2));
    
    const geminiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!geminiResponse) {
      console.error('❌ No text found in response');
      alert('Gemini API test failed. Check API key or endpoint.\n\nError: Invalid response format');
      return;
    }
    
    console.log('🎉 Gemini Response Text:', geminiResponse);
    
    alert(`✅ Gemini API Test Successful!\n\nResponse: ${geminiResponse}`);
    
  } catch (error) {
    console.error('❌ Gemini API test failed:', error);
    console.error('Full error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    alert(`Gemini API test failed. Check API key or endpoint.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};