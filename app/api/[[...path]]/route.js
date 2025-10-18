import { NextResponse } from 'next/server';
import { getVisionModel, getTextModel } from '@/lib/gemini';

// Handle CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// OCR + Translation API
export async function POST(request) {
  try {
    const { pathname } = new URL(request.url);

    // Extract and translate endpoint
    if (pathname.includes('/extract-translate')) {
      const formData = await request.formData();
      const imageFile = formData.get('image');
      const targetLanguage = formData.get('targetLanguage') || 'English';

      if (!imageFile) {
        return NextResponse.json(
          { error: 'Image file is required' },
          { status: 400, headers: corsHeaders }
        );
      }

      // Convert image to base64
      const imageBuffer = await imageFile.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      const mimeType = imageFile.type;

      // Step 1: Extract text using Gemini Vision
      const visionModel = getVisionModel();
      
      const ocrPrompt = `Extract all text from this image. The image may contain text in Indian regional languages like Odia, Bengali, Tamil, Telugu, Malayalam, Kannada, Gujarati, Marathi, or other languages. Please extract ALL text exactly as it appears in the image, maintaining the original language. Return only the extracted text without any additional commentary.`;

      const ocrResult = await visionModel.generateContent([
        {
          inlineData: {
            mimeType,
            data: base64Image,
          },
        },
        ocrPrompt,
      ]);

      const extractedText = ocrResult.response.text();

      // Step 2: Translate the extracted text
      const textModel = getTextModel();
      
      const translationPrompt = `Translate the following text to ${targetLanguage}. Preserve the meaning and context accurately. If the text is already in ${targetLanguage}, just return it as is. Only return the translated text without any additional commentary or explanations.\n\nText to translate:\n${extractedText}`;

      const translationResult = await textModel.generateContent(translationPrompt);
      const translatedText = translationResult.response.text();

      return NextResponse.json(
        {
          success: true,
          extractedText,
          translatedText,
          targetLanguage,
        },
        { headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: 'Endpoint not found' },
      { status: 404, headers: corsHeaders }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET(request) {
  return NextResponse.json(
    { message: 'Scriptly API is running', status: 'ok' },
    { headers: corsHeaders }
  );
}
