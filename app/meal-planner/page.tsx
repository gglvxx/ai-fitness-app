'use client';
import React, { useState } from 'react';
import { Utensils, Sparkles, ArrowLeft, Loader2, Apple, Salad, Pizza } from 'lucide-react';
import Link from 'next/link';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function MealPlannerPage() {
  const [input, setInput] = useState('');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
const generateMealPlan = async () => {
  if (!input) return;
  setLoading(true);
  try {
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // PROMPT ACTUALIZAT:
    const prompt = `Ești un nutriționist de elită. Utilizatorul îți oferă următoarele detalii: "${input}". 
    
    Cerințe obligatorii pentru răspuns:
    1. Calculează un necesar caloric zilnic estimativ de pornire (BMR + activitate) bazat pe datele oferite.
    2. Identifică din textul utilizatorului câte mese dorește în total și generează EXACT acel număr de mese.
    3. Pentru fiecare masă, specifică alimentele și caloriile per masă.
    4. Răspunde în limba română, folosind un ton profesional și motivant.
    5. Formatează răspunsul clar cu titluri (ex: ## Recomandare Calorii, ## Plan Mese).`;

    const result = await model.generateContent(prompt);
    setPlan(result.response.text());
  } catch (error) {
    console.error(error);
    setPlan("Eroare la generarea planului. Încearcă să fii mai specific în descriere.");
  }
  setLoading(false);
};
return (
    <div className="min-h-screen bg-black text-white p-6 pb-20">
      <Link href="/" className="inline-flex items-center text-blue-500 mb-8">
        <ArrowLeft className="mr-2" size={20} /> Înapoi
      </Link>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <Utensils className="text-orange-500" /> AI Meal Planner
        </h1>
        <p className="text-gray-400 mb-8">Spune-mi ce obiective ai (ex: slăbire, masă musculară) sau ce ingrediente ai, și eu îți fac meniul.</p>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl mb-8">
          <textarea 
            className="w-full bg-transparent border-none focus:ring-0 text-lg resize-none"
            placeholder="Ex: Am ouă, pui și spanac. Vreau un plan pentru masă musculară..."
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            onClick={generateMealPlan}
            disabled={loading || !input}
            className="w-full mt-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
            Generează Planul
          </button>
        </div>

        {plan && (
          <div className="bg-gray-900/50 border border-orange-500/30 p-8 rounded-3xl animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
              <Apple size={24} /> Planul tău personalizat:
            </h3>
            <div className="text-gray-200 prose prose-invert max-w-none whitespace-pre-wrap">
              {plan}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}