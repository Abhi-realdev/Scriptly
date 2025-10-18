// Using Gemini's OpenAI-compatible API with Emergent LLM Key
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/openai';
const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

export async function analyzeImageWithGemini(imageBase64, mimeType, prompt) {
  try {
    const response = await fetch(`${GEMINI_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gemini-2.0-flash-exp',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 2048,
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error('Gemini Vision API Error:', error);
    throw error;
  }
}

export async function translateWithGemini(text, targetLanguage) {
  try {
    const response = await fetch(`${GEMINI_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gemini-2.0-flash-exp',
        messages: [
          {
            role: 'user',
            content: `Translate the following text to ${targetLanguage}. Preserve the meaning and context accurately. If the text is already in ${targetLanguage}, just return it as is. Only return the translated text without any additional commentary or explanations.\n\nText to translate:\n${text}`,
          },
        ],
        max_tokens: 2048,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error('Gemini Translation API Error:', error);
    throw error;
  }
}
