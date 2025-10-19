# Quick Start Guide

## Prerequisites
1. Node.js installed
2. Google Gemini API Key

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
1. Open `.env.local` file
2. Replace `your_api_key_here` with your actual Google Gemini API Key
3. Get your API key from: https://aistudio.google.com/app/apikey

### 3. Start the Application
```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

## How to Use
1. Open http://localhost:3000 in your browser
2. Upload an image containing text in Indian regional languages
3. Select target language (Hindi or English)
4. Click "Translate" to get OCR + translation results

## Troubleshooting
- **API Error**: Make sure your `GOOGLE_GEMINI_API_KEY` is set in `.env.local`
- **Model not found error**: Run `node check_models.js` to see available models
- **Port 3000 in use**: The app will automatically use the next available port
- **No text extracted**: Try with clearer images or better lighting

### Check API Key & Models
```bash
node check_models.js      # List all available models
node test_translation.js  # Test translation functionality
```
These will verify your API key is working correctly.

## Features
- Drag & drop image upload
- OCR for Indian regional languages
- Translation to Hindi/English
- Responsive design
- Real-time processing