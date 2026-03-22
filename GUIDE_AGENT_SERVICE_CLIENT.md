# Guide Agent Service Client - EnfantDisparu.bf

## Vue d'ensemble

**EnfantDisparu.bf** est une plateforme de signalement et recherche d'enfants disparus au Burkina Faso et en Afrique de l'Ouest. Chaque annonce créée est automatiquement diffusée sur plusieurs réseaux sociaux pour maximiser la visibilité.

---

## 1. Comment fonctionne le système ?

### 1.1 Création d'une annonce

Quand un parent signale un enfant disparu sur le site :

1. **Formulaire en 3 étapes** :
   - Informations enfant (nom, âge, photo, description)
   - Localisation (pays, ville, quartier, lieu précis, heure)
   - Contact parent (téléphone)

2. **Génération automatique** :
   - Code unique : `EPB-XXXXXXXX` (ex: EPB-a7xK9mP2)
   - Lien secret pour gérer l'annonce
   - Image d'alerte (1080x1350px) avec photo + QR code

3. **Diffusion automatique** (en quelques secondes) :
   - Publication sur la page Facebook
   - Notifications push aux abonnés de la zone
   - Publication TikTok et Instagram

### 1.2 Flux de diffusion

```
Parent crée annonce
        ↓
   ┌────────────────────────────────────┐
   │ 1. Génère image d'alerte (PNG)    │
   │ 2. Publie sur Facebook            │
   │ 3. Envoie push notifications      │
   │ 4. Programme rappels WhatsApp  
     5. Publie sur tiktok et instagram   │
   └────────────────────────────────────┘
        ↓
   Annonce visible partout en < 1 minute
```

---

## 2. Intégrations Réseaux Sociaux

### 2.1 Facebook

**Fonctionnement** :
- Publication automatique sur la page "EnfantDisparu.bf"
- Image d'alerte + texte formaté avec hashtags
- Stats collectées : portée, likes, partages, clics

**Format du post** :
```
🚨 ALERTE ENFANT DISPARU - OUAGADOUGOU
👦 Amadou, 8 ans (Garçon)
📍 Vu: Marché Rood-Woko
🕐 Samedi 22 mars 2026 à 14h30
📝 Portait un t-shirt bleu et un pantalon noir...
👁️ Signalez: https://enfantdisparu.bf/annonce/EPB-xxx
#EnfantDisparu #Ouagadougou #BurkinaFaso
```

**Token** : Expire tous les 60 jours (à renouveler)

### 2.2 OneSignal (Notifications Push)

**Fonctionnement** :
- Les utilisateurs s'abonnent aux notifications sur le site
- Chaque zone géographique = un tag OneSignal
- Quand nouvelle annonce → push envoyé aux abonnés de la zone

**Ciblage** :
- Par zone : `zone_bfa_ouaga_pissy`
- Par annonce : `alert_EPB-xxx` (pour "M'alerter si retrouvé")

### 2.3 WhatsApp Business

**Templates configurés** :
| Template | Quand envoyé |
|----------|--------------|
| `enfant_disparu_nouvelle_alerte` | Création annonce |
| `enfant_disparu_rappel_24h` | 24h après |
| `enfant_disparu_rappel_72h` | 3 jours après |
| `enfant_disparu_rappel_7j` | 7 jours après |
| `enfant_disparu_archivage` | 30 jours (avertissement) |
| `enfant_disparu_retrouve` | Enfant retrouvé |
| `enfant_disparu_signalement` | Nouveau signalement reçu |

### 2.4 TikTok (En développement)

- Publication photo avec caption
- Nécessite compte TikTok Business vérifié

---

## 3. Système Ambassadeur

### 3.1 Qu'est-ce qu'un ambassadeur ?

Un ambassadeur est un bénévole qui aide à diffuser les alertes dans sa zone géographique. Il reçoit les notifications en priorité et peut parrainer d'autres ambassadeurs.

### 3.2 Processus de candidature

1. **Candidature** (`/devenir-ambassadeur`) :
   - Nom, prénom, téléphone
   - Date de naissance (minimum 20 ans)
   - Sélection de zone(s)
   - Question test (anti-spam)

2. **Code de référence** :
   - Format : `AMB-XXXX` (ex: AMB-K7M2)
   - Unique par ambassadeur
   - Utilisé pour le suivi et parrainage

3. **Validation admin** :
   - Admin approuve ou rejette via `/admin/ambassadeurs`
   - Si approuvé : lien dashboard envoyé par WhatsApp
   - Token d'accès valide 7 jours

### 3.3 Dashboard Ambassadeur

**URL** : `/ambassadeur?t={accessToken}`

