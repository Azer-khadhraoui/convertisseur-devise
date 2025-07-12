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
  
  const conversion = convertCurrency(montant, deviseFrom, deviseTo).toFixed(2);
  const currentRate = convertCurrency(1, deviseFrom, deviseTo);
  
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
        
        // Ajouter à l'historique
        addToHistory(montant, deviseFrom, deviseTo, parseFloat(conversion), currentRate);
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

  // Composant d'historique
  const HistoryPanel = () => (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ${showHistory ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-5/6 overflow-hidden transition-transform duration-300 ${showHistory ? 'scale-100' : 'scale-95'}`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">📊 Historique & Statistiques</h2>
              <p className="text-blue-100">Vos dernières conversions</p>
            </div>
            <button
              onClick={() => setShowHistory(false)}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalConversions}</div>
              <div className="text-sm text-gray-600">Conversions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{deviseInfo[mostUsedCurrency as Devise]?.flag}</div>
              <div className="text-sm text-gray-600">Devise préférée</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.avgAmount.toFixed(0)}</div>
              <div className="text-sm text-gray-600">Montant moyen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{Array.from(favorites).length}</div>
              <div className="text-sm text-gray-600">Favoris</div>
            </div>
          </div>
        </div>

        {/* Liste d'historique */}
        <div className="flex-1 overflow-y-auto p-6">
          {history.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📈</div>
              <p className="text-lg">Aucune conversion encore</p>
              <p className="text-sm">Commencez à convertir pour voir votre historique ici</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.slice(0, 20).map((item) => {
                const pairKey = `${item.deviseFrom}-${item.deviseTo}`;
                const isFavorite = favorites.has(pairKey);
                
                return (
                  <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">
                            {deviseInfo[item.deviseFrom].flag} → {deviseInfo[item.deviseTo].flag}
                          </span>
                          <button
                            onClick={() => toggleFavorite(pairKey)}
                            className={`text-sm ${isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'} transition-colors`}
                          >
                            {isFavorite ? '⭐' : '☆'}
                          </button>
                        </div>
                        <div className="text-lg font-semibold text-gray-800">
                          {item.montant} {item.deviseFrom} = {item.resultat.toFixed(2)} {item.deviseTo}
                        </div>
                        <div className="text-sm text-gray-500">
                          Taux: 1 {item.deviseFrom} = {item.taux.toFixed(4)} {item.deviseTo}
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>{item.timestamp.toLocaleDateString('fr-FR')}</div>
                        <div>{item.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer avec actions */}
        {history.length > 0 && (
          <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
            <button
              onClick={clearHistory}
              className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              🗑️ Effacer l'historique
            </button>
            <div className="text-sm text-gray-600">
              {history.length} conversion{history.length > 1 ? 's' : ''} enregistrée{history.length > 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute -bottom-8 -right-8 w-96 h-96 bg-pink-300/20 rounded-full blur-xl animate-float-reverse"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-300/15 rounded-full blur-xl animate-pulse-slow"></div>
      </div>
      
      <div className={`bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 transition-all duration-300 ${isAnimating ? 'scale-105 shadow-3xl' : ''}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setShowHistory(true)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center space-x-1"
              >
                <span>📊</span>
                <span>Historique</span>
                {history.length > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {history.length}
                  </span>
                )}
              </button>
              
              {/* Bouton favoris rapides */}
              {Array.from(favorites).length > 0 && (
                <div className="flex space-x-1">
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
                        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs font-medium transition-colors"
                      >
                        {deviseInfo[from].flag}→{deviseInfo[to].flag}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 animate-gradient-text">
            Convertisseur de Devises
          </h1>
          <p className="text-gray-600">Conversion entre toutes les devises</p>
        </div>

        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant à convertir
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="0.00"
                value={montant || ''}
                onChange={(e) => handleMontantChange(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <span className="absolute right-3 top-3 text-gray-500 font-medium">
                {deviseInfo[deviseFrom].symbol}
              </span>
            </div>
          </div>

          {/* From Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              De
            </label>
            <select 
              value={deviseFrom} 
              onChange={(e) => setDeviseFrom(e.target.value as Devise)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-white"
            >
              {Object.entries(deviseInfo).map(([code, info]) => (
                <option key={code} value={code}>
                  {info.flag} {info.name} ({code})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapCurrencies}
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* To Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vers
            </label>
            <select 
              value={deviseTo} 
              onChange={(e) => setDeviseTo(e.target.value as Devise)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-white"
            >
              {Object.entries(deviseInfo).map(([code, info]) => (
                <option key={code} value={code}>
                  {info.flag} {info.name} ({code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl text-white text-center relative overflow-hidden">
          <p className="text-sm font-medium mb-1">Résultat</p>
          
          {isAnimating ? (
            <div className="py-4">
              <div className="inline-flex items-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="text-lg">Calcul en cours...</span>
              </div>
            </div>
          ) : showResult ? (
            <div className="animate-fade-in">
              <p className="text-3xl font-bold animate-bounce-once">
                ✨ {conversion} {deviseInfo[deviseTo].symbol}
              </p>
              <p className="text-sm opacity-90 mt-2 animate-slide-up">
                1 {deviseFrom} = {convertCurrency(1, deviseFrom, deviseTo).toFixed(4)} {deviseInfo[deviseTo].symbol}
              </p>
            </div>
          ) : (
            <div className="py-4 text-white/60">
              <p className="text-2xl">💱</p>
              <p className="text-sm">Saisissez un montant pour voir le résultat</p>
            </div>
          )}
          
          {/* Animation particles */}
          {isAnimating && (
            <>
              <div className="absolute top-2 left-4 animate-ping">💰</div>
              <div className="absolute top-4 right-6 animate-ping animation-delay-200">💱</div>
              <div className="absolute bottom-4 left-6 animate-ping animation-delay-400">✨</div>
            </>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            💡 Taux de change indicatifs - Conversion bidirectionnelle
          </p>
        </div>
      </div>
      
      {/* Historique Panel */}
      <HistoryPanel />
      
      {/* Styles CSS pour les animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes bounce-once {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
          40%, 43% { transform: translate3d(0,-8px,0); }
          70% { transform: translate3d(0,-4px,0); }
          90% { transform: translate3d(0,-2px,0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-bounce-once {
          animation: bounce-once 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out 0.3s both;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}

export default App;
