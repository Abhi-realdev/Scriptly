// Using Google Gemini API directly
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

export async function analyzeImageWithGemini(imageBase64, mimeType, prompt) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: imageBase64
              }
            }
          ]
        }],
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.4,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error) {
    console.error('Gemini Vision API Error:', error);
    throw error;
  }
}

export async function translateWithGemini(text, targetLanguage) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Translate the following text to ${targetLanguage}. Preserve the meaning and context accurately. If the text is already in ${targetLanguage}, just return it as is. Only return the translated text without any additional commentary or explanations.\n\nText to translate:\n${text}`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.2,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error) {
    console.error('Gemini Translation API Error:', error);
    throw error;
  }
}
