'use client';
import React, { useState, useEffect } from 'react';
import { Dumbbell, Utensils, Camera, ArrowRight, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LandingPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    checkUser();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans text-left">
      {/* Header */}
      <nav className="flex justify-between items-center p-6 border-b border-gray-800">
        <div className="text-2xl font-bold tracking-tighter text-blue-500">AI MORPH</div>
        
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="h-8 w-20 bg-gray-800 animate-pulse rounded-lg" />
          ) : user ? (
            <Link href="/settings" className="text-sm font-medium text-gray-400 hover:text-white transition flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-[10px] text-white">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              Profilul meu
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-blue-400 transition">
                Log In
              </Link>
              <Link href="/login">
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-bold transition">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Transformarea ta, <span className="text-blue-500">inteligentă.</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Singura platformă care combină nutriția, antrenamentul și analiza vizuală AI pentru a-ți sculpta corpul dorit.
        </p>
        
        <div className="flex justify-center">
          {loading ? (
            <div className="h-14 w-48 bg-gray-800 animate-pulse rounded-full" />
          ) : user ? (
            <Link href="/meal-planner">
              <button className="bg-blue-600 text-white hover:bg-blue-500 px-8 py-4 rounded-full font-bold flex items-center transition text-lg group shadow-lg shadow-blue-900/20 border-none">
                Mergi la Dashboard <LayoutDashboard className="ml-2" />
              </button>
            </Link>
          ) : (
            <Link href="/login">
              <button className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full font-bold flex items-center transition text-lg group border-none">
                Începe Acum <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition shadow-lg">
          <Utensils className="text-blue-500 mb-4" size={40} />
          <h3 className="text-xl font-bold mb-2">Smart Meal Planner</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Planuri de masă bazate pe bugetul tău și biometria salvată.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition shadow-lg">
          <Dumbbell className="text-blue-500 mb-4" size={40} />
          <h3 className="text-xl font-bold mb-2">Workout Tracking</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Monitorizează fiecare serie. AI-ul îți ajustează automat volumul de lucru.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition shadow-lg">
          <Camera className="text-blue-500 mb-4" size={40} />
          <h3 className="text-xl font-bold mb-2">AI Morph Analysis</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Analiză multi-unghi și evoluție vizuală bazată pe istoricul tău.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-600 border-t border-gray-900">
        <p>© 2026 AI MORPH - Creat pentru Performanță</p>
      </footer>
    </div>
  );
}