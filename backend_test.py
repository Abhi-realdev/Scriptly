#!/usr/bin/env python3
"""
Backend API Testing for Scriptly OCR + Translation App
Tests the Gemini AI-powered OCR and translation endpoints
"""

import requests
import json
import base64
import os
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
import sys

# Get the base URL from environment or use default
BASE_URL = "https://scriptly-translate.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

def create_test_image_with_text(text, language="Hindi", width=400, height=200):
    """Create a test image with text for OCR testing"""
    try:
        # Create a white background image
        img = Image.new('RGB', (width, height), color='white')
        draw = ImageDraw.Draw(img)
        
        # Try to use a font that supports Unicode characters
        try:
            # Try to find a system font that supports Unicode
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
        except:
            try:
                font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 24)
            except:
                # Fallback to default font
                font = ImageFont.load_default()
        
        # Calculate text position (center)
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        x = (width - text_width) // 2
        y = (height - text_height) // 2
        
        # Draw the text
        draw.text((x, y), text, fill='black', font=font)
        
        # Save to BytesIO
        img_buffer = BytesIO()
        img.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        
        return img_buffer.getvalue()
    except Exception as e:
        print(f"Error creating test image: {e}")
        # Create a simple fallback image
        img = Image.new('RGB', (width, height), color='white')
        draw = ImageDraw.Draw(img)
        draw.text((50, 50), text, fill='black')
        img_buffer = BytesIO()
        img.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        return img_buffer.getvalue()

def test_api_health_check():
    """Test the API health check endpoint"""
    print("\n=== Testing Next.js API Health Check ===")
    try:
        response = requests.get(f"{API_BASE}", timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'ok':
                print("✅ Next.js API Health Check: PASSED")
                return True
            else:
                print("❌ Next.js API Health Check: Invalid response format")
                return False
        else:
            print(f"❌ Next.js API Health Check: Failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Next.js API Health Check: Exception - {e}")
        return False

def test_python_service_health():
    """Test the Python Gemini service health check endpoint"""
    print("\n=== Testing Python Service Health Check ===")
    try:
        response = requests.get("http://localhost:8000/health", timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'ok' and 'Python Gemini Service' in data.get('message', ''):
                print("✅ Python Service Health Check: PASSED")
                return True
            else:
                print("❌ Python Service Health Check: Invalid response format")
                return False
        else:
            print(f"❌ Python Service Health Check: Failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Python Service Health Check: Exception - {e}")
        return False

def test_ocr_translation_endpoint():
    """Test the OCR + Translation endpoint with various scenarios"""
    print("\n=== Testing OCR + Translation Endpoint ===")
    
    # Test cases with different Indian language texts
    test_cases = [
        {
            "text": "नमस्ते दुनिया",  # Hindi
            "target_language": "English",
            "description": "Hindi to English"
        },
        {
            "text": "স্বাগতম",  # Bengali
            "target_language": "Hindi", 
            "description": "Bengali to Hindi"
        },
        {
            "text": "வணக்கம்",  # Tamil
            "target_language": "English",
            "description": "Tamil to English"
        },
        {
            "text": "Hello World",  # English
            "target_language": "Hindi",
            "description": "English to Hindi"
        }
    ]
    
    results = []
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n--- Test Case {i}: {test_case['description']} ---")
        
        try:
            # Create test image with text
            image_data = create_test_image_with_text(test_case['text'])
            
            # Prepare form data
            files = {
                'image': ('test_image.png', image_data, 'image/png')
            }
            data = {
                'targetLanguage': test_case['target_language']
            }
            
            # Make API request
            response = requests.post(
                f"{API_BASE}/extract-translate",
                files=files,
                data=data,
                timeout=60
            )
            
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Response: {json.dumps(result, indent=2, ensure_ascii=False)}")
                
                # Validate response structure
                required_fields = ['success', 'extractedText', 'translatedText', 'targetLanguage']
                missing_fields = [field for field in required_fields if field not in result]
                
                if missing_fields:
                    print(f"❌ Missing fields: {missing_fields}")
                    results.append(False)
                elif result.get('success') != True:
                    print(f"❌ Success field is not True: {result.get('success')}")
                    results.append(False)
                elif not result.get('extractedText'):
                    print("❌ No extracted text returned")
                    results.append(False)
                elif not result.get('translatedText'):
                    print("❌ No translated text returned")
                    results.append(False)
                else:
                    print(f"✅ Test Case {i}: PASSED")
                    print(f"   Extracted: {result['extractedText']}")
                    print(f"   Translated: {result['translatedText']}")
                    results.append(True)
            else:
                print(f"❌ Test Case {i}: Failed with status {response.status_code}")
                try:
                    error_response = response.json()
                    print(f"Error: {error_response}")
                except:
                    print(f"Error response: {response.text}")
                results.append(False)
                
        except Exception as e:
            print(f"❌ Test Case {i}: Exception - {e}")
            results.append(False)
    
    return results

def test_error_handling():
    """Test error handling scenarios"""
    print("\n=== Testing Error Handling ===")
    
    error_tests = []
    
    # Test 1: No image file
    print("\n--- Test: No image file ---")
    try:
        data = {'targetLanguage': 'English'}
        response = requests.post(f"{API_BASE}/extract-translate", data=data, timeout=30)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 400:
            result = response.json()
            print(f"Response: {result}")
            if 'error' in result and 'required' in result['error'].lower():
                print("✅ No image error handling: PASSED")
                error_tests.append(True)
            else:
                print("❌ No image error handling: Incorrect error message")
                error_tests.append(False)
        else:
            print(f"❌ No image error handling: Expected 400, got {response.status_code}")
            error_tests.append(False)
    except Exception as e:
        print(f"❌ No image error handling: Exception - {e}")
        error_tests.append(False)
    
    # Test 2: Invalid endpoint
    print("\n--- Test: Invalid endpoint ---")
    try:
        response = requests.post(f"{API_BASE}/invalid-endpoint", timeout=30)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 404:
            print("✅ Invalid endpoint handling: PASSED")
            error_tests.append(True)
        else:
            print(f"❌ Invalid endpoint handling: Expected 404, got {response.status_code}")
            error_tests.append(False)
    except Exception as e:
        print(f"❌ Invalid endpoint error handling: Exception - {e}")
        error_tests.append(False)
    
    return error_tests

def main():
    """Run all backend tests"""
    print("🚀 Starting Scriptly Backend API Tests")
    print(f"Testing API at: {API_BASE}")
    
    all_results = []
    
    # Test 1: Next.js API Health Check
    health_result = test_api_health_check()
    all_results.append(health_result)
    
    # Test 2: Python Service Health Check
    python_health_result = test_python_service_health()
    all_results.append(python_health_result)
    
    # Test 3: OCR + Translation Endpoint
    ocr_results = test_ocr_translation_endpoint()
    all_results.extend(ocr_results)
    
    # Test 4: Error Handling
    error_results = test_error_handling()
    all_results.extend(error_results)
    
    # Summary
    print("\n" + "="*50)
    print("📊 TEST SUMMARY")
    print("="*50)
    
    passed = sum(all_results)
    total = len(all_results)
    
    print(f"Total Tests: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {total - passed}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    
    if passed == total:
        print("\n🎉 All tests PASSED!")
        return True
    else:
        print(f"\n⚠️  {total - passed} test(s) FAILED!")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)