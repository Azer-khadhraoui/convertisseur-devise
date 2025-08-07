#!/bin/bash

# Script de déploiement manuel pour GitHub Pages
# Utiliser en cas de problème avec GitHub Actions

echo "🚀 Déploiement GitHub Pages - CurrencyPro"
echo "==========================================="

# 1. Build de l'application
echo "📦 Construction de l'application..."
npm run build

# 2. Sauvegarde de la branche actuelle
current_branch=$(git branch --show-current)
echo "📋 Branche actuelle: $current_branch"

# 3. Passage à gh-pages
echo "🔄 Basculement vers gh-pages..."
git checkout gh-pages

# 4. Suppression des anciens fichiers (sauf .git)
echo "🧹 Nettoyage des anciens fichiers..."
find . -maxdepth 1 ! -name '.git' ! -name '.' ! -name '..' -exec rm -rf {} +

# 5. Copie des nouveaux fichiers
echo "📂 Copie des fichiers de build..."
cp -r build/* .

# 6. Ajout et commit
echo "📝 Commit des modifications..."
git add .
git commit -m "🚀 Déploiement GitHub Pages $(date)"

# 7. Push vers GitHub
echo "⬆️ Push vers GitHub..."
git push origin gh-pages

# 8. Retour à la branche originale
echo "🔙 Retour à la branche $current_branch..."
git checkout $current_branch

echo "✅ Déploiement terminé!"
echo "🌐 Votre site sera disponible à: https://Azer-khadhraoui.github.io/convertisseur-devise"
echo "⏱️ Attendre 5-10 minutes pour la propagation"
