<<<<<<< HEAD
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
=======
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
>>>>>>> f0a5e046e3282535dda0ece2283513ef1850a360
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
<<<<<<< HEAD
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
=======
    return data.choices?.[0]?.message?.content || '';
>>>>>>> f0a5e046e3282535dda0ece2283513ef1850a360
  } catch (error) {
    console.error('Gemini Vision API Error:', error);
    throw error;
  }
}

export async function translateWithGemini(text, targetLanguage) {
  try {
<<<<<<< HEAD
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
=======
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
>>>>>>> f0a5e046e3282535dda0ece2283513ef1850a360
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
<<<<<<< HEAD
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
=======
    return data.choices?.[0]?.message?.content || '';
>>>>>>> f0a5e046e3282535dda0ece2283513ef1850a360
  } catch (error) {
    console.error('Gemini Translation API Error:', error);
    throw error;
  }
}
