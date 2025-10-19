# How to Get Google Gemini API Key

## Steps to Get Your FREE Google Gemini API Key:

1. **Go to Google AI Studio**
   - Visit: https://aistudio.google.com/app/apikey

2. **Sign in with your Google Account**
   - Use any Gmail account you have

3. **Create a New API Key**
   - Click "Create API Key"
   - Choose "Create API key in new project" or use existing project
   - Copy the API key that's generated

4. **Update Your .env File**
   - Replace the current key in your `.env` file:
   ```
   GOOGLE_GEMINI_API_KEY=YOUR_NEW_API_KEY_HERE
   ```
   - The new key should start with something like `AIza...` (not `sk-emergent`)

5. **Restart Your Development Server**
   - Stop the current server (Ctrl+C)
   - Run `npm run dev` again

## Important Notes:
- The Gemini API is **FREE** with generous limits
- No credit card required for basic usage
- Perfect for your translation app
- Much more reliable than the emergent key you were using

## Current Issue:
Your current API key `sk-emergent-*` is not compatible with Google's Gemini API. That's why you're getting the "Incorrect API key" error.

Once you get the proper Gemini API key and update your `.env` file, your app will work perfectly! 🚀