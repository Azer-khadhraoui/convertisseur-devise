// Service API pour CurrencyPro
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: string;
}

export interface ConversionResult {
  amount: number;
  from: string;
  to: string;
  result: number;
  rate: number;
  timestamp: string;
}

export interface ExchangeRate {
  devise: string;
  taux: number;
  lastUpdated: string;
}

class CurrencyAPIService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Obtenir tous les taux de change
  async getRates(): Promise<ApiResponse<Record<string, ExchangeRate>>> {
    try {
      const response = await fetch(`${this.baseURL}/rates`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur de connexion au serveur'
      };
    }
  }

  // Convertir une devise
  async convertCurrency(amount: number, from: string, to: string): Promise<ApiResponse<ConversionResult>> {
    try {
      const response = await fetch(`${this.baseURL}/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, from, to }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la conversion'
      };
    }
  }

  // Obtenir le taux d'une devise spécifique
  async getRate(devise: string): Promise<ApiResponse<ExchangeRate>> {
    try {
      const response = await fetch(`${this.baseURL}/rates/${devise}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la récupération du taux'
      };
    }
  }

  // Vérifier la santé du serveur
  async healthCheck(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Serveur non disponible'
      };
    }
  }

  // Mettre à jour un taux (pour admin)
  async updateRate(devise: string, taux: number): Promise<ApiResponse<ExchangeRate>> {
    try {
      const response = await fetch(`${this.baseURL}/rates/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ devise, taux }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la mise à jour'
      };
    }
  }
}

// Instance singleton
export const currencyAPI = new CurrencyAPIService();

// Hook React personnalisé pour l'API
import { useState, useEffect } from 'react';

export const useCurrencyAPI = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [rates, setRates] = useState<Record<string, ExchangeRate>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vérifier la connexion au serveur
  const checkConnection = async () => {
    const result = await currencyAPI.healthCheck();
    setIsOnline(result.success);
    return result.success;
  };

  // Charger les taux
  const loadRates = async () => {
    setLoading(true);
    setError(null);
    
    const result = await currencyAPI.getRates();
    
    if (result.success && result.data) {
      setRates(result.data);
    } else {
      setError(result.error || 'Erreur inconnue');
    }
    
    setLoading(false);
  };

  // Convertir avec l'API
  const convertWithAPI = async (amount: number, from: string, to: string) => {
    const result = await currencyAPI.convertCurrency(amount, from, to);
    return result;
  };

  // Initialisation
  useEffect(() => {
    const init = async () => {
      const online = await checkConnection();
      if (online) {
        await loadRates();
      } else {
        setLoading(false);
        setError('Serveur API non disponible');
      }
    };

    init();
  }, []);

  return {
    isOnline,
    rates,
    loading,
    error,
    checkConnection,
    loadRates,
    convertWithAPI,
    api: currencyAPI
  };
};
