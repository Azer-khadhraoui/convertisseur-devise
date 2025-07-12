# � CurrencyPro

> **Convertisseur de devise## 💱 Devises supportées

| **Flag** | **Devise** | **Code** | **Symbole** | **Pays** |
|:---:|:---|:---:|:---:|:---|
| 🇹🇳 | Dinar Tunisien | TND | DT | Tunisie |
| 🇪🇺 | Euro | EUR | € | Zone Euro |
| 🇺🇸 | Dollar Américain | USD | $ | États-Unis |
| 🇬🇧 | Livre Sterling | GBP | £ | Royaume-Uni |
| 🇲🇦 | Dirham Marocain | MAD | MAD | Maroc |
| 🇨🇦 | Dollar Canadien | CAD | C$ | Canada |
| 🇨🇭 | Franc Suisse | CHF | CHF | Suisse |
| 🇯🇵 | Yen Japonais | JPY | ¥ | Japon |

## 🏗️ Architecture

### 🎨 Frontend (React + TypeScript)
```
src/
├── App.tsx                  # Routeur principal et navigation
├── CurrencyConverter.tsx    # Composant de conversion
├── Dashboard.tsx           # Tableau de bord analytique
├── RatesHistory.tsx        # Graphiques historiques (Chart.js)
├── AlertsManager.tsx       # Gestionnaire d'alertes
├── APITester.tsx          # Utilitaire de test API
└── services/
    └── api.ts             # Services API React
```

### ⚙️ Backend (Node.js + Express)
```
server/
├── server.js              # Serveur Express principal
├── package.json           # Dépendances backend
└── .env                   # Variables d'environnement
```

## 🔌 Endpoints API

| **Méthode** | **Route** | **Description** |
|:---:|:---|:---|
| `GET` | `/api/health` | Status du serveur |
| `GET` | `/api/rates` | Taux de change actuels |
| `POST` | `/api/convert` | Conversion de devises |
| `GET` | `/api/history/:currency` | Historique 30 jours |
| `GET` | `/api/alerts` | Liste des alertes |
| `POST` | `/api/alerts` | Créer une alerte |
| `DELETE` | `/api/alerts/:id` | Supprimer une alerte |

### Exemple d'utilisation API :

```javascript
// Conversion USD → EUR
const response = await fetch('http://localhost:5000/api/convert', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 100,
    fromCurrency: 'USD',
    toCurrency: 'EUR'
  })
});
```

## 📊 Pages de l'application

### 🏠 **Page d'accueil** (`/`)
- Convertisseur principal avec sélection de devises
- Calcul temps réel et échange bidirectionnel
- Interface glassmorphism responsive

### 📈 **Dashboard** (`/dashboard`)
- Métriques de conversion en temps réel
- Statistiques des devises populaires
- Graphiques de tendance journalière

### 📉 **Historique** (`/history`)
- Graphiques Chart.js sur 30 jours
- Sélection de devise dynamique
- Calculs statistiques (min, max, moyenne)

### 🔔 **Alertes** (`/alerts`)
- Configuration d'alertes par email
- CRUD complet (créer, lire, supprimer)
- Notifications automatiques

## 🛠️ Stack technique

### **Frontend**
- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling et design system
- **React Router** - Navigation SPA
- **Chart.js** - Visualisation de données
- **Fetch API** - Communication backend

### **Backend**
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Développement typé
- **CORS** - Gestion cross-origin
- **dotenv** - Variables d'environnement
- **Nodemon** - Hot reload développementc API Node.js, historique des taux et interface React moderne**

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

## 📋 Description

Application full-stack de conversion de devises avec **API REST**, **historique des taux** et **alertes personnalisées**. Développée avec React, TypeScript, Node.js et une interface moderne glassmorphism.

## ✨ Fonctionnalités principales

| **Feature** | **Description** |
|:---:|:---|
| 💱 **Conversion temps réel** | 8 devises avec API backend |
| � **Dashboard analytique** | Statistiques et métriques avancées |
| 📈 **Historique des taux** | Graphiques interactifs sur 30 jours |
| 🔔 **Système d'alertes** | Notifications par email personnalisées |
| 🎨 **Design glassmorphism** | Interface moderne et responsive |
| 🔧 **API REST complète** | Backend Node.js avec Express |
| 📱 **Navigation fluide** | React Router avec menu intégré |

