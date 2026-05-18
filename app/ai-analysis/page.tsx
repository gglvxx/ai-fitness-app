'use client';
import React, { useState } from 'react';
import { Camera, Upload, Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function AIAnalysisPage() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const analyzeImage = async (base64Image: string) => {
    setLoading(true);
    setAnalysis(''); // Curățăm textul vechi
    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
      
      // Încercăm modelul "gemini-1.5-flash" (fără latest) sau "gemini-pro-vision"
      const model = genAI.getGenerativeModel({ 
  model: "gemini-3-flash-preview" // Numele exact pentru varianta Preview din poza ta
});
      const prompt = "Analizează această imagine ca un expert fitness. Oferă: 1. Postură, 2. Mușchi, 3. Sfat. Răspunde scurt în română.";

      const imageData = base64Image.split(',')[1];
      
      const parts = [
        { text: prompt },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageData
          }
        }
      ];

      const result = await model.generateContent(parts);
      const response = await result.response;
      setAnalysis(response.text());
      
    } catch (error: any) {
      console.error("Eroare detaliată:", error);
      setAnalysis(`Eroare: ${error.message || "Nu am putut contacta AI-ul."}`);
    }
    setLoading(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        analyzeImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Link href="/" className="inline-flex items-center text-blue-500 mb-8">
        <ArrowLeft className="mr-2" size={20} /> Înapoi
      </Link>

      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <Sparkles className="text-blue-500" /> AI Morph Analysis
        </h1>
        <p className="text-gray-400 mb-8">Încarcă o poză cu tine pentru a primi feedback instant despre postură și formă.</p>

        <div className="bg-gray-900 border-2 border-dashed border-gray-800 rounded-3xl p-12 mb-8 relative overflow-hidden">
          {image ? (
            <img src={image} alt="Preview" className="max-h-64 mx-auto rounded-lg mb-4" />
          ) : (
            <div className="space-y-4">
              <Camera size={48} className="mx-auto text-gray-700" />
              <p className="text-sm text-gray-500">Nicio imagine selectată</p>
            </div>
          )}

          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="hidden" 
            id="upload-input"
          />
          
          <label 
            htmlFor="upload-input"
            className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full font-bold cursor-pointer transition"
          >
            <Upload size={20} /> Încarcă Poză
          </label>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 text-blue-500 mb-8">
            <Loader2 className="animate-spin" /> Analizăm imaginea...
          </div>
        )}

        {analysis && (
          <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-2xl text-left animate-in fade-in slide-in-from-bottom-4">
            <h3 className="font-bold text-blue-400 mb-2">Rezultat Scanare:</h3>
            <div className="text-gray-200 whitespace-pre-wrap">{analysis}</div>
          </div>
        )}
      </div>
    </div>
  );
}