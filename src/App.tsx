import React, { useState, useEffect } from 'react';
import './App.css';

type Devise = 'TND' | 'EUR' | 'USD' | 'GBP' | 'MAD' | 'CAD' | 'CHF' | 'JPY';

// Interface pour l'historique des conversions
interface ConversionHistory {
  id: string;
  montant: number;
  deviseFrom: Devise;
  deviseTo: Devise;
  resultat: number;
  taux: number;
  timestamp: Date;
}

const tauxChange: Record<Devise, number> = {
  TND: 1,     // Base
  EUR: 3.475,  // 1 EUR = 3.475 TND
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
  
  // Nouveaux états pour l'historique
  const [history, setHistory] = useState<ConversionHistory[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Charger l'historique depuis localStorage au démarrage
  useEffect(() => {
    const savedHistory = localStorage.getItem('currency-history');
    const savedFavorites = localStorage.getItem('currency-favorites');
    
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
      setHistory(parsedHistory);
    }
    
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Sauvegarder dans localStorage quand l'historique change
  useEffect(() => {
    localStorage.setItem('currency-history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('currency-favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);
  
  // Fonction pour ajouter une conversion à l'historique
  const addToHistory = (montant: number, from: Devise, to: Devise, resultat: number, taux: number) => {
    const newConversion: ConversionHistory = {
      id: Date.now().toString(),
      montant,
      deviseFrom: from,
      deviseTo: to,
      resultat,
      taux,
      timestamp: new Date()
    };
    
    setHistory(prev => [newConversion, ...prev.slice(0, 49)]); // Garder max 50 entrées
  };

  // Fonction de conversion bidirectionnelle
  const convertCurrency = (amount: number, from: Devise, to: Devise): number => {
    if (from === to) return amount;
    
    // Convertir d'abord vers TND (devise de base)
    const amountInTND = from === 'TND' ? amount : amount / tauxChange[from];
    
    // Puis convertir vers la devise cible
    const result = to === 'TND' ? amountInTND : amountInTND * tauxChange[to];
    
    return result;
  };
  
  const conversion = convertCurrency(montant, deviseFrom, deviseTo);
  const currentRate = convertCurrency(1, deviseFrom, deviseTo);
  
  // Fonction pour déclencher l'animation - CORRIGÉE
  const triggerAnimation = () => {
    if (montant > 0) {
      setIsAnimating(true);
      setShowResult(false);
      setAnimatedValue(0);
      
      // Calculer le résultat final avant l'animation
      const finalResult = convertCurrency(montant, deviseFrom, deviseTo);
      
      // Animation de calcul
      setTimeout(() => {
        setShowResult(true);
        // Animation du compteur avec la valeur finale correcte
        animateCounter(finalResult);
        setIsAnimating(false);
        
        // Ajouter à l'historique avec la valeur finale correcte
        addToHistory(montant, deviseFrom, deviseTo, finalResult, convertCurrency(1, deviseFrom, deviseTo));
      }, 1500);
    }
  };
  
  // Animation du compteur de nombres - CORRIGÉE
  const animateCounter = (finalValue: number) => {
    const targetValue = finalValue;
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
  
  // Fonction pour échanger les devises avec animation - CORRIGÉE
  const swapCurrencies = () => {
    playSound(700, 80); // Son d'échange
    setIsAnimating(true);
    
    // Échanger les devises immédiatement
    const tempFrom = deviseFrom;
    setDeviseFrom(deviseTo);
    setDeviseTo(tempFrom);
    
    setTimeout(() => {
      setIsAnimating(false);
      // Déclencher une nouvelle conversion si il y a un montant
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

  // Fonction pour basculer les favoris
  const toggleFavorite = (pair: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(pair)) {
      newFavorites.delete(pair);
    } else {
      newFavorites.add(pair);
    }
    setFavorites(newFavorites);
  };

  // Fonction pour effacer l'historique
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('currency-history');
  };

  // Statistiques calculées
  const stats = {
    totalConversions: history.length,
    mostUsedFrom: history.length > 0 ? history.reduce((acc, curr) => {
      acc[curr.deviseFrom] = (acc[curr.deviseFrom] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) : {},
    totalAmount: history.reduce((sum, item) => sum + item.montant, 0),
    avgAmount: history.length > 0 ? history.reduce((sum, item) => sum + item.montant, 0) / history.length : 0
  };

  const mostUsedCurrency = Object.entries(stats.mostUsedFrom).sort(([,a], [,b]) => b - a)[0]?.[0] || 'TND';

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

  // Composant d'historique premium
  const HistoryPanel = () => (
    <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 ${showHistory ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-3xl h-5/6 overflow-hidden transition-all duration-500 border border-white/20 ${showHistory ? 'scale-100' : 'scale-95'}`}>
        
        {/* Header premium */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent,rgba(255,255,255,0.1),transparent)]"></div>
          <div className="relative flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                <span className="text-4xl animate-bounce">📊</span>
                Tableau de Bord
              </h2>
              <p className="text-purple-100 text-lg font-medium">
                Analytics & Historique Pro
              </p>
            </div>
            <button
              onClick={() => setShowHistory(false)}
              className="text-white hover:bg-white/20 p-3 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Statistiques premium */}
        <div className="p-8 bg-gradient-to-br from-slate-900/50 to-purple-900/30 border-b border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-3xl font-black text-blue-400 mb-2">{stats.totalConversions}</div>
              <div className="text-sm text-white/70 font-medium">Conversions Totales</div>
            </div>
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-3xl mb-2">{deviseInfo[mostUsedCurrency as Devise]?.flag}</div>
              <div className="text-sm text-white/70 font-medium">Devise Préférée</div>
            </div>
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-3xl font-black text-green-400 mb-2">{stats.avgAmount.toFixed(0)}</div>
              <div className="text-sm text-white/70 font-medium">Montant Moyen</div>
            </div>
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-3xl font-black text-orange-400 mb-2">{Array.from(favorites).length}</div>
              <div className="text-sm text-white/70 font-medium">Favoris</div>
            </div>
          </div>
        </div>

        {/* Liste d'historique premium avec scroll amélioré */}
        <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-transparent to-black/20 max-h-96 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
          {history.length === 0 ? (
            <div className="text-center py-16 text-white/60">
              <div className="text-8xl mb-6 animate-pulse">📈</div>
              <p className="text-2xl font-bold mb-2">Aucune conversion</p>
              <p className="text-lg">Commencez à convertir pour voir votre historique</p>
            </div>
          ) : (
            <div className="space-y-4 pr-2">
              <div className="text-center mb-4">
                <p className="text-white/60 text-sm">📜 Faites défiler pour voir plus d'entrées</p>
              </div>
              {history.map((item) => {
                const pairKey = `${item.deviseFrom}-${item.deviseTo}`;
                const isFavorite = favorites.has(pairKey);
                
                return (
                  <div key={item.id} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] group">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-2 text-xl">
                            <span>{deviseInfo[item.deviseFrom].flag}</span>
                            <span className="text-white/40">→</span>
                            <span>{deviseInfo[item.deviseTo].flag}</span>
                          </div>
                          <div className="text-white/60 text-sm font-medium">
                            {new Date(item.timestamp).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        <div className="text-white">
                          <span className="font-bold text-lg">{item.montant} {deviseInfo[item.deviseFrom].symbol}</span>
                          <span className="text-white/60 mx-3">=</span>
                          <span className="font-bold text-lg text-green-400">{item.resultat.toFixed(2)} {deviseInfo[item.deviseTo].symbol}</span>
                        </div>
                        <div className="text-white/50 text-sm mt-1">
                          Taux: {item.taux.toFixed(4)}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFavorite(pairKey)}
                        className={`p-2 rounded-xl transition-all duration-300 ${
                          isFavorite 
                            ? 'text-yellow-400 bg-yellow-400/20 hover:bg-yellow-400/30' 
                            : 'text-white/40 bg-white/5 hover:bg-white/10 hover:text-white/80'
                        }`}
                      >
                        {isFavorite ? '⭐' : '☆'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer avec actions */}
        {history.length > 0 && (
          <div className="p-6 bg-white/5 backdrop-blur-sm border-t border-white/10">
            <button
              onClick={clearHistory}
              className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 py-3 px-6 rounded-2xl transition-all duration-300 border border-red-500/20 hover:border-red-500/40 font-bold"
            >
              🗑️ Effacer l'historique
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      
      {/* Background Effects Premium */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 rounded-full filter blur-2xl animate-pulse delay-500"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>
      
      {/* Container principal avec effet de verre */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          
          {/* Header Premium */}
          <div className="text-center mb-10">
            <div className="relative inline-block">
              <h1 className="text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4 tracking-tight">
                CurrencyPro
              </h1>
              <div className="absolute -top-3 -right-3 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-ping"></div>
              <div className="absolute -top-3 -right-3 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-4xl animate-bounce">💱</span>
              <p className="text-white/80 text-lg font-medium">
                Conversion Pro • Design Premium
              </p>
            </div>
            
            {/* Indicateurs de statut */}
            <div className="flex justify-center gap-3 mb-6">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/90 text-sm font-medium">En ligne</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <span className="text-sm text-white/90 font-medium">8 Devises</span>
              </div>
            </div>
          </div>

          {/* Carte principale avec glassmorphism premium */}
          <div className={`relative bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-8 transition-all duration-700 hover:bg-white/10 ${isAnimating ? 'scale-105 shadow-purple-500/20 shadow-2xl ring-2 ring-purple-400/20' : ''}`}>
            
            {/* Effet lumineux sur les bords */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Navigation des favoris et historique */}
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={() => setShowHistory(true)}
                className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-5 py-3 rounded-xl transition-all duration-300 border border-white/20 hover:border-white/30 flex items-center gap-3 shadow-lg hover:shadow-xl"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">📊</span>
                <div className="text-left">
                  <div className="text-sm font-semibold">Historique</div>
                  {history.length > 0 && (
                    <div className="text-xs text-white/70">{history.length} conversions</div>
                  )}
                </div>
                {history.length > 0 && (
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                    {history.length}
                  </span>
                )}
              </button>
              
              {/* Favoris rapides avec design amélioré */}
              {Array.from(favorites).length > 0 && (
                <div className="flex gap-2">
                  {Array.from(favorites).slice(0, 2).map(pair => {
                    const [from, to] = pair.split('-') as [Devise, Devise];
                    return (
                      <button
                        key={pair}
                        onClick={() => {
                          setDeviseFrom(from);
                          setDeviseTo(to);
                          if (montant > 0) triggerAnimation();
                        }}
                        className="group bg-gradient-to-r from-yellow-400/20 to-orange-400/20 hover:from-yellow-400/30 hover:to-orange-400/30 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 border border-yellow-400/20 hover:border-yellow-400/40 shadow-md hover:shadow-lg"
                      >
                        <span className="group-hover:scale-110 transition-transform inline-block">
                          {deviseInfo[from].flag}→{deviseInfo[to].flag}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Section montant avec design premium */}
            <div className="mb-8">
              <label className="block text-white/90 text-sm font-bold mb-4 flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                💰 Montant à convertir
              </label>
              <div className="relative group">
                <input
                  type="number"
                  value={montant}
                  onChange={(e) => handleMontantChange(Number(e.target.value))}
                  className="w-full p-6 text-3xl font-black text-center border-2 border-white/10 rounded-2xl focus:border-purple-400/50 focus:ring-4 focus:ring-purple-400/10 transition-all duration-300 bg-white/5 hover:bg-white/10 text-white placeholder-white/40 backdrop-blur-xl shadow-lg hover:shadow-xl group-hover:scale-[1.02]"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white/60 font-bold text-lg">
                  {deviseInfo[deviseFrom].symbol}
                </div>
              </div>
            </div>

            {/* Section sélecteurs de devises avec design moderne */}
            <div className="grid grid-cols-1 gap-6 mb-8">
              
              {/* Devise source */}
              <div>
                <label className="block text-white/90 text-sm font-bold mb-4 flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
                  📤 Depuis
                </label>
                <div className="relative group">
                  <select 
                    value={deviseFrom} 
                    onChange={(e) => handleDeviseChange(e.target.value as Devise, 'from')}
                    className="w-full p-4 text-lg font-bold border-2 border-white/10 rounded-2xl focus:border-blue-400/50 focus:ring-4 focus:ring-blue-400/10 transition-all duration-300 bg-white/5 hover:bg-white/10 text-white backdrop-blur-xl shadow-lg hover:shadow-xl appearance-none cursor-pointer group-hover:scale-[1.02]"
                  >
                    {Object.entries(deviseInfo).map(([code, info]) => (
                      <option key={code} value={code} className="bg-slate-800 text-white">
                        {info.flag} {info.name} ({code})
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bouton d'échange stylé */}
              <div className="flex justify-center">
                <button
                  onClick={swapCurrencies}
                  className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 border border-white/20"
                >
                  <svg className={`w-6 h-6 transition-transform duration-300 ${isAnimating ? 'rotate-180' : 'group-hover:rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>

              {/* Devise cible */}
              <div>
                <label className="block text-white/90 text-sm font-bold mb-4 flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
                  📥 Vers
                </label>
                <div className="relative group">
                  <select 
                    value={deviseTo} 
                    onChange={(e) => handleDeviseChange(e.target.value as Devise, 'to')}
                    className="w-full p-4 text-lg font-bold border-2 border-white/10 rounded-2xl focus:border-green-400/50 focus:ring-4 focus:ring-green-400/10 transition-all duration-300 bg-white/5 hover:bg-white/10 text-white backdrop-blur-xl shadow-lg hover:shadow-xl appearance-none cursor-pointer group-hover:scale-[1.02]"
                  >
                    {Object.entries(deviseInfo).map(([code, info]) => (
                      <option key={code} value={code} className="bg-slate-800 text-white">
                        {info.flag} {info.name} ({code})
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            


            {/* Animation de chargement */}
            {isAnimating && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-3">
                  <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-4 h-4 bg-pink-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                </div>
                <p className="text-white/70 mt-4 font-medium">Conversion en cours...</p>
              </div>
            )}

            {/* Informations sur le taux actuel - RÉSULTAT PRINCIPAL */}
            {montant > 0 && !isAnimating && (
              <div className="mt-6 p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl border border-green-400/30 shadow-xl">
                <div className="text-center">
                  <div className="text-sm text-white/70 font-medium mb-3">💰 Résultat de la conversion</div>
                  <div className="text-white text-lg mb-4">
                    <span className="font-bold text-2xl">{montant} {deviseInfo[deviseFrom].symbol}</span>
                    <span className="mx-4 text-white/60">=</span>
                    <span className="font-bold text-2xl text-green-400">{conversion.toFixed(2)} {deviseInfo[deviseTo].symbol}</span>
                  </div>
                  <div className="text-sm text-white/60 mb-4">
                    Taux : 1 {deviseInfo[deviseFrom].symbol} = {currentRate.toFixed(4)} {deviseInfo[deviseTo].symbol}
                  </div>
                  
                  {/* Bouton favoris avec style premium */}
                  <button
                    onClick={() => {
                      const pairKey = `${deviseFrom}-${deviseTo}`;
                      toggleFavorite(pairKey);
                      playSound(800, 100);
                    }}
                    className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl ${
                      favorites.has(`${deviseFrom}-${deviseTo}`)
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:from-yellow-500 hover:to-orange-500'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30'
                    }`}
                  >
                    {favorites.has(`${deviseFrom}-${deviseTo}`) ? '⭐ Retiré des favoris' : '⭐ Ajouter aux favoris'}
                  </button>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
      
      {/* Composant Historique amélioré */}
      <HistoryPanel />
    </div>
  );
}

export default App;
