'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Activity, Target, Save, ArrowLeft, Scale, Ruler, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    gender: 'Bărbat',
    age: 25,
    weight: 70,
    height: 175,
    activity_level: 'Moderat',
    fitness_goal: 'Menținere',
    training_frequency: '3-4 zile'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (data && !error) {
        setProfile(data);
      }
    };
    getProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Trebuie să fii logat!");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('profiles').upsert({
      user_id: user.id,
      ...profile
    });
    
    if (!error) alert("Profil actualizat!");
    else alert("Eroare: " + error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32">
      <Link href="/" className="inline-flex items-center text-gray-400 mb-8 hover:text-white transition">
        <ArrowLeft className="mr-2" size={20} /> Înapoi
      </Link>

      <div className="max-w-md mx-auto space-y-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-blue-500 text-left">
          <User size={32} /> Profil Biometric
        </h1>

        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-3xl space-y-6 shadow-2xl">
          {/* GEN */}
          <div className="text-left">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
              <Users size={16} /> Gen
            </label>
            <div className="grid grid-cols-2 gap-4">
              {['Bărbat', 'Femeie'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setProfile({...profile, gender: g})}
                  className={`py-3 rounded-xl border font-bold transition-all ${
                    profile.gender === g 
                      ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                      : 'border-gray-800 bg-black text-gray-500 hover:border-gray-700'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* BIOMETRIE */}
          <div className="grid grid-cols-3 gap-4 text-left">
            <div>
              <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 mb-2 uppercase">
                <Calendar size={12} /> Vârstă
              </label>
              <input 
                type="number" value={profile.age}
                onChange={(e) => setProfile({...profile, age: parseInt(e.target.value) || 0})}
                className="w-full bg-black border border-gray-800 rounded-xl p-3 focus:border-blue-500 outline-none text-center font-bold text-white"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 mb-2 uppercase">
                <Scale size={12} /> Kg
              </label>
              <input 
                type="number" value={profile.weight}
                onChange={(e) => setProfile({...profile, weight: parseInt(e.target.value) || 0})}
                className="w-full bg-black border border-gray-800 rounded-xl p-3 focus:border-blue-500 outline-none text-center font-bold text-white"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 mb-2 uppercase">
                <Ruler size={12} /> Cm
              </label>
              <input 
                type="number" value={profile.height}
                onChange={(e) => setProfile({...profile, height: parseInt(e.target.value) || 0})}
                className="w-full bg-black border border-gray-800 rounded-xl p-3 focus:border-blue-500 outline-none text-center font-bold text-white"
              />
            </div>
          </div>

          <hr className="border-gray-800/50" />

          {/* ACTIVITATE */}
          <div className="text-left">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
              <Activity size={16} /> Nivel activitate
            </label>
            <select 
              value={profile.activity_level}
              onChange={(e) => setProfile({...profile, activity_level: e.target.value})}
              className="w-full bg-black border border-gray-800 rounded-xl p-4 focus:border-blue-500 outline-none text-white cursor-pointer"
            >
              <option value="Sedentar">Sedentar</option>
              <option value="Moderat">Moderat</option>
              <option value="Activ">Activ</option>
              <option value="Foarte Activ">Foarte Activ</option>
            </select>
          </div>

          {/* OBIECTIV */}
          <div className="text-left">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
              <Target size={16} /> Obiectiv
            </label>
            <select 
              value={profile.fitness_goal}
              onChange={(e) => setProfile({...profile, fitness_goal: e.target.value})}
              className="w-full bg-black border border-gray-800 rounded-xl p-4 focus:border-blue-500 outline-none text-white cursor-pointer"
            >
              <option value="Slăbire">Slăbire</option>
              <option value="Menținere">Menținere</option>
              <option value="Masă Musculară">Masă Musculară</option>
            </select>
          </div>

          {/* BUTON SALVARE */}
          <button 
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10 active:scale-95"
          >
            {loading ? "Se salvează..." : <><Save size={20} /> Salvează Preferințele</>}
          </button>
        </div>
      </div>
    </div>
  );
}