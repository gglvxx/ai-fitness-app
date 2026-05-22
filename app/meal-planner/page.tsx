'use client';
import React, { useState, useEffect } from 'react';
import { Utensils, Sparkles, ArrowLeft, Loader2, Apple, History } from 'lucide-react';
import Link from 'next/link';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabase';

export default function MealPlannerPage() {
  const [input, setInput] = useState('');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const fetchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('meal_plans')
        .select('id, created_at, goal, plan_content')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setHistory(data);
    } catch (error: any) {
      console.error("Eroare la încărcare istoric:", error.message);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const generateMealPlan = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Trebuie să fii logat!");
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

      const prompt = `
        EȘTI UN NUTRIȚIONIST DE ELITĂ. PROFIL CLIENT:
        - Gen: ${profile?.gender || 'Bărbat'}
        - Vârstă: ${profile?.age || '25'} ani
        - Greutate: ${profile?.weight || '70'} kg
        - Înălțime: ${profile?.height || '175'} cm
        - Activitate: ${profile?.activity_level || 'Moderat'}
        - Obiectiv: ${profile?.fitness_goal || 'Menținere'}

        CERINȚA: "${input}"

        INSTRUCȚIUNI:
        1. Calculează BMR și TDEE precis.
        2. Creează un plan alimentar detaliat în limba română.
        3. Folosește formatare Markdown (##, bullet points).
      `;

      const result = await model.generateContent(prompt);
      const generatedContent = result.response.text();
      setPlan(generatedContent);

      const { error: saveError } = await supabase.from('meal_plans').insert([{ 
        goal: input.substring(0, 100), 
        plan_content: generatedContent,
        user_id: user.id
      }]);

      if (saveError) throw saveError;
      fetchHistory();
      
    } catch (error: any) {
      console.error("Eroare:", error.message);
      setPlan("A apărut o eroare. Reîncearcă în câteva secunde.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32 text-left">
      <Link href="/" className="inline-flex items-center text-blue-500 mb-8 hover:text-blue-400">
        <ArrowLeft className="mr-2" size={20} /> Dashboard
      </Link>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <Utensils className="text-orange-500" /> AI Meal Planner
        </h1>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl mb-8 shadow-xl">
          <textarea 
            className="w-full bg-transparent border-none focus:ring-0 text-lg resize-none placeholder:text-gray-600 outline-none"
            placeholder="Ex: 3 mese, am pui și broccoli..."
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            onClick={generateMealPlan}
            disabled={loading || !input}
            className="w-full mt-4 bg-orange-600 hover:bg-orange-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
            Generează Planul
          </button>
        </div>

        {plan && (
          <div className="bg-gray-900/50 border border-orange-500/30 p-8 rounded-3xl mb-12 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
            <h3 className="text-xl font-bold text-orange-400 mb-4 border-b border-orange-500/20 pb-4">
              Rezultat Personalizat:
            </h3>
            <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
              {plan}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-12 border-t border-gray-800 pt-8">
            <h2 className="text-xl font-bold mb-6 text-gray-400 uppercase tracking-tighter">
              Istoric Planuri
            </h2>
            <div className="grid gap-4">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-gray-900/40 border border-gray-800 p-4 rounded-2xl cursor-pointer hover:border-orange-500/50 transition"
                  onClick={() => {
                    setPlan(item.plan_content);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <p className="text-xs text-orange-500 mb-1">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-white font-medium line-clamp-1">{item.goal}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}