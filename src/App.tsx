import React, { useState } from 'react';
import { PledgeForm } from './components/PledgeForm';
import { PledgeCard } from './components/PledgeCard';
import { Adda247Logo } from './components/Adda247Logo';
import { AdminDashboard } from './components/AdminDashboard';
import { IntroScreen } from './components/IntroScreen';
import { PledgeData } from './types';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [pledgeData, setPledgeData] = useState<PledgeData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleFooterClick = () => {
    setClickCount((prev) => prev + 1);
    if (clickCount >= 4) { // 5 clicks total
      setIsAdmin(true);
      setClickCount(0);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden relative font-sans flex flex-col">
      {/* Background aesthetics - optimized for performance without heavy mix-blend/animations on mobile */}
      <div className="fixed inset-0 z-0 select-none pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-red-100/60 rounded-full blur-3xl md:blur-[100px]"></div>
        <div className="absolute top-[20%] left-[-10%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-rose-100/50 rounded-full blur-3xl md:blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[400px] md:w-[800px] h-[250px] md:h-[400px] bg-amber-100/50 rounded-full blur-3xl md:blur-[100px]"></div>
      </div>

      <header className="relative z-10 w-full p-4 flex justify-center w-full bg-white/70 backdrop-blur-md shadow-sm border-b border-slate-200/50">
        <Adda247Logo />
      </header>

      <main className="flex-1 relative z-10 flex flex-col items-center justify-start p-4 py-6 md:py-8 mt-2 md:mt-4 w-full">
        {isAdmin ? (
          <AdminDashboard onExit={() => setIsAdmin(false)} />
        ) : showIntro ? (
          <IntroScreen onStart={() => setShowIntro(false)} />
        ) : !pledgeData ? (
          <PledgeForm onSubmit={setPledgeData} />
        ) : (
          <PledgeCard data={pledgeData} onReset={() => setPledgeData(null)} />
        )}
      </main>
      
      <footer className="relative z-10 w-full p-4 text-center text-sm text-slate-400 font-medium">
        <span 
          onClick={handleFooterClick}
          className="cursor-default select-none"
        >
          &copy; {new Date().getFullYear()} Adda247. All rights reserved.
        </span>
      </footer>
    </div>
  );
}
