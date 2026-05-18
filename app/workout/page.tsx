'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Dumbbell, History } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';// Importăm conexiunea

export default function WorkoutPage() {
  const [exercise, setExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Funcția care citește datele din Supabase când deschizi pagina
  useEffect(() => {
    fetchWorkouts();
  }, []);

  async function fetchWorkouts() {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setLogs(data);
    setLoading(false);
  }

  // 2. Funcția care salvează un exercițiu nou în Supabase
 const addLog = async () => {
  if (!exercise || !weight) return;

  const { data, error } = await supabase
    .from('workouts')
    .insert([{ 
      exercise: exercise, 
      weight: parseInt(weight) 
      // NU scrie nimic de ID aici, se ocupă Supabase!
    }])
    .select();

  if (error) {
    alert('Eroare: ' + error.message);
  } else {
    if (data) setLogs([data[0], ...logs]);
    setExercise('');
    setWeight('');
  }
};

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <Link href="/" className="inline-flex items-center text-blue-500 hover:text-blue-400 mb-8 transition">
        <ArrowLeft className="mr-2" size={20} /> Înapoi la început
      </Link>

      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold flex items-center gap-3">
            <Dumbbell className="text-blue-500" size={36} /> Workout Tracker
          </h1>
          <p className="text-gray-400 mt-2">Datele tale sunt acum salvate în Cloud.</p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 bg-gray-900/50 p-6 rounded-2xl border border-gray-800 h-fit">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">Log Nou</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                value={exercise}
                onChange={(e) => setExercise(e.target.value)}
                placeholder="Exercițiu (ex: Bench Press)" 
                className="w-full bg-black border border-gray-800 rounded-lg p-2.5 outline-none focus:border-blue-500"
              />
              <input 
                type="number" 
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Greutate (kg)" 
                className="w-full bg-black border border-gray-800 rounded-lg p-2.5 outline-none focus:border-blue-500"
              />
              <button 
                onClick={addLog}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition"
              >
                Salvează în Cloud
              </button>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">Istoric Real-Time</h3>
            {loading ? <p>Se încarcă datele...</p> : logs.map((log,index) => (
              <div key={index} className="bg-gray-900/30 border border-gray-800 p-5 rounded-xl flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-lg">{log.exercise}</h4>
                  <p className="text-sm text-gray-500">{new Date(log.created_at).toLocaleDateString('ro-RO')}</p>
                </div>
                <div className="text-right text-2xl font-black text-blue-500">
                  {log.weight} <span className="text-xs text-gray-500">KG</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}