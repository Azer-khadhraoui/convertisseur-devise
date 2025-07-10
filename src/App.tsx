import React, { useState } from 'react';
import './App.css';

type Devise = 'TND' | 'EUR' | 'USD' | 'GBP' | 'MAD' | 'CAD' | 'CHF' | 'JPY';

const tauxChange: Record<Devise, number> = {
  TND: 1,     // Base
  EUR: 0.31,  // 1 TND = 0.31 EUR
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
  
  // Fonction pour échanger les devises
  const swapCurrencies = () => {
    setDeviseFrom(deviseTo);
    setDeviseTo(deviseFrom);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
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
                onChange={(e) => setMontant(parseFloat(e.target.value) || 0)}
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
        <div className="mt-8 p-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl text-white text-center">
          <p className="text-sm font-medium mb-1">Résultat</p>
          <p className="text-3xl font-bold">
            {conversion} {deviseInfo[deviseTo].symbol}
          </p>
          <p className="text-sm opacity-90 mt-2">
            1 {deviseFrom} = {convertCurrency(1, deviseFrom, deviseTo).toFixed(4)} {deviseInfo[deviseTo].symbol}
          </p>
        </div>

        {/* Info Section */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            💡 Taux de change indicatifs - Conversion bidirectionnelle
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
