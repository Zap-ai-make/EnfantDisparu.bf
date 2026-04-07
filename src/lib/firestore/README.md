# Module Firestore - Documentation

## Architecture

Ce dossier contient le module Firestore décomposé en plusieurs fichiers thématiques pour une meilleure maintenabilité.

```
src/lib/firestore/
├── index.ts              # Point d'entrée - Réexporte tout
├── utils.ts              # Utilitaires partagés
├── announcements.ts      # Gestion des annonces et vigies
├── ambassadors.ts        # Gestion des ambassadeurs
├── sightings.ts          # Gestion des signalements
├── stats.ts              # Statistiques globales
└── zones.ts              # Zones personnalisées
```

## Utilisation

### Import depuis l'application

Tous les imports doivent se faire depuis le fichier racine `@/lib/firestore` :

```typescript
// ✅ Correct
import { createAnnouncement, getAmbassadorByRefCode } from '@/lib/firestore'

// ❌ Éviter les imports directs des sous-modules
import { createAnnouncement } from '@/lib/firestore/announcements'
```

### Import entre modules

Les modules internes peuvent s'importer entre eux :

```typescript
// announcements.ts peut importer depuis utils.ts
import { generateShortCode, maskPhone } from './utils'
```

## Modules

### `utils.ts`
Fonctions utilitaires partagées entre les modules.

**Exports publics :**
- `maskPhone(phone: string): string`
- `getDefaultStats(): Announcement["stats"]`

**Exports internes :** (utilisés par d'autres modules)
- `generateShortCode(): string`
- `generateSecretToken(): string`

---

### `announcements.ts`
Gestion complète des annonces d'enfants disparus/trouvés.

**Fonctions principales :**
- `createAnnouncement(input: CreateAnnouncementInput)` - Créer une annonce enfant disparu
- `createFoundChildAnnouncement(input: CreateFoundChildInput)` - Créer une annonce enfant trouvé
- `getAnnouncementByShortCode(shortCode: string)` - Récupérer une annonce par code
- `updateAnnouncement(id: string, data: Partial<Announcement>)` - Mettre à jour
- `resolveAnnouncement(id: string)` - Marquer comme retrouvé

**Subscriptions temps réel :**
- `subscribeToActiveAnnouncements(callback, zoneId?, maxResults?)`
- `subscribeToFilteredAnnouncements(callback, options)`
- `subscribeToAnnouncement(shortCode, callback)`
- `subscribeToZoneAnnouncements(zoneId, callback, maxResults?)`

**Vigies communautaires :**
- `registerVigie(input: RegisterVigieInput)`
- `getVigiesByZone(zoneId: string)`
- `getVigieCount()`

---

### `ambassadors.ts`
Gestion des ambassadeurs communautaires.

**Candidatures :**
- `submitAmbassadorApplication(input: SubmitApplicationInput)`
- `approveAmbassador(ambassadorId: string, adminId: string)`
- `rejectAmbassador(ambassadorId: string, adminId: string, reason?)`

**Récupération :**
- `getAmbassadorByPhone(phone: string)`
- `getAmbassadorByRefCode(refCode: string)`
- `getAmbassadorByAccessToken(token: string)`

**Gestion :**
- `addZoneToAmbassador(ambassadorId: string, zoneId: string)`
- `regenerateAccessToken(ambassadorId: string)`
- `incrementAmbassadorStat(refCode: string, statKey: string)`

**Statistiques :**
- `getAmbassadorCount()` - Nombre d'ambassadeurs (avec cache 5min)
- `getAmbassadorsByStatus(status: AmbassadorStatus)`
- `getAmbassadorLeaderboard(maxResults?)` - Classement
- `calculateAmbassadorScore(stats)` - Calcul du score
- `getAmbassadorRank(ambassadorId)` - Rang d'un ambassadeur
- `getAmbassadorGlobalStats()` - Stats globales

---

### `sightings.ts`
Gestion des signalements d'enfants disparus.

**Fonctions :**
- `createSighting(data)` - Créer un signalement
- `subscribeToSightings(announcementId, callback)` - Temps réel
- `getSightingsForAnnouncement(announcementId)` - Tous les signalements

---

### `stats.ts`
Statistiques globales de la plateforme.

**Fonctions :**
- `getGlobalStats()` - Nombre d'annonces actives/résolues
- `incrementPageViews(announcementId)` - Incrémenter les vues

---

### `zones.ts`
Gestion des zones géographiques personnalisées.

**Fonctions :**
- `saveCustomZone(countryCode, countryName, city, neighborhood)`
- `getCustomZones()` - Toutes les zones triées par utilisation
- `getCustomZonesByCountry(countryCode)` - Zones d'un pays

---

### `index.ts`
Point d'entrée central qui réexporte toutes les fonctions publiques.

## Types exportés

### Announcements
- `CreateFoundChildInput`
- `Vigie`
- `RegisterVigieInput`

### Ambassadors
- `AmbassadorGlobalStats`

### Zones
- `CustomZone`

## Constantes

### Ambassadeurs
- `MAX_ZONES_PER_AMBASSADOR = 5`
- `ACCESS_TOKEN_EXPIRY_DAYS = 7`
- `AMBASSADOR_COUNT_CACHE_TTL = 5 minutes`

## Dépendances

### Firebase
- `firebase/firestore` - Base de données
- `firebase/storage` - Stockage de photos

### Autres
- `nanoid` - Génération d'IDs uniques
- `@/lib/firebase` - Instance Firebase
- `@/lib/zones` - Gestion des zones géographiques
- `@/lib/ambassador-utils` - Utilitaires ambassadeurs

## Migration depuis l'ancien fichier

L'ancien fichier monolithique `firestore.ts` (1316 lignes) a été conservé en tant que `firestore.old.ts`.

Le nouveau `firestore.ts` (6 lignes) réexporte simplement tout depuis ce module pour maintenir la compatibilité.

## Tests

Pour tester que tout fonctionne :

```bash
npm run build
```

Aucune erreur ne devrait apparaître si tous les imports sont corrects.

## Bonnes pratiques

1. **Ne jamais importer directement les sous-modules** - Toujours utiliser `@/lib/firestore`
2. **Ajouter les nouvelles fonctions dans le bon module thématique**
3. **Exporter les nouvelles fonctions dans `index.ts`**
4. **Documenter les fonctions complexes avec JSDoc**
5. **Garder les modules focalisés sur leur responsabilité**

## Maintenance

Lors de l'ajout d'une nouvelle fonction :

1. Identifier le module approprié (announcements, ambassadors, etc.)
2. Ajouter la fonction dans ce module
3. Exporter la fonction dans `index.ts`
4. Tester la compilation : `npm run build`

---

**Dernière mise à jour** : 2026-04-07
