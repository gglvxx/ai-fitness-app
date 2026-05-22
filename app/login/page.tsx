'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { LogIn, UserPlus, Mail, Lock, Loader2 } from 'lucide-react';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert("Cont creat! Acum te poți loga.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else router.push('/'); // Te trimite la Dashboard după logare
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          {isSignUp ? <UserPlus className="text-blue-500" /> : <LogIn className="text-blue-500" />}
          {isSignUp ? "Cont Nou" : "Log In"}
        </h1>
        <p className="text-gray-400 mb-8 text-sm">Introduceți datele pentru a continua.</p>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-4 text-gray-500" size={20} />
            <input 
              type="email" placeholder="Email" required
              className="w-full bg-black border border-gray-700 rounded-xl p-4 pl-12 text-white outline-none focus:border-blue-500"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-4 text-gray-500" size={20} />
            <input 
              type="password" placeholder="Parolă" required
              className="w-full bg-black border border-gray-700 rounded-xl p-4 pl-12 text-white outline-none focus:border-blue-500"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : (isSignUp ? "Înregistrare" : "Conectare")}
          </button>
        </form>

        <button 
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full mt-6 text-gray-400 text-sm hover:text-white transition"
        >
          {isSignUp ? "Ai deja cont? Loghează-te" : "Nu ai cont? Creează unul acum"}
        </button>
      </div>
    </div>
  );
}