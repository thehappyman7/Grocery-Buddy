import { supabase } from "@/integrations/supabase/client";

export const testGeminiAPI = async () => {
  try {
    console.log('🧪 Testing Gemini API connection via secure edge function...');

    const { data, error } = await supabase.functions.invoke('test-gemini');

    if (error) {
      console.error('❌ Edge function error:', {
        status: error.status,
        message: error.message,
        details: error
      });
      alert(`Gemini API test failed.\n\nError: ${error.message}\nStatus: ${error.status || 'unknown'}`);
      return;
    }

    if (data?.error) {
      console.error('❌ Gemini API error:', {
        error: data.error,
        details: data.details
      });
      alert(`Gemini API test failed.\n\nError: ${data.error}`);
      return;
    }

    console.log('🎉 Gemini API Response:', data.message);
    console.log('✅ Gemini connection test successful!');
    
    alert(`✅ Gemini API Test Successful!\n\nResponse: ${data.message}`);
    
  } catch (error) {
    console.error('❌ Gemini API test failed:', {
      status: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      fullError: error
    });
    alert(`Gemini API test failed.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
