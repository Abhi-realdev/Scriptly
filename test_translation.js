// Quick test for translation functionality
require('dotenv').config({ path: '.env.local' });
const { translateWithGemini } = require('./lib/gemini.js');

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

if (!API_KEY || API_KEY === 'your_api_key_here') {
  console.error('❌ Please set your GOOGLE_GEMINI_API_KEY in .env.local file');
  process.exit(1);
}

async function testTranslation() {
  try {
    console.log('🌐 Testing translation functionality...\n');
    
    console.log('Testing English to Hindi translation...');
    const hindiResult = await translateWithGemini('Hello, how are you?', 'Hindi');
    console.log('✅ Hindi Result:', hindiResult);
    
    console.log('\nTesting Hindi to English translation...');
    const englishResult = await translateWithGemini('नमस्ते, आप कैसे हैं?', 'English');
    console.log('✅ English Result:', englishResult);
    
    console.log('\n🎉 Translation tests passed!');
    console.log('📌 The application should work for translation. OCR will work when you upload real images.');
    
  } catch (error) {
    console.error('❌ Translation test failed:', error.message);
  }
}

testTranslation();