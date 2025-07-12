// Hook personnalisé pour utiliser l'API CurrencyPro
import { useState, useEffect } from 'react';

interface ApiConversionResult {
  amount: number;
  from: string;
  to: string;
  result: number;
  rate: number;
  timestamp: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: string;
}

export const useCurrencyAPI = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = 'http://localhost:5000/api';

  // Vérifier si l'API est disponible
  const checkAPIHealth = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/health`);
      const data = await response.json();
      setIsOnline(data.success);
      return data.success;
    } catch (error) {
      setIsOnline(false);
      return false;
    }
  };

  // Convertir avec l'API
  const convertWithAPI = async (amount: number, from: string, to: string): Promise<ApiConversionResult | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, from, to }),
      });

      const result: ApiResponse<ApiConversionResult> = await response.json();

      if (result.success && result.data) {
        return result.data;
      } else {
        setError(result.error || 'Erreur de conversion');
        return null;
      }
    } catch (error) {
      setError('Erreur de connexion à l\'API');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Obtenir tous les taux
  const getRates = async () => {
    try {
      const response = await fetch(`${API_BASE}/rates`);
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      return null;
    }
  };

  // Initialisation
  useEffect(() => {
    checkAPIHealth();
  }, []);

  return {
    isOnline,
    loading,
    error,
    convertWithAPI,
    getRates,
    checkAPIHealth
  };
};