## 🚀 Lancement rapide

```bash
# Installation complète
npm install
cd server && npm install && cd ..

# Démarrage (Backend + Frontend automatique)
npm run dev
```

**Accès :** 
- Frontend: http://localhost:3000
- API Backend: http://localhost:5000

## 🚀 Devises supportées

| Devise | Code | Symbole | Pays/Région |
|--------|------|---------|-------------|
| 🇹🇳 Dinar Tunisien | TND | TND | Tunisie |
| 🇪🇺 Euro | EUR | € | Zone Euro |
| 🇺🇸 Dollar US | USD | $ | États-Unis |
| 🇬🇧 Livre Sterling | GBP | £ | Royaume-Uni |
| 🇲🇦 Dirham Marocain | MAD | MAD | Maroc |
| 🇨🇦 Dollar Canadien | CAD | C$ | Canada |
| 🇨🇭 Franc Suisse | CHF | CHF | Suisse |
| 🇯🇵 Yen Japonais | JPY | ¥ | Japon |

## 🛠️ Technologies utilisées

- **React 18** - Library JavaScript pour l'interface utilisateur
- **TypeScript** - Typage statique pour JavaScript
- **Tailwind CSS** - Framework CSS utility-first
- **Create React App** - Boilerplate React
- **PostCSS** - Outil de transformation CSS

## 📦 Installation et Configuration

### 🔧 Prérequis
- **Node.js** (version 18 ou supérieure)
- **npm** ou **yarn**

### 🚀 Installation complète

```bash
# 1. Cloner le repository
git clone [URL_DU_REPO]
cd convertisseur-devise

# 2. Installer les dépendances Frontend
npm install

# 3. Installer les dépendances Backend
cd server
npm install
cd ..

# 4. Configuration environnement (optionnel)
cd server
echo "PORT=5000" > .env
cd ..
```

### ⚡ Démarrage rapide

```bash
# Option 1: Démarrage automatique (Frontend + Backend)
npm run dev

# Option 2: Démarrage manuel séparé
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend  
npm start
```

**URLs d'accès :**
- 🌐 **Frontend React :** http://localhost:3000
- 🔌 **API Backend :** http://localhost:5000
- 📊 **Test API :** http://localhost:5000/api/health

## 📁 Structure du projet

```
convertisseur-devise/
├── 📁 public/              # Assets statiques
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── 📁 src/                 # Code source React
│   ├── App.tsx            # Routeur principal
│   ├── CurrencyConverter.tsx
│   ├── Dashboard.tsx
│   ├── RatesHistory.tsx
│   ├── AlertsManager.tsx
│   ├── APITester.tsx
│   └── 📁 services/
│       └── api.ts         # Services API
├── 📁 server/             # Backend Node.js
│   ├── server.js          # Serveur Express
│   ├── package.json       # Dépendances backend
│   └── .env              # Variables d'environnement
├── package.json           # Configuration principale
├── tsconfig.json          # Configuration TypeScript
└── tailwind.config.js     # Configuration Tailwind
```

## 💻 Scripts disponibles

### Frontend (Racine)
```bash
npm start              # Démarrage React (port 3000)
npm run build          # Build production
npm test               # Tests unitaires
npm run dev            # Frontend + Backend simultané
```

### Backend (Dossier server/)
```bash
npm run dev            # Démarrage avec nodemon
npm start              # Démarrage production
```

## 🔧 Configuration avancée

### Variables d'environnement (`server/.env`)
```env
PORT=5000              # Port du serveur API
NODE_ENV=development   # Environnement
CORS_ORIGIN=http://localhost:3000  # Origine CORS autorisée
```

### Configuration CORS personnalisée
```javascript
// server/server.js
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));
```

## 💡 Concepts avancés implémentés

