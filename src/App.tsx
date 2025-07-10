import React, { useState } from 'react';
import './App.css';

type Devise = 'EUR' | 'USD' | 'GBP' | 'MAD';

const tauxChange: Record<Devise, number> = {
  EUR: 0.31,  // 1 DT = 0.31 EUR (taux réel approximatif)
  USD: 0.33,  // 1 DT = 0.33 USD
  GBP: 0.27,  // 1 DT = 0.27 GBP
  MAD: 3.35,  // 1 DT = 3.35 MAD (dirham marocain)
};

const deviseSymbols: Record<Devise, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  MAD: 'MAD',
};

function App() {
  const [montant, setMontant] = useState<number>(0);
  const [devise, setDevise] = useState<Devise>('EUR');
  
  const conversion = (montant * tauxChange[devise]).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Convertisseur TND
          </h1>
          <p className="text-gray-600">Dinar Tunisien vers autres devises</p>
        </div>

        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant en TND
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
                TND
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Convertir vers
            </label>
            <select 
              value={devise} 
              onChange={(e) => setDevise(e.target.value as Devise)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-white"
            >
              <option value="EUR">🇪🇺 Euro (EUR)</option>
              <option value="USD">🇺🇸 Dollar Américain (USD)</option>
              <option value="GBP">🇬🇧 Livre Sterling (GBP)</option>
              <option value="MAD">🇲🇦 Dirham Marocain (MAD)</option>
            </select>
          </div>
        </div>

        {/* Result Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl text-white text-center">
          <p className="text-sm font-medium mb-1">Résultat</p>
          <p className="text-3xl font-bold">
            {conversion} {deviseSymbols[devise]}
          </p>
          <p className="text-sm opacity-90 mt-2">
            Taux: 1 TND = {tauxChange[devise]} {deviseSymbols[devise]}
          </p>
        </div>

        {/* Info Section */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            💡 Taux de change indicatifs mis à jour régulièrement
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
