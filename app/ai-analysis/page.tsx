'use client';
import React, { useState, useEffect } from 'react';
import { Camera, Upload, Sparkles, ArrowLeft, Loader2, X, Image as ImageIcon, History } from 'lucide-react';
import Link from 'next/link';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AIAnalysisPage() {
  const [images, setImages] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<any>(null); // State pentru memoria AI
  const router = useRouter();

  // 1. Verificare Sesiune & Încărcare Istoric
  useEffect(() => {
    const initPage = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      // Luăm ultima analiză din DB pentru a o da ca context lui Gemini
      const { data } = await supabase
        .from('body_analyses')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (data) setLastAnalysis(data);
    };
    initPage();
  }, [router]);

  const analyzeImages = async () => {
    if (images.length === 0) return;
    setLoading(true);
    setAnalysis('');
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

      // CONTEXTUL PENTRU COMPARAȚIE
      const comparisonContext = lastAnalysis 
        ? `CONTEXT ANALIZĂ ANTERIOARĂ (${new Date(lastAnalysis.created_at).toLocaleDateString()}):
           - Greutate atunci: ${lastAnalysis.weight_at_time} kg
           - Analiza de atunci: ${lastAnalysis.analysis_result.substring(0, 500)}...`
        : "Acesta este prima analiză a clientului. Nu există istoric anterior.";

      const prompt = `
        EȘTI UN EXPERT ÎN BIOMECANICĂ ȘI ANTRENOR PERSONAL. 
        PROFIL ACTUAL: ${profile?.gender}, ${profile?.weight}kg, ${profile?.height}cm, Obiectiv: ${profile?.fitness_goal}.

        ${comparisonContext}

        SARCINI:
        1. COMPARĂ pozele noi cu datele din analiza anterioară. Observă progresul vizual sau schimbările de postură.
        2. ANALIZEAZĂ compoziția actuală față de greutatea de ${profile?.weight}kg.
        3. VERDICT PENTRU MEAL PLANNER: Pe baza pozelor, ce ar trebui să ceară utilizatorul în continuare la Meal Planner? (Ex: "Scade 200kcal", "Menține proteinele ridicate", etc.)
        4. SFAT POSTURĂ: 2 corecții rapide pe baza a ceea ce vezi.

        Răspunde motivant în limba română, formatat cu ##.
      `;

      const imageParts = images.map(img => ({
        inlineData: { mimeType: "image/jpeg", data: img.split(',')[1] }
      }));

      const result = await model.generateContent([{ text: prompt }, ...imageParts]);
      const finalResponse = result.response.text();
      setAnalysis(finalResponse);

      // SALVARE ÎN BAZĂ PENTRU ANALIZA VIITOARE
      await supabase.from('body_analyses').insert([{
        user_id: user?.id,
        analysis_result: finalResponse,
        weight_at_time: profile?.weight,
        goal_at_time: profile?.fitness_goal
      }]);
      
    } catch (error: any) {
      console.error(error);
      setAnalysis("Eroare la analiză. Verifică conexiunea.");
    }
    setLoading(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
        alert("Maxim 5 poze.");
        return;
    }
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setImages(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24 text-left">
      <Link href="/" className="inline-flex items-center text-blue-500 mb-8 hover:text-blue-400 transition">
        <ArrowLeft className="mr-2" size={20} /> Dashboard
      </Link>

      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
            <Sparkles className="text-blue-500" /> AI Morph Evoluție
          </h1>
          <p className="text-gray-400">Analizăm progresul tău comparând imaginile cu datele anterioare.</p>
          
          {lastAnalysis && (
            <div className="mt-4 inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full text-xs text-blue-400">
              <History size={14} /> Ultima scanare detectată: {new Date(lastAnalysis.created_at).toLocaleDateString()}
            </div>
          )}
        </header>

        <div className="bg-gray-900 border-2 border-dashed border-gray-800 rounded-3xl p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {images.map((img, index) => (
              <div key={index} className="relative aspect-square group">
                <img src={img} className="w-full h-full object-cover rounded-2xl border border-gray-700 shadow-xl" />
                <button onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg">
                  <X size={16} />
                </button>
              </div>
            ))}
            
            {images.length < 5 && (
              <label className="aspect-square border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition">
                <ImageIcon className="text-gray-700 mb-2" />
                <span className="text-[10px] uppercase font-bold text-gray-500">Adaugă Poză</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>

          {images.length > 0 && (
            <button 
              onClick={analyzeImages}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition disabled:bg-gray-800 shadow-lg shadow-blue-900/20"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              Începe Analiza de Evoluție
            </button>
          )}
        </div>

        {analysis && (
          <div className="bg-gray-900/50 border border-blue-500/20 p-8 rounded-3xl animate-in fade-in slide-in-from-bottom-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
            <div className="text-gray-200 whitespace-pre-wrap leading-relaxed prose prose-invert prose-blue">
              {analysis}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}