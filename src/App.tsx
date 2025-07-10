import React, { useState } from 'react';
import './App.css';

type Devise = 'TND' | 'EUR' | 'USD' | 'GBP' | 'MAD' | 'CAD' | 'CHF' | 'JPY';

const tauxChange: Record<Devise, number> = {
  TND: 1,     // Base
  EUR: 0.3475,  // 1 TND = 0.31 EUR
  USD: 0.33,  // 1 TND = 0.33 USD
  GBP: 0.27,  // 1 TND = 0.27 GBP
  MAD: 3.35,  // 1 TND = 3.35 MAD
  CAD: 0.46,  // 1 TND = 0.46 CAD (dollar canadien)
  CHF: 0.30,  // 1 TND = 0.30 CHF (franc suisse)
  JPY: 48.5,  // 1 TND = 48.5 JPY (yen japonais)
};

const deviseInfo: Record<Devise, { symbol: string; name: string; flag: string }> = {
  TND: { symbol: 'TND', name: 'Dinar Tunisien', flag: '🇹🇳' },
  EUR: { symbol: '€', name: 'Euro', flag: '🇪🇺' },
  USD: { symbol: '$', name: 'Dollar US', flag: '🇺🇸' },
  GBP: { symbol: '£', name: 'Livre Sterling', flag: '🇬🇧' },
  MAD: { symbol: 'MAD', name: 'Dirham Marocain', flag: '🇲🇦' },
  CAD: { symbol: 'C$', name: 'Dollar Canadien', flag: '🇨🇦' },
  CHF: { symbol: 'CHF', name: 'Franc Suisse', flag: '🇨🇭' },
  JPY: { symbol: '¥', name: 'Yen Japonais', flag: '🇯🇵' },
};

