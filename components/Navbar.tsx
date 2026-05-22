'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dumbbell, Utensils, Sparkles, LayoutDashboard, User, LogIn } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Workout', href: '/workout', icon: Dumbbell },
    { name: 'AI Morph', href: '/ai-analysis', icon: Sparkles },
    { name: 'Meals', href: '/meal-planner', icon: Utensils },
    { name: 'Profil', href: '/settings', icon: User },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4">
      <div className="bg-gray-900/80 backdrop-blur-lg border border-white/10 px-6 py-3 rounded-full flex items-center gap-6 md:gap-8 shadow-2xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-all relative ${
                isActive ? 'text-blue-500 scale-110' : 'text-gray-400 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium uppercase tracking-wider">{item.name}</span>
              {isActive && (
                <div className="absolute -bottom-2 w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]" />
              )}
            </Link>
          );
        })}

        {/* --- LINIE DESPĂRȚITOARE SUBȚIRE --- */}
        <div className="w-[1px] h-6 bg-white/10" />

        {/* --- BUTONUL DE LOGIN / SIGN UP --- */}
        <Link 
          href="/login"
          className={`flex flex-col items-center gap-1 transition-all ${
            pathname === '/login' ? 'text-green-500' : 'text-gray-400 hover:text-green-400'
          }`}
        >
          <LogIn size={20} />
          <span className="text-[10px] font-medium uppercase tracking-wider italic">Login</span>
        </Link>
      </div>
    </nav>
  );
}