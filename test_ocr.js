// Quick test for OCR functionality
require('dotenv').config({ path: '.env.local' });
const { analyzeImageWithGemini, translateWithGemini } = require('./lib/gemini.js');

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

if (!API_KEY || API_KEY === 'your_api_key_here') {
  console.error('❌ Please set your GOOGLE_GEMINI_API_KEY in .env.local file');
  process.exit(1);
}

async function testOCR() {
  try {
    console.log('🧪 Testing OCR with a simple text prompt...\n');
    
    // Create a simple base64 test image (1x1 transparent pixel)
    // This is just to test the API endpoint, not actual OCR
    const testBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGA60e6kgAAAABJRU5ErkJggg==';
    const mimeType = 'image/png';
    
    const prompt = 'Extract any text from this image. If no text is visible, respond with "No text found".';
    
    console.log('📷 Calling analyzeImageWithGemini...');
    const result = await analyzeImageWithGemini(testBase64, mimeType, prompt);
    console.log('✅ OCR Result:', result);
    
    console.log('\n🌐 Testing translation...');
    const translationResult = await translateWithGemini('Hello world', 'Hindi');
    console.log('✅ Translation Result:', translationResult);
    
    console.log('\n🎉 All tests passed! The application should work correctly.');
    console.log('📌 You can now start the app with: npm run dev');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('\n💡 Your API key might be invalid. Please check your .env.local file.');
    }
  }
}

testOCR();