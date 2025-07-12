# 💰 Convertisseur de Devises

> Un projet d'apprentissage TypeScript et Tailwind CSS - Convertisseur de devises moderne et responsive

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📋 Description

Application web de conversion de devises développée dans le cadre de l'apprentissage de **TypeScript** et **Tailwind CSS**. Elle permet de convertir entre différentes devises avec une interface moderne et intuitive.

## ✨ Fonctionnalités

- 💱 **Conversion bidirectionnelle** entre 8 devises différentes
- 🔄 **Échange rapide** des devises source/destination
- 🎨 **Design moderne** avec Tailwind CSS
- 📱 **Interface responsive** (mobile, tablette, desktop)
- ⚡ **Calcul en temps réel** des conversions
- 🌍 **Support multidevises** (TND, EUR, USD, GBP, MAD, CAD, CHF, JPY)
- 🏁 **Type Safety** avec TypeScript

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

## 📦 Installation et démarrage

### Prérequis
- Node.js (version 14 ou supérieure)
- npm ou yarn

### Installation

```bash
# Cloner le repository
git clone [URL_DU_REPO]
cd convertisseur-devise

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🏗️ Structure du projet

```
convertisseur-devise/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── App.tsx           # Composant principal
│   ├── App.css           # Styles spécifiques
│   ├── index.tsx         # Point d'entrée
│   └── index.css         # Styles globaux + Tailwind
├── tailwind.config.js    # Configuration Tailwind
├── postcss.config.js     # Configuration PostCSS
├── tsconfig.json         # Configuration TypeScript
└── package.json
```

## 💡 Concepts TypeScript appris

### Types personnalisés
```typescript
type Devise = 'TND' | 'EUR' | 'USD' | 'GBP' | 'MAD' | 'CAD' | 'CHF' | 'JPY';
```

### Record Types
```typescript
const tauxChange: Record<Devise, number> = {
  TND: 1,
  EUR: 0.31,
  // ...
};
```

### Interfaces
```typescript
interface DeviseInfo {
  symbol: string;
  name: string;
  flag: string;
}
```

### Hooks typés
```typescript
const [devise, setDevise] = useState<Devise>('TND');
```

## 🎨 Concepts Tailwind CSS utilisés

- **Utility Classes** : `bg-blue-500`, `text-center`, `p-4`
- **Responsive Design** : `md:max-w-lg`, `sm:text-sm`
- **Gradients** : `bg-gradient-to-br from-blue-500 to-pink-500`
- **Flexbox** : `flex items-center justify-center`
- **Transitions** : `transition-colors duration-200`
- **Focus States** : `focus:ring-2 focus:ring-blue-500`

## 📈 Fonctionnalités à venir

- [ ] 📊 Historique des conversions
- [ ] ⭐ Devises favorites
- [ ] 📡 Taux de change en temps réel (API)
- [ ] 🌙 Mode sombre
- [ ] 💾 Sauvegarde des préférences
- [ ] 📊 Graphiques de tendances

## 🤝 Contribution

Ce projet est à des fins d'apprentissage, mais les suggestions et améliorations sont les bienvenues !

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.


---

⭐ **N'hésitez pas à donner une étoile si ce projet vous a aidé à apprendre TypeScript et Tailwind CSS !**
