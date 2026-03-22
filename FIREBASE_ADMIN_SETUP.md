# Configuration Firebase Admin pour le développement local

Pour que l'API `/api/ambassador/submit` fonctionne en local, vous devez configurer Firebase Admin SDK.

## Option 1 : Service Account Key (Recommandé pour le développement)

1. Allez dans la [Console Firebase](https://console.firebase.google.com/)
2. Sélectionnez votre projet `taskflow-26718`
3. Allez dans **Paramètres du projet** (⚙️ en haut à gauche) → **Comptes de service**
4. Cliquez sur **Générer une nouvelle clé privée**
5. Téléchargez le fichier JSON
6. Renommez-le `serviceAccountKey.json`
7. Placez-le dans le dossier racine du projet (à côté de `package.json`)
8. Ajoutez-le au `.gitignore` (déjà fait)

Puis modifiez `src/app/api/ambassador/submit/route.ts` :

```typescript
// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      require("../../../../serviceAccountKey.json")
    ),
  });
}
```

## Option 2 : Application Default Credentials

Si vous avez installé `gcloud CLI` :

```bash
gcloud auth application-default login
```

Cette commande configure automatiquement les credentials.

## Option 3 : Variable d'environnement

Ajoutez dans `.env.local` :

```env
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
```

## Vérification

Redémarrez le serveur de développement :

```bash
npm run dev
```

Puis essayez de soumettre une candidature ambassadeur.

## En production (Cloud Functions)

Les Cloud Functions utilisent automatiquement les credentials du projet, pas besoin de configuration supplémentaire.
