# Architecture Technique — EnfantPerdu.bf
**Date :** 2026-03-02
**Projet :** EnfantPerdu.bf × SecureID
**Firebase project :** secureID (existant — plan Blaze)

---

## VUE D'ENSEMBLE

```
┌─────────────────────────────────────────────────────────────────┐
│                        FIREBASE (secureID)                       │
│                                                                  │
│  Firestore ──────────────────────────────────────────────────   │
│  ├── /announcements   (cœur EnfantPerdu.bf)                     │
│  ├── /zones           (secteurs/quartiers)                       │
│  ├── /push_subscribers (abonnés OneSignal par zone)             │
│  ├── /sightings       (signalements témoins)                     │
│  ├── /bracelets       (existant SecureID)                        │
│  ├── /profiles        (existant SecureID)                        │
│  ├── /users           (existant SecureID)                        │
│  ├── /orders          (existant SecureID)                        │
│  └── /scans           (existant SecureID)                        │
│                                                                  │
│  Storage                                                         │
│  ├── /announcement-photos/   (photos enfants)                   │
│  └── /alert-cards/           (images JPG générées pour partage) │
│                                                                  │
│  Cloud Functions (nouvelles)                                     │
│  ├── onAnnouncementCreate                                        │
│  ├── onAnnouncementUpdate                                        │
│  ├── scheduledReminders      (cron)                              │
│  ├── syncFacebookStats       (cron)                              │
│  ├── generateAlertCard                                           │
│  └── secureIdAlert           (endpoint API pour app SecureID)   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐     ┌──────────────────┐
│  enfantperdu.bf  │     │  secureid-app    │
│  (Next.js/Vercel)│     │  (app mobile)    │
│                  │     │                  │
│  Site public     │     │  Bandeau widget  │
│  Formulaire      │     │  "Mon enfant est │
│  Gestion annonce │     │   perdu" → API   │
│  Stats temps réel│     │                  │
└────────┬─────────┘     └────────┬─────────┘
         │                        │
         └──────────┬─────────────┘
                    │
             Firebase SDK
                    │
         ┌──────────▼──────────┐
         │     FIRESTORE       │
         └──────────┬──────────┘
                    │
         ┌──────────▼──────────────────────────┐
         │        CLOUD FUNCTIONS              │
         │                                      │
         │  → Facebook Graph API               │
         │  → WhatsApp Business Cloud API      │
         │  → OneSignal REST API               │
         └─────────────────────────────────────┘
```

---

## 1. STRUCTURE FIRESTORE

### Collection `/announcements`

Document ID : `EPB-{random4digits}` (ex: EPB-8472)

```javascript
{
  // Identité
  id:              "EPB-8472",
  shortCode:       "EPB-8472",
  secretToken:     "a8f3k2xp",          // lien de gestion parent
  createdAt:       Timestamp,
  updatedAt:       Timestamp,
  status:          "active",            // active | resolved | archived

  // Enfant
  childName:       "Aminata Sawadogo",
  childAge:        6,
  childGender:     "F",                 // M | F
  childPhoto:      "gs://storage/.../EPB-8472.jpg",
  childPhotoURL:   "https://...",       // URL publique
  description:     "Robe bleue, cheveux tressés",
  distinctiveSign: "Petite cicatrice front gauche",

  // Localisation
  zoneId:          "secteur-15-ouaga",
  zoneName:        "Secteur 15 — Ouagadougou",
  lastSeenPlace:   "Marché Rood-Woko, côté légumes",
  lastSeenAt:      Timestamp,

  // Contact parent (jamais affiché publiquement)
  parentPhone:     "+22670XXXXXX",
  parentPhoneDisplay: "+226 70 XX XX XX",  // masqué pour affichage

  // Lien SecureID (null si annonce sans bracelet)
  isSecureID:      false,
  linkedProfileId: null,
  linkedBraceletId: null,
  lastGpsLat:      null,
  lastGpsLng:      null,

  // Stats (mises à jour automatiquement par Cloud Functions)
  stats: {
    facebookPostId:    "123456789",
    facebookReach:     1247,
    facebookShares:    203,
    facebookClicks:    89,
    whatsappSent:      892,
    whatsappDelivered: 876,
    whatsappRead:      701,
    pushSent:          267,
    pushClicked:       43,
    pageViews:         1089,
    alertSubscribers:  34,              // abonnés "alertez-moi" sur cette annonce
  },

  // Suivi automatique (relances)
  remindersSent:   0,                   // 0 → 3
  lastReminderAt:  null,
  nextReminderAt:  Timestamp,           // prochaine relance planifiée

  // Clôture
  resolvedAt:      null,
  resolvedBy:      null,               // "parent" | "community" | "auto"
}
```