### 🔷 TypeScript avancé
```typescript
// Types unions pour les devises
type Devise = 'TND' | 'EUR' | 'USD' | 'GBP' | 'MAD' | 'CAD' | 'CHF' | 'JPY';

// Interfaces pour l'API
interface ConversionRequest {
  amount: number;
  fromCurrency: Devise;
  toCurrency: Devise;
}

interface HistoricalRate {
  date: string;
  rate: number;
  currency: string;
}

// Record types pour les taux
const exchangeRates: Record<Devise, number> = {
  TND: 1,
  EUR: 0.31,
  USD: 0.33,
  // ...
};

// Generic API response type
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
```

### 🎨 Tailwind CSS moderne
```css
/* Glassmorphism effect */
.glass-card {
  @apply bg-white/10 backdrop-blur-md border border-white/20;
}

/* Responsive grid system */
.dashboard-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

/* Custom animations */
.fade-in {
  @apply opacity-0 translate-y-4 transition-all duration-500;
}
```

### 🔌 Architecture API REST
```javascript
// Express.js avec middleware moderne
app.use(express.json());
app.use(cors());
app.use(helmet()); // Sécurité

// Routes modulaires
app.get('/api/rates', getRates);
app.post('/api/convert', convertCurrency);
app.get('/api/history/:currency', getHistoricalRates);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ 
    success: false, 
    message: err.message 
  });
});
```

### 📊 Chart.js intégration
```typescript
// Configuration graphique dynamique
const chartConfig: ChartConfiguration = {
  type: 'line',
  data: {
    labels: dates,
    datasets: [{
      label: `Taux ${currency}`,
      data: rates,
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  }
};
```

## � Fonctionnalités futures

- [ ] 🔐 **Authentification utilisateur** (JWT)
- [ ] � **Notifications email** réelles
- [ ] 🌙 **Mode sombre** persistant
- [ ] 📱 **Application mobile** (React Native)
- [ ] 🤖 **Bot Telegram** intégré
- [ ] � **Machine Learning** prédictions
- [ ] 🌐 **API externe** temps réel
- [ ] 💾 **Base de données** PostgreSQL
- [ ] � **Dockerisation** complète
- [ ] ☁️ **Déploiement** cloud (Vercel/Railway)

## 🤝 Contribution et développement

### 📋 Guidelines de contribution
1. **Fork** le repository
2. **Branch** feature : `git checkout -b feature/amazing-feature`
3. **Commit** : `git commit -m 'feat: add amazing feature'`
4. **Push** : `git push origin feature/amazing-feature`
5. **Pull Request** avec description détaillée

### 🧪 Tests et qualité
```bash
# Tests Frontend
npm test                    # Jest + React Testing Library
npm run test:coverage      # Couverture de code

# Tests Backend  
cd server && npm test      # Tests API avec Supertest

# Linting et formatage
npm run lint               # ESLint
npm run format             # Prettier
npm run type-check         # TypeScript validation
```

### � Environnement de développement
- **VSCode** avec extensions recommandées
- **TypeScript strict mode** activé
- **Prettier** formatage automatique
- **ESLint** règles strictes
- **Husky** pre-commit hooks

## 📚 Apprentissages clés

### ⚡ **Performance**
- Code splitting avec React.lazy()
- Memoization des composants (React.memo)
- Optimisation des re-renders
- Lazy loading des graphiques

### 🔒 **Sécurité**
- Validation des entrées utilisateur
- Sanitisation des données API
- CORS configuré correctement
- Headers de sécurité (Helmet.js)

### 📱 **UX/UI**
- Design responsive mobile-first
- Feedback utilisateur (loading states)
- Gestion d'erreurs élégante
- Animations fluides

## 📝 Licence et crédits

**Licence :** MIT License - Libre d'utilisation

**Crédits :**
- Icons par [Heroicons](https://heroicons.com/)
- Fonts par [Google Fonts](https://fonts.google.com/)
- Design inspiré par [Glassmorphism](https://uxdesign.cc/glassmorphism-in-user-interfaces-1f39bb1308c9)

---

⭐ **N'hésitez pas à donner une étoile si ce projet vous a aidé à apprendre le développement full-stack !**

🔗 **Liens utiles :**
- [Documentation React](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
