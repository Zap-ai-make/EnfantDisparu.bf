# 📋 Workflow Programme Ambassadeur

## 🎯 Flux Complet

### 1️⃣ Candidature (Utilisateur)
**Page** : [/devenir-ambassadeur](http://localhost:3000/devenir-ambassadeur)

1. L'utilisateur remplit le formulaire en 4 étapes :
   - Identité (prénom, nom, téléphone)
   - Zone (pays, ville, quartier)
   - Date de naissance + question anti-bot
   - Confirmation

2. Après soumission :
   - ✅ Un code ambassadeur unique est généré (ex: `AMB-AB12`)
   - ✅ Le statut est mis à `pending`
   - ✅ Redirection vers `/ambassadeur-confirme?ref=AMB-AB12`
   - ℹ️ L'utilisateur conserve son code pour suivre sa candidature

---

### 2️⃣ Validation Admin
**Page** : [/admin/ambassadeurs](http://localhost:3000/admin/ambassadeurs)

#### Accès à la page admin :
Allez directement sur : `http://localhost:3000/admin/ambassadeurs`

#### Actions disponibles :

**Onglet "En attente"** :
- Liste des candidatures avec statut `pending`
- Informations affichées : nom, téléphone, zones, date de création
- 2 boutons par candidature :
  - ✅ **Approuver** → Génère un lien d'accès WhatsApp
  - ❌ **Rejeter** → Demande une raison (optionnelle)

**Onglet "Approuvés"** :
- Liste des ambassadeurs actifs
- Affiche leurs stats (notifications, partages, recrutements, vues)
- Bouton pour voir leur dashboard

**Onglet "Rejetés"** :
- Liste des candidatures rejetées
- Affiche la raison du rejet

#### Workflow d'approbation :

1. Cliquer sur ✅ **Approuver**
2. Un `accessToken` est généré automatiquement
3. Une fenêtre WhatsApp s'ouvre avec un message pré-rempli :

```
Bonjour [Prénom],

Votre candidature ambassadeur EnfantDisparu.bf a été approuvée !

Accédez à votre tableau de bord :
https://enfantdisparu.bf/ambassadeur?t=[token]

Merci de votre engagement.
```

4. Envoyez le message WhatsApp
5. L'ambassadeur clique sur le lien et accède à son dashboard

---

### 3️⃣ Dashboard Ambassadeur
**Page** : [/ambassadeur?t={token}](http://localhost:3000/ambassadeur)

L'ambassadeur accède via le lien WhatsApp reçu après approbation.

#### Fonctionnalités :

**📊 Stats en temps réel** :
- 🔔 Notifications activées
- 📤 Alertes partagées
- 👥 Ambassadeurs recrutés
- 👁️ Vues générées

**📍 Gestion des zones** (max 5) :
- Voir ses zones actives
- Ajouter de nouvelles zones
- Ville → Quartier sélection

**🔗 Outils de partage** :
- **Message WhatsApp "Activer notifications"** : Invite les gens à s'inscrire aux alertes
- **Message WhatsApp "Recruter ambassadeur"** : Invite les gens à devenir ambassadeurs
- **QR Code personnel** : Téléchargeable pour impression
- **Copier le lien** : Partage rapide

**Lien de partage** : `https://enfantdisparu.bf/?ref=AMB-AB12`
- Trackage automatique des recrutements
- Attribution des notifications activées

---

## 🔑 Accès Rapides (Développement Local)

| Page | URL | Rôle |
|------|-----|------|
| **Landing Ambassadeur** | [/devenir-ambassadeur](http://localhost:3000/devenir-ambassadeur) | Inscription publique |
| **Admin** | [/admin/ambassadeurs](http://localhost:3000/admin/ambassadeurs) | Gestion candidatures |
| **Dashboard** | `/ambassadeur?t={token}` | Espace ambassadeur |

---

## 📱 Suivi de Candidature (Ambassadeur)

### Option 1 : Attendre le WhatsApp
L'ambassadeur attend simplement le message WhatsApp avec le lien.

### Option 2 : Page de suivi (pas encore implémentée)
Pourrait être créée : `/candidature?ref=AMB-AB12`
- Afficherait le statut : En attente / Approuvé / Rejeté
- Nécessite le code ref pour accéder

---

## 🔄 États d'une Candidature

```
┌─────────────┐
│  PENDING    │ → Candidature soumise, en attente
└──────┬──────┘
       │
       ├─→ APPROUVÉ   → Ambassadeur actif avec dashboard
       │
       └─→ REJETÉ     → Candidature refusée
```

---

## 🚀 Tracking et Attribution

### Quand quelqu'un clique sur le lien d'un ambassadeur :

1. **URL visitée** : `https://enfantdisparu.bf/?ref=AMB-AB12`

2. **Tracking automatique** :
   - Le `ref` est stocké dans localStorage + cookie (30 jours)
   - Composant `AmbassadorRefTracker` détecte et stocke

3. **Attribution** :
   - Si la personne **active les notifications** → `notificationsActivated++`
   - Si la personne **devient ambassadeur** → `ambassadorsRecruited++`
   - Chaque visite → `viewsGenerated++`

4. **Webhook OneSignal** :
   - Quand une notification est activée avec le tag `ambassador_ref`
   - Cloud Function incrémente automatiquement les stats

---

## 🛠️ Tests en Local

### Tester le flux complet :

1. **Inscrivez-vous comme ambassadeur** :
   ```
   http://localhost:3000/devenir-ambassadeur
   ```
   - Nom : Test User
   - Téléphone : 70123456
   - Zone : Ouagadougou > Pissy
   - Date : 1990-01-01
   - Chat : Oui

2. **Notez le code** (ex: AMB-AB12)

3. **Validez en tant qu'admin** :
   ```
   http://localhost:3000/admin/ambassadeurs
   ```
   - Onglet "En attente"
   - Cliquer sur ✅ Approuver

4. **Récupérez le lien du dashboard** :
   - Copier l'URL depuis le message WhatsApp
   - Ou cliquer sur le bouton "Voir dashboard" dans l'onglet "Approuvés"

5. **Accédez au dashboard** :
   ```
   http://localhost:3000/ambassadeur?t={le-token-généré}
   ```

---

## 📦 Base de données Firestore

### Collection `ambassadors`

```javascript
{
  id: "doc-id",
  refCode: "AMB-AB12",
  firstName: "Jean",
  lastName: "Dupont",
  phone: "+22670123456",
  zones: ["bfa-ouaga-pissy"],
  dateOfBirth: Timestamp,
  catAnswer: "yes",
  status: "pending" | "approved" | "rejected",

  // Seulement si approuvé
  accessToken: "uuid-token",
  accessTokenExpiresAt: Timestamp (7 jours),
  approvedAt: Timestamp,
  approvedBy: "admin",

  // Stats
  stats: {
    notificationsActivated: 0,
    alertsShared: 0,
    ambassadorsRecruited: 0,
    viewsGenerated: 0
  }
}
```

---

## 🔐 Sécurité

- ✅ Honeypot anti-bot
- ✅ Rate limiting (3 candidatures/heure par IP)
- ✅ Validation âge minimum (20 ans)
- ✅ Détection doublons par téléphone
- ✅ Access tokens expirables (7 jours)
- ✅ Validation hiérarchie zones

---

## 🎨 Pages créées

- ✅ `/devenir-ambassadeur` - Landing + Formulaire
- ✅ `/ambassadeur-confirme` - Confirmation candidature
- ✅ `/ambassadeur` - Dashboard ambassadeur
- ✅ `/admin/ambassadeurs` - Gestion admin
- ✅ Composant `AmbassadorQRCode` - QR code partageable
- ✅ Composant `AmbassadorRefTracker` - Tracking attribution

---

## 🚨 Production

### Cloud Functions à déployer :
- `oneSignalWebhook` - Tracking notifications
- `submitAmbassadorApplication` - Soumission candidatures

### Variables d'environnement :
```env
NEXT_PUBLIC_FIREBASE_PROJECT_ID=taskflow-26718
NEXT_PUBLIC_ONESIGNAL_APP_ID=a1ce6fb6-...
ONESIGNAL_WEBHOOK_SECRET=...
```

En production, l'API route `/api/ambassador/submit` n'est PAS utilisée.
La Cloud Function `submitAmbassadorApplication` prend le relais.
