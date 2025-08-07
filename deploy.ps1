# Script PowerShell pour déploiement GitHub Pages
# CurrencyPro - Convertisseur de devises

Write-Host "🚀 Déploiement GitHub Pages - CurrencyPro" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

try {
    # 1. Build de l'application
    Write-Host "📦 Construction de l'application..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Erreur lors du build"
    }

    # 2. Sauvegarde de la branche actuelle
    $currentBranch = git branch --show-current
    Write-Host "📋 Branche actuelle: $currentBranch" -ForegroundColor Green

    # 3. Passage à gh-pages
    Write-Host "🔄 Basculement vers gh-pages..." -ForegroundColor Yellow
    git checkout gh-pages

    # 4. Suppression des anciens fichiers (sauf .git et dossiers système)
    Write-Host "🧹 Nettoyage des anciens fichiers..." -ForegroundColor Yellow
    Get-ChildItem -Path . -Exclude ".git", "build" | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

    # 5. Copie des nouveaux fichiers
    Write-Host "📂 Copie des fichiers de build..." -ForegroundColor Yellow
    Copy-Item -Path "build\*" -Destination "." -Recurse -Force

    # 6. Suppression du dossier build copié
    Remove-Item -Path "build" -Recurse -Force -ErrorAction SilentlyContinue

    # 7. Ajout et commit
    Write-Host "📝 Commit des modifications..." -ForegroundColor Yellow
    git add .
    $commitMessage = "🚀 Déploiement GitHub Pages $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    git commit -m $commitMessage

    # 8. Push vers GitHub
    Write-Host "⬆️ Push vers GitHub..." -ForegroundColor Yellow
    git push origin gh-pages

    # 9. Retour à la branche originale
    Write-Host "🔙 Retour à la branche $currentBranch..." -ForegroundColor Yellow
    git checkout $currentBranch

    Write-Host "✅ Déploiement terminé avec succès!" -ForegroundColor Green
    Write-Host "🌐 Votre site sera disponible à: https://Azer-khadhraoui.github.io/convertisseur-devise" -ForegroundColor Cyan
    Write-Host "⏱️ Attendre 5-10 minutes pour la propagation" -ForegroundColor Yellow

} 
catch {
    Write-Host "❌ Erreur lors du déploiement: $_" -ForegroundColor Red
    Write-Host "🔙 Retour à la branche master..." -ForegroundColor Yellow
    git checkout master
}
