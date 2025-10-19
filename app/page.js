'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, Globe, Sparkles, Github, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState('Hindi');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setResult(null);
      setError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setResult(null);
      setError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleTranslate = async () => {
    if (!selectedImage) {
      setError('Please upload an image first');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('targetLanguage', targetLanguage);

      const response = await fetch('/api/extract-translate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process image');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Scriptly
          </div>
          <div className="flex gap-6">
            <button onClick={() => scrollToSection('translate')} className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
              Translate
            </button>
            <button onClick={() => scrollToSection('why')} className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
              Overview
            </button>
            <button onClick={() => scrollToSection('about')} className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
              About
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
<<<<<<< HEAD
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20" 
          style={{ backgroundImage: "url('/banner.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
=======
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
>>>>>>> f0a5e046e3282535dda0ece2283513ef1850a360
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Powered by AI
          </div>
          <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Scriptly
          </h1>
          <p className="text-2xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
            Break the language barrier – Instantly translate flex boards, posters & billboards from Indian regional languages into <span className="font-semibold text-blue-600">Hindi</span> or <span className="font-semibold text-indigo-600">English</span>.
          </p>
        </div>
      </section>

      {/* Main App Section */}
      <section id="translate" className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <Card className="shadow-2xl border-0 overflow-hidden">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
                Upload & Translate
              </h2>

              {/* Upload Area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all mb-6"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg shadow-md"
                    />
                    <p className="text-sm text-slate-600">Click to change image</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-16 h-16 mx-auto text-blue-500" />
                    <div>
                      <p className="text-lg font-semibold text-slate-700">Drop your image here</p>
                      <p className="text-sm text-slate-500">or click to browse</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Language Selection */}
              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block text-slate-700">
                  Select Output Language
                </Label>
                <RadioGroup value={targetLanguage} onValueChange={setTargetLanguage} className="flex gap-4 justify-center">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Hindi" id="hindi" />
                    <Label htmlFor="hindi" className="cursor-pointer text-base">Hindi</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="English" id="english" />
                    <Label htmlFor="english" className="cursor-pointer text-base">English</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Translate Button */}
              <Button
                onClick={handleTranslate}
                disabled={!selectedImage || loading}
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Translate
                  </span>
                )}
              </Button>

              {/* Error Display */}
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <p className="font-semibold">Error:</p>
                  <p>{error}</p>
                </div>
              )}

              {/* Results Display */}
              {result && (
                <div className="mt-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Original Text */}
                    <Card className="border-slate-200 shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <FileText className="w-5 h-5 text-slate-600" />
                          <h3 className="font-bold text-lg text-slate-800">Extracted Text</h3>
                        </div>
                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {result.extractedText}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Translated Text */}
                    <Card className="border-blue-200 bg-blue-50/50 shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Globe className="w-5 h-5 text-blue-600" />
                          <h3 className="font-bold text-lg text-blue-800">Translated to {result.targetLanguage}</h3>
                        </div>
                        <p className="text-slate-800 whitespace-pre-wrap leading-relaxed font-medium">
                          {result.translatedText}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Scriptly Section */}
      <section id="why" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-800">
            Why Scriptly?
          </h2>
          <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
            <p>
              <span className="font-semibold text-blue-600">Purpose:</span> India's linguistic diversity is beautiful but can be a barrier when traveling or working across regions. Scriptly makes regional texts accessible by instantly translating signboards, posters, and documents from languages like Odia, Bengali, Tamil, Telugu, Malayalam, and more into Hindi or English.
            </p>
            <p>
              <span className="font-semibold text-indigo-600">Usage:</span> Perfect for students studying regional literature, travelers navigating unfamiliar territories, professionals working across state boundaries, and anyone who encounters regional language content in their daily life.
            </p>
            <p>
              <span className="font-semibold text-purple-600">Benefit:</span> Bridge the gap between India's 22 official languages and create connections through understanding. No more confusion or miscommunication – just instant, accurate translations powered by advanced AI.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-800">
            About
          </h2>
          <Card className="shadow-xl border-0 overflow-hidden">
<<<<<<< HEAD
            <CardContent className="p-8">
=======
            <CardContent className="p-8 md:p-12">
>>>>>>> f0a5e046e3282535dda0ece2283513ef1850a360
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-slate-800">About Me</h3>
                  <div className="space-y-2">
                    <p className="text-slate-700">
<<<<<<< HEAD
                      <span className="font-semibold">Name:</span> Murshid khan
=======
                      <span className="font-semibold">Name:</span> Abhimanyu Desai
>>>>>>> f0a5e046e3282535dda0ece2283513ef1850a360
                    </p>
                    <p className="text-slate-700">
                      <span className="font-semibold">Designation:</span> Full-Stack Developer & AI Enthusiast
                    </p>
                    <p className="text-slate-700">
                      <span className="font-semibold">Experience:</span> Building innovative solutions that bridge technology and real-world problems
                    </p>
                  </div>
                  <div className="pt-4">
                    <p className="text-slate-700 font-semibold mb-2">Vision:</p>
                    <p className="text-slate-600 leading-relaxed">
                      To create technology that breaks down barriers and brings people together. Scriptly is my contribution to making India's incredible linguistic diversity accessible to everyone, one translation at a time.
                    </p>
                  </div>
                </div>
                <div className="flex justify-center">
<<<<<<< HEAD
                  <div className="w-64 h-64 rounded-2xl overflow-hidden shadow-xl">
                    <img 
                      src="/Murshid khan.png" 
                      alt="Murshid khan" 
                      className="w-full h-full object-cover"
                    />
=======
                  <div className="w-64 h-64 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <div className="text-white text-6xl font-bold">AD</div>
>>>>>>> f0a5e046e3282535dda0ece2283513ef1850a360
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-bold">
              Scriptly
            </div>
            <div className="flex gap-8">
              <button onClick={() => scrollToSection('translate')} className="hover:text-blue-400 transition-colors">
                Translate
              </button>
              <button onClick={() => scrollToSection('why')} className="hover:text-blue-400 transition-colors">
                Overview
              </button>
              <button onClick={() => scrollToSection('about')} className="hover:text-blue-400 transition-colors">
                About
              </button>
            </div>
            <div className="flex gap-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="text-center mt-8 text-slate-400">
<<<<<<< HEAD
            © 2025 Scriptly. Built with ❤️ by Murshid khan.
=======
            © 2025 Scriptly. Built with ❤️ by Abhimanyu Desai.
>>>>>>> f0a5e046e3282535dda0ece2283513ef1850a360
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