---

### Collection `/zones`

```javascript
// /zones/secteur-15-ouaga
{
  id:                   "secteur-15-ouaga",
  name:                 "Secteur 15",
  city:                 "Ouagadougou",
  country:              "BF",
  oneSignalSegment:     "zone-secteur-15",   // segment OneSignal pour ciblage
  activeAnnouncements:  3,                   // counter mis à jour automatiquement
}
```

Zones initiales à créer :
- Secteur 15, 17, 22, 25, 27, 30 (Ouaga)
- Pissy, Gounghin, Bogodogo, Nongr-Massom, Tanghin
- Bobo-Dioulasso Centre, Secteur 1 Bobo
- Autres (pour les villes secondaires)

---

### Collection `/sightings`

```javascript
// /sightings/{sightingId}
{
  announcementId:  "EPB-8472",
  createdAt:       Timestamp,
  place:           "Près de l'école primaire, rue Manga",
  description:     "Enfant seul, semblait perdu, pleurait",
  reporterPhone:   "+22670XXXXXX",   // masqué
  anonymous:       false,
  status:          "pending",        // pending | reviewed | confirmed | dismissed
}
```

---

### Collection `/push_subscribers`

```javascript
// /push_subscribers/{oneSignalPlayerId}
{
  oneSignalPlayerId: "abc-123-xyz",
  zoneIds:          ["secteur-15-ouaga", "pissy-ouaga"],
  createdAt:        Timestamp,
  lastSeen:         Timestamp,
}
```

---

### Sous-collection `/announcements/{id}/alert_subscribers`

```javascript
// Gens qui cliquent "Alertez-moi si retrouvé" sur une annonce
// /announcements/EPB-8472/alert_subscribers/{phone_hash}
{
  phoneHash:  "sha256(+22670XXXXXX)",   // jamais le vrai numéro
  waPhone:    "+22670XXXXXX",           // pour envoyer le message de clôture
  createdAt:  Timestamp,
  notified:   false,
}
```

---

## 2. PAGES DU SITE — enfantperdu.bf

```
/                          → Homepage
/signaler                  → Formulaire création annonce
/annonce/[shortCode]       → Page publique annonce (ex: /annonce/EPB-8472)
/gestion/[secretToken]     → Gestion annonce par le parent
/retrouver-mon-annonce     → Fallback "j'ai perdu mon lien"
/retrouvailles             → Hall of fame des retrouvailles
/zones/[zoneId]            → Feed filtré par zone
/code/[shortCode]          → Redirect vers /annonce/[shortCode] (recherche par code)
/api/...                   → Endpoints API (voir section API)
```

---

### `/` — Homepage

**Contenu :**
- Header : logo + "Signaler un enfant" (CTA primaire)
- Bandeau OneSignal : "🔔 Recevoir les alertes de mon quartier"
- **Stats globales** (temps réel Firestore) :
  ```
  ✅ 847 enfants retrouvés   |   🚨 12 cas actifs   |   ⚡ 23 min délai moyen
  ```