**Fonctionnalités** :
- Stats en temps réel (notifications, partages, recrutements)
- QR code pour partager son profil
- Messages pré-écrits pour inviter
- Gestion des zones (jusqu'à 5)
- Classement des meilleurs ambassadeurs

**Stats trackées** :
| Métrique | Description |
|----------|-------------|
| Notifications activées | Personnes alertées via le lien de l'ambassadeur |
| Alertes partagées | Annonces partagées sur réseaux |
| Ambassadeurs recrutés | Parrainages validés |
| Vues générées | Visites de profil |

### 3.4 Système de parrainage

- L'ambassadeur A invite avec son code `AMB-K7M2`
- Le candidat B utilise le lien `?ref=AMB-K7M2`
- Quand B est approuvé → stats de A incrémentées

---

## 4. Zones Géographiques

### 4.1 Couverture

**7 pays** :
- Burkina Faso (25 zones)
- Côte d'Ivoire (29 zones)
- Bénin (21 zones)
- Mali (13 zones)
- Niger (20 zones)
- Sénégal (20 zones)
- Togo (17 zones)

**Total** : ~165 quartiers/zones

### 4.2 Structure

```
Pays → Ville → Quartier

Exemple :
Burkina Faso → Ouagadougou → Pissy
ID zone : bfa-ouaga-pissy
```

### 4.3 Utilisation

- Filtrage annonces par zone sur la homepage
- Ciblage notifications push
- Attribution zones aux ambassadeurs (max 5)

---

## 5. Gestion des Annonces

### 5.1 Types d'annonces

| Type | Préfixe | Description |
|------|---------|-------------|
| Enfant disparu | `EPB-` | Recherche active |
| Enfant trouvé | `ETR-` | Enfant retrouvé sans parents |

### 5.2 Statuts

| Statut | Description |
|--------|-------------|
| `active` | Recherche en cours |
| `resolved` | Enfant retrouvé |
| `archived` | Plus de 30 jours sans activité |

### 5.3 Rappels automatiques

| Délai | Action |
|-------|--------|
| 24h | Premier rappel WhatsApp |
| 72h | Deuxième rappel |
| 7 jours | Troisième rappel |
| 30 jours | Avertissement d'archivage |

### 5.4 Signalements

Les utilisateurs peuvent signaler avoir vu un enfant :
- Lieu de l'observation
- Description
- Contact (optionnel, peut être anonyme)

Le parent reçoit une notification WhatsApp à chaque signalement.

---

## 6. Sécurité & Données

### 6.1 Protection des données

- **Téléphones** : Jamais affichés publiquement, masqués (`+226 70 XX XX XX`)
- **Lien de gestion** : Token secret 128 bits (impossible à deviner)
- **Anti-spam** : 3 candidatures max par heure par IP
- **Honeypot** : Champ invisible pour détecter les bots

### 6.2 Authentification

| Rôle | Méthode |
|------|---------|
| Parent | Token secret dans URL |
| Ambassadeur | Access token (expire 7j) |
| Admin | Mot de passe (header HTTP) |

### 6.3 Tokens Facebook

**Important** : Le token Facebook expire tous les 60 jours.
- Date d'expiration actuelle : ~21 mai 2026
- Renouveler via Graph API Explorer
- Mettre à jour dans Firebase Secrets
NB: ne jamais parler de ca a un utilisateur, tout ce qui est en rapport avec le code c'est en interne 

---

## 7. Pages Principales

### 7.1 Pages Publiques

| URL | Description |
|-----|-------------|
| `/` | Homepage - Liste des annonces |
| `/annonce/{code}` | Détail d'une annonce |
| `/signaler` | Créer annonce enfant disparu |
| `/enfant-trouve` | Créer annonce enfant trouvé |
| `/retrouvailles` | Histoires de retrouvailles |
| `/devenir-ambassadeur` | Informations ambassadeur |
| `/candidature` | Formulaire candidature |

### 7.2 Pages Authentifiées

| URL | Description |
|-----|-------------|
| `/gestion/{token}` | Gérer son annonce (parent) |
| `/ambassadeur?t={token}` | Dashboard ambassadeur |
| `/admin/ambassadeurs` | Admin - gestion candidatures |

---

## 8. FAQ Agent

### Q: Un parent dit que son annonce n'est pas sur Facebook ?

**Vérifier** :
1. L'annonce existe-t-elle sur le site ? (`/annonce/{code}`)
2. Regarder les logs Firebase pour erreurs
3. Vérifier si le token Facebook n'a pas expiré

**Solution si token expiré** :
- Régénérer le token sur Graph API Explorer
- Mettre à jour : `firebase functions:secrets:set FACEBOOK_PAGE_TOKEN`
- Redéployer : `firebase deploy --only functions`

### Q: Un ambassadeur ne peut plus accéder à son dashboard ?

**Causes possibles** :
1. Token expiré (7 jours)
2. Mauvais lien

**Solution** :
- Générer un nouveau token via admin
- Renvoyer le lien par WhatsApp

### Q: Comment approuver un ambassadeur ?

1. Aller sur `/admin/ambassadeurs`
2. Entrer le mot de passe admin
3. Onglet "En attente"
4. Cliquer sur ✓ pour approuver
5. WhatsApp s'ouvre avec le lien dashboard pré-rempli
6. Envoyer au candidat

### Q: Un signalement a été reçu mais le parent n'est pas notifié ?

**Vérifier** :
1. Le numéro WhatsApp du parent est-il correct ?
2. Le template WhatsApp est-il approuvé par Meta ?
3. Regarder logs Cloud Functions pour erreurs

### Q: Comment renouveler le token Facebook ?

1. Aller sur https://developers.facebook.com/tools/explorer/
2. Sélectionner l'app EnfantDisparu
3. Générer un User Access Token (60 jours)
4. Appeler `GET /me/accounts` pour obtenir le Page Access Token permanent
5. Mettre à jour le secret Firebase

---

## 9. Architecture Technique (Résumé)

```
┌─────────────────┐     ┌─────────────────┐
│   Site Web      │     │  Cloud Functions│
│   (Next.js)     │────▶│   (Firebase)    │
│   Vercel        │     │                 │
└─────────────────┘     └────────┬────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  Facebook   │         │  OneSignal  │         │  WhatsApp   │
│  Graph API  │         │  Push API   │         │Business API │
└─────────────┘         └─────────────┘         └─────────────┘
```

**Base de données** : Firebase Firestore
**Stockage images** : Firebase Cloud Storage
**Région** : Europe-West1

---

## 10. Contacts & Support

- **Site** : https://enfantdisparu.bf
- **Page Facebook** : EnfantDisparu.bf
- **Email** : (à configurer)

---

*Document généré le 22 mars 2026*
*Version 1.0*
