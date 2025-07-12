import React, { useState, useEffect } from 'react';
import './App.css';
import { useCurrencyAPI } from './hooks/useCurrencyAPI';

// Définition des types
interface Currency {
  code: string;
  name: string;
  flag: string;
}

const App: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('EUR');
  const [toCurrency, setToCurrency] = useState<string>('USD');
  const [result, setResult] = useState<number | null>(null);
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Utilisation du hook de l'API
  const { isOnline, loading, error, convertWithAPI, checkAPIHealth } = useCurrencyAPI();

  // Liste des devises populaires
  const currencies: Currency[] = [
    { code: 'EUR', name: 'Euro', flag: 'EU' },
    { code: 'USD', name: 'Dollar américain', flag: 'US' },
    { code: 'GBP', name: 'Livre sterling', flag: 'GB' },
    { code: 'JPY', name: 'Yen japonais', flag: 'JP' },
    { code: 'CHF', name: 'Franc suisse', flag: 'CH' },
    { code: 'CAD', name: 'Dollar canadien', flag: 'CA' },
    { code: 'AUD', name: 'Dollar australien', flag: 'AU' },
    { code: 'CNY', name: 'Yuan chinois', flag: 'CN' },
    { code: 'INR', name: 'Roupie indienne', flag: 'IN' },
    { code: 'BRL', name: 'Real brésilien', flag: 'BR' },
    { code: 'RUB', name: 'Rouble russe', flag: 'RU' },
    { code: 'KRW', name: 'Won sud-coréen', flag: 'KR' },
    { code: 'SGD', name: 'Dollar de Singapour', flag: 'SG' },
    { code: 'HKD', name: 'Dollar de Hong Kong', flag: 'HK' },
    { code: 'NOK', name: 'Couronne norvégienne', flag: 'NO' },
    { code: 'SEK', name: 'Couronne suédoise', flag: 'SE' },
    { code: 'DKK', name: 'Couronne danoise', flag: 'DK' },
    { code: 'PLN', name: 'Zloty polonais', flag: 'PL' },
    { code: 'CZK', name: 'Couronne tchèque', flag: 'CZ' },
    { code: 'HUF', name: 'Forint hongrois', flag: 'HU' },
    { code: 'TRY', name: 'Livre turque', flag: 'TR' },
    { code: 'ZAR', name: 'Rand sud-africain', flag: 'ZA' },
    { code: 'MXN', name: 'Peso mexicain', flag: 'MX' },
    { code: 'AED', name: 'Dirham des EAU', flag: 'AE' },
    { code: 'SAR', name: 'Riyal saoudien', flag: 'SA' },
    { code: 'EGP', name: 'Livre égyptienne', flag: 'EG' },
    { code: 'THB', name: 'Baht thaïlandais', flag: 'TH' },
    { code: 'MYR', name: 'Ringgit malaisien', flag: 'MY' },
    { code: 'IDR', name: 'Roupie indonésienne', flag: 'ID' },
    { code: 'PHP', name: 'Peso philippin', flag: 'PH' },
    { code: 'VND', name: 'Dong vietnamien', flag: 'VN' },
    { code: 'ILS', name: 'Shekel israélien', flag: 'IL' },
    { code: 'CLP', name: 'Peso chilien', flag: 'CL' },
    { code: 'COP', name: 'Peso colombien', flag: 'CO' },
    { code: 'PEN', name: 'Sol péruvien', flag: 'PE' },
    { code: 'ARS', name: 'Peso argentin', flag: 'AR' },
    { code: 'MAD', name: 'Dirham marocain', flag: 'MA' },
    { code: 'TND', name: 'Dinar tunisien', flag: 'TN' },
    { code: 'DZD', name: 'Dinar algérien', flag: 'DZ' },
    { code: 'LYD', name: 'Dinar libyen', flag: 'LY' },
    { code: 'LBP', name: 'Livre libanaise', flag: 'LB' },
    { code: 'JOD', name: 'Dinar jordanien', flag: 'JO' },
    { code: 'SYP', name: 'Livre syrienne', flag: 'SY' },
    { code: 'IQD', name: 'Dinar irakien', flag: 'IQ' },
    { code: 'KWD', name: 'Dinar koweïtien', flag: 'KW' },
    { code: 'BHD', name: 'Dinar bahreïni', flag: 'BH' },
    { code: 'QAR', name: 'Riyal qatari', flag: 'QA' },
    { code: 'OMR', name: 'Rial omanais', flag: 'OM' },
    { code: 'YER', name: 'Rial yéménite', flag: 'YE' }
  ];

  // Fonction pour convertir les devises via API
  const convertCurrency = async (): Promise<void> => {
    if (!amount || isNaN(parseFloat(amount))) {
      alert('Veuillez entrer un montant valide');
      return;
    }

    if (!isOnline) {
      alert('API non disponible. Veuillez vérifier que le serveur est démarré.');
      return;
    }

    const amountNum = parseFloat(amount);
    const conversionResult = await convertWithAPI(amountNum, fromCurrency, toCurrency);

    if (conversionResult) {
      setResult(conversionResult.result);
      setConversionRate(conversionResult.rate);
      setLastUpdate(new Date(conversionResult.timestamp).toLocaleString('fr-FR'));
    }
  };

  // Fonction pour inverser les devises
  const swapCurrencies = (): void => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
    setConversionRate(null);
  };

  // Fonction pour obtenir le code de devise
  const getCurrencyInfo = (code: string): Currency | undefined => {
    return currencies.find(currency => currency.code === code);
  };

  // Composant pour l'affichage du drapeau
  const FlagIcon: React.FC<{ currencyCode: string; className?: string }> = ({ currencyCode, className = '' }) => {
    const currency = getCurrencyInfo(currencyCode);
    
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <span className="w-6 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-sm flex items-center justify-center text-xs text-white font-bold">
          {currency?.flag || currencyCode.substring(0, 2)}
        </span>
      </div>
    );
  };

  // Indicateur de statut API
  const ApiStatus: React.FC = () => (
    <div className="flex items-center justify-center mb-4">
      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
        isOnline 
          ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
          : 'bg-red-500/20 text-red-300 border border-red-500/30'
      }`}>
        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
        <span>{isOnline ? 'API Connectée' : 'API Hors ligne'}</span>
        {!isOnline && (
          <button
            onClick={checkAPIHealth}
            className="text-blue-300 hover:text-blue-200 underline ml-2"
          >
            Reconnecter
          </button>
        )}
      </div>
    </div>
  );

  // Vérification périodique de l'API
  useEffect(() => {
    const interval = setInterval(checkAPIHealth, 30000); // Vérifier toutes les 30 secondes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">CurrencyPro</h1>
          <p className="text-blue-200">Convertisseur de devises avec API</p>
        </div>

        {/* Card principale */}
        <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Statut API */}
          <ApiStatus />

          {/* Message d'erreur */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Montant à convertir */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-2">Montant</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setResult(null);
                setConversionRate(null);
              }}
              placeholder="Entrez le montant"
              className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          {/* Devise source */}
          <div className="mb-4">
            <label className="block text-white font-medium mb-2">De</label>
            <div className="relative">
              <select
                value={fromCurrency}
                onChange={(e) => {
                  setFromCurrency(e.target.value);
                  setResult(null);
                  setConversionRate(null);
                }}
                className="w-full px-4 py-3 pl-12 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent appearance-none"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code} className="bg-gray-800 text-white">
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FlagIcon currencyCode={fromCurrency} />
              </div>
            </div>
          </div>

          {/* Bouton d'échange */}
          <div className="flex justify-center mb-4">
            <button
              onClick={swapCurrencies}
              className="p-3 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:rotate-180"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* Devise cible */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-2">Vers</label>
            <div className="relative">
              <select
                value={toCurrency}
                onChange={(e) => {
                  setToCurrency(e.target.value);
                  setResult(null);
                  setConversionRate(null);
                }}
                className="w-full px-4 py-3 pl-12 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent appearance-none"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code} className="bg-gray-800 text-white">
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FlagIcon currencyCode={toCurrency} />
              </div>
            </div>
          </div>

          {/* Bouton de conversion */}
          <button
            onClick={convertCurrency}
            disabled={loading || !amount || !isOnline}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Conversion via API...
              </div>
            ) : (
              'Convertir avec API'
            )}
          </button>

          {/* Résultat */}
          {result !== null && (
            <div className="mt-6 p-4 rounded-xl bg-white/10 backdrop-blur border border-white/20">
              <div className="text-center">
                <p className="text-white/70 text-sm mb-1">Résultat de l'API</p>
                <div className="flex items-center justify-center space-x-2">
                  <FlagIcon currencyCode={toCurrency} />
                  <p className="text-2xl font-bold text-white">
                    {result.toLocaleString('fr-FR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6
                    })} {toCurrency}
                  </p>
                </div>
                {conversionRate && (
                  <p className="text-white/50 text-xs mt-2">
                    Taux: 1 {fromCurrency} = {conversionRate.toFixed(6)} {toCurrency}
                  </p>
                )}
                {lastUpdate && (
                  <p className="text-white/40 text-xs mt-1">
                    Mis à jour: {lastUpdate}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/50 text-sm">
            {isOnline ? 'Taux en temps réel via API • Conversion sécurisée' : 'Veuillez démarrer le serveur Node.js'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
