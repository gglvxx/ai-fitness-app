'use client';
import React from 'react';
import { Dumbbell, Utensils, Camera, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <nav className="flex justify-between items-center p-6 border-b border-gray-800">
        <div className="text-2xl font-bold tracking-tighter text-blue-500">AI MORPH</div>
        <div className="space-x-4">
          <button className="text-sm font-medium hover:text-blue-400 transition">Log In</button>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-bold transition">
            Sign Up
          </button>
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
        <button className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full font-bold flex items-center mx-auto transition text-lg">
          Începe Acum <ArrowRight className="ml-2" />
        </button>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition">
          <Utensils className="text-blue-500 mb-4" size={40} />
          <h3 className="text-xl font-bold mb-2">Smart Meal Planner</h3>
          <p className="text-gray-400 text-sm">Planuri de masă bazate pe bugetul tău și ingredientele pe care le ai deja.</p>
        </div>

        <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition">
          <Dumbbell className="text-blue-500 mb-4" size={40} />
          <h3 className="text-xl font-bold mb-2">Workout Tracking</h3>
          <p className="text-gray-400 text-sm">Monitorizează fiecare serie și repetare. AI-ul îți spune când să crești greutatea.</p>
        </div>

        <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition">
          <Camera className="text-blue-500 mb-4" size={40} />
          <h3 className="text-xl font-bold mb-2">AI Body Analysis</h3>
          <p className="text-gray-400 text-sm">Trimite o poză și primește un plan de evoluție bazat pe forma ta actuală.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-600 border-t border-gray-900">
        <p>© 2026 AI MORPH - Creat pentru Performanță</p>
      </footer>
    </div>
  );
}
