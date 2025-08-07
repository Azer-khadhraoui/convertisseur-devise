// Configuration pour l'environnement de déploiement
export const config = {
  // En mode développement local, utilise le serveur Node.js
  // En mode production (GitHub Pages), utilise des données statiques
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // API Base URL - change selon l'environnement
  apiBaseUrl: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api'
    : '', // GitHub Pages = mode statique uniquement
    
  // Taux de change statiques pour GitHub Pages
  staticExchangeRates: {
    TND: 1,
    EUR: 0.31,
    USD: 0.33,
    GBP: 0.28,
    MAD: 3.1,
    CAD: 0.44,
    CHF: 0.30,
    JPY: 38.5
  },
  
  // Configuration pour le mode production statique
  useStaticData: process.env.NODE_ENV === 'production'
};

export default config;
