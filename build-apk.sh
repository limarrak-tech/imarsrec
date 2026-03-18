#!/bin/bash
# ============================================================
#  imarsRecord — Script de build APK
#  Usage : chmod +x build-apk.sh && ./build-apk.sh
# ============================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      imarsRecord — Build APK         ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════╝${NC}"
echo ""

# ── 1. Vérification Node.js ──────────────────────────────────
echo -e "${YELLOW}[1/6] Vérification de l'environnement...${NC}"
if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js non trouvé. Installez Node.js ≥ 18 : https://nodejs.org${NC}"
  exit 1
fi
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo -e "${RED}✗ Node.js ≥ 18 requis (actuel: $(node -v))${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# ── 2. Installation des dépendances ──────────────────────────
echo ""
echo -e "${YELLOW}[2/6] Installation des dépendances npm...${NC}"
npm install
echo -e "${GREEN}✓ Dépendances installées${NC}"

# ── 3. Installation Expo CLI + EAS CLI ───────────────────────
echo ""
echo -e "${YELLOW}[3/6] Installation des outils Expo...${NC}"
if ! command -v expo &> /dev/null; then
  npm install -g expo-cli
  echo -e "${GREEN}✓ expo-cli installé${NC}"
else
  echo -e "${GREEN}✓ expo-cli déjà présent${NC}"
fi

if ! command -v eas &> /dev/null; then
  npm install -g eas-cli
  echo -e "${GREEN}✓ eas-cli installé${NC}"
else
  echo -e "${GREEN}✓ eas-cli déjà présent${NC}"
fi

# ── 4. Connexion Expo ─────────────────────────────────────────
echo ""
echo -e "${YELLOW}[4/6] Connexion à Expo...${NC}"
echo -e "  → Si vous n'avez pas de compte : https://expo.dev/signup (gratuit)"
echo ""
eas login

# ── 5. Initialisation du projet EAS ──────────────────────────
echo ""
echo -e "${YELLOW}[5/6] Initialisation du projet EAS...${NC}"
eas init --id auto || true

# ── 6. Build APK ─────────────────────────────────────────────
echo ""
echo -e "${YELLOW}[6/6] Lancement du build APK...${NC}"
echo ""
echo -e "  Choisissez votre mode de build :"
echo -e "  ${BLUE}[1]${NC} Cloud EAS (recommandé — gratuit, ~10 min, aucun SDK requis)"
echo -e "  ${BLUE}[2]${NC} Local (Android Studio + SDK requis)"
echo ""
read -p "Votre choix [1/2] : " choice

if [ "$choice" = "2" ]; then
  echo ""
  echo -e "${YELLOW}Build local...${NC}"
  eas build --platform android --profile apk-local --local
else
  echo ""
  echo -e "${YELLOW}Build cloud EAS (preview APK)...${NC}"
  eas build --platform android --profile preview
fi

# ── Résultat ──────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✓ Build terminé !                       ║${NC}"
echo -e "${GREEN}║                                          ║${NC}"
echo -e "${GREEN}║  → Téléchargez l'APK sur expo.dev        ║${NC}"
echo -e "${GREEN}║  → Installez sur Android :               ║${NC}"
echo -e "${GREEN}║    adb install imarsRecord.apk           ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
echo ""
