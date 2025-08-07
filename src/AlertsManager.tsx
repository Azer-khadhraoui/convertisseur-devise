import React, { useState } from 'react';
import { apiService } from './services/adaptiveApi';

interface Alert {
  id: string;
  currency: string;
  targetRate: number;
  type: 'above' | 'below';
  email?: string;
  created: string;
  active: boolean;
}

const AlertsManager: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [newAlert, setNewAlert] = useState({
    currency: 'EUR/USD',
    targetRate: '',
    type: 'above' as 'above' | 'below',
    email: ''
  });
  const [loading, setLoading] = useState(false);

  const currencies = [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'EUR/GBP', 
    'TND/EUR', 'TND/USD', 'MAD/EUR', 'USD/CHF'
  ];

  const createAlert = async () => {
    if (!newAlert.targetRate) {
      alert('Veuillez entrer un taux cible');
      return;
    }

    try {
      setLoading(true);
      const result = await apiService.createAlert({
        currency: newAlert.currency,
        targetRate: parseFloat(newAlert.targetRate),
        type: newAlert.type,
        email: newAlert.email
      });

      if (result.success) {
        setAlerts([...alerts, result.data]);
        setNewAlert({
          currency: 'EUR/USD',
          targetRate: '',
          type: 'above',
          email: ''
        });
        alert('Alerte créée avec succès !');
      } else {
        alert(result.message || 'Erreur lors de la création de l\'alerte');
      }
    } catch (error) {
      alert('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🔔 Alertes de Taux</h1>
          <p className="text-blue-200">Recevez des notifications quand les taux atteignent vos objectifs</p>
        </div>

        {/* Formulaire de création d'alerte */}
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">➕ Créer une nouvelle alerte</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Paire de devises */}
            <div>
              <label className="block text-white font-medium mb-2">Paire de devises</label>
              <select
                value={newAlert.currency}
                onChange={(e) => setNewAlert({...newAlert, currency: e.target.value})}
                className="w-full px-3 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency} className="bg-gray-800 text-white">
                    {currency}
                  </option>
                ))}
              </select>
            </div>

            {/* Taux cible */}
            <div>
              <label className="block text-white font-medium mb-2">Taux cible</label>
              <input
                type="number"
                step="0.0001"
                value={newAlert.targetRate}
                onChange={(e) => setNewAlert({...newAlert, targetRate: e.target.value})}
                placeholder="Ex: 1.0850"
                className="w-full px-3 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Type d'alerte */}
            <div>
              <label className="block text-white font-medium mb-2">Condition</label>
              <select
                value={newAlert.type}
                onChange={(e) => setNewAlert({...newAlert, type: e.target.value as 'above' | 'below'})}
                className="w-full px-3 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="above" className="bg-gray-800 text-white">Au-dessus de</option>
                <option value="below" className="bg-gray-800 text-white">En-dessous de</option>
              </select>
            </div>

            {/* Email (optionnel) */}
            <div>
              <label className="block text-white font-medium mb-2">Email (optionnel)</label>
              <input
                type="email"
                value={newAlert.email}
                onChange={(e) => setNewAlert({...newAlert, email: e.target.value})}
                placeholder="votre@email.com"
                className="w-full px-3 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <button
            onClick={createAlert}
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Création...
              </div>
            ) : (
              '🔔 Créer l\'alerte'
            )}
          </button>
        </div>

        {/* Liste des alertes */}
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">📋 Mes alertes actives</h3>
          
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🔕</div>
              <p className="text-white/70">Aucune alerte configurée</p>
              <p className="text-white/50 text-sm">Créez votre première alerte ci-dessus</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="backdrop-blur-lg bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">
                        {alert.type === 'above' ? '📈' : '📉'}
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {alert.currency} {alert.type === 'above' ? '≥' : '≤'} {alert.targetRate}
                        </div>
                        <div className="text-white/50 text-sm">
                          Créée le {new Date(alert.created).toLocaleDateString('fr-FR')}
                          {alert.email && ` • Email: ${alert.email}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                        Active
                      </span>
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

export default AlertsManager;
