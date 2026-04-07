# Configuration TikTok pour EnfantDisparu.bf

Ce guide explique comment configurer l'intégration TikTok pour publier automatiquement les alertes enfants disparus.

## Vue d'ensemble

L'intégration TikTok permet de publier automatiquement chaque nouvelle alerte sur le compte TikTok officiel de EnfantDisparu.bf.

**Flux de publication :**
1. Un utilisateur crée une alerte sur enfentdisparu.bf
2. Firebase Functions génère l'alert card (image)
3. Firebase Functions publie automatiquement sur TikTok avec l'API Content Posting
4. L'alerte apparaît sur le compte TikTok @enfentdisparu.bf

## Prérequis

- Compte TikTok Business/Creator
- Accès au [TikTok Developer Portal](https://developers.tiktok.com/)
- Nom de domaine vérifié

## Configuration initiale

### 1. Créer une app TikTok

1. Aller sur https://developers.tiktok.com/apps
2. Cliquer sur "Create new app"
3. Remplir les informations :
   - **App name** : EnfantDisparu.bf
   - **Category** : Social Good / Non-profit
   - **Description** : Plateforme de signalement d'enfants disparus au Burkina Faso

### 2. Configurer les URLs

Dans les paramètres de l'app :

- **Website URL** : `https://enfentdisparu.bf`
- **Terms of Service** : `https://enfentdisparu.bf/conditions-utilisation`
- **Privacy Policy** : `https://enfentdisparu.bf/politique-confidentialite`
- **Redirect URI** : `https://enfentdisparu.bf/api/auth/tiktok/callback`

### 3. Vérifier le domaine

1. Copier le code de vérification fourni par TikTok
2. Ajouter un enregistrement TXT DNS :
   ```
   Type: TXT
   Name: @
   Value: tiktok-developers-site-verification=VOTRE_CODE_ICI
   ```
3. Attendre la propagation DNS (5 min à 24h)
4. Cliquer sur "Vérifier" dans le Developer Portal

### 4. Ajouter les produits

Ajouter uniquement ces produits (nécessaires pour Content Posting API) :

- ✅ **Login Kit** (requis, dépendance)
- ✅ **Content Posting API** (pour publier les alertes)

**Ne pas ajouter** :
- ❌ Share Kit (pas nécessaire)
- ❌ Webhooks (optionnel)

### 5. Obtenir les credentials

1. Dans l'onglet "Basic information"
2. Copier le **Client Key** et **Client Secret**
3. Les ajouter dans Firebase Secret Manager :
   ```bash
   firebase functions:secrets:set TIKTOK_CLIENT_KEY
   firebase functions:secrets:set TIKTOK_CLIENT_SECRET
   ```

4. Ajouter le Client Key dans `.env.local` :
   ```
   NEXT_PUBLIC_TIKTOK_CLIENT_KEY=votre_client_key_ici
   ```

### 6. Créer la vidéo de démonstration

TikTok exige une vidéo montrant l'intégration. Utiliser Loom pour enregistrer :

1. Page d'accueil enfentdisparu.bf
2. Page admin `/admin/tiktok`
3. Clic sur "Connecter TikTok" → Login Kit OAuth
4. Autorisation TikTok
5. Retour sur le site avec "✅ Compte connecté"
6. Création d'une nouvelle alerte
7. Ouverture de TikTok montrant l'alerte publiée automatiquement

**Spécifications vidéo :**
- Format : MP4 ou MOV
- Taille max : 50 MB
- Durée : 30-60 secondes recommandé
- Doit montrer clairement l'UI et les interactions

### 7. Soumettre pour review

1. Uploader la vidéo de démo
2. Vérifier que tous les champs sont remplis
3. Cliquer sur "Soumettre"
4. Attendre l'approbation (généralement 1-3 jours ouvrables)

## Utilisation (après approbation)

### Connecter le compte TikTok officiel

1. Aller sur `https://enfentdisparu.bf/admin/tiktok`
2. Cliquer sur "Connecter TikTok"
3. Autoriser l'application à publier sur votre compte
4. Le token sera stocké dans Firestore (`app_config/tiktok`)

### Publication automatique

Une fois connecté, toutes les nouvelles alertes seront automatiquement publiées sur TikTok !

Le système :
1. Récupère l'access token depuis Firestore
2. Upload l'alert card sur TikTok
3. Publie le post avec la description formatée
4. Stocke le `tiktokVideoId` dans l'annonce

### Renouvellement du token

Le token TikTok expire après 24 heures. Pour le renouveler :

1. Retourner sur `/admin/tiktok`
2. Cliquer sur "Reconnecter TikTok"

**TODO** : Implémenter le refresh automatique avec le refresh token.

## Structure du code

### Frontend

- **`/admin/tiktok`** : Page admin pour connecter le compte TikTok
- **`/api/auth/tiktok/callback`** : Endpoint OAuth callback

### Backend (Firebase Functions)

- **`exchangeTikTokCode`** : Échange le code OAuth contre un access token
- **`postToTikTok`** : Endpoint HTTP pour publication manuelle (tests)
- **`services/tiktok.ts`** : Service de publication TikTok
  - `getTikTokAccessToken()` : Récupère le token depuis Firestore
  - `postAnnouncementToTikTok()` : Publie une alerte sur TikTok

### Firestore

Collection : `app_config`
Document : `tiktok`

```typescript
{
  accessToken: string,
  refreshToken: string,
  expiresAt: number,
  connectedAt: number,
  openId: string,
  scope: string,
  tokenType: string,
  updatedAt: Timestamp
}
```

## Dépannage

### "TikTok access token not available"

Le compte TikTok n'est pas connecté. Aller sur `/admin/tiktok` et se connecter.

### "TikTok access token expired"

Le token a expiré (24h). Reconnecter le compte sur `/admin/tiktok`.

### "Failed to post to TikTok"

Vérifier :
- Le token est valide
- L'alert card URL existe
- Les credentials TikTok sont corrects dans Firebase Secrets

### La vidéo n'apparaît pas sur TikTok

En mode **Sandbox**, les posts ne sont pas visibles publiquement. Il faut attendre l'approbation de l'app pour que les posts soient publics.

## Ressources

- [TikTok Developer Portal](https://developers.tiktok.com/)
- [TikTok Content Posting API Docs](https://developers.tiktok.com/doc/content-posting-api-get-started/)
- [TikTok Login Kit Docs](https://developers.tiktok.com/doc/login-kit-web/)

## Notes importantes

⚠️ **Mode Sandbox** : Avant l'approbation, l'app est en mode Sandbox. Les posts ne sont visibles que par les testeurs autorisés.

⚠️ **Limites de taux** : TikTok impose des limites de publication. Voir la documentation officielle pour les quotas.

⚠️ **Sécurité** : Le Client Secret ne doit JAMAIS être exposé côté client. Il est stocké dans Firebase Secret Manager et utilisé uniquement par les Cloud Functions.
