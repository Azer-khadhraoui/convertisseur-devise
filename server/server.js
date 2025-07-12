const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Base de données en mémoire
let exchangeRates = {
  TND: { devise: 'TND', taux: 1, lastUpdated: new Date() },
  EUR: { devise: 'EUR', taux: 3.475, lastUpdated: new Date() },
  USD: { devise: 'USD', taux: 2.98, lastUpdated: new Date() },
  GBP: { devise: 'GBP', taux: 3.70, lastUpdated: new Date() },
  MAD: { devise: 'MAD', taux: 0.298, lastUpdated: new Date() },
  CAD: { devise: 'CAD', taux: 2.17, lastUpdated: new Date() },
  CHF: { devise: 'CHF', taux: 3.33, lastUpdated: new Date() },
  JPY: { devise: 'JPY', taux: 0.0206, lastUpdated: new Date() },
};

// Historique des taux (stockage en mémoire)
let ratesHistory = {};

// Système d'alertes
let alerts = [];

// Fonction pour générer des données historiques simulées
const generateHistoricalData = (baseCurrency, targetCurrency, days = 30) => {
  const data = [];
  const baseRate = exchangeRates[targetCurrency].taux / exchangeRates[baseCurrency].taux;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Variation aléatoire de ±2% autour du taux de base
    const variation = (Math.random() - 0.5) * 0.04; // ±2%
    const rate = baseRate * (1 + variation);
    
    data.push({
      date: date.toISOString().split('T')[0],
      rate: parseFloat(rate.toFixed(6)),
      change: variation * 100
    });
  }
  
  return data;
};

// Initialiser l'historique avec des données simulées pour chaque devise
Object.keys(exchangeRates).forEach(devise => {
  if (devise !== 'TND') {
    ratesHistory[devise] = generateHistoricalData('TND', devise, 30);
  }
});

// Fonction de conversion
const convertCurrency = (amount, from, to) => {
  if (from === to) return amount;
  
  if (from === 'TND') {
    return amount / exchangeRates[to].taux;
  }
  
  if (to === 'TND') {
    return amount * exchangeRates[from].taux;
  }
  
  const amountInTND = amount * exchangeRates[from].taux;
  return amountInTND / exchangeRates[to].taux;
};

// Routes API
app.get('/api/rates', (req, res) => {
  try {
    res.json({
      success: true,
      data: exchangeRates,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des taux'
    });
  }
});

app.post('/api/convert', (req, res) => {
  try {
    const { amount, from, to } = req.body;
    
    if (!amount || !from || !to) {
      return res.status(400).json({
        success: false,
        error: 'Paramètres manquants: amount, from, to'
      });
    }
    
    if (!exchangeRates[from] || !exchangeRates[to]) {
      return res.status(400).json({
        success: false,
        error: 'Devise non supportée'
      });
    }
    
    const result = convertCurrency(amount, from, to);
    const rate = convertCurrency(1, from, to);
    
    res.json({
      success: true,
      data: {
        amount,
        from,
        to,
        result: parseFloat(result.toFixed(6)),
        rate: parseFloat(rate.toFixed(6)),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la conversion'
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🏦 CurrencyPro API is running!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: '🏦 CurrencyPro API Server',
    version: '1.0.0',
    endpoints: [
      'GET /api/health',
      'GET /api/rates',
      'POST /api/convert'
    ]
  });
});

// Endpoint pour l'historique des taux
app.get('/api/history/:from/:to', (req, res) => {
  try {
    const { from, to } = req.params;
    const days = parseInt(req.query.days) || 30;
    
    if (!exchangeRates[from] || !exchangeRates[to]) {
      return res.status(400).json({
        success: false,
        error: 'Devise non supportée'
      });
    }
    
    const historicalData = generateHistoricalData(from, to, days);
    
    res.json({
      success: true,
      data: {
        from,
        to,
        period: `${days} jours`,
        history: historicalData,
        summary: {
          current: historicalData[historicalData.length - 1].rate,
          highest: Math.max(...historicalData.map(d => d.rate)),
          lowest: Math.min(...historicalData.map(d => d.rate)),
          averageChange: historicalData.reduce((sum, d) => sum + Math.abs(d.change), 0) / historicalData.length
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération de l\'historique'
    });
  }
});

// GET /api/history/:currency - Obtenir l'historique d'une devise spécifique
app.get('/api/history/:currency', (req, res) => {
  try {
    const { currency } = req.params;
    const upperCurrency = currency.toUpperCase();
    
    if (!exchangeRates[upperCurrency]) {
      return res.status(404).json({
        success: false,
        error: 'Devise non supportée'
      });
    }
    
    if (!ratesHistory[upperCurrency]) {
      return res.status(404).json({
        success: false,
        error: 'Aucun historique disponible pour cette devise'
      });
    }
    
    res.json({
      success: true,
      data: {
        currency: upperCurrency,
        history: ratesHistory[upperCurrency],
        currentRate: exchangeRates[upperCurrency].taux,
        totalEntries: ratesHistory[upperCurrency].length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération de l\'historique'
    });
  }
});

// GET /api/alerts - Obtenir toutes les alertes
app.get('/api/alerts', (req, res) => {
  try {
    res.json({
      success: true,
      data: alerts,
      count: alerts.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des alertes'
    });
  }
});

// Endpoint pour les alertes de taux
app.post('/api/alerts', (req, res) => {
  try {
    const { currency, targetRate, type, email } = req.body;
    
    if (!currency || !targetRate || !type) {
      return res.status(400).json({
        success: false,
        error: 'Paramètres manquants'
      });
    }
    
    // Simuler la création d'une alerte
    const alert = {
      id: Date.now().toString(),
      currency,
      targetRate,
      type, // 'above' ou 'below'
      email,
      created: new Date().toISOString(),
      active: true
    };
    
    res.json({
      success: true,
      data: alert,
      message: 'Alerte créée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création de l\'alerte'
    });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur CurrencyPro démarré sur http://localhost:${PORT}`);
  console.log(`📊 API disponible sur http://localhost:${PORT}/api`);
  console.log(`💹 Health check: http://localhost:${PORT}/api/health`);
});
