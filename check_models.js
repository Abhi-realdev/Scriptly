// Script to check available Gemini models
require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

if (!API_KEY || API_KEY === 'your_api_key_here') {
  console.error('❌ Please set your GOOGLE_GEMINI_API_KEY in .env.local file');
  process.exit(1);
}

async function listModels() {
  try {
    console.log('🔍 Checking available Gemini models...\n');
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('📋 Available models:');
    console.log('==================');
    
    data.models.forEach(model => {
      console.log(`• ${model.name}`);
      console.log(`  Display Name: ${model.displayName}`);
      console.log(`  Description: ${model.description}`);
      console.log(`  Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
      console.log('');
    });
    
    // Test a simple generateContent request
    console.log('🧪 Testing generateContent with gemini-2.5-flash...');
    const testResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Say hello'
          }]
        }]
      })
    });
    
    if (testResponse.ok) {
      console.log('✅ gemini-2.5-flash is working!');
    } else {
      const error = await testResponse.json();
      console.log('❌ gemini-2.5-flash test failed:', error.error?.message || 'Unknown error');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('\n💡 Your API key might be invalid. Please check:');
      console.log('   1. Go to https://aistudio.google.com/app/apikey');
      console.log('   2. Create a new API key');
      console.log('   3. Update your .env.local file');
    }
  }
}

listModels();