import { NextResponse } from 'next/server';
<<<<<<< HEAD
import { analyzeImageWithGemini, translateWithGemini } from '@/lib/gemini';
=======
>>>>>>> f0a5e046e3282535dda0ece2283513ef1850a360

// Handle CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

<<<<<<< HEAD
=======
const PYTHON_API_URL = 'http://localhost:8000';

>>>>>>> f0a5e046e3282535dda0ece2283513ef1850a360
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
<<<<<<< HEAD
      const mimeType = imageFile.type || 'image/jpeg';

      // Extract text using Gemini Vision API
      const ocrPrompt = `Extract all text from this image. The image may contain text in Indian regional languages like Odia, Bengali, Tamil, Telugu, Malayalam, Kannada, Gujarati, Marathi, or other languages. Please extract ALL text exactly as it appears in the image, maintaining the original language. Return only the extracted text without any additional commentary.`;
      
      const extractedText = await analyzeImageWithGemini(base64Image, mimeType, ocrPrompt);
      
      if (!extractedText || extractedText.trim().length === 0) {
        return NextResponse.json(
          { error: 'No text could be extracted from the image' },
          { status: 400, headers: corsHeaders }
        );
      }

      // Translate the extracted text
      const translatedText = await translateWithGemini(extractedText, targetLanguage);

      return NextResponse.json(
        {
          success: true,
          extractedText: extractedText.trim(),
          translatedText: translatedText.trim(),
          targetLanguage: targetLanguage,
=======

      // Call Python Gemini service
      const ocrPrompt = `Extract all text from this image. The image may contain text in Indian regional languages like Odia, Bengali, Tamil, Telugu, Malayalam, Kannada, Gujarati, Marathi, or other languages. Please extract ALL text exactly as it appears in the image, maintaining the original language. Return only the extracted text without any additional commentary.`;

      const response = await fetch(`${PYTHON_API_URL}/ocr-translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_base64: base64Image,
          prompt: ocrPrompt,
          target_language: targetLanguage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(errorData.detail || 'Failed to process image');
      }

      const data = await response.json();

      return NextResponse.json(
        {
          success: data.success,
          extractedText: data.extractedText,
          translatedText: data.translatedText,
          targetLanguage: data.targetLanguage,
>>>>>>> f0a5e046e3282535dda0ece2283513ef1850a360
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
