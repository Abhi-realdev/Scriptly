from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent
import base64
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get API key from environment
API_KEY = os.getenv('GOOGLE_GEMINI_API_KEY', 'sk-emergent-9B57c06574f5073745')

class OCRRequest(BaseModel):
    image_base64: str
    prompt: str
    target_language: str = "English"

class TextRequest(BaseModel):
    text: str
    target_language: str = "English"

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Python Gemini Service is running"}

@app.post("/ocr-translate")
async def ocr_translate(request: OCRRequest):
    try:
        # Step 1: OCR - Extract text from image
        ocr_chat = LlmChat(
            api_key=API_KEY,
            session_id=f"ocr-session-{hash(request.image_base64[:100])}",
            system_message="You are a helpful assistant specialized in extracting text from Indian regional languages."
        ).with_model("gemini", "gemini-2.0-flash-exp")
        
        # Create image content
        image_content = ImageContent(image_base64=request.image_base64)
        
        # Create OCR message
        ocr_message = UserMessage(
            text=request.prompt,
            file_contents=[image_content]
        )
        
        # Extract text
        extracted_text = await ocr_chat.send_message(ocr_message)
        
        # Step 2: Translation
        translation_chat = LlmChat(
            api_key=API_KEY,
            session_id=f"translate-session-{hash(extracted_text[:100])}",
            system_message="You are a helpful translation assistant."
        ).with_model("gemini", "gemini-2.0-flash-exp")
        
        translation_prompt = f"Translate the following text to {request.target_language}. Preserve the meaning and context accurately. If the text is already in {request.target_language}, just return it as is. Only return the translated text without any additional commentary or explanations.\n\nText to translate:\n{extracted_text}"
        
        translation_message = UserMessage(text=translation_prompt)
        translated_text = await translation_chat.send_message(translation_message)
        
        return {
            "success": True,
            "extractedText": extracted_text,
            "translatedText": translated_text,
            "targetLanguage": request.target_language
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/translate")
async def translate(request: TextRequest):
    try:
        chat = LlmChat(
            api_key=API_KEY,
            session_id=f"translate-session-{hash(request.text[:100])}",
            system_message="You are a helpful translation assistant."
        ).with_model("gemini", "gemini-2.0-flash-exp")
        
        prompt = f"Translate the following text to {request.target_language}. Preserve the meaning and context accurately. If the text is already in {request.target_language}, just return it as is. Only return the translated text without any additional commentary or explanations.\n\nText to translate:\n{request.text}"
        
        message = UserMessage(text=prompt)
        translated_text = await chat.send_message(message)
        
        return {
            "success": True,
            "translatedText": translated_text,
            "targetLanguage": request.target_language
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)