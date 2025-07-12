import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface HistoryEntry {
  date: string;
  rate: number;
  change: number;
}

interface CurrencyHistoryData {
  currency: string;
  history: HistoryEntry[];
  currentRate: number;
  totalEntries: number;
}

const RatesHistory: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('EUR');
  const [historyData, setHistoryData] = useState<CurrencyHistoryData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [timeRange, setTimeRange] = useState<string>('30');

  const API_BASE = 'http://localhost:5000/api';

  const currencies = [
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'USD', name: 'Dollar US', flag: '🇺🇸' },
    { code: 'GBP', name: 'Livre Sterling', flag: '🇬🇧' },
    { code: 'JPY', name: 'Yen Japonais', flag: '🇯🇵' },
    { code: 'CHF', name: 'Franc Suisse', flag: '🇨🇭' },
    { code: 'CAD', name: 'Dollar Canadien', flag: '🇨🇦' },
    { code: 'MAD', name: 'Dirham Marocain', flag: '🇲🇦' }
  ];

  // Charger l'historique d'une devise
  const fetchHistory = async (currency: string) => {
    setLoading(true);
    setError('');
    
    try {
      console.log(`🔄 Chargement historique pour ${currency}...`);
      const response = await fetch(`${API_BASE}/history/${currency}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('📊 Réponse API:', result);
      
      if (result.success) {
        setHistoryData(result.data);
        console.log('✅ Historique chargé avec succès');
      } else {
        setError(result.error || 'Erreur lors du chargement');
        console.error('❌ Erreur API:', result.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur de connexion: ${errorMessage}`);
      console.error('❌ Erreur de connexion:', err);
    } finally {
      setLoading(false);
    }
  };

  // Charger l'historique au changement de devise
  useEffect(() => {
    fetchHistory(selectedCurrency);
  }, [selectedCurrency]);

  // Préparer les données pour le graphique
  const chartData = historyData ? {
    labels: historyData.history.slice(-parseInt(timeRange)).map(entry => 
      new Date(entry.date).toLocaleDateString('fr-FR', { 
        month: 'short', 
        day: 'numeric' 
      })
    ),
    datasets: [
      {
        label: `Taux TND/${selectedCurrency}`,
        data: historyData.history.slice(-parseInt(timeRange)).map(entry => entry.rate),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        fill: true,
        tension: 0.4
      }
    ]
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          callback: function(value: any) {
            return value.toFixed(4);
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.9)'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `Taux: ${context.parsed.y.toFixed(6)}`;
          }
        }
      }
    }
  };

  // Calculer les statistiques
  const getStats = () => {
    if (!historyData || historyData.history.length === 0) return null;
    
    const rates = historyData.history.slice(-parseInt(timeRange)).map(h => h.rate);
    const changes = historyData.history.slice(-parseInt(timeRange)).map(h => h.change);
    
    return {
      highest: Math.max(...rates),
      lowest: Math.min(...rates),
      average: rates.reduce((sum, rate) => sum + rate, 0) / rates.length,
      avgChange: changes.reduce((sum, change) => sum + Math.abs(change), 0) / changes.length
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📈 Historique des Taux</h1>
          <p className="text-blue-200">Évolution des taux de change par rapport au Dinar Tunisien</p>
        </div>

        {/* Controls */}
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sélection de devise */}
            <div>
              <label className="block text-white font-medium mb-2">Devise</label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code} className="bg-gray-800 text-white">
                    {currency.flag} {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Période */}
            <div>
              <label className="block text-white font-medium mb-2">Période</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="7" className="bg-gray-800 text-white">7 derniers jours</option>
                <option value="15" className="bg-gray-800 text-white">15 derniers jours</option>
                <option value="30" className="bg-gray-800 text-white">30 derniers jours</option>
              </select>
            </div>

            {/* Bouton actualiser */}
            <div className="flex items-end">
              <button
                onClick={() => fetchHistory(selectedCurrency)}
                disabled={loading}
                className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-300"
              >
                {loading ? '🔄 Chargement...' : '🔄 Actualiser'}
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="backdrop-blur-lg bg-white/10 rounded-xl p-4 border border-white/20 text-center">
              <div className="text-2xl mb-1">📊</div>
              <div className="text-white font-semibold">Taux Actuel</div>
              <div className="text-blue-300 text-lg">{historyData?.currentRate.toFixed(6)}</div>
            </div>
            <div className="backdrop-blur-lg bg-white/10 rounded-xl p-4 border border-white/20 text-center">
              <div className="text-2xl mb-1">📈</div>
              <div className="text-white font-semibold">Plus Haut</div>
              <div className="text-green-300 text-lg">{stats.highest.toFixed(6)}</div>
            </div>
            <div className="backdrop-blur-lg bg-white/10 rounded-xl p-4 border border-white/20 text-center">
              <div className="text-2xl mb-1">📉</div>
              <div className="text-white font-semibold">Plus Bas</div>
              <div className="text-red-300 text-lg">{stats.lowest.toFixed(6)}</div>
            </div>
            <div className="backdrop-blur-lg bg-white/10 rounded-xl p-4 border border-white/20 text-center">
              <div className="text-2xl mb-1">📊</div>
              <div className="text-white font-semibold">Moyenne</div>
              <div className="text-blue-300 text-lg">{stats.average.toFixed(6)}</div>
            </div>
          </div>
        )}

        {/* Graphique */}
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">
            📈 Évolution TND/{selectedCurrency} - {timeRange} derniers jours
          </h3>
          
          {error && (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">❌</div>
              <p className="text-red-300">{error}</p>
              <button
                onClick={() => fetchHistory(selectedCurrency)}
                className="mt-4 px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
              >
                Réessayer
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white/70">Chargement de l'historique...</p>
            </div>
          )}

          {chartData && !loading && !error && (
            <div className="h-80">
              <Line data={chartData} options={chartOptions} />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="text-center">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            ← Retour au convertisseur
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatesHistory;