- Feed des annonces actives (toutes zones, triées par date)
- Filtre rapide par ville / zone
- Footer : lien SecureID + contact

---

### `/signaler` — Formulaire création

**3 étapes simples :**

```
ÉTAPE 1 — L'enfant
  Prénom et nom *
  Âge *
  Genre (Garçon / Fille)
  Photo * (upload)
  Description physique (vêtements, coiffure...)
  Signe distinctif (optionnel)

ÉTAPE 2 — Où et quand
  Zone / Quartier * (select parmi les zones)
  Lieu précis * (texte libre : "Marché Rood-Woko")
  Heure de disparition * (datetime picker)

ÉTAPE 3 — Votre contact
  Numéro WhatsApp * (pour recevoir le lien de gestion)
  [pas affiché publiquement — mention rassurante]

→ PUBLIER L'ANNONCE

CONFIRMATION :
  ┌────────────────────────────────────────────┐
  │ ✅ Votre annonce est en ligne !             │
  │                                             │
  │ Code de référence : EPB-8472               │
  │                                             │
  │ Vous recevez votre lien de gestion         │
  │ sur WhatsApp dans quelques secondes.       │
  │                                             │
  │ Votre annonce est diffusée sur :           │
  │ ✓ Facebook EnfantPerdu.bf                  │
  │ ✓ Chaîne WhatsApp                          │
  │ ✓ Notifications membres du Secteur 15      │
  └────────────────────────────────────────────┘
```

---

### `/annonce/[shortCode]` — Page publique

**Contenu :**
- Photo grand format + badge statut (🔴 ACTIF / ✅ RETROUVÉ)
- Infos enfant complètes
- Dernière zone vue + heure
- **Stats en temps réel** (listener Firestore) :
  ```
  📊 Portée de cette annonce
  👁 3,247 personnes atteintes
  📘 1,891 via Facebook  (203 partages)
  💬 1,089 via WhatsApp  (701 lus)
  🔔   267 membres alertés
  Publiée il y a 47 min
  ```
- Bouton **"📍 J'ai vu cet enfant"** → formulaire signalement
- Bouton **"🔔 M'alerter si retrouvé"** → saisie numéro WhatsApp
- Bouton **"↗ Partager"** → télécharge la carte JPG OU copie le lien
- Séparateur
- Si annonce SecureID → "🛡 Cet enfant est protégé par SecureID"
- CTA bas de page → "Protégez votre enfant : découvrir SecureID"

**Open Graph (méta-tags pour WhatsApp/Facebook) :**
```html
<meta property="og:title" content="🚨 URGENT — Aminata, 6 ans, disparue à Ouagadougou" />
<meta property="og:description" content="Dernière vue au Secteur 15 aujourd'hui à 14h30. Contactez-nous si vous l'avez vue." />
<meta property="og:image" content="https://.../alert-cards/EPB-8472.jpg" />
<meta property="og:url" content="https://enfantperdu.bf/annonce/EPB-8472" />
```

---

### `/gestion/[secretToken]` — Espace parent

**Accessible uniquement via le lien secret (pas de mot de passe)**

**Contenu :**
- Vue de l'annonce telle qu'elle apparaît publiquement
- Stats détaillées par canal (Facebook reach, WA read, push clicked...)
- Liste des signalements reçus (/sightings)
- Boutons d'action :
  - ✏️ Modifier l'annonce (description, photo)
  - 📢 Relancer l'alerte manuellement
  - ✅ **Mon enfant a été retrouvé** → déclenche la clôture

---

### `/retrouver-mon-annonce` — Fallback

```
Vous avez perdu votre lien de gestion ?

[+226 __ __ __ __]   ← numéro WhatsApp utilisé lors de la création

[Recevoir mon lien →]

→ Firebase vérifie → renvoie le lien par WhatsApp
```

---

### `/retrouvailles` — Hall of fame

