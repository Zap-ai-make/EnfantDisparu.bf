---
title: 'Programme Ambassadeur - Migration Vigie'
slug: 'programme-ambassadeur'
created: '2026-03-20'
updated: '2026-03-21'
status: 'ready-for-dev'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['Next.js 15', 'Firebase Firestore', 'OneSignal', 'TypeScript', 'Tailwind CSS', 'Cloud Functions']
files_to_modify: ['src/lib/firestore.ts', 'src/components/OneSignalInit.tsx', 'src/app/page.tsx', 'src/app/layout.tsx', 'functions/src/index.ts']
code_patterns: ['react-hook-form', 'cascading zone selects', 'react-hot-toast', 'Tailwind design system']
test_patterns: ['manual testing']
adversarial_reviews: 3
issues_addressed: 35
---

# Tech-Spec: Programme Ambassadeur - Migration Vigie

**Created:** 2026-03-20
**Updated:** 2026-03-21 (post-adversarial review)

## Overview

### Problem Statement

Le terme "Vigie" n'est pas compris par les utilisateurs au Burkina Faso. Le système actuel manque de gamification, de tracking d'impact et d'outils pour motiver les bénévoles à faire grandir le réseau EnfantDisparu.bf.

### Solution

Migrer le système "Vigie" vers "Ambassadeur" avec :
- Un formulaire de candidature (validation manuelle au lieu d'inscription directe)
- Un dashboard personnel avec statistiques d'impact
- Un lien unique de tracking `?ref=AMB-xxxx` pour mesurer les activations OneSignal
- Des outils de partage (messages pré-écrits, QR code personnel)

### Scope

**In Scope (MVP) :**
- Renommer Vigie → Ambassadeur partout (pages, textes, collection Firestore)
- Page `/ambassadeur` de présentation + `/ambassadeur/postuler` pour candidature
- Système de validation manuelle des candidatures (status: pending → approved)
- Dashboard Ambassadeur `/ambassadeur/dashboard` avec accès sécurisé (magic link)
- Génération de code unique `AMB-XXXX` par ambassadeur (avec vérification unicité)
- Lien `?ref=AMB-xxxx` avec tracking OneSignal (tag attribution)
- Cloud Function pour incrémenter les stats automatiquement
- Kit outils : messages pré-écrits copiables, QR code personnel

**Out of Scope (V2+) :**
- Système de points/gamification avancé
- Challenges hebdo/mensuels
- Badges déblocables
- Wall of Impact / carte publique des ambassadeurs
- Numéro vert (appel sans internet)
- Mode offline/PWA pour dashboard
- Pagination historique dashboard

## Context for Development

### Party Mode Decisions (2026-03-20)

#### Formulaire de Candidature
| Champ | Type | Validation |
|-------|------|------------|
| Prénom | text | required, min 2 chars |
| Nom | text | required, min 2 chars |
| WhatsApp | tel | required, format E.164 (+226XXXXXXXX) |
| Pays | select (cascade) | required |
| Ville | select (cascade) | required, doit appartenir au Pays sélectionné |
| Quartier | select (cascade) | required, doit appartenir à la Ville sélectionnée |
| Date de naissance | 3 selects (Jour/Mois/Année) | required, min 20 ans (calculé dynamiquement) |
| "Aimez-vous les chats ?" | select (Oui/Non/Peut-être) | required (UX only) |
| Honeypot field | hidden text | must be empty (anti-bot) |

#### Structure Firestore `ambassadors`
```typescript
interface Ambassador {
  id: string;
  refCode: string;              // "AMB-XXXX" - vérifié unique via transaction
  firstName: string;
  lastName: string;
  phone: string;                // Format E.164 normalisé: +226XXXXXXXX
  zones: string[];              // Max 5 quartiers
  dateOfBirth: Timestamp;
  catAnswer: "yes" | "no" | "maybe";
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;     // Si rejected, raison optionnelle
  createdAt: Timestamp;
  approvedAt: Timestamp | null;
  approvedBy?: string;          // ID admin qui a approuvé (audit)
  rejectedAt?: Timestamp;
  accessToken?: string;         // Généré seulement à l'approbation (pas à la création)
  accessTokenExpiresAt?: Timestamp; // Expiration du token (7 jours après génération)
  stats: {
    notificationsActivated: number;
    alertsShared: number;
    ambassadorsRecruited: number;
    viewsGenerated: number;
  };
}
```

#### Structure Firestore `ambassador_audit_log`
```typescript
interface AmbassadorAuditLog {
  id: string;
  ambassadorId: string;
  action: "approved" | "rejected" | "zone_added" | "token_regenerated";
  performedBy: string;          // "system" ou ID admin
  timestamp: Timestamp;
  details?: Record<string, any>;
}
```

### Sécurité & Protection (Issues F1, F2, F3, F15, F16)

#### Authentification Dashboard (Magic Link)
- **Pas de token simple dans l'URL** - utiliser un magic link avec token JWT-like
- Token généré: `crypto.randomUUID()` (36 chars)
- Expiration: 7 jours après génération
- Renouvellement: nouveau token envoyé par WhatsApp si expiré
- URL format: `/ambassadeur/dashboard?t={accessToken}`

#### Rate Limiting Formulaire
- **Côté client:** Désactiver bouton submit pendant 3 secondes après soumission
- **Côté serveur:** Cloud Function `submitApplication` qui:
  - Vérifie collection `rate_limits` pour IP de l'appelant
  - Limite à 3 candidatures par IP par heure
  - Crée/update doc `rate_limits/{ip_hash}` avec compteur + timestamp
  - Rejette avec erreur 429 si limite atteinte
- **Honeypot:** Champ caché `website` qui doit rester vide

#### Validation Serveur Zones
- Avant insertion, vérifier que:
  - `pays` existe dans `COUNTRIES`
  - `ville` existe dans `CITIES_BY_COUNTRY[pays]`
  - `quartier` existe dans `ZONES_BY_CITY[ville]`
- Rejeter avec erreur si combinaison invalide

#### Normalisation Téléphone (Issue F6)
```typescript
function normalizePhone(phone: string): string {
  // Supprimer espaces, tirets, parenthèses
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  // Convertir 00226 → +226
  if (cleaned.startsWith('00226')) {
    cleaned = '+226' + cleaned.slice(5);
  }
  // Ajouter +226 si commence par 0 ou directement les chiffres
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '+226' + cleaned.slice(1);
  }
  if (/^\d{8}$/.test(cleaned)) {
    cleaned = '+226' + cleaned;
  }
  return cleaned; // Format final: +226XXXXXXXX
}
```

### Messages Pré-écrits (Issue F20)

#### Message WhatsApp 1 - Invitation générale
```
🚨 Enfants disparus au Burkina Faso

Reçois une alerte instantanée si un enfant disparaît dans ton quartier.

👉 Active les notifications : https://enfantdisparu.bf/?ref={REF_CODE}

Ensemble, on peut les retrouver. 🙏
```

#### Message WhatsApp 2 - Appel à devenir ambassadeur
```
Tu veux aider à retrouver les enfants disparus ?

Deviens Ambassadeur EnfantDisparu.bf et aide ton quartier à se mobiliser.

👉 Inscris-toi : https://enfantdisparu.bf/ambassadeur?ref={REF_CODE}
```

#### Message Facebook/Twitter
```
🚨 Au Burkina, des enfants disparaissent chaque jour.

J'ai rejoint EnfantDisparu.bf pour recevoir les alertes et aider à les retrouver.

Toi aussi, active les notifications 👉 https://enfantdisparu.bf/?ref={REF_CODE}

#EnfantDisparuBF #Solidarité
```

### Codebase Patterns

- Forms : `react-hook-form` avec validation Zod
- Zones : `COUNTRIES`, `CITIES_BY_COUNTRY`, `ZONES_BY_CITY` depuis `src/lib/zones.ts`
- UI : Tailwind avec `rounded-2xl`, `border-gray-100`, `shadow-sm`
- Toasts : `react-hot-toast`
- Accessibilité : aria-labels sur tous les inputs, focus visible, contraste AA minimum

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `src/app/devenir-vigie/page.tsx` | Pattern formulaire multi-step existant |
| `src/lib/firestore.ts` | Pattern fonctions Firestore |
| `src/components/OneSignalInit.tsx` | Init OneSignal actuelle |
| `src/lib/zones.ts` | Système de zones réutilisable |
| `functions/src/index.ts` | Cloud Functions existantes |

## Implementation Plan

### Tasks

#### Phase 1 : Types et Utilitaires

- [ ] **Task 1: Créer les types Ambassador**
  - File: `src/types/ambassador.ts`
  - Action: Créer interfaces:
    - `Ambassador` (structure complète avec audit fields)
    - `AmbassadorStats`
    - `SubmitApplicationInput`
    - `AmbassadorAuditLog`
  - Notes: Inclure tous les champs de sécurité (accessToken, expiration)

- [ ] **Task 2: Créer les utilitaires Ambassador**
  - File: `src/lib/ambassador-utils.ts`
  - Action: Créer fonctions:
    - `generateRefCodeCandidate()`: génère un candidat AMB-XXXX (4 chars alphanumériques majuscules)
    - `generateAccessToken()`: crypto.randomUUID()
    - `calculateAge(dateOfBirth)`: calcul dynamique basé sur date actuelle
    - `isMinimumAge(dateOfBirth, minAge)`: true si >= minAge ans
    - `normalizePhone(phone)`: normalisation format E.164
    - `validateZoneHierarchy(pays, ville, quartier)`: vérifie cohérence cascade
    - `hashIP(ip)`: hash SHA256 de l'IP pour rate limiting (pas stocker IP en clair)
  - Notes:
    - refCode = "AMB-" + 4 chars alphanumériques majuscules aléatoires
    - L'unicité du refCode est vérifiée via transaction Firestore (pas boucle)
    - Âge minimum calculé dynamiquement (pas d'années hardcodées)

#### Phase 2 : Fonctions Firestore

- [ ] **Task 3: Ajouter fonctions Ambassador dans firestore.ts**
  - File: `src/lib/firestore.ts`
  - Action: Ajouter fonctions :
    - `submitAmbassadorApplication(input)`:
      - Normalise le phone
      - Vérifie honeypot vide
      - Valide hiérarchie zones côté serveur
      - Vérifie doublon phone (normalisé)
      - Utilise `runTransaction()` pour:
        - Générer refCode candidat
        - Vérifier unicité dans la transaction
        - Si collision, re-générer (max 5 tentatives)
        - Créer doc atomiquement
      - Crée avec status "pending" (PAS de accessToken à ce stade)
    - `getAmbassadorByPhone(phone)`: cherche par phone normalisé
    - `getAmbassadorByRefCode(refCode)`: récupère ambassadeur par code ref
    - `getAmbassadorByAccessToken(token)`: récupère + vérifie expiration
    - `approveAmbassador(id, adminId)`:
      - Passe status à "approved"
      - **Génère accessToken + expiration (7 jours)** ← token créé ici
      - Set approvedAt + approvedBy
      - Log dans ambassador_audit_log
    - `rejectAmbassador(id, adminId, reason?)`:
      - Passe status à "rejected"
      - Set rejectedAt + rejectionReason
      - Log dans ambassador_audit_log
    - `addZoneToAmbassador(ambassadorId, zoneId)`:
      - Vérifie que l'ambassadeur est "approved"
      - Vérifie max 5 zones
      - Vérifie que la zone n'est pas déjà présente
      - Ajoute le quartier
      - Log dans ambassador_audit_log
    - `regenerateAccessToken(id)`:
      - Génère nouveau token + expiration (7 jours)
      - Log dans ambassador_audit_log
      - Retourne le nouveau token (pour envoi WhatsApp)
    - `incrementAmbassadorStat(refCode, statKey)`: incrémente une stat atomiquement
    - `getAmbassadorCount()`: compte les ambassadeurs approuvés (avec cache 5 min)
    - `checkRateLimit(ipHash)`: vérifie/incrémente compteur dans `rate_limits/{ipHash}`
  - Notes: Toutes les recherches par phone utilisent normalizePhone()

#### Phase 3 : Cloud Function Stats (Issue F4)

- [ ] **Task 4: Créer Cloud Function pour webhook OneSignal**
  - File: `functions/src/http/oneSignalWebhook.ts`
  - Action:
    - Endpoint HTTP `POST /oneSignalWebhook`
    - Vérifier signature HMAC-SHA256:
      - Secret stocké dans `ONESIGNAL_WEBHOOK_SECRET` (env var ou Firebase Secret Manager)
      - Header `X-OneSignal-Signature` contient le hash
      - Calculer HMAC du body avec le secret, comparer
      - Rejeter 401 si signature invalide
    - Reçoit les events de subscription OneSignal
    - Si event type = "notification.subscription.created" et tag `ambassador_ref` présent:
      - Appelle `incrementAmbassadorStat(refCode, 'notificationsActivated')`
    - Retourner 200 OK
  - Notes:
    - Configurer webhook dans dashboard OneSignal → Settings → Webhooks
    - Copier le signing secret dans Firebase: `firebase functions:secrets:set ONESIGNAL_WEBHOOK_SECRET`

- [ ] **Task 5: Créer Cloud Function pour soumission candidature**
  - File: `functions/src/http/submitAmbassadorApplication.ts`
  - Action:
    - Endpoint HTTP `POST /submitAmbassadorApplication`
    - Extraire IP du request (X-Forwarded-For ou connection.remoteAddress)
    - Hasher l'IP avec SHA256
    - Vérifier rate limit via `checkRateLimit(ipHash)` - max 3/heure
    - Si limite atteinte → 429 Too Many Requests
    - Sinon, appeler la logique `submitAmbassadorApplication()` de firestore.ts
    - Retourner résultat (success/error)
  - Notes: Le formulaire client appelle cette Cloud Function, pas Firestore directement

- [ ] **Task 6: Exporter les Cloud Functions**
  - File: `functions/src/index.ts`
  - Action: Ajouter:
    ```typescript
    export { oneSignalWebhook } from "./http/oneSignalWebhook";
    export { submitAmbassadorApplication } from "./http/submitAmbassadorApplication";
    ```

#### Phase 4 : Tracking OneSignal

- [ ] **Task 7: Détecter et stocker le ref code depuis l'URL**
  - File: `src/app/layout.tsx`
  - Action: Dans le composant client:
    - Détecter `?ref=AMB-XXXX` sur **toutes les routes** (/, /ambassadeur, /annonce/*, etc.)
    - Regex: `/^AMB-[A-Z0-9]{4}$/`
    - Stocker dans `localStorage.setItem('ambassador_ref', refCode)`
    - Stocker dans cookie `ambassador_ref` avec expiration **30 jours** (js-cookie)
    - Cookie fallback si localStorage indisponible (mode incognito)
  - Notes: Vérifier format strict avant stockage

- [ ] **Task 8: Envoyer le tag ambassador_ref à OneSignal**
  - File: `src/components/OneSignalInit.tsx`
  - Action:
    - Après init OneSignal, lire `localStorage.getItem('ambassador_ref')` ou cookie fallback
    - Envoyer tag `OneSignal.sendTag('ambassador_ref', refCode)`
    - Ajouter try/catch avec log silencieux en cas d'erreur
  - Notes: Ne rien faire si pas de ref

#### Phase 5 : Pages Ambassadeur

- [ ] **Task 9: Créer la landing page Ambassadeur**
  - File: `src/app/ambassadeur/page.tsx`
  - Action: Page de présentation avec :
    - Header gradient avec titre "Deviens Ambassadeur"
    - Section "Ce que tu fais" (missions):
      - Partager les alertes dans ton quartier
      - Convaincre tes proches d'activer les notifications
      - Être le relais de confiance dans ta communauté
    - Section "Ce que tu reçois" (avantages):
      - Ton dashboard personnel avec tes stats d'impact
      - Des outils de partage (messages, QR code)
      - Formations et certifications (à venir)
    - Compteur ambassadeurs actifs (avec cache)
    - CTA "Postuler" vers /ambassadeur/postuler
    - Accessibilité: aria-labels, focus visible
  - Notes: Ton émotionnel authentique, pas de bullshit

- [ ] **Task 10: Créer le formulaire de candidature**
  - File: `src/app/ambassadeur/postuler/page.tsx`
  - Action: Formulaire avec :
    - Champs visibles: prénom, nom, whatsapp, pays/ville/quartier (cascade), date naissance (3 selects), question chats
    - Champ honeypot caché: `<input type="text" name="website" style="display:none" tabIndex={-1} />`
    - Validation âge minimum 20 ans (calculé dynamiquement: `currentYear - 20`)
    - Validation zones cascade côté client + serveur
    - Désactivation bouton 3 sec après submit (anti-spam)
    - Logique doublon (vérification phone avant affichage formulaire complet):
      - **Si phone existe et approved:**
        - Afficher UI simplifiée: "Tu es déjà ambassadeur ! Ajoute un nouveau quartier :"
        - Afficher seulement les 3 selects Pays/Ville/Quartier (pas nom, prénom, etc.)
        - Bouton "Ajouter ce quartier" → appelle `addZoneToAmbassador()`
        - Redirect vers dashboard avec toast "Quartier ajouté !"
      - **Si phone existe et pending:**
        - Afficher message: "Ta candidature est en cours de validation. Tu recevras un WhatsApp bientôt."
        - Pas de formulaire
      - **Si phone existe et rejected:**
        - Afficher message: "Ta candidature précédente a été refusée. Contacte-nous sur WhatsApp."
        - Lien WhatsApp vers le numéro de l'association
    - Submit (nouveau candidat) → Cloud Function `submitAmbassadorApplication` → redirect /ambassadeur/candidature-envoyee
    - Accessibilité: labels associés, erreurs aria-describedby
  - Notes: Utiliser react-hook-form + Zod validation

- [ ] **Task 11: Créer la page de confirmation candidature**
  - File: `src/app/ambassadeur/candidature-envoyee/page.tsx`
  - Action: Page confirmation avec :
    - Message "Candidature envoyée !"
    - Explication du processus de validation (24-48h)
    - "Tu recevras un WhatsApp quand ta candidature sera validée"
    - CTA retour accueil
  - Notes: Design cohérent avec vigie-confirmee

- [ ] **Task 12: Créer le dashboard Ambassadeur**
  - File: `src/app/ambassadeur/dashboard/page.tsx`
  - Action: Dashboard avec :
    - Accès via magic link: `/ambassadeur/dashboard?t={accessToken}`
    - Vérification token:
      - Si invalide → redirect /ambassadeur avec toast erreur
      - Si expiré → page "Lien expiré" avec:
        - Message explicatif
        - Champ pour entrer son numéro WhatsApp
        - Bouton "Renvoyer mon lien" qui génère lien `wa.me`:
          ```
          https://wa.me/226XXXXXXXX?text=Bonjour,%20je%20suis%20ambassadeur%20et%20mon%20lien%20a%20expiré.%20Mon%20numéro%20:%20{phone}
          ```
        - Ouvre WhatsApp avec message pré-rempli vers l'admin
        - L'admin envoie manuellement le nouveau lien (MVP)
    - Header avec prénom, quartier(s), date inscription
    - Stats cards:
      - Notifications activées grâce à toi
      - Alertes partagées (V2 - afficher 0 pour MVP)
      - Ambassadeurs recrutés (V2 - afficher 0 pour MVP)
    - Section "Ton lien de partage":
      - URL: `https://enfantdisparu.bf/?ref=AMB-XXXX`
      - Bouton "Copier" avec feedback toast
    - Section "Kit de partage":
      - Messages pré-écrits avec bouton "Copier" pour chaque (texte avec {REF_CODE} remplacé)
      - QR code avec texte en dessous: "Scanne pour activer les alertes"
    - Accessibilité: headings hierarchy, focus management
  - Notes: Pas de pagination pour MVP (stats simples)

- [ ] **Task 13: Créer composant QR Code**
  - File: `src/components/AmbassadorQRCode.tsx`
  - Action:
    - Installer `qrcode.react` (npm install qrcode.react)
    - Composant qui génère QR code pour `https://enfantdisparu.bf/?ref=AMB-XXXX`
    - Props: `refCode: string`, `size?: number` (default 200)
    - Afficher texte sous le QR: "Scanne pour activer les alertes enfants disparus"
    - Bouton "Télécharger PNG":
      - Utiliser `qrcode.react` avec `renderAs="canvas"`
      - Récupérer le canvas via ref
      - `canvas.toDataURL('image/png')` pour générer l'image
      - Créer lien `<a download="mon-qr-ambassadeur.png">` et déclencher click
  - Notes: qrcode.react supporte nativement le rendu canvas

#### Phase 6 : Migration et Nettoyage

- [ ] **Task 14: Mettre à jour le CTA sur la page d'accueil**
  - File: `src/app/page.tsx`
  - Action: Remplacer "Devenir Vigie" par "Devenir Ambassadeur", lien vers `/ambassadeur`
  - Notes: Garder le même style (gradient bleu)

- [ ] **Task 15: Script de migration vigies → ambassadors**
  - File: `scripts/migrate-vigies.ts`
  - Action: Script one-shot avec modes:
    - **Mode dry-run** (`--dry-run` flag):
      - Lit toutes les vigies
      - Simule la migration sans écrire
      - Affiche preview: "127 vigies seraient migrées"
      - Détecte problèmes potentiels (phones invalides, doublons)
    - **Mode backup** (toujours exécuté):
      - Exporter collection `vigies` vers `vigies_backup_{timestamp}.json`
    - **Mode migration** (sans `--dry-run`):
      1. Backup automatique
      2. Pour chaque vigie:
         - Normaliser le phone
         - Générer refCode unique (avec transaction)
         - Générer accessToken + expiration
         - Créer dans `ambassadors` avec status "approved"
         - approvedAt = createdAt de la vigie
         - approvedBy = "migration_script"
      3. Vérification: Comparer counts
      4. Log détaillé avec succès/échecs
      5. Instructions rollback si problème
  - Usage:
    ```bash
    npx ts-node scripts/migrate-vigies.ts --dry-run  # Preview
    npx ts-node scripts/migrate-vigies.ts            # Execute
    ```
  - Notes:
    - Exécuter d'abord sur Firestore emulator
    - Puis dry-run en prod
    - Puis migration réelle
    - Garder collection `vigies` intacte

- [ ] **Task 16: Créer page admin basique**
  - File: `src/app/admin/ambassadeurs/page.tsx`
  - Action: Page admin simple (protégée par auth basique ou env var):
    - Liste des candidatures pending avec:
      - Nom, prénom, phone, quartier, date candidature
      - Bouton "Approuver" → appelle `approveAmbassador()`
      - Bouton "Refuser" → modal avec raison optionnelle → appelle `rejectAmbassador()`
    - Après approbation:
      - Afficher le magic link à envoyer par WhatsApp
      - Bouton "Copier le lien" pour faciliter l'envoi manuel
    - Filtre par status (pending/approved/rejected)
    - Tri par date
  - Notes:
    - Protection: vérifier `process.env.ADMIN_SECRET` dans header ou query param
    - Pas besoin d'auth Firebase complète pour MVP

- [ ] **Task 17: Supprimer les anciennes pages Vigie**
  - Files: `src/app/devenir-vigie/`, `src/app/vigie-confirmee/`
  - Action: Supprimer les dossiers après validation que tout fonctionne
  - Notes:
    - Faire après migration réussie ET validation en prod
    - Git permet de restaurer si nécessaire

#### Résumé des Tasks

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1. Types & Utils | 1-2 | Interfaces, fonctions utilitaires |
| 2. Firestore | 3 | Fonctions CRUD ambassadeurs |
| 3. Cloud Functions | 4-6 | Webhook OneSignal, soumission avec rate limit |
| 4. Tracking | 7-8 | Détection ref, envoi tag OneSignal |
| 5. Pages | 9-13 | Landing, formulaire, confirmation, dashboard, QR |
| 6. Migration | 14-17 | CTA accueil, script migration, admin, cleanup |

**Total: 17 Tasks**

### Acceptance Criteria

#### Candidature

- [ ] **AC1:** Given un visiteur sur /ambassadeur, when il clique "Postuler", then il arrive sur le formulaire de candidature
- [ ] **AC2:** Given un formulaire rempli avec âge < 20 ans, when il sélectionne une année récente, then le bouton submit est désactivé et un message d'erreur s'affiche (âge calculé dynamiquement)
- [ ] **AC3:** Given un formulaire valide, when il soumet, then une entrée est créée dans `ambassadors` avec status "pending" et refCode unique (PAS de accessToken à ce stade)
- [ ] **AC4:** Given un numéro déjà ambassadeur approuvé, when il postule, then on lui propose d'ajouter un quartier (pas nouvelle candidature)
- [ ] **AC5:** Given un numéro avec candidature pending, when il postule, then on affiche "Votre candidature est en cours de validation"
- [ ] **AC6:** Given un numéro avec candidature rejected, when il postule, then on affiche un message approprié

#### Sécurité

- [ ] **AC7:** Given un formulaire avec honeypot rempli, when soumis, then la candidature est rejetée silencieusement (200 OK mais pas d'insertion)
- [ ] **AC8:** Given un phone au format "70 00 00 00", when soumis, then il est normalisé en "+22670000000" avant stockage
- [ ] **AC9:** Given une combinaison pays/ville/quartier invalide, when soumise, then une erreur est retournée
- [ ] **AC10:** Given un ambassadeur avec 5 zones, when il essaie d'en ajouter une 6ème, then une erreur "Maximum 5 quartiers" s'affiche
- [ ] **AC11:** Given 4 soumissions de la même IP en 1 heure, when 4ème soumission, then erreur 429 "Trop de tentatives"
- [ ] **AC12:** Given deux soumissions simultanées, when refCode généré, then chacune a un refCode unique (pas de collision grâce à transaction)

#### Tracking

- [ ] **AC13:** Given un visiteur arrivant via `?ref=AMB-K7X2` sur n'importe quelle route, when la page charge, then "AMB-K7X2" est stocké dans localStorage ET cookie (30 jours)
- [ ] **AC14:** Given un ref en localStorage, when OneSignal s'initialise, then le tag `ambassador_ref: AMB-K7X2` est envoyé
- [ ] **AC15:** Given un refCode invalide (pas format AMB-XXXX), when URL parsée, then rien n'est stocké
- [ ] **AC16:** Given une subscription OneSignal avec tag ambassador_ref, when webhook reçu avec signature valide, then stat notificationsActivated est incrémentée
- [ ] **AC17:** Given un webhook OneSignal avec signature invalide, when reçu, then 401 Unauthorized retourné

#### Dashboard

- [ ] **AC18:** Given un ambassadeur approuvé, when il accède à son dashboard avec token valide, then il voit ses stats et son lien de partage
- [ ] **AC19:** Given un token expiré, when accès dashboard, then page "Lien expiré" avec formulaire pour demander nouveau lien via WhatsApp
- [ ] **AC20:** Given un token invalide, when accès dashboard, then redirect vers /ambassadeur avec toast erreur
- [ ] **AC21:** Given un ambassadeur, when il clique "Copier" sur son lien, then le lien est copié + toast confirmation
- [ ] **AC22:** Given un ambassadeur, when il affiche le QR code, then le QR encode bien `https://enfantdisparu.bf/?ref=AMB-XXXX`
- [ ] **AC23:** Given un QR code, when affiché, then texte explicatif visible en dessous
- [ ] **AC24:** Given le bouton "Télécharger PNG", when cliqué, then fichier PNG téléchargé avec nom "mon-qr-ambassadeur.png"

#### Migration

- [ ] **AC25:** Given le script en mode `--dry-run`, when exécuté, then preview affiché sans aucune écriture
- [ ] **AC26:** Given 127 vigies existantes, when le script de migration s'exécute, then 127 ambassadeurs sont créés avec status "approved"
- [ ] **AC27:** Given la migration, when terminée, then un fichier backup `vigies_backup_{timestamp}.json` existe
- [ ] **AC28:** Given la migration, when terminée, then chaque ambassadeur a un phone normalisé, refCode unique, et accessToken

#### Admin

- [ ] **AC29:** Given un admin sur /admin/ambassadeurs, when il voit la liste pending, then il peut approuver ou refuser chaque candidature
- [ ] **AC30:** Given une approbation via admin, when effectuée, then accessToken généré et magic link affiché pour envoi WhatsApp
- [ ] **AC31:** Given un refus via admin, when effectué avec raison, then raison stockée dans rejectionReason

#### Audit

- [ ] **AC32:** Given une approbation d'ambassadeur, when effectuée, then une entrée est créée dans ambassador_audit_log avec performedBy

## Additional Context

### Dependencies

| Dépendance | Usage | Status |
|------------|-------|--------|
| `react-onesignal` | Tracking notifications | Déjà installé |
| `firebase` | Firestore | Déjà installé |
| `react-hook-form` | Formulaires | Déjà installé |
| `zod` | Validation schemas | Déjà installé |
| `qrcode.react` | Génération QR code | **À installer** |
| `js-cookie` | Cookie fallback pour ref | **À installer** |

### Testing Strategy

**Tests manuels :**
1. Parcours complet candidature (nouveau, doublon pending, doublon approved, doublon rejected)
2. Test honeypot (remplir le champ caché, vérifier rejet silencieux)
3. Test normalisation téléphone (différents formats)
4. Test validation zones (combinaison invalide)
5. Vérifier tracking ref dans localStorage ET cookie
6. Vérifier tag OneSignal envoyé (via console OneSignal)
7. Tester webhook OneSignal (via Postman avec signature)
8. Tester dashboard avec token valide/invalide/expiré
9. Tester copie lien et QR code
10. Tester limite 5 zones
11. Exécuter migration sur Firestore emulator
12. Vérifier logs audit après approbation

**Tests automatisés (V2) :**
- Unit tests pour `generateRefCode()`, `calculateAge()`, `normalizePhone()`, `validateZoneHierarchy()`
- Integration tests pour fonctions Firestore

### Notes

**Risques identifiés :**
- OneSignal webhook : vérifier signature pour éviter appels frauduleux
- Migration : backup obligatoire, tester sur emulator d'abord
- Rate limiting : monitoring pour ajuster si faux positifs

**Décisions prises (post-adversarial review - 35 issues) :**
- Magic link au lieu de token simple (sécurité)
- Honeypot + rate limiting via Cloud Function (anti-spam)
- Normalisation téléphone E.164 (éviter doublons)
- Cloud Function pour stats via webhook OneSignal (automatisation)
- Cloud Function pour soumission candidature avec rate limiting par IP
- Limite 5 zones par ambassadeur
- Audit log pour traçabilité admin
- Cookie fallback 30 jours pour ref (robustesse)
- Messages pré-écrits définis (pas de guess)
- QR code library spécifiée: `qrcode.react` avec download via canvas.toDataURL
- Âge calculé dynamiquement (pas de dates hardcodées)
- Transaction Firestore pour refCode unique (pas de race condition)
- AccessToken généré seulement à l'approbation (pas à la création)
- Page admin basique pour approuver/refuser candidatures
- Script migration avec mode dry-run
- Ref tracking sur toutes les routes (pas seulement /)
- WhatsApp "renvoyer lien" via lien wa.me pré-rempli (MVP)

**Limitations acceptées MVP :**
- Pas de mode offline (connexion requise)
- Pas de pagination dashboard (stats simples)
- Stats "alertes partagées" et "ambassadeurs recrutés" à 0 (tracking V2)
- Validation WhatsApp manuelle (pas de SMS automatique)

**Références :**
- Brainstorming : `_bmad-output/brainstorming/brainstorming-session-2026-03-20-1450.md`
- Page existante à utiliser comme référence : `src/app/devenir-vigie/page.tsx`
- Adversarial Reviews : 3 reviews, 35 issues identifiées et adressées
