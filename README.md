# 📖 imarsRecord

Application mobile pour enregistrer, rechercher et gérer votre dictionnaire personnel de mots.

Développée avec **React Native + Expo** (iOS & Android).

---

## ✨ Fonctionnalités

| Fonctionnalité | Status |
|---|---|
| Liste des mots avec recherche temps réel | ✅ |
| Ajouter un mot (formulaire complet) | ✅ |
| Éditer un mot existant | ✅ |
| Supprimer avec confirmation | ✅ |
| Partager un mot (Share natif) | ✅ |
| Capture de texte via image (caméra / galerie) | ✅ |
| Export JSON (sauvegarde) | ✅ |
| Import JSON (restauration + fusion) | ✅ |
| Statistiques (total, cette semaine, top catégorie) | ✅ |
| Mode sombre / clair automatique | ✅ |
| Stockage local persistant (AsyncStorage) | ✅ |
| Navigation par onglets (Accueil + Paramètres) | ✅ |
| Tests unitaires (tous passants) | ✅ |

---

## 🚀 Installation et lancement

### Prérequis
- Node.js ≥ 18
- npm ou yarn
- Expo CLI : `npm install -g expo-cli`
- App **Expo Go** sur votre téléphone (iOS ou Android)

### Étapes

```bash
# 1. Cloner / extraire le projet
cd imarsRecord

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm start
# ou
expo start

# 4. Scanner le QR code avec Expo Go
```

### Lancer sur simulateur

```bash
# iOS (macOS uniquement + Xcode)
npm run ios

# Android (Android Studio requis)
npm run android
```

### Lancer les tests

```bash
npm test
```

---

## 📁 Architecture du projet

```
imarsRecord/
├── App.tsx                      # Point d'entrée
├── app.json                     # Config Expo
├── package.json
├── tsconfig.json
├── __tests__/
│   └── app.test.ts             # Tests unitaires
└── src/
    ├── types.ts                 # Types TypeScript
    ├── theme.ts                 # Couleurs, thèmes clair/sombre
    ├── hooks/
    │   └── useWords.tsx        # Context + state management
    ├── utils/
    │   └── storage.ts          # AsyncStorage + export/import JSON
    ├── navigation/
    │   └── AppNavigator.tsx    # Navigation Stack + Tabs
    ├── components/
    │   └── WordCard.tsx        # Carte de mot réutilisable
    └── screens/
        ├── HomeScreen.tsx      # Accueil + liste + recherche
        ├── WordDetailScreen.tsx # Détail + actions
        ├── AddWordScreen.tsx   # Formulaire ajout/édition + capture image
        └── SettingsScreen.tsx  # Export, import, stats, préférences
```

---

## 🏗️ Technologies

| Technologie | Usage |
|---|---|
| React Native 0.73 | Framework mobile |
| Expo SDK 50 | Build & outils natifs |
| TypeScript | Typage statique |
| AsyncStorage | Persistance locale |
| React Navigation v6 | Navigation |
| expo-image-picker | Caméra & galerie |
| expo-sharing | Partage natif |
| expo-document-picker | Import JSON |
| expo-file-system | Lecture / écriture fichiers |

---

## 📸 Capture de texte via image (OCR)

La fonctionnalité de capture est prête à brancher sur un service OCR :

```typescript
// Dans AddWordScreen.tsx, fonction handleImageCapture()
// Remplacer le Alert.alert() par un appel OCR :

const response = await fetch('https://vision.googleapis.com/v1/images:annotate?key=YOUR_KEY', {
  method: 'POST',
  body: JSON.stringify({
    requests: [{
      image: { content: base64Image },
      features: [{ type: 'TEXT_DETECTION' }]
    }]
  })
});
const data = await response.json();
const detectedText = data.responses[0]?.fullTextAnnotation?.text ?? '';
setWordText(detectedText.split('\n')[0]); // premier ligne = mot
```

Services OCR compatibles :
- **Google Cloud Vision API** (recommandé)
- **AWS Textract**
- **Microsoft Azure Computer Vision**

---

## 📦 Build production

```bash
# Build pour iOS (App Store)
eas build --platform ios

# Build pour Android (Play Store)
eas build --platform android

# Build APK local pour Android
expo build:android -t apk
```

---

## 🎨 Personnalisation

Les couleurs et thèmes sont centralisés dans `src/theme.ts` :

```typescript
export const lightTheme: AppTheme = {
  accent: '#1A73E8',      // Couleur principale
  success: '#1E8E3E',     // Vert
  danger: '#D93025',      // Rouge
  // ...
};
```

---

*imarsRecord v1.0.0 — Développé avec React Native + Expo*
