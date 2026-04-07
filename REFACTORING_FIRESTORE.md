# Refactorisation du module Firestore

## Vue d'ensemble

Le fichier monolithique `src/lib/firestore.ts` (1316 lignes) a été décomposé en modules thématiques pour améliorer la maintenabilité et l'organisation du code.

## Structure avant

```
src/lib/
├── firestore.ts (1316 lignes - MONOLITHIQUE)
└── ...
```

## Structure après

```
src/lib/
├── firestore.ts (6 lignes - Fichier de compatibilité)
├── firestore.old.ts (1316 lignes - Backup)
└── firestore/
    ├── index.ts (72 lignes - Réexports publics)
    ├── README.md (Documentation complète)
    ├── METRICS.md (Métriques de décomposition)
    ├── utils.ts (78 lignes - Utilitaires partagés)
    ├── announcements.ts (535 lignes - CRUD annonces + vigies)
    ├── ambassadors.ts (518 lignes - CRUD ambassadeurs)
    ├── sightings.ts (69 lignes - Signalements)
    ├── stats.ts (34 lignes - Statistiques globales)
    └── zones.ts (115 lignes - Zones personnalisées)
```

## Diagramme d'architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Application (17 fichiers)                 │
│                                                              │
│  src/app/page.tsx, src/app/signaler/page.tsx, etc.         │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ import { ... } from '@/lib/firestore'
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              src/lib/firestore.ts (Wrapper)                  │
│                                                              │
│  export * from "./firestore/index"                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│            src/lib/firestore/index.ts (Hub)                  │
│                                                              │
│  Réexporte toutes les fonctions publiques                   │
└──────┬───────┬────────┬────────┬────────┬────────┬──────────┘
       │       │        │        │        │        │
   ┌───┘   ┌───┘    ┌───┘    ┌───┘    ┌───┘    ┌───┘
   ↓       ↓        ↓        ↓        ↓        ↓
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│utils│ │annc │ │ambas│ │sight│ │stats│ │zones│
│     │ │     │ │     │ │     │ │     │ │     │
│ 78L │ │535L │ │518L │ │ 69L │ │ 34L │ │115L │
└─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘
   ↑       ↑        ↑        ↑        ↑        ↑
   │       └────────┴────────┴────────┴────────┘
   │              Utilise utils.ts
   │
   └─ Fonctions partagées:
      • generateShortCode()
      • generateSecretToken()
      • maskPhone()
      • getDefaultStats()
```

## Détails des modules

### 1. `utils.ts` (78 lignes)
Utilitaires partagés entre tous les modules :
- `generateShortCode()` - Génère un code court unique (EPB-XXXXXXXX)
- `generateSecretToken()` - Génère un token sécurisé
- `maskPhone()` - Masque un numéro de téléphone pour affichage public
- `getDefaultStats()` - Retourne les stats par défaut pour une annonce

### 2. `announcements.ts` (535 lignes)
Toutes les fonctions liées aux annonces :
- **Création** : `createAnnouncement()`, `createFoundChildAnnouncement()`
- **Lecture** : `getAnnouncementByShortCode()`, `getAnnouncementByToken()`, `getAnnouncementsByPhone()`
- **Mise à jour** : `updateAnnouncement()`, `resolveAnnouncement()`
- **Subscriptions** : `subscribeToActiveAnnouncements()`, `subscribeToFilteredAnnouncements()`, `subscribeToAnnouncement()`, `subscribeToZoneAnnouncements()`
- **Upload** : `uploadAnnouncementPhoto()`
- **Alertes** : `subscribeToAlertUpdates()`
- **Retrouvailles** : `getResolvedAnnouncements()`
- **Vigies** : `registerVigie()`, `getVigiesByZone()`, `getVigieCount()`

### 3. `ambassadors.ts` (518 lignes)
Toutes les fonctions liées aux ambassadeurs :
- **Candidatures** : `submitAmbassadorApplication()`
- **Récupération** : `getAmbassadorByPhone()`, `getAmbassadorByRefCode()`, `getAmbassadorByAccessToken()`
- **Approbation** : `approveAmbassador()`, `rejectAmbassador()`
- **Gestion** : `addZoneToAmbassador()`, `regenerateAccessToken()`
- **Statistiques** : `incrementAmbassadorStat()`, `getAmbassadorCount()`, `getAmbassadorsByStatus()`
- **Classement** : `getAmbassadorLeaderboard()`, `calculateAmbassadorScore()`, `getAmbassadorRank()`
- **Stats globales** : `getAmbassadorGlobalStats()`
- **Helper interne** : `createAuditLog()`

### 4. `sightings.ts` (69 lignes)
Fonctions pour les signalements :
- `createSighting()` - Créer un signalement
- `subscribeToSightings()` - Écouter les signalements en temps réel
- `getSightingsForAnnouncement()` - Récupérer tous les signalements

### 5. `stats.ts` (34 lignes)
Fonctions pour les statistiques :
- `getGlobalStats()` - Stats globales (actives/résolues)
- `incrementPageViews()` - Incrémenter les vues d'une annonce

### 6. `zones.ts` (115 lignes)
Fonctions pour les zones personnalisées :
- `saveCustomZone()` - Sauvegarder une zone personnalisée
- `getCustomZones()` - Récupérer toutes les zones
- `getCustomZonesByCountry()` - Récupérer les zones par pays

### 7. `index.ts` (72 lignes)
Fichier central qui réexporte TOUTES les fonctions des sous-modules pour maintenir l'API publique cohérente.

## Compatibilité

Le fichier `src/lib/firestore.ts` (maintenant 6 lignes) réexporte simplement tout depuis `./firestore/index.ts`, ce qui garantit que tous les imports existants continuent de fonctionner :

```typescript
// Les imports existants fonctionnent sans modification
import { createAnnouncement, getAmbassadorByRefCode } from '@/lib/firestore'
```

## Types exportés

Tous les types sont réexportés depuis leurs modules respectifs :
- `CreateFoundChildInput`, `Vigie`, `RegisterVigieInput` (announcements)
- `AmbassadorGlobalStats` (ambassadors)
- `CustomZone` (zones)

## Constantes

Les constantes internes restent dans leurs modules :
- `MAX_ZONES_PER_AMBASSADOR = 5` (ambassadors.ts)
- `ACCESS_TOKEN_EXPIRY_DAYS = 7` (ambassadors.ts)
- `AMBASSADOR_COUNT_CACHE_TTL = 5 minutes` (ambassadors.ts)

## Tests de compilation

✅ Compilation réussie sans erreur
✅ Tous les imports existants fonctionnent
✅ Aucun changement requis dans le reste de l'application

## Statistiques

- **Avant** : 1 fichier de 1316 lignes
- **Après** : 7 modules pour un total de 1421 lignes
- **Augmentation** : +105 lignes (8%) due aux imports/exports supplémentaires
- **Réduction par module** : Chaque module fait entre 34 et 535 lignes (bien plus maintenable)

## Backup

L'ancien fichier monolithique est conservé en tant que `firestore.old.ts` pour référence.

## Prochaines étapes possibles

1. Ajouter des tests unitaires pour chaque module
2. Documenter les fonctions avec JSDoc plus détaillé
3. Extraire les constantes dans un fichier `constants.ts` séparé
4. Créer des types dédiés dans `types.ts` si nécessaire

---

**Date de refactorisation** : 2026-04-07
**Statut** : ✅ Terminé et validé