- Liste des cas résolus avec photo de l'enfant retrouvé
- Témoignage court (optionnel, avec accord du parent)
- Compteur animé : "X enfants retrouvés grâce à la communauté"
- Très important pour la confiance et la viralité

---

## 3. CLOUD FUNCTIONS

### `onAnnouncementCreate`

**Déclencheur :** `functions.firestore.document('announcements/{id}').onCreate()`

```javascript
Séquence d'exécution :
1. Générer shortCode unique (EPB-XXXX)
2. Appeler generateAlertCard() → image JPG dans Storage
3. Poster sur Facebook Page (Graph API)
   → Stocker facebookPostId dans l'annonce
4. Envoyer WhatsApp au parent avec lien de gestion
   → "✅ Votre annonce EPB-8472 est en ligne.
      Gérez-la ici : enfantperdu.bf/gestion/a8f3k2"
5. Envoyer OneSignal push aux abonnés de la zone concernée
6. Incrémenter zones/{zoneId}.activeAnnouncements
7. Planifier nextReminderAt = now + 24h
```

---

### `onAnnouncementUpdate`

**Déclencheur :** `functions.firestore.document('announcements/{id}').onUpdate()`

```javascript
Si status passe à "resolved" :
  1. Poster "Retrouvaille" sur Facebook Page
     → "✅ BONNE NOUVELLE — Aminata a été retrouvée ! Merci à tous."
  2. Notifier les alert_subscribers de l'annonce par WhatsApp
     → "✅ Bonne nouvelle ! Aminata (EPB-8472) a été retrouvée.
        Merci d'avoir partagé."
  3. Décrémenter zones/{zoneId}.activeAnnouncements
  4. Incrémenter compteur global resolved (document /stats/global)
  5. Supprimer le push OneSignal actif si existant
```

---

### `scheduledReminders`

**Déclencheur :** `functions.pubsub.schedule('every 60 minutes')`

```javascript
Query : announcements WHERE status = "active"
                        AND nextReminderAt <= now()

Pour chaque annonce trouvée :
  If remindersSent === 0 (24h) :
    → WhatsApp : "Des nouvelles d'Aminata ?
      Répondez OUI si retrouvée, votre annonce reste active sinon.
      enfantperdu.bf/gestion/a8f3k2"

  If remindersSent === 1 (72h) :
    → WhatsApp : "Aminata (EPB-8472) est toujours recherchée.
      Nous relançons l'alerte dans votre quartier.
      Souhaitez-vous mettre à jour la description ?"
    → Repost Facebook automatique

  If remindersSent === 2 (7j) :
    → WhatsApp : "Cela fait 7 jours. Nous relançons une alerte.
      Si Aminata a été retrouvée, merci de nous le signaler."
    → Repost Facebook avec mention "7 jours de recherche"

  If remindersSent === 3 AND dernière activité > 30j :
    → WhatsApp : "Votre annonce va être archivée dans 48h.
      Répondez pour la maintenir active."
    → Si pas de réponse après 48h → status = "archived"

  Mettre à jour remindersSent++
  Calculer prochain nextReminderAt
```

---

### `syncFacebookStats`

**Déclencheur :** `functions.pubsub.schedule('every 2 hours')`

```javascript
Query : announcements WHERE status = "active"
                        AND stats.facebookPostId != null

Pour chaque annonce :
  GET https://graph.facebook.com/{postId}/insights
    ?metric=post_impressions_unique,post_clicks,post_shares
    &access_token={PAGE_TOKEN}

  → Mettre à jour stats.facebookReach, facebookClicks, facebookShares
```

---

### `generateAlertCard`

**Appelé par onAnnouncementCreate**

```javascript
// Génère l'image JPG partageable (la "carte d'alerte")
// Option A : API Bannerbear (template prédéfini, facile)
// Option B : endpoint Next.js /api/generate-card
//            (satori + sharp → génère image côté serveur)

Input :  { childName, childAge, childPhoto, zoneName,
           lastSeenPlace, lastSeenAt, shortCode }
Output : URL Firebase Storage de la carte JPG

Taille : 1200×630px (ratio idéal WhatsApp + Facebook)
```