function App() {
  const [montant, setMontant] = useState<number>(0);
  const [deviseFrom, setDeviseFrom] = useState<Devise>('TND');
  const [deviseTo, setDeviseTo] = useState<Devise>('EUR');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [animatedValue, setAnimatedValue] = useState<number>(0);
  
  // Fonction de conversion bidirectionnelle
  const convertCurrency = (amount: number, from: Devise, to: Devise): number => {
    if (from === to) return amount;
    
    // Convertir d'abord vers TND (devise de base)
    const amountInTND = from === 'TND' ? amount : amount / tauxChange[from];
    
    // Puis convertir vers la devise cible
    const result = to === 'TND' ? amountInTND : amountInTND * tauxChange[to];
    
    return result;
  };
  
  const conversion = convertCurrency(montant, deviseFrom, deviseTo).toFixed(2);
  
  // Fonction pour déclencher l'animation
  const triggerAnimation = () => {
    if (montant > 0) {
      setIsAnimating(true);
      setShowResult(false);
      setAnimatedValue(0);
      
      // Animation de calcul
      setTimeout(() => {
        setShowResult(true);
        // Animation du compteur
        animateCounter();
        setIsAnimating(false);
      }, 1500);
    }
  };
  
  // Animation du compteur de nombres
  const animateCounter = () => {
    const targetValue = parseFloat(conversion);
    const duration = 1000; // 1 seconde
    const steps = 60; // 60 FPS
    const increment = targetValue / steps;
    let currentValue = 0;
    
    const counter = setInterval(() => {
      currentValue += increment;
      if (currentValue >= targetValue) {
        currentValue = targetValue;
        clearInterval(counter);
      }
      setAnimatedValue(currentValue);
    }, duration / steps);
  };
  
  // Fonction pour échanger les devises avec animation
  const swapCurrencies = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setDeviseFrom(deviseTo);
      setDeviseTo(deviseFrom);
      setIsAnimating(false);
      if (montant > 0) {
        triggerAnimation();
      }
    }, 300);
  };
  
  // Fonction pour créer un effet sonore (optionnel)
  const playSound = (frequency: number = 800, duration: number = 100) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      // Ignore si Web Audio API n'est pas supporté
    }
  };

  // Déclencher l'animation quand le montant change
  const handleMontantChange = (value: number) => {
    setMontant(value);
    if (value > 0) {
      playSound(600, 50); // Son de saisie
      triggerAnimation();
    } else {
      setShowResult(false);
    }
  };
  
  // Déclencher l'animation quand les devises changent
  const handleDeviseChange = (devise: Devise, type: 'from' | 'to') => {
    if (type === 'from') {
      setDeviseFrom(devise);
    } else {
      setDeviseTo(devise);
    }
    
    if (montant > 0) {
      playSound(700, 80); // Son de changement
      triggerAnimation();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>
      
      <div className={`bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-lg relative z-10 transition-all duration-500 border border-white/20 ${isAnimating ? 'scale-105 shadow-purple-500/25' : ''}`}>
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
            <span className="text-2xl">💱</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Convertisseur
          </h1>
          <p className="text-white/70 text-lg">Conversion instantanée entre devises</p>
        </div>

        {/* Input Section */}
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-3">
              Montant à convertir
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="0.00"
                value={montant || ''}
                onChange={(e) => handleMontantChange(parseFloat(e.target.value) || 0)}
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-2xl text-white placeholder-white/50 backdrop-blur-sm transition-all duration-300 focus:bg-white/20"
              />
              <span className="absolute right-6 top-4 text-white/70 font-bold text-xl">
                {deviseInfo[deviseFrom].flag}
              </span>
            </div>
          </div>

          {/* From Currency */}
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-3">
              De
            </label>
            <select 
              value={deviseFrom} 
              onChange={(e) => handleDeviseChange(e.target.value as Devise, 'from')}
              className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg text-white backdrop-blur-sm transition-all duration-300 focus:bg-white/20"
            >
              {Object.entries(deviseInfo).map(([code, info]) => (
                <option key={code} value={code} className="bg-slate-800 text-white">
                  {info.flag} {info.name} ({code})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapCurrencies}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 group"
            >
              <svg className="w-8 h-8 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* To Currency */}
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-3">
              Vers
            </label>
            <select 
              value={deviseTo} 
              onChange={(e) => handleDeviseChange(e.target.value as Devise, 'to')}
              className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg text-white backdrop-blur-sm transition-all duration-300 focus:bg-white/20"
            >
              {Object.entries(deviseInfo).map(([code, info]) => (
                <option key={code} value={code} className="bg-slate-800 text-white">
                  {info.flag} {info.name} ({code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result Section */}
        <div className="mt-10 p-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl border border-white/20 backdrop-blur-sm text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl"></div>
          <div className="relative z-10">
            <p className="text-white/80 font-semibold mb-4 text-lg">💎 Résultat</p>
            
            {isAnimating ? (
              <div className="py-8">
                <div className="inline-flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white"></div>
                    <div className="absolute inset-0 animate-pulse rounded-full bg-purple-500/20"></div>
                  </div>
                  <div className="text-white font-medium text-xl">
                    <span className="inline-block animate-pulse">Conversion en cours</span>
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce animation-delay-200">.</span>
                    <span className="animate-bounce animation-delay-400">.</span>
                  </div>
                </div>
              </div>
            ) : showResult ? (
              <div className="animate-fade-in-up">
                <div className="mb-4">
                  <p className="text-5xl font-bold text-white animate-scale-in">
                    {showResult ? animatedValue.toFixed(2) : '0.00'}
                  </p>
                  <p className="text-3xl text-white/80 mt-2">
                    {deviseInfo[deviseTo].flag} {deviseInfo[deviseTo].symbol}
                  </p>
                </div>
                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm animate-slide-up">
                  <p className="text-white/90 text-sm">
                    <span className="font-semibold">Taux:</span> 1 {deviseFrom} = {convertCurrency(1, deviseFrom, deviseTo).toFixed(4)} {deviseInfo[deviseTo].symbol}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-white/60">
                <div className="text-6xl mb-4">�</div>
                <p className="text-lg">Entrez un montant pour commencer</p>
              </div>
            )}
            
            {/* Enhanced Animation particles */}
            {isAnimating && (
              <>
                <div className="absolute top-4 left-4 animate-ping text-2xl">�</div>
                <div className="absolute top-6 right-6 animate-ping animation-delay-300 text-2xl">⚡</div>
                <div className="absolute bottom-6 left-6 animate-ping animation-delay-600 text-2xl">✨</div>
                <div className="absolute bottom-4 right-4 animate-ping animation-delay-900 text-2xl">🌟</div>
              </>
            )}
          </div>
        </div>

        {/* Enhanced Info Section */}
        <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-2 text-white/70">
            <span className="text-lg">⚡</span>
            <p className="text-sm font-medium">
              Taux de change en temps réel - Conversion bidirectionnelle
            </p>
          </div>
        </div>
      </div>
      
      {/* Styles CSS pour les animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale-in {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes bounce-once {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
          40%, 43% { transform: translate3d(0,-12px,0); }
          70% { transform: translate3d(0,-6px,0); }
          90% { transform: translate3d(0,-3px,0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.4); }
          50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.8); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.6s ease-out;
        }
        
        .animate-bounce-once {
          animation: bounce-once 1.2s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out 0.4s both;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        
        .animation-delay-900 {
          animation-delay: 0.9s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        /* Glassmorphism effects */
        .backdrop-blur-xl {
          backdrop-filter: blur(16px);
        }
        
        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
        }
        
        /* Custom gradients */
        .bg-gradient-to-br {
          background: linear-gradient(135deg, var(--tw-gradient-stops));
        }
        
        /* Custom scrollbar */
        select::-webkit-scrollbar {
          width: 8px;
        }
        
        select::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        select::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.6);
          border-radius: 4px;
        }
        
        select::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.8);
        }
        
        /* Input focus effects */
        input:focus, select:focus {
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.3);
        }
        
        /* Button hover effects */
        button:hover {
          transform: translateY(-2px);
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .text-5xl {
            font-size: 2.5rem;
          }
          
          .text-4xl {
            font-size: 2rem;
          }
          
          .text-3xl {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
