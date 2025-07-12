import React, { useState, useEffect } from 'react';

const APITester: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  const [testResults, setTestResults] = useState<any[]>([]);
  
  const API_BASE = 'http://localhost:5000/api';
  
  const testEndpoints = [
    { name: 'Health Check', url: '/health' },
    { name: 'Taux de change', url: '/rates' },
    { name: 'Historique EUR', url: '/history/EUR' },
    { name: 'Historique USD', url: '/history/USD' },
    { name: 'Alertes', url: '/alerts' }
  ];
  
  const testAPI = async () => {
    setApiStatus('loading');
    const results = [];
    
    for (const endpoint of testEndpoints) {
      try {
        console.log(`🧪 Test de ${endpoint.name}...`);
        const startTime = Date.now();
        
        const response = await fetch(`${API_BASE}${endpoint.url}`);
        const responseTime = Date.now() - startTime;
        const data = await response.json();
        
        results.push({
          name: endpoint.name,
          url: endpoint.url,
          status: response.ok ? 'SUCCESS' : 'ERROR',
          statusCode: response.status,
          responseTime,
          data: data,
          error: response.ok ? null : `HTTP ${response.status}`
        });
        
      } catch (error) {
        results.push({
          name: endpoint.name,
          url: endpoint.url,
          status: 'FAILED',
          statusCode: 0,
          responseTime: 0,
          data: null,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
      }
    }
    
    setTestResults(results);
    
    // Déterminer le statut général
    const hasSuccess = results.some(r => r.status === 'SUCCESS');
    setApiStatus(hasSuccess ? 'online' : 'offline');
  };
  
  useEffect(() => {
    testAPI();
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🧪 Test de l'API</h1>
          <p className="text-blue-200">Diagnostic de connectivité CurrencyPro API</p>
        </div>
        
        {/* Statut global */}
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Statut de l'API</h3>
              <p className="text-blue-200">{API_BASE}</p>
            </div>
            <div className="text-right">
              {apiStatus === 'loading' && (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span className="text-white">Test en cours...</span>
                </div>
              )}
              {apiStatus === 'online' && (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 font-semibold">En ligne</span>
                </div>
              )}
              {apiStatus === 'offline' && (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                  <span className="text-red-400 font-semibold">Hors ligne</span>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={testAPI}
            className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            🔄 Retester
          </button>
        </div>
        
        {/* Résultats des tests */}
        <div className="space-y-4">
          {testResults.map((result, index) => (
            <div key={index} className="backdrop-blur-lg bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    result.status === 'SUCCESS' ? 'bg-green-400' :
                    result.status === 'ERROR' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}></div>
                  <span className="text-white font-semibold">{result.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-blue-200 text-sm">{result.responseTime}ms</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    result.status === 'SUCCESS' ? 'bg-green-500/20 text-green-400' :
                    result.status === 'ERROR' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {result.status} {result.statusCode > 0 && `(${result.statusCode})`}
                  </span>
                </div>
              </div>
              
              <div className="text-blue-200 text-sm mb-2">
                <code>{API_BASE}{result.url}</code>
              </div>
              
              {result.error && (
                <div className="text-red-300 text-sm mb-2">
                  ❌ {result.error}
                </div>
              )}
              
              {result.data && (
                <details className="text-xs">
                  <summary className="text-blue-300 cursor-pointer hover:text-blue-200">
                    Voir la réponse JSON
                  </summary>
                  <pre className="mt-2 p-2 bg-black/20 rounded text-green-300 overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
        
        {/* Instructions de debug */}
        <div className="mt-8 backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">🔧 Guide de dépannage</h3>
          <div className="space-y-2 text-blue-200">
            <p>• Vérifiez que le serveur Node.js est démarré: <code>cd server && node server.js</code></p>
            <p>• Vérifiez que le port 5000 est libre: <code>netstat -ano | findstr :5000</code></p>
            <p>• Testez directement l'API dans le navigateur: <a href="http://localhost:5000/api/health" target="_blank" className="text-blue-300 underline">http://localhost:5000/api/health</a></p>
            <p>• Vérifiez les logs de la console (F12) pour plus d'informations</p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300"
          >
            ← Retour
          </button>
        </div>
      </div>
    </div>
  );
};

export default APITester;
