# 📦 Guide de Build APK — imarsRecord

Ce guide explique comment générer le fichier `.apk` installable sur tout téléphone Android,
sans passer par le Play Store.

---

## ⚡ Méthode rapide (recommandée) — EAS Cloud

**Durée : ~10 minutes | Aucun SDK Android requis | Gratuit**

### Étape 1 — Prérequis

Installez Node.js ≥ 18 si ce n'est pas déjà fait :
- https://nodejs.org (téléchargez la version LTS)

### Étape 2 — Créer un compte Expo (gratuit)

https://expo.dev/signup

### Étape 3 — Ouvrir un terminal dans le dossier du projet

```bash
cd imarsRecord
```

### Étape 4 — Lancer le script automatique

```bash
# Rendre le script exécutable (Mac/Linux)
chmod +x build-apk.sh
./build-apk.sh

# Sur Windows (PowerShell)
npm install
npm install -g eas-cli expo-cli
eas login
eas build --platform android --profile preview
```

### Étape 5 — Récupérer l'APK

Une fois le build terminé (~10 min), Expo vous envoie un lien de téléchargement :

```
✔ Build finished
Download link: https://expo.dev/artifacts/eas/xxxx.apk
```

Téléchargez le fichier `.apk` et transférez-le sur votre téléphone Android.

---

## 📱 Installer l'APK sur Android

### Option A — Via câble USB (ADB)

```bash
# Installer ADB si nécessaire
# Windows : https://developer.android.com/studio/releases/platform-tools
# Mac :
brew install android-platform-tools

# Activer le débogage USB sur le téléphone :
# Paramètres → À propos → Numéro de build (appuyer 7 fois) → Options développeur → Débogage USB

# Installer l'APK
adb devices                          # vérifier que le téléphone est détecté
adb install imarsRecord.apk
```

### Option B — Transfert direct (le plus simple)

1. Copiez l'APK sur votre téléphone (câble, email, Google Drive, WhatsApp…)
2. Ouvrez le fichier `.apk` depuis le téléphone
3. Si demandé : **Paramètres → Sécurité → Sources inconnues → Autoriser**
4. Appuyez sur **Installer**

### Option C — QR Code (Expo Go, pour tester)

```bash
npx expo start
```
Scannez le QR code avec l'app **Expo Go** (Android/iOS) — aucun build nécessaire.

---

## 🔧 Méthode locale (Android Studio)

**Pour les développeurs avec Android Studio installé**

### Prérequis
- Android Studio : https://developer.android.com/studio
- Java JDK 17 : `brew install openjdk@17` (Mac) ou https://adoptium.net
- Variable d'environnement `ANDROID_HOME` configurée

### Build local

```bash
npm install
npm install -g eas-cli
eas login
eas build --platform android --profile apk-local --local
```

L'APK sera généré dans `./android/app/build/outputs/apk/release/`.

---

## 🔑 Signature de l'APK (production)

Pour distribuer officiellement, l'APK doit être signé. EAS gère ça automatiquement.

Pour signer manuellement :

```bash
# Générer un keystore (une seule fois)
keytool -genkey -v \
  -keystore imarsRecord.keystore \
  -alias imarsRecord \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Configurer dans eas.json
# "credentialsSource": "local"
# Et renseigner le keystore dans les variables d'environnement EAS
```

---

## 📊 Profils de build disponibles

| Profil | Commande | Usage |
|--------|----------|-------|
| `preview` | `eas build --profile preview` | APK de test, distribution interne |
| `apk-local` | `eas build --profile apk-local --local` | APK release en local |
| `production` | `eas build --profile production` | AAB pour Play Store |
| `development` | `eas build --profile development` | Debug avec dev client |

---

## 🌐 Publier sur le Play Store (optionnel)

```bash
# 1. Build AAB (Android App Bundle)
eas build --platform android --profile production

# 2. Soumettre au Play Store
eas submit --platform android

# Prérequis : compte Google Play Developer (25 USD unique)
# https://play.google.com/console
```

---

## ❓ Problèmes courants

### "SDK location not found"
```bash
# Créer le fichier local.properties dans android/
echo "sdk.dir=$HOME/Library/Android/sdk" > android/local.properties
# Windows : sdk.dir=C\:\\Users\\VotreNom\\AppData\\Local\\Android\\Sdk
```

### "Could not find tools.jar"
```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```

### "Gradle build failed"
```bash
cd android && ./gradlew clean && cd ..
eas build --platform android --profile apk-local --local
```

### L'APK ne s'installe pas
- Activer **Sources inconnues** dans les paramètres Android
- Désinstaller l'ancienne version si présente : `adb uninstall com.imars.record`

---

## 📋 Checklist avant distribution

- [ ] Tester sur au moins 2 appareils Android différents
- [ ] Vérifier que l'export/import JSON fonctionne
- [ ] Tester la caméra et la galerie
- [ ] Vérifier le mode sombre
- [ ] S'assurer que `versionCode` est incrémenté pour chaque mise à jour

---

*imarsRecord v1.0.0 — Guide Build APK*
