# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

### Development
```bash
npm run dev                 # Start Next.js dev server on port 3000 with memory optimization
npm run dev:no-reload      # Start dev server without auto-reload
npm run build              # Build for production (standalone output)
npm start                  # Start production build
```

### Python Backend (Required for OCR/Translation)
```bash
cd python_api
pip install -r requirements.txt
python gemini_service.py   # Start FastAPI server on port 8000
```

### Testing
```bash
node test_api.js           # Basic API health check test
```

## Architecture

**Scriptly** is a Next.js application that translates text from Indian regional languages in images to Hindi or English using AI.

### Core Architecture
- **Frontend**: Next.js 14 App Router with React 18 client-side SPA
- **Styling**: Tailwind CSS + shadcn/ui components (Radix UI primitives)
- **Backend**: Hybrid approach with both Node.js (Next.js API routes) and Python FastAPI
- **AI Integration**: Google Gemini 2.5 Flash API for OCR and translation

### Key Components
- **Single-page app** (`app/page.js`) - Complete UI with upload, language selection, and results display
- **Catch-all API route** (`app/api/[[...path]]/route.js`) - Handles `/extract-translate` endpoint
- **Python service** (`python_api/gemini_service.py`) - OCR and translation using emergentintegrations LLM library
- **Gemini integration** (`lib/gemini.js`) - Direct API calls (alternative to Python service)

### Code Structure Pattern
The codebase shows merge conflict artifacts with two approaches:
1. **Node.js approach**: Direct Gemini API calls from Next.js
2. **Python approach**: Separate FastAPI service with emergentintegrations library

Current implementation uses the **Python backend approach** for better OCR accuracy.

### State Management
- Client-side React state for UI (image preview, loading, results)
- No external state management library - uses useState hooks
- File handling via FormData for image uploads

### Environment Variables Required
```bash
GOOGLE_GEMINI_API_KEY=your_api_key_here
```

## Workflow Notes

### Image Processing Flow
1. User uploads image via drag-and-drop or file picker
2. Frontend converts image to base64 and sends to `/api/extract-translate`
3. Next.js API forwards request to Python FastAPI service on port 8000
4. Python service uses Gemini for OCR text extraction
5. Python service uses Gemini for translation to target language
6. Results flow back through API layers to frontend

### Development Dependencies
- Python backend must be running on port 8000 for full functionality
- Cross-platform memory optimization in next.config.js for development
- CORS headers configured for cross-origin requests

### UI Framework Details
- Uses shadcn/ui with "new-york" style preset
- Lucide React for icons
- Tailwind CSS with custom color system and animations
- Responsive design with mobile-first approach

### Testing Approach
- Basic API testing via Node.js script (`test_api.js`)
- No formal test framework currently configured
- Manual testing via web interface recommended

## Important Files
- `app/page.js` - Main application UI and logic
- `python_api/gemini_service.py` - AI processing backend
- `lib/gemini.js` - Alternative Gemini integration (not currently used)
- `next.config.js` - Standalone build + dev optimizations
- `components.json` - shadcn/ui configuration