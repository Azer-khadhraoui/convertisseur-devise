import config from '../config';

// Service API adaptatif pour développement et production
class ApiService {
  private baseUrl: string;
  private useStatic: boolean;

  constructor() {
    this.baseUrl = config.apiBaseUrl;
    this.useStatic = config.useStaticData;
  }

  // Conversion de devises
  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string) {
    if (this.useStatic) {
      // Mode statique pour GitHub Pages
      const fromRate = config.staticExchangeRates[fromCurrency as keyof typeof config.staticExchangeRates] || 1;
      const toRate = config.staticExchangeRates[toCurrency as keyof typeof config.staticExchangeRates] || 1;
      const convertedAmount = (amount / fromRate) * toRate;
      
      return {
        success: true,
        data: {
          amount,
          fromCurrency,
          toCurrency,
          convertedAmount: parseFloat(convertedAmount.toFixed(4)),
          rate: parseFloat((toRate / fromRate).toFixed(6))
        }
      };
    } else {
      // Mode développement avec backend
      const response = await fetch(`${this.baseUrl}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, fromCurrency, toCurrency })
      });
      return await response.json();
    }
  }

  // Récupération des taux de change
  async getExchangeRates() {
    if (this.useStatic) {
      return {
        success: true,
        data: config.staticExchangeRates
      };
    } else {
      const response = await fetch(`${this.baseUrl}/rates`);
      return await response.json();
    }
  }

  // Health check API
  async checkHealth() {
    if (this.useStatic) {
      return {
        success: true,
        data: {
          status: 'Static Mode',
          message: 'Application en mode statique (GitHub Pages)',
          timestamp: new Date().toISOString()
        }
      };
    } else {
      try {
        const response = await fetch(`${this.baseUrl}/health`);
        return await response.json();
      } catch (error) {
        return {
          success: false,
          error: 'Backend non disponible'
        };
      }
    }
  }

  // Historique des taux (version statique)
  async getHistoricalRates(currency: string) {
    if (this.useStatic) {
      // Génération de données historiques simulées
      const baseRate = config.staticExchangeRates[currency as keyof typeof config.staticExchangeRates] || 1;
      const dates = [];
      const rates = [];
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
        
        // Variation aléatoire de ±5% autour du taux de base
        const variation = (Math.random() - 0.5) * 0.1;
        rates.push(parseFloat((baseRate * (1 + variation)).toFixed(6)));
      }
      
      return {
        success: true,
        data: {
          currency,
          dates,
          rates,
          period: '30 jours (données simulées)'
        }
      };
    } else {
      const response = await fetch(`${this.baseUrl}/history/${currency}`);
      return await response.json();
    }
  }

  // Alertes (version statique limitée)
  async createAlert(alertData: any) {
    if (this.useStatic) {
      return {
        success: true,
        data: {
          id: Date.now().toString(),
          ...alertData,
          created: new Date().toISOString(),
          active: true
        },
        message: 'Alerte créée (mode démo - pas de notifications réelles)'
      };
    } else {
      const response = await fetch(`${this.baseUrl}/alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData)
      });
      return await response.json();
    }
  }

  async getAlerts() {
    if (this.useStatic) {
      return {
        success: true,
        data: []
      };
    } else {
      const response = await fetch(`${this.baseUrl}/alerts`);
      return await response.json();
    }
  }
}

export const apiService = new ApiService();
export default apiService;
