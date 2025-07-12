import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import cron from 'node-cron';

// Configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Types
interface ExchangeRate {
  devise: string;
  taux: number;
  lastUpdated: Date;
}

interface ConversionRequest {
  amount: number;
  from: string;
  to: string;
}

interface RateHistoryEntry {
  taux: number;
  date: string;
  timestamp: number;
}

interface AlertRequest {
  currency: string;
  targetRate: number;
  type: 'above' | 'below';
  email?: string;
}

// Base de données en mémoire (remplacer par une vraie DB en production)
let exchangeRates: Record<string, ExchangeRate> = {
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
let ratesHistory: Record<string, RateHistoryEntry[]> = {};

// Système d'alertes
let alerts: Array<{
  id: string;
  currency: string;
  targetRate: number;
  type: 'above' | 'below';
  email?: string;
  created: string;
  active: boolean;
}> = [];

// Initialiser l'historique avec les taux actuels
Object.keys(exchangeRates).forEach(devise => {
  ratesHistory[devise] = [{
    taux: exchangeRates[devise].taux,
    date: new Date().toISOString(),
    timestamp: Date.now()
  }];
});

// Fonction de conversion
const convertCurrency = (amount: number, from: string, to: string): number => {
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

// GET /api/rates - Obtenir tous les taux de change
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

// POST /api/convert - Convertir une devise
app.post('/api/convert', (req, res) => {
  try {
    const { amount, from, to }: ConversionRequest = req.body;
    
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

// GET /api/rates/:devise - Obtenir le taux d'une devise spécifique
app.get('/api/rates/:devise', (req, res) => {
  try {
    const { devise } = req.params;
    const upperDevise = devise.toUpperCase();
    
    if (!exchangeRates[upperDevise]) {
      return res.status(404).json({
        success: false,
        error: 'Devise non trouvée'
      });
    }
    
    res.json({
      success: true,
      data: exchangeRates[upperDevise]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du taux'
    });
  }
});

// POST /api/rates/update - Mettre à jour les taux (pour admin)
app.post('/api/rates/update', (req, res) => {
  try {
    const { devise, taux } = req.body;
    
    if (!devise || !taux) {
      return res.status(400).json({
        success: false,
        error: 'Devise et taux requis'
      });
    }
    
    const upperDevise = devise.toUpperCase();
    
    if (!exchangeRates[upperDevise]) {
      return res.status(404).json({
        success: false,
        error: 'Devise non supportée'
      });
    }
    
    exchangeRates[upperDevise] = {
      devise: upperDevise,
      taux: parseFloat(taux),
      lastUpdated: new Date()
    };
    
    // Mettre à jour l'historique
    ratesHistory[upperDevise].push({
      taux: parseFloat(taux),
      date: new Date().toISOString(),
      timestamp: Date.now()
    });
    
    res.json({
      success: true,
      message: `Taux de ${upperDevise} mis à jour`,
      data: exchangeRates[upperDevise]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour'
    });
  }
});

// GET /api/history/:devise - Obtenir l'historique des taux d'une devise
app.get('/api/history/:devise', (req, res) => {
  try {
    const { devise } = req.params;
    const upperDevise = devise.toUpperCase();
    
    if (!ratesHistory[upperDevise]) {
      return res.status(404).json({
        success: false,
        error: 'Historique non trouvé pour cette devise'
      });
    }
    
    res.json({
      success: true,
      data: ratesHistory[upperDevise]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération de l\'historique'
    });
  }
});

// POST /api/alerts - Créer une alerte de taux (pour admin)
app.post('/api/alerts', (req, res) => {
  try {
    const { currency, targetRate, type, email }: AlertRequest = req.body;
    
    if (!currency || targetRate === undefined || !type) {
      return res.status(400).json({
        success: false,
        error: 'Paramètres manquants: currency, targetRate, type'
      });
    }
    
    const upperCurrency = currency.toUpperCase();
    
    if (!exchangeRates[upperCurrency]) {
      return res.status(404).json({
        success: false,
        error: 'Devise non supportée'
      });
    }
    
    const id = new Date().getTime().toString();
    alerts.push({
      id,
      currency: upperCurrency,
      targetRate,
      type,
      email,
      created: new Date().toISOString(),
      active: true
    });
    
    res.json({
      success: true,
      message: 'Alerte créée avec succès',
      data: alerts.find(alert => alert.id === id)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création de l\'alerte'
    });
  }
});

// GET /api/alerts - Obtenir toutes les alertes
app.get('/api/alerts', (req, res) => {
  try {
    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des alertes'
    });
  }
});

// GET /api/health - Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CurrencyPro API is running!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Fonction pour mettre à jour les taux depuis une API externe (optionnel)
const updateRatesFromAPI = async () => {
  try {
    console.log('🔄 Mise à jour des taux de change...');
    // Ici vous pouvez intégrer une vraie API comme Fixer.io, CurrencyAPI, etc.
    // const response = await axios.get('https://api.exchangerate-api.com/v4/latest/TND');
    
    // Pour l'instant, on simule une petite variation
    Object.keys(exchangeRates).forEach(devise => {
      if (devise !== 'TND') {
        const variation = (Math.random() - 0.5) * 0.02; // ±1% de variation
        exchangeRates[devise].taux *= (1 + variation);
        exchangeRates[devise].lastUpdated = new Date();
      }
    });
    
    console.log('✅ Taux mis à jour avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour des taux:', error);
  }
};

// Planifier la mise à jour des taux toutes les heures
cron.schedule('0 * * * *', updateRatesFromAPI);

// Route par défaut
app.get('/', (req, res) => {
  res.json({
    message: '🏦 CurrencyPro API Server',
    version: '1.0.0',
    endpoints: [
      'GET /api/health',
      'GET /api/rates',
      'GET /api/rates/:devise',
      'POST /api/convert',
      'POST /api/rates/update',
      'GET /api/history/:devise',
      'POST /api/alerts',
      'GET /api/alerts'
    ]
  });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint non trouvé'
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur CurrencyPro démarré sur http://localhost:${PORT}`);
  console.log(`📊 API disponible sur http://localhost:${PORT}/api`);
  console.log(`💹 Health check: http://localhost:${PORT}/api/health`);
});