---

### `secureIdAlert`

**Déclencheur :** HTTP endpoint (appelé par l'app SecureID)

```javascript
// Quand parent SecureID tape "Mon enfant est perdu"
POST /secureIdAlert
Body : {
  userId:      "uid_parent",
  profileId:   "profile_enfant",
  braceletId:  "BF-042",
  lastGpsLat:  12.3456,
  lastGpsLng:  -1.5678,
}

Séquence :
1. Récupérer profil enfant depuis /profiles/{profileId}
   → childName, childAge, childGender, childPhoto
2. Déterminer la zone à partir des coordonnées GPS
3. Créer le document dans /announcements avec :
   - isSecureID: true
   - linkedProfileId, linkedBraceletId
   - lastGpsLat, lastGpsLng
   - toutes les infos du profil pré-remplies
4. Le reste est géré par onAnnouncementCreate (cascade normale)
```

---

## 4. INTÉGRATIONS EXTERNES

### Facebook Graph API

```
Permissions nécessaires :
  - pages_manage_posts    → poster sur la Page
  - pages_read_engagement → lire les stats
  - pages_show_list       → accès à la Page

Token : Page Access Token (longue durée — 60 jours, à rafraîchir)
Stocker dans : Firebase Remote Config (jamais dans le code)

Endpoints utilisés :
  POST /{page-id}/photos      → upload photo + légende
  GET  /{post-id}/insights    → stats du post
```

**Format du post Facebook :**
```
🚨 ENFANT PERDU — URGENT

Aminata Sawadogo, 6 ans, disparue aujourd'hui à 14h30.
📍 Dernière vue : Marché Rood-Woko, Secteur 15 — Ouagadougou
👗 Robe bleue, cheveux tressés

Si vous l'avez vue, contactez sa famille immédiatement :
🔗 enfantperdu.bf/annonce/EPB-8472

⚡ Partagez — chaque partage peut sauver une vie.
#EnfantPerdu #Ouagadougou #BurkinaFaso
```

---

### WhatsApp Business Cloud API (Meta)

```
Setup :
  - Compte Meta Business Manager
  - Numéro dédié WhatsApp Business (ex: +226 XX XX XX XX)
  - Accès via Meta Cloud API (gratuit avec Firebase Blaze)
  - Webhook pour recevoir les réponses parents (OUI/NON)

Utilisation :
  1. Envoi lien de gestion au parent (après création annonce)
  2. Envoi relances automatiques (scheduledReminders)
  3. Réception réponses parents (webhook → Cloud Function)
  4. Notification clôture aux alert_subscribers
  5. Fallback "retrouver mon annonce" (envoi lien)

Templates pré-approuvés Meta requis pour :
  - Message de confirmation de création
  - Messages de relance
  - Message de clôture/retrouvaille
```

---

### OneSignal

```
Setup :
  - App OneSignal type "Web Push"
  - SDK intégré dans Next.js (3 lignes)
  - Segments créés par zone (un segment = une zone)

Flow abonnement :
  1. Visiteur arrive sur enfantperdu.bf
  2. Bandeau : "Recevoir les alertes de mon quartier"
  3. Sélectionne sa zone → popup permission navigateur
  4. OneSignal enregistre le playerId + zone choisie
  5. Sauvegarde dans /push_subscribers Firestore

Flow notification :
  Cloud Function → OneSignal API
  POST https://onesignal.com/api/v1/notifications
  Body : {
    "app_id": "...",
    "included_segments": ["zone-secteur-15"],
    "headings": { "fr": "🚨 Enfant perdu — Secteur 15" },
    "contents": { "fr": "Aminata, 6 ans. Dernière vue il y a 5 min." },
    "url": "https://enfantperdu.bf/annonce/EPB-8472",
    "large_icon": "https://.../EPB-8472.jpg"
  }
```

---

## 5. WIDGET SECUREID — Bandeau dans le dashboard

**Côté SecureID app (React Native / Flutter) :**

```javascript
// Composant à ajouter dans le dashboard parent
// Appelle l'API EnfantPerdu.bf avec la zone du parent

const AlertBanner = ({ userZoneId }) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Realtime listener Firestore (même Firebase project)
    const unsubscribe = firestore()
      .collection('announcements')
      .where('zoneId', '==', userZoneId)
      .where('status', '==', 'active')
      .orderBy('createdAt', 'desc')
      .limit(3)
      .onSnapshot(snapshot => {
        setAlerts(snapshot.docs.map(d => d.data()));
      });
    return unsubscribe;
  }, [userZoneId]);

  if (alerts.length === 0) return null;

  return (
    <View style={styles.banner}>
      <Text>🚨 {alerts.length} alerte(s) dans votre secteur</Text>
      {alerts.map(a => (
        <TouchableOpacity onPress={() => openURL(`enfantperdu.bf/annonce/${a.shortCode}`)}>
          <Text>{a.childName}, {a.childAge} ans — {a.lastSeenPlace}</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.link}>Voir sur EnfantPerdu.bf →</Text>
    </View>
  );
};
```

**Avantage :** même Firebase project = pas d'API à construire, accès direct Firestore.

---

## 6. STACK TECHNIQUE RECOMMANDÉE

```
Frontend enfantperdu.bf :
  Framework  : Next.js 14+ (App Router)
  Style      : Tailwind CSS
  Hébergement: Vercel (gratuit au départ, même config que SecureID landing)
  Firebase   : firebase SDK v9+ (client)
  Push       : @onesignal/onesignal-react-native (ou web SDK)
  Images     : next/image + Firebase Storage

Backend :
  Firebase Cloud Functions (Node.js 20)
  Firebase Firestore (realtime listeners)
  Firebase Storage (photos + cartes JPG)
  Firebase Auth : NON utilisé pour les parents anonymes
                  OUI pour les comptes admin/modération éventuels

Génération carte d'alerte :
  Option A (recommandée pour solo dev) :
    → Bannerbear.com : templates visuels no-code, API simple
    → ~$49/mois mais zéro dev time
  Option B (gratuit mais à coder) :
    → @vercel/og (satori) dans un endpoint Next.js /api/og
    → génère l'image côté serveur en JSX → PNG/JPG

Automatisation (optionnel si Cloud Functions suffisent) :
  → n8n self-hosted sur un VPS (Railway, Render...)
    pour les flux plus complexes sans code

Variables d'environnement (Firebase Remote Config) :
  FACEBOOK_PAGE_ID
  FACEBOOK_PAGE_TOKEN
  WHATSAPP_PHONE_NUMBER_ID
  WHATSAPP_API_TOKEN
  ONESIGNAL_APP_ID
  ONESIGNAL_API_KEY
  BANNERBEAR_API_KEY
```

---

## 7. FLUX COMPLET — DE LA PUBLICATION À LA DIFFUSION

```
t=0    Parent ouvre enfantperdu.bf/signaler
t=1    Remplit le formulaire (photo + infos + zone + téléphone)
t=2    Clique "Publier"
         → Firestore : document /announcements/EPB-8472 créé
         → Cloud Function onAnnouncementCreate déclenchée

t=3    generateAlertCard() → carte JPG générée + uploadée Storage

t=4    Facebook Graph API → post publié sur Page EnfantPerdu.bf
         (image JPG + texte formaté + lien annonce)

t=5    WhatsApp Business API → message envoyé au parent :
         "✅ Votre annonce EPB-8472 est en ligne.
          Gérez-la ici : enfantperdu.bf/gestion/a8f3k2"

t=6    OneSignal API → push envoyé aux abonnés Secteur 15
         (apparaît sur leur téléphone même si navigateur fermé)

t=7    Page /annonce/EPB-8472 disponible publiquement
         (indexée Google, Open Graph configuré)

t=8    Parent voit la confirmation sur l'écran
         + reçoit le WhatsApp avec son lien de gestion

---- Le système tourne seul à partir d'ici ----

t=24h  scheduledReminders → WhatsApp automatique au parent
t=72h  scheduledReminders → relance alerte + WhatsApp parent
t=7j   scheduledReminders → repost Facebook + WhatsApp parent
t=30j  scheduledReminders → archivage si pas de réponse

---- Si retrouvé ----

Parent clique "Retrouvé" dans /gestion/a8f3k2
  → status = "resolved"
  → Cloud Function onAnnouncementUpdate :
       Post Facebook : "✅ BONNE NOUVELLE — Aminata retrouvée !"
       WhatsApp aux alert_subscribers : "Bonne nouvelle !"
       Compteur global resolved++
       Zone activeAnnouncements--
```

---

## 8. ORDRE DE DÉVELOPPEMENT RECOMMANDÉ

```
SPRINT 1 — Le squelette (semaine 1-2)
  □ Setup Firebase collections (announcements, zones)
  □ Formulaire /signaler → écriture Firestore
  □ Page publique /annonce/[shortCode] (lecture Firestore)
  □ Page /gestion/[secretToken] (modifier + clôturer)
  □ Page /retrouver-mon-annonce (OTP WhatsApp)
  □ Homepage avec feed des annonces actives

SPRINT 2 — L'automatisation (semaine 3-4)
  □ Cloud Function onAnnouncementCreate
  □ Intégration Facebook Graph API (post auto)
  □ Intégration WhatsApp Business API (lien de gestion)
  □ Génération carte d'alerte JPG (Bannerbear)
  □ Stats Facebook → sync dans Firestore

SPRINT 3 — L'engagement (semaine 5-6)
  □ OneSignal setup + abonnement par zone
  □ Push notification dans onAnnouncementCreate
  □ Formulaire signalement témoin (/sightings)
  □ Bouton "Alertez-moi si retrouvé" (alert_subscribers)
  □ Stats temps réel sur la page annonce (Firestore listener)
  □ Page /retrouvailles

SPRINT 4 — Connexion SecureID (semaine 7-8)
  □ Cloud Function secureIdAlert (endpoint HTTP)
  □ Bandeau widget dans app SecureID
  □ Formulaire pré-rempli depuis profil SecureID
  □ CTA conversion SecureID sur le formulaire anonyme
  □ Page /zones/[zoneId]
```

---

## 9. POINTS D'ATTENTION SÉCURITÉ

```
❌ Ne jamais exposer le numéro de téléphone du parent publiquement
   → Utiliser parentPhoneDisplay masqué (+226 70 XX XX XX)
   → Contact uniquement via la page de l'annonce (bouton WhatsApp
     qui ouvre wa.me/NUMERO — le numéro est dans l'URL non indexée)

❌ Ne jamais exposer le secretToken dans l'URL publique de l'annonce
   → /annonce/EPB-8472 (public)
   → /gestion/a8f3k2 (privé, lien envoyé uniquement par WhatsApp)

❌ Ne jamais exposer les coordonnées GPS précises publiquement
   → Afficher uniquement la zone/quartier

✅ Firestore Security Rules :
   announcements : read = public
                   write = Cloud Functions only (Admin SDK)
   gestion : accessible uniquement via secretToken en paramètre
             (vérification côté Cloud Function, pas côté client)

✅ Rate limiting sur le formulaire de création
   → Max 3 annonces par numéro de téléphone par 24h
   → Évite le spam
```

---

*Document généré lors de la session de brainstorming du 2026-03-02*
*Projet : EnfantPerdu.bf × SecureID — Swabo Hamadou*
