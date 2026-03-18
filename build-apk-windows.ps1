# ============================================================
#  imarsRecord — Script de build APK (Windows PowerShell)
#  Usage : Clic droit → Exécuter avec PowerShell
# ============================================================

$Host.UI.RawUI.WindowTitle = "imarsRecord — Build APK"
Write-Host ""
Write-Host "╔══════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║      imarsRecord — Build APK         ║" -ForegroundColor Blue
Write-Host "╚══════════════════════════════════════╝" -ForegroundColor Blue
Write-Host ""

# ── 1. Vérification Node.js ──────────────────────────────────
Write-Host "[1/5] Vérification de l'environnement..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js non trouvé. Téléchargez-le sur https://nodejs.org" -ForegroundColor Red
    Pause
    exit 1
}

# ── 2. Installation des dépendances ──────────────────────────
Write-Host ""
Write-Host "[2/5] Installation des dépendances..." -ForegroundColor Yellow
npm install
Write-Host "✓ Dépendances installées" -ForegroundColor Green

# ── 3. Installation EAS CLI ───────────────────────────────────
Write-Host ""
Write-Host "[3/5] Installation de EAS CLI..." -ForegroundColor Yellow
npm install -g eas-cli expo-cli
Write-Host "✓ EAS CLI installé" -ForegroundColor Green

# ── 4. Connexion Expo ─────────────────────────────────────────
Write-Host ""
Write-Host "[4/5] Connexion à Expo..." -ForegroundColor Yellow
Write-Host "  → Créez un compte gratuit sur https://expo.dev/signup si besoin" -ForegroundColor Cyan
Write-Host ""
eas login

# ── 5. Build APK ─────────────────────────────────────────────
Write-Host ""
Write-Host "[5/5] Lancement du build APK cloud..." -ForegroundColor Yellow
Write-Host ""
eas build --platform android --profile preview

Write-Host ""
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✓ Build lancé sur le cloud Expo !       ║" -ForegroundColor Green
Write-Host "║                                          ║" -ForegroundColor Green
Write-Host "║  Suivez la progression sur :             ║" -ForegroundColor Green
Write-Host "║  https://expo.dev                        ║" -ForegroundColor Green
Write-Host "║                                          ║" -ForegroundColor Green
Write-Host "║  L'APK sera disponible dans ~10 min      ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Pause
