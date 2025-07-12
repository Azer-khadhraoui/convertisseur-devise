import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface HistoricalData {
  date: string;
  rate: number;
  change: number;
}

interface TrendingCurrency {
  currency: string;
  change: string;
  volume: string;
}

const Dashboard: React.FC = () => {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [trending, setTrending] = useState<TrendingCurrency[]>([]);
  const [selectedPair, setSelectedPair] = useState('EUR/USD');
  const [loading, setLoading] = useState(false);

  const API_BASE = 'http://localhost:5000/api';

  // Charger l'historique des taux
  const loadHistoricalData = async (from: string, to: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/history/${from}/${to}?days=30`);
      const result = await response.json();
      
      if (result.success) {
        setHistoricalData(result.data.history);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les tendances
  const loadTrending = async () => {
    try {
      const response = await fetch(`${API_BASE}/trending`);
      const result = await response.json();
      
      if (result.success) {
        setTrending(result.data.trending);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des tendances:', error);
    }
  };

  useEffect(() => {
    const [from, to] = selectedPair.split('/');
    loadHistoricalData(from, to);
    loadTrending();
  }, [selectedPair]);

  // Configuration du graphique linéaire
  const lineChartData = {
    labels: historicalData.map(d => new Date(d.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: `Taux ${selectedPair}`,
        data: historicalData.map(d => d.rate),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Évolution du taux ${selectedPair} (30 jours)`,
        color: 'white',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      y: {
        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  // Configuration du graphique en barres pour les tendances
  const barChartData = {
    labels: trending.map(t => t.currency),
    datasets: [
      {
        label: 'Variation (%)',
        data: trending.map(t => parseFloat(t.change.replace('%', '').replace('+', ''))),
        backgroundColor: trending.map(t => 
          t.change.startsWith('+') ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'
        ),
        borderColor: trending.map(t => 
          t.change.startsWith('+') ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
        ),
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Tendances des devises (24h)',
        color: 'white',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      y: {
        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  const currencyPairs = [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'EUR/GBP', 
    'TND/EUR', 'TND/USD', 'MAD/EUR', 'USD/CHF'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📊 Dashboard CurrencyPro</h1>
          <p className="text-blue-200">Analyse des tendances et historiques des devises</p>
        </div>

        {/* Sélecteur de paire de devises */}
        <div className="mb-6">
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-4 border border-white/20">
            <label className="block text-white font-medium mb-2">Paire de devises</label>
            <select
              value={selectedPair}
              onChange={(e) => setSelectedPair(e.target.value)}
              className="w-full md:w-auto px-4 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {currencyPairs.map(pair => (
                <option key={pair} value={pair} className="bg-gray-800 text-white">
                  {pair}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grille des graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Graphique historique */}
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : (
              <Line data={lineChartData} options={lineChartOptions} />
            )}
          </div>

          {/* Graphique des tendances */}
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Tableau des tendances détaillées */}
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">📈 Tendances du marché</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left text-white py-3 px-4">Devise</th>
                  <th className="text-left text-white py-3 px-4">Variation 24h</th>
                  <th className="text-left text-white py-3 px-4">Volume</th>
                  <th className="text-left text-white py-3 px-4">Statut</th>
                </tr>
              </thead>
              <tbody>
                {trending.map((item, index) => (
                  <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="w-8 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center text-xs text-white font-bold">
                          {item.currency}
                        </span>
                        <span className="text-white font-medium">{item.currency}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${
                        item.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {item.change}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white/70">{item.volume}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.change.startsWith('+') 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {item.change.startsWith('+') ? '📈 Hausse' : '📉 Baisse'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
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

export default Dashboard;
