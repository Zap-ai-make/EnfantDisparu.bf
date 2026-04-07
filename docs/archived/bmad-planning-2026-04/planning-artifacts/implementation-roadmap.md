# 🗺️ ROADMAP D'IMPLÉMENTATION - EnfantPerdu.bf
## Combler les Gaps UX Design Specification

**Date de création:** 2026-04-02
**Auteur:** Swabo
**Basé sur:** UX Design Specification (2026-03-28) + Analyse du code actuel
**Couverture actuelle:** ~63% (C+)
**Objectif:** 90%+ (A)

---

## 📊 ÉTAT ACTUEL - RÉSUMÉ EXÉCUTIF

### ✅ Forces (Ce qui fonctionne bien)

- **Architecture solide:** Firebase + Next.js, 47 composants TSX, séparation claire des responsabilités
- **Features core complètes:** Signalement, recherche, ambassadeurs, partage social
- **Design mobile-first:** Responsive, touch-friendly, palette de couleurs cohérente
- **Real-time data binding:** Firestore `onSnapshot` pour updates live
- **Système de scoring:** Formule mathématique claire pour ambassadeurs

### ❌ Faiblesses (Gaps critiques)

- **Manque "wow moments":** Pas d'animations de compteurs live, pas de célébrations
- **Gamification superficielle:** Scores OK mais pas de badges/défis/streaks
- **Mobilisation invisible:** Pas de fil d'activité communautaire en temps réel
- **Engagement passif:** Pas de rituel quotidien (Morning Briefing), pas de hooks
- **Crédibilité limitée:** Pas de showcase technique pour autorités (Mission Control)

### 🎯 Score Global: 63% (C+)

| Catégorie | Score | Grade |
|-----------|-------|-------|
| Fonctionnalités core | 85% | A- |
| Système Ambassadeurs | 70% | C+ |
| Gamification | 40% | D |
| Design émotionnel | 50% | C |
| Real-time | 60% | C+ |
| Mobile | 90% | A- |
| Accessibilité | 70% | C+ |
| **TOTAL** | **63%** | **C+** |

---

## 🚀 ROADMAP PAR PHASE

---

## PHASE 1: QUICK WINS 🏃‍♂️
**Timeline:** 1-2 semaines (5-10 jours dev)
**Objectif:** Gains rapides, impact visuel immédiat, conformité légale
**Score cible:** 63% → 72% (+9%)

### 1.1 Animations Compteurs Live ⚡
**Impact:** ⭐⭐⭐⭐⭐ (Très Élevé - "Wow moment" critique)
**Effort:** 🔨 Faible (2-3 jours)
**Priorité:** P0 (CRITIQUE)

**Problème actuel:**
- Page de confirmation affiche des nombres statiques (ex: "2,450 personnes notifiées")
- Aucun feedback visuel pendant la diffusion → famille anxieuse

**Solution:**
```tsx
// Installation
npm install react-countup

// Composant de confirmation
import CountUp from 'react-countup';

<div className="bg-orange-50 p-6 rounded-2xl">
  <div className="text-center">
    <div className="text-4xl font-bold text-orange-600">
      <CountUp
        start={0}
        end={stats.pushSent || 0}
        duration={2.5}
        separator=" "
        suffix=" personnes notifiées"
      />
    </div>
    <p className="text-sm text-gray-600 mt-2">
      🔥 La mobilisation s'étend en ce moment même...
    </p>
  </div>
</div>
```

**Implémentation détaillée:**

**Fichiers à modifier:**
- `src/app/confirmation/page.tsx` (page principale)
- `src/components/StatsBar.tsx` (compteurs sur annonce détail)

**Étapes:**
1. Installer `react-countup` (`npm install react-countup`)
2. Créer composant wrapper `LiveCounter.tsx`:
   ```tsx
   'use client';
   import CountUp from 'react-countup';

   interface LiveCounterProps {
     value: number;
     label: string;
     icon?: string;
     color?: 'orange' | 'blue' | 'green' | 'red';
     duration?: number;
   }

   export function LiveCounter({
     value,
     label,
     icon,
     color = 'orange',
     duration = 2.5
   }: LiveCounterProps) {
     const colorClasses = {
       orange: 'text-orange-600 bg-orange-50',
       blue: 'text-blue-600 bg-blue-50',
       green: 'text-green-600 bg-green-50',
       red: 'text-red-600 bg-red-50',
     };

     return (
       <div className={`p-6 rounded-2xl ${colorClasses[color]}`}>
         <div className="text-center">
           {icon && <div className="text-3xl mb-2">{icon}</div>}
           <div className="text-4xl font-bold">
             <CountUp
               start={0}
               end={value}
               duration={duration}
               separator=" "
               useEasing={true}
               easingFn={(t, b, c, d) => {
                 // Easing "ease-out" pour ralentir à la fin
                 return c * ((t = t / d - 1) * t * t + 1) + b;
               }}
             />
           </div>
           <p className="text-sm mt-2 opacity-80">{label}</p>
         </div>
       </div>
     );
   }
   ```

3. Utiliser dans page de confirmation:
   ```tsx
   <div className="grid grid-cols-2 gap-4 mt-6">
     <LiveCounter
       value={announcement.stats?.pushSent || 0}
       label="Notifications envoyées"
       icon="🔔"
       color="orange"
     />
     <LiveCounter
       value={announcement.stats?.facebookReach || 0}
       label="Personnes atteintes sur Facebook"
       icon="👥"
       color="blue"
     />
     <LiveCounter
       value={announcement.stats?.whatsappChannelReach || 0}
       label="Abonnés WhatsApp notifiés"
       icon="💬"
       color="green"
     />
     <LiveCounter
       value={announcement.stats?.pageViews || 0}
       label="Vues de l'annonce"
       icon="👁️"
       color="red"
     />
   </div>
   ```

4. Ajouter animation de "check progressif" pour canaux sociaux:
   ```tsx
   const [channels, setChannels] = useState([
     { name: 'Facebook', icon: '✓', done: false, delay: 500 },
     { name: 'Instagram', icon: '✓', done: false, delay: 1000 },
     { name: 'WhatsApp', icon: '✓', done: false, delay: 1500 },
     { name: 'X (Twitter)', icon: '✓', done: false, delay: 2000 },
     { name: 'LinkedIn', icon: '✓', done: false, delay: 2500 },
     { name: 'Notifications Push', icon: '✓', done: false, delay: 3000 },
   ]);

   useEffect(() => {
     channels.forEach((channel, idx) => {
       setTimeout(() => {
         setChannels(prev => prev.map((ch, i) =>
           i === idx ? { ...ch, done: true } : ch
         ));
       }, channel.delay);
     });
   }, []);

   return (
     <div className="space-y-2">
       <p className="font-semibold">📡 Diffusion en cours...</p>
       {channels.map((ch, i) => (
         <div key={i} className="flex items-center gap-2">
           <div className={`
             transition-all duration-300
             ${ch.done ? 'text-green-600 scale-110' : 'text-gray-400'}
           `}>
             {ch.done ? '✅' : '⏳'}
           </div>
           <span className={ch.done ? 'text-green-700 font-medium' : 'text-gray-500'}>
             {ch.name}
           </span>
         </div>
       ))}
     </div>
   );
   ```

**Tests:**
- Vérifier animation fluide sur mobile (60fps)
- Tester avec valeurs nulles/undefined
- Vérifier accessibilité (lecteur d'écran annonce la valeur finale)

**Impact utilisateur:**
- Famille voit mobilisation "exploser" en temps réel → réassurance immédiate ✅
- Preuves sociales animées → confiance ✅
- "Wow moment" mémorable → viralité bouche-à-oreille ✅

---

### 1.2 Support Reduced Motion (WCAG AA) ♿
**Impact:** ⭐⭐⭐ (Élevé - Obligation légale)
**Effort:** 🔨 Très Faible (1 jour)
**Priorité:** P0 (CRITIQUE - Conformité)

**Problème actuel:**
- Animations peuvent causer nausées/vertiges pour utilisateurs sensibles
- Non-conformité WCAG AA (risque légal)

**Solution:**
```css
/* src/app/globals.css */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Désactiver animations spécifiques */
  .animate-spin,
  .animate-pulse,
  .animate-bounce {
    animation: none !important;
  }

  /* Garder transitions essentielles mais instantanées */
  button:active {
    transition: none;
  }
}
```

**Composant LiveCounter amélioré:**
```tsx
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function LiveCounter({ value, ... }: LiveCounterProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <CountUp
      start={0}
      end={value}
      duration={prefersReducedMotion ? 0 : 2.5} // Instantané si reduced motion
      useEasing={!prefersReducedMotion}
    />
  );
}
```

**Hook utilitaire:**
```tsx
// src/hooks/useReducedMotion.ts
'use client';
import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
}
```

**Fichiers à modifier:**
- `src/app/globals.css` (CSS media query)
- `src/hooks/useReducedMotion.ts` (nouveau hook)
- `src/components/LiveCounter.tsx` (utiliser le hook)
- Tous les composants avec animations (optionnel mais recommandé)

**Tests:**
- Activer "Reduce motion" dans paramètres système
- Vérifier que compteurs affichent valeur finale instantanément
- Vérifier transitions désactivées

**Impact:**
- Conformité WCAG AA ✅
- Accessibilité pour personnes avec troubles vestibulaires ✅
- Protection légale ✅

---

### 1.3 Système de Badges de Base 🏅
**Impact:** ⭐⭐⭐⭐ (Très Élevé - Gamification)
**Effort:** 🔨 Moyen (3-4 jours)
**Priorité:** P0 (CRITIQUE)

**Problème actuel:**
- Ambassadeurs ont seulement "rang" (TOP 1, TOP 5, etc.)
- Pas de reconnaissance pour actions spécifiques
- Pas d'incitation à diversifier contributions

**Solution: 12 Badges Initiaux**

**1. Badges d'Initiation (débloqués automatiquement)**
- 🎖️ **Nouveau Gardien** - Compte ambassadeur créé
- 📍 **Ancré dans ma Zone** - Première zone suivie activée

**2. Badges d'Action (basés sur compteurs)**
- 🔔 **Veilleur Actif** - 10+ notifications activées
- 📢 **Super Partageur** - 50+ partages effectués
- 👀 **Générateur de Vues** - 1,000+ vues générées
- 🤝 **Recruteur** - 5+ ambassadeurs recrutés

**3. Badges de Maîtrise (seuils élevés)**
- 🏆 **Ambassadeur d'Elite** - 1,000+ points de score total
- ⚡ **Force de Frappe** - 100+ partages effectués
- 🌟 **Influenceur Communautaire** - 10,000+ vues générées
- 👑 **Légende** - Top 10 du classement national

**4. Badges Spéciaux (événements uniques)**
- 🎯 **Premier Témoin** - Premier signalement de témoin validé
- 💚 **Héros du Jour** - Contribution à une retrouvaille confirmée

**Implémentation:**

**Schéma de données (Firestore `ambassadors` collection):**
```typescript
// src/types/ambassador.ts

export interface Badge {
  id: string; // ex: "nouveau_gardien", "super_partageur"
  name: string; // "Super Partageur"
  description: string; // "A partagé plus de 50 alertes"
  icon: string; // "📢"
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'; // Niveaux visuels
  unlockedAt?: Date; // Quand débloqué
  condition: BadgeCondition; // Critères de déblocage
}

export interface BadgeCondition {
  type: 'count' | 'threshold' | 'event' | 'rank';
  metric?: 'shares' | 'notifications' | 'views' | 'recruited' | 'score';
  value?: number;
  eventType?: 'firstSighting' | 'retrouvaille' | 'topTen';
}

export interface AmbassadorWithBadges extends Ambassador {
  badges: Badge[]; // Badges débloqués
  badgeProgress: Record<string, number>; // Progrès vers badges (ex: "super_partageur": 35/50)
}
```

**Logique de déblocage (utils):**
```typescript
// src/lib/badge-utils.ts

import { Ambassador, Badge, BadgeCondition } from '@/types/ambassador';

// Définition des badges disponibles
export const AVAILABLE_BADGES: Record<string, Badge> = {
  nouveau_gardien: {
    id: 'nouveau_gardien',
    name: 'Nouveau Gardien',
    description: 'Compte ambassadeur créé avec succès',
    icon: '🎖️',
    tier: 'bronze',
    condition: { type: 'event', eventType: 'accountCreated' },
  },
  ancre_zone: {
    id: 'ancre_zone',
    name: 'Ancré dans ma Zone',
    description: 'Première zone suivie activée',
    icon: '📍',
    tier: 'bronze',
    condition: { type: 'count', metric: 'zones', value: 1 },
  },
  veilleur_actif: {
    id: 'veilleur_actif',
    name: 'Veilleur Actif',
    description: '10+ notifications activées',
    icon: '🔔',
    tier: 'silver',
    condition: { type: 'threshold', metric: 'notifications', value: 10 },
  },
  super_partageur: {
    id: 'super_partageur',
    name: 'Super Partageur',
    description: '50+ partages effectués',
    icon: '📢',
    tier: 'gold',
    condition: { type: 'threshold', metric: 'shares', value: 50 },
  },
  generateur_vues: {
    id: 'generateur_vues',
    name: 'Générateur de Vues',
    description: '1,000+ vues générées',
    icon: '👀',
    tier: 'silver',
    condition: { type: 'threshold', metric: 'views', value: 1000 },
  },
  recruteur: {
    id: 'recruteur',
    name: 'Recruteur',
    description: '5+ ambassadeurs recrutés',
    icon: '🤝',
    tier: 'gold',
    condition: { type: 'threshold', metric: 'recruited', value: 5 },
  },
  elite: {
    id: 'elite',
    name: 'Ambassadeur d\'Elite',
    description: '1,000+ points de score total',
    icon: '🏆',
    tier: 'platinum',
    condition: { type: 'threshold', metric: 'score', value: 1000 },
  },
  force_frappe: {
    id: 'force_frappe',
    name: 'Force de Frappe',
    description: '100+ partages effectués',
    icon: '⚡',
    tier: 'platinum',
    condition: { type: 'threshold', metric: 'shares', value: 100 },
  },
  influenceur: {
    id: 'influenceur',
    name: 'Influenceur Communautaire',
    description: '10,000+ vues générées',
    icon: '🌟',
    tier: 'platinum',
    condition: { type: 'threshold', metric: 'views', value: 10000 },
  },
  legende: {
    id: 'legende',
    name: 'Légende',
    description: 'Top 10 du classement national',
    icon: '👑',
    tier: 'platinum',
    condition: { type: 'rank', value: 10 },
  },
  premier_temoin: {
    id: 'premier_temoin',
    name: 'Premier Témoin',
    description: 'Premier signalement de témoin validé',
    icon: '🎯',
    tier: 'gold',
    condition: { type: 'event', eventType: 'firstSighting' },
  },
  heros_jour: {
    id: 'heros_jour',
    name: 'Héros du Jour',
    description: 'A contribué à une retrouvaille confirmée',
    icon: '💚',
    tier: 'platinum',
    condition: { type: 'event', eventType: 'retrouvaille' },
  },
};

// Vérifier quels badges un ambassadeur peut débloquer
export function checkBadgeUnlocks(ambassador: Ambassador): string[] {
  const newBadges: string[] = [];
  const currentBadgeIds = ambassador.badges?.map(b => b.id) || [];

  Object.values(AVAILABLE_BADGES).forEach(badge => {
    // Skip si déjà débloqué
    if (currentBadgeIds.includes(badge.id)) return;

    // Vérifier condition
    if (isBadgeConditionMet(badge.condition, ambassador)) {
      newBadges.push(badge.id);
    }
  });

  return newBadges;
}

function isBadgeConditionMet(condition: BadgeCondition, ambassador: Ambassador): boolean {
  switch (condition.type) {
    case 'threshold':
      const currentValue = ambassador.stats[condition.metric!] || 0;
      return currentValue >= condition.value!;

    case 'count':
      if (condition.metric === 'zones') {
        return (ambassador.zones?.length || 0) >= condition.value!;
      }
      return false;

    case 'rank':
      // Nécessite rank global (à calculer côté serveur)
      return (ambassador.globalRank || 999) <= condition.value!;

    case 'event':
      // Géré manuellement lors des événements
      return false;

    default:
      return false;
  }
}

// Calculer progression vers badges non débloqués
export function getBadgeProgress(ambassador: Ambassador): Record<string, { current: number; target: number; percentage: number }> {
  const progress: Record<string, any> = {};
  const currentBadgeIds = ambassador.badges?.map(b => b.id) || [];

  Object.values(AVAILABLE_BADGES).forEach(badge => {
    if (currentBadgeIds.includes(badge.id)) return; // Déjà débloqué
    if (badge.condition.type !== 'threshold') return; // Seulement badges avec seuils

    const current = ambassador.stats[badge.condition.metric!] || 0;
    const target = badge.condition.value!;

    progress[badge.id] = {
      current,
      target,
      percentage: Math.min(100, Math.round((current / target) * 100)),
    };
  });

  return progress;
}
```

**Composant affichage badges:**
```tsx
// src/components/BadgeDisplay.tsx
'use client';

import { Badge } from '@/types/ambassador';

interface BadgeDisplayProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export function BadgeDisplay({ badge, size = 'md', showTooltip = true }: BadgeDisplayProps) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-20 h-20 text-4xl',
  };

  const tierColors = {
    bronze: 'from-amber-700 to-amber-500',
    silver: 'from-gray-400 to-gray-300',
    gold: 'from-yellow-500 to-yellow-400',
    platinum: 'from-purple-500 to-pink-500',
  };

  return (
    <div className="relative group">
      <div className={`
        ${sizeClasses[size]}
        rounded-full
        bg-gradient-to-br ${tierColors[badge.tier]}
        flex items-center justify-center
        shadow-lg
        transition-transform hover:scale-110
      `}>
        <span>{badge.icon}</span>
      </div>

      {showTooltip && (
        <div className="
          absolute bottom-full left-1/2 -translate-x-1/2 mb-2
          hidden group-hover:block
          bg-gray-900 text-white text-xs rounded-lg px-3 py-2
          whitespace-nowrap
          z-10
        ">
          <div className="font-semibold">{badge.name}</div>
          <div className="text-gray-300">{badge.description}</div>
          {badge.unlockedAt && (
            <div className="text-gray-400 text-[10px] mt-1">
              Débloqué le {new Date(badge.unlockedAt).toLocaleDateString('fr-FR')}
            </div>
          )}
          {/* Triangle pointer */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
}

// Grille de badges
interface BadgeGridProps {
  badges: Badge[];
  maxDisplay?: number;
}

export function BadgeGrid({ badges, maxDisplay }: BadgeGridProps) {
  const displayBadges = maxDisplay ? badges.slice(0, maxDisplay) : badges;
  const remainingCount = badges.length - displayBadges.length;

  return (
    <div className="flex items-center gap-2">
      {displayBadges.map(badge => (
        <BadgeDisplay key={badge.id} badge={badge} size="sm" />
      ))}
      {remainingCount > 0 && (
        <div className="text-sm text-gray-500">
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
```

**Intégration dans Dashboard Ambassadeur:**
```tsx
// src/app/ambassadeur/page.tsx (modifier)

import { BadgeDisplay, BadgeGrid } from '@/components/BadgeDisplay';
import { AVAILABLE_BADGES, getBadgeProgress } from '@/lib/badge-utils';

export default function AmbassadorDashboard() {
  // ... existing code

  const badgeProgress = getBadgeProgress(ambassador);
  const nextBadges = Object.entries(badgeProgress)
    .sort((a, b) => b[1].percentage - a[1].percentage)
    .slice(0, 3); // Top 3 badges les plus proches

  return (
    <div className="space-y-6">
      {/* Section Badges */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold mb-4">🏅 Mes Badges ({ambassador.badges.length})</h2>

        {/* Badges débloqués */}
        {ambassador.badges.length > 0 ? (
          <div className="grid grid-cols-4 gap-4 mb-6">
            {ambassador.badges.map(badge => (
              <BadgeDisplay key={badge.id} badge={badge} size="md" />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-6">Aucun badge débloqué pour le moment.</p>
        )}

        {/* Progression vers prochains badges */}
        {nextBadges.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="font-semibold text-sm text-gray-600 mb-3">
              Prochains badges à débloquer:
            </h3>
            <div className="space-y-3">
              {nextBadges.map(([badgeId, progress]) => {
                const badge = AVAILABLE_BADGES[badgeId];
                return (
                  <div key={badgeId} className="flex items-center gap-3">
                    <BadgeDisplay badge={badge} size="sm" showTooltip={false} />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{badge.name}</span>
                        <span className="text-gray-500">
                          {progress.current}/{progress.target}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all"
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Existing dashboard content... */}
    </div>
  );
}
```

**Cloud Function pour vérification auto (bonus):**
```typescript
// functions/src/triggers/onAmbassadorUpdate.ts

import * as functions from 'firebase-functions';
import { getFirestore } from 'firebase-admin/firestore';
import { checkBadgeUnlocks, AVAILABLE_BADGES } from '../utils/badge-utils';

export const onAmbassadorStatsUpdate = functions.firestore
  .document('ambassadors/{ambassadorId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Vérifier si stats ont changé
    if (JSON.stringify(before.stats) === JSON.stringify(after.stats)) {
      return; // Pas de changement stats
    }

    // Vérifier nouveaux badges
    const newBadgeIds = checkBadgeUnlocks(after);

    if (newBadgeIds.length === 0) return;

    // Ajouter nouveaux badges
    const badges = after.badges || [];
    newBadgeIds.forEach(badgeId => {
      badges.push({
        ...AVAILABLE_BADGES[badgeId],
        unlockedAt: new Date(),
      });
    });

    // Update document
    await change.after.ref.update({ badges });

    // TODO: Envoyer notification push "🎉 Nouveau badge débloqué!"

    return;
  });
```

**Fichiers à créer/modifier:**
- ✅ `src/types/ambassador.ts` (ajouter types Badge)
- ✅ `src/lib/badge-utils.ts` (logique badges)
- ✅ `src/components/BadgeDisplay.tsx` (composant visuel)
- ✅ `src/app/ambassadeur/page.tsx` (intégration dashboard)
- ✅ `functions/src/triggers/onAmbassadorUpdate.ts` (vérification auto)

**Tests:**
- Créer ambassadeur → vérifier badge "Nouveau Gardien"
- Simuler 50 partages → vérifier badge "Super Partageur"
- Vérifier barres de progression précises
- Tester hover tooltips sur badges

**Impact utilisateur:**
- Reconnaissance visuelle immédiate des contributions ✅
- Objectifs clairs (progression visible) → motivation ✅
- Collection de badges → engagement "Pokémon effect" ✅
- Différenciation ambassadeurs novices vs vétérans ✅

---

### 1.4 Timestamps de Diffusion (Timeline) 🕐
**Impact:** ⭐⭐⭐ (Élevé - Transparence)
**Effort:** 🔨 Faible (1-2 jours)
**Priorité:** P1 (Important)

**Problème actuel:**
- Famille ne sait pas QUAND chaque canal a été activé
- Pas de visibilité sur séquence de diffusion

**Solution:**

**Schéma Firestore (modifier `announcements`):**
```typescript
// src/types/announcement.ts

export interface AnnouncementStats {
  // Existing fields...
  pushSent?: number;
  facebookReach?: number;

  // NOUVEAU: Timestamps de diffusion
  diffusionTimeline?: DiffusionEvent[];
}

export interface DiffusionEvent {
  channel: 'facebook' | 'instagram' | 'whatsapp' | 'twitter' | 'linkedin' | 'push' | 'tiktok';
  status: 'pending' | 'success' | 'failed';
  timestamp: Date;
  details?: string; // Ex: "Post ID: 123456", "Error: Rate limit"
  reach?: number; // Portée initiale si disponible
}
```

**Cloud Function (modifier `onAnnouncementCreate.ts`):**
```typescript
// functions/src/triggers/onAnnouncementCreate.ts

export const onAnnouncementCreated = functions.firestore
  .document('announcements/{announcementId}')
  .onCreate(async (snap, context) => {
    const announcement = snap.data();
    const timeline: DiffusionEvent[] = [];

    // Facebook
    try {
      const fbResult = await postToFacebook(announcement);
      timeline.push({
        channel: 'facebook',
        status: 'success',
        timestamp: new Date(),
        details: `Post ID: ${fbResult.postId}`,
        reach: fbResult.initialReach,
      });
    } catch (error) {
      timeline.push({
        channel: 'facebook',
        status: 'failed',
        timestamp: new Date(),
        details: error.message,
      });
    }

    // Instagram
    try {
      const igResult = await postToInstagram(announcement);
      timeline.push({
        channel: 'instagram',
        status: 'success',
        timestamp: new Date(),
        details: `Media ID: ${igResult.mediaId}`,
      });
    } catch (error) {
      timeline.push({
        channel: 'instagram',
        status: 'failed',
        timestamp: new Date(),
        details: error.message,
      });
    }

    // ... autres canaux

    // Update announcement avec timeline
    await snap.ref.update({
      'stats.diffusionTimeline': timeline,
    });
  });
```

**Composant Timeline (nouveau):**
```tsx
// src/components/DiffusionTimeline.tsx
'use client';

import { DiffusionEvent } from '@/types/announcement';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DiffusionTimelineProps {
  timeline: DiffusionEvent[];
}

const CHANNEL_INFO = {
  facebook: { name: 'Facebook', icon: '📘', color: 'blue' },
  instagram: { name: 'Instagram', icon: '📸', color: 'pink' },
  whatsapp: { name: 'WhatsApp', icon: '💬', color: 'green' },
  twitter: { name: 'X (Twitter)', icon: '🐦', color: 'gray' },
  linkedin: { name: 'LinkedIn', icon: '💼', color: 'blue' },
  push: { name: 'Notifications Push', icon: '🔔', color: 'orange' },
  tiktok: { name: 'TikTok', icon: '🎵', color: 'black' },
};

export function DiffusionTimeline({ timeline }: DiffusionTimelineProps) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        ⏳ Diffusion en cours...
      </div>
    );
  }

  // Trier par timestamp (plus récent en premier)
  const sorted = [...timeline].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm text-gray-600">
        📡 Historique de diffusion
      </h3>
      <div className="space-y-2">
        {sorted.map((event, idx) => {
          const info = CHANNEL_INFO[event.channel];
          const isSuccess = event.status === 'success';

          return (
            <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              {/* Icon */}
              <div className={`
                text-2xl
                ${isSuccess ? 'opacity-100' : 'opacity-40 grayscale'}
              `}>
                {isSuccess ? '✅' : '❌'} {info.icon}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className={`font-medium ${isSuccess ? 'text-gray-900' : 'text-gray-500'}`}>
                    {info.name}
                  </span>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatDistanceToNow(new Date(event.timestamp), {
                      addSuffix: true,
                      locale: fr
                    })}
                  </span>
                </div>

                {/* Status */}
                {isSuccess ? (
                  <div className="text-sm text-green-600 mt-1">
                    ✓ Publié avec succès
                    {event.reach && (
                      <span className="text-gray-500 ml-2">
                        · {event.reach.toLocaleString()} personnes atteintes
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-red-600 mt-1">
                    ✗ Échec: {event.details}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

**Intégration page confirmation:**
```tsx
// src/app/confirmation/page.tsx

import { DiffusionTimeline } from '@/components/DiffusionTimeline';

export default function ConfirmationPage({ announcement }) {
  return (
    <div className="space-y-6">
      {/* Existing content */}

      {/* Timeline */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <DiffusionTimeline timeline={announcement.stats?.diffusionTimeline || []} />
      </div>
    </div>
  );
}
```

**Fichiers à modifier:**
- `src/types/announcement.ts` (ajouter types)
- `functions/src/triggers/onAnnouncementCreate.ts` (logger timestamps)
- `src/components/DiffusionTimeline.tsx` (nouveau composant)
- `src/app/confirmation/page.tsx` (intégration)

**Impact utilisateur:**
- Transparence totale sur processus de diffusion ✅
- Famille voit séquence exacte (Facebook à T+2s, WhatsApp T+5s, etc.) ✅
- Debugging facile si échecs ✅

---

## RÉCAPITULATIF PHASE 1

| Feature | Fichiers modifiés | Effort | Impact | Priorité |
|---------|------------------|--------|--------|----------|
| **1.1 Animations Compteurs** | 3 fichiers (confirmation, StatsBar, nouveau LiveCounter) | 2-3 jours | ⭐⭐⭐⭐⭐ | P0 |
| **1.2 Reduced Motion** | 2 fichiers (globals.css, hook) | 1 jour | ⭐⭐⭐ | P0 |
| **1.3 Badges** | 5 fichiers (types, utils, composant, dashboard, function) | 3-4 jours | ⭐⭐⭐⭐ | P0 |
| **1.4 Timeline** | 4 fichiers (types, function, composant, page) | 1-2 jours | ⭐⭐⭐ | P1 |
| **TOTAL** | **14 fichiers** | **7-10 jours** | **Score: 63% → 72%** | |

**Gains attendus:**
- +9% score global
- Conformité WCAG AA ✅
- Premier système de badges fonctionnel ✅
- Feedback visuel "wow moments" ✅
- Transparence diffusion ✅

---

## PHASE 2: ENGAGEMENT QUOTIDIEN 🌅
**Timeline:** 2-4 semaines (10-20 jours dev)
**Objectif:** Créer rituels quotidiens, visibilité communauté, crédibilité institutionnelle
**Score cible:** 72% → 85% (+13%)

### 2.1 Morning Briefing Modal (Hook Quotidien) ☀️
**Impact:** ⭐⭐⭐⭐⭐ (Très Élevé - Engagement rituel)
**Effort:** 🔨🔨 Élevé (5-6 jours)
**Priorité:** P0 (CRITIQUE pour rétention)

**Problème actuel:**
- Ambassadeurs ouvrent app seulement quand notification reçue (passif)
- Pas de rituel quotidien → engagement sporadique
- Pas de feedback sur impact personnel

**Solution: Modal "Bonjour Champion!"**

**Déclenchement:**
1. **Push notification 7h-8h du matin** (OneSignal scheduled)
2. **Ouverture app:** Modal s'affiche si pas vu aujourd'hui
3. **Contenu dynamique:** Stats hier, objectifs aujourd'hui, nouveau badge éventuel

**Architecture:**

**1. Schéma Firestore (ajouter à `ambassadors`):**
```typescript
export interface Ambassador {
  // ... existing fields

  // Morning briefing tracking
  lastBriefingDate?: Date; // Dernière fois modal vue
  briefingStats?: {
    totalViews: number; // Combien de fois vue
    currentStreak: number; // Jours consécutifs de visite
    longestStreak: number; // Record de streak
  };
}
```

**2. Cloud Function: Scheduled Push (nouveau):**
```typescript
// functions/src/scheduled/morningBriefingPush.ts

import * as functions from 'firebase-functions';
import { getFirestore } from 'firebase-admin/firestore';
import { sendPushNotification } from '../services/onesignal';

// Trigger: Tous les jours à 7h30 UTC+0 (8h30 heure Burkina)
export const sendMorningBriefings = functions.pubsub
  .schedule('30 7 * * *')
  .timeZone('Africa/Ouagadougou')
  .onRun(async (context) => {
    const db = getFirestore();

    // Récupérer tous ambassadeurs actifs
    const ambassadors = await db.collection('ambassadors')
      .where('status', '==', 'approved')
      .get();

    const playerIds: string[] = [];

    ambassadors.forEach(doc => {
      const amb = doc.data();
      if (amb.oneSignalPlayerId) {
        playerIds.push(amb.oneSignalPlayerId);
      }
    });

    if (playerIds.length === 0) return;

    // Envoyer push notification
    await sendPushNotification({
      playerIds,
      headings: { fr: '☀️ Bonjour Champion !' },
      contents: { fr: 'Votre briefing quotidien vous attend. Découvrez votre impact d\'hier ! 🎯' },
      data: {
        type: 'morning_briefing',
        action: 'open_modal',
      },
      buttons: [
        { id: 'open', text: 'Voir mon briefing 📊' },
      ],
    });

    console.log(`Morning briefing sent to ${playerIds.length} ambassadors`);
  });
```

**3. Modal Component:**
```tsx
// src/components/MorningBriefingModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Ambassador } from '@/types/ambassador';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Confetti from 'react-confetti';

interface MorningBriefingModalProps {
  ambassador: Ambassador;
  onClose: () => void;
}

export function MorningBriefingModal({ ambassador, onClose }: MorningBriefingModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Fetch yesterday's stats
    fetchYesterdayStats(ambassador.id).then(setStats);
  }, [ambassador.id]);

  // Déterminer si nouveau badge débloqué (comparer last briefing)
  const newBadges = getNewBadgesSinceLastBriefing(ambassador);

  useEffect(() => {
    if (newBadges.length > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [newBadges]);

  // Objectif quotidien (variable reward)
  const dailyChallenge = getDailyChallenge(new Date());

  return (
    <>
      {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}

      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white">
            <div className="text-center">
              <div className="text-5xl mb-2">☀️</div>
              <h2 className="text-2xl font-bold">Bonjour Champion !</h2>
              <p className="text-orange-100 text-sm mt-1">
                {ambassador.name?.split(' ')[0] || 'Ambassadeur'}
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Streak */}
            <div className="text-center bg-orange-50 p-4 rounded-2xl">
              <div className="text-3xl mb-1">🔥</div>
              <div className="text-2xl font-bold text-orange-600">
                {ambassador.briefingStats?.currentStreak || 1} jours
              </div>
              <div className="text-sm text-gray-600">
                Série de connexions consécutives
              </div>
              {(ambassador.briefingStats?.currentStreak || 0) > 3 && (
                <div className="text-xs text-orange-600 mt-2 font-medium">
                  🎉 Continue comme ça, tu es incroyable !
                </div>
              )}
            </div>

            {/* Yesterday's Impact */}
            {stats && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3">
                  📊 Ton impact d'hier
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">
                      +{stats.newViews || 0}
                    </div>
                    <div className="text-xs text-gray-600">vues générées</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">
                      +{stats.newShares || 0}
                    </div>
                    <div className="text-xs text-gray-600">partages</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">
                      +{stats.newPoints || 0}
                    </div>
                    <div className="text-xs text-gray-600">points XP</div>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600">
                      #{stats.newRank || ambassador.globalRank || '?'}
                    </div>
                    <div className="text-xs text-gray-600">classement</div>
                  </div>
                </div>
              </div>
            )}

            {/* New Badges */}
            {newBadges.length > 0 && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border-2 border-purple-200">
                <div className="text-center mb-3">
                  <div className="text-4xl mb-2">🎉</div>
                  <div className="font-bold text-purple-900">
                    Nouveau badge débloqué !
                  </div>
                </div>
                <div className="flex justify-center gap-3">
                  {newBadges.map(badge => (
                    <div key={badge.id} className="text-center">
                      <div className="text-4xl mb-1">{badge.icon}</div>
                      <div className="text-xs font-medium text-purple-800">
                        {badge.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Daily Challenge */}
            <div className="border-2 border-dashed border-orange-300 p-4 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">🎯</div>
                <div>
                  <div className="font-bold text-gray-900">Défi du jour</div>
                  <div className="text-xs text-gray-500">Bonus +{dailyChallenge.bonus} points</div>
                </div>
              </div>
              <div className="text-sm text-gray-700">
                {dailyChallenge.description}
              </div>
            </div>

            {/* Active Searches in Your Zones */}
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                🔍 Recherches actives dans tes zones
              </h3>
              {ambassador.activeSearchesInZones?.length > 0 ? (
                <div className="space-y-2">
                  {ambassador.activeSearchesInZones.slice(0, 3).map((search: any) => (
                    <div key={search.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
                      <div className="text-2xl">🚨</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {search.childName}
                        </div>
                        <div className="text-xs text-gray-600">
                          {search.zone} · {formatDistanceToNow(new Date(search.createdAt), { addSuffix: true, locale: fr })}
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg">
                        Partager
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 text-center py-3">
                  Aucune recherche active pour le moment
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t">
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-shadow"
            >
              C'est parti ! 🚀
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Utilitaires
function getDailyChallenge(date: Date): { description: string; bonus: number; type: string } {
  // Rotation de 7 défis (un par jour de la semaine)
  const dayOfWeek = date.getDay();
  const challenges = [
    { description: 'Partage 3 alertes actives', bonus: 50, type: 'shares' },
    { description: 'Recrute 1 nouvel ambassadeur', bonus: 100, type: 'recruit' },
    { description: 'Active les notifications pour 2 nouvelles zones', bonus: 30, type: 'zones' },
    { description: 'Génère 500 vues sur tes partages', bonus: 60, type: 'views' },
    { description: 'Partage sur 3 réseaux sociaux différents', bonus: 40, type: 'platforms' },
    { description: 'Vérifie toutes les recherches actives dans ta zone', bonus: 20, type: 'check' },
    { description: 'Connecte-toi 7 jours d\'affilée (aujourd\'hui inclus)', bonus: 150, type: 'streak' },
  ];

  return challenges[dayOfWeek];
}

async function fetchYesterdayStats(ambassadorId: string) {
  // TODO: Implémenter fetch real stats from Firestore
  // Pour l'instant, mock data
  return {
    newViews: Math.floor(Math.random() * 500) + 50,
    newShares: Math.floor(Math.random() * 10) + 1,
    newPoints: Math.floor(Math.random() * 100) + 10,
    newRank: Math.floor(Math.random() * 50) + 1,
  };
}

function getNewBadgesSinceLastBriefing(ambassador: Ambassador) {
  // Compare badges actuels avec ceux au dernier briefing
  // TODO: Implémenter logique réelle
  return []; // Pour l'instant
}
```

**4. Intégration Dashboard:**
```tsx
// src/app/ambassadeur/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { MorningBriefingModal } from '@/components/MorningBriefingModal';
import { isSameDay } from 'date-fns';

export default function AmbassadorDashboard() {
  const [showBriefing, setShowBriefing] = useState(false);
  const [ambassador, setAmbassador] = useState<Ambassador | null>(null);

  useEffect(() => {
    // Vérifier si modal déjà vue aujourd'hui
    if (ambassador && ambassador.lastBriefingDate) {
      const lastViewed = new Date(ambassador.lastBriefingDate);
      const today = new Date();

      if (!isSameDay(lastViewed, today)) {
        // Pas encore vue aujourd'hui → afficher
        setShowBriefing(true);
      }
    } else if (ambassador) {
      // Jamais vue → afficher
      setShowBriefing(true);
    }
  }, [ambassador]);

  const handleCloseBriefing = async () => {
    setShowBriefing(false);

    // Update Firestore
    if (ambassador) {
      await fetch('/api/ambassador/update-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ambassadorId: ambassador.id,
          timestamp: new Date().toISOString(),
        }),
      });

      // Update local state
      setAmbassador({
        ...ambassador,
        lastBriefingDate: new Date(),
        briefingStats: {
          totalViews: (ambassador.briefingStats?.totalViews || 0) + 1,
          currentStreak: calculateStreak(ambassador.lastBriefingDate),
          longestStreak: Math.max(
            ambassador.briefingStats?.longestStreak || 0,
            calculateStreak(ambassador.lastBriefingDate)
          ),
        },
      });
    }
  };

  return (
    <>
      {showBriefing && ambassador && (
        <MorningBriefingModal
          ambassador={ambassador}
          onClose={handleCloseBriefing}
        />
      )}

      {/* Existing dashboard content */}
    </>
  );
}

function calculateStreak(lastBriefingDate?: Date): number {
  if (!lastBriefingDate) return 1;

  const last = new Date(lastBriefingDate);
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Jour consécutif → streak continue
    return 1; // Sera incrémenté par backend
  } else if (diffDays > 1) {
    // Gap → reset streak
    return 1;
  }

  return 1;
}
```

**5. API Route (tracking):**
```typescript
// src/app/api/ambassador/update-briefing/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';
import { isSameDay, differenceInDays } from 'date-fns';

export async function POST(req: NextRequest) {
  const { ambassadorId, timestamp } = await req.json();

  const db = getFirestore();
  const ambassadorRef = db.collection('ambassadors').doc(ambassadorId);
  const doc = await ambassadorRef.get();

  if (!doc.exists) {
    return NextResponse.json({ error: 'Ambassador not found' }, { status: 404 });
  }

  const ambassador = doc.data()!;
  const today = new Date(timestamp);
  const lastBriefing = ambassador.lastBriefingDate?.toDate();

  // Calculer streak
  let currentStreak = 1;
  if (lastBriefing) {
    const daysDiff = differenceInDays(today, lastBriefing);

    if (daysDiff === 1) {
      // Jour consécutif
      currentStreak = (ambassador.briefingStats?.currentStreak || 0) + 1;
    } else if (daysDiff > 1) {
      // Gap → reset
      currentStreak = 1;
    } else {
      // Même jour (ne devrait pas arriver)
      currentStreak = ambassador.briefingStats?.currentStreak || 1;
    }
  }

  const longestStreak = Math.max(
    ambassador.briefingStats?.longestStreak || 0,
    currentStreak
  );

  // Update
  await ambassadorRef.update({
    lastBriefingDate: today,
    'briefingStats.totalViews': (ambassador.briefingStats?.totalViews || 0) + 1,
    'briefingStats.currentStreak': currentStreak,
    'briefingStats.longestStreak': longestStreak,
  });

  return NextResponse.json({ success: true, currentStreak, longestStreak });
}
```

**Fichiers à créer/modifier:**
- ✅ `functions/src/scheduled/morningBriefingPush.ts` (Cloud Function)
- ✅ `src/components/MorningBriefingModal.tsx` (Modal UI)
- ✅ `src/app/ambassadeur/page.tsx` (intégration)
- ✅ `src/app/api/ambassador/update-briefing/route.ts` (API tracking)
- ✅ `src/types/ambassador.ts` (types briefingStats)
- ✅ `package.json` (ajouter `react-confetti`, `date-fns`)

**Impact utilisateur:**
- Rituel quotidien → engagement habituel ✅
- Feedback positif sur impact → motivation ✅
- Variable rewards (défis différents) → addiction ✅
- Streaks → FOMO (ne pas casser la série) ✅
- Celebration nouveaux badges → satisfaction ✅

---

### 2.2 Fil d'Activité Communautaire 📊
**Impact:** ⭐⭐⭐⭐⭐ (Très Élevé - Preuve sociale live)
**Effort:** 🔨🔨🔨 Élevé (6-8 jours)
**Priorité:** P0 (CRITIQUE pour mobilisation visible)

**Problème actuel:**
- Mobilisation communautaire invisible
- Pas de preuve que "ça bouge"
- Famille se sent seule

**Solution: Feed d'activité temps réel**

**Exemples d'événements:**
- "👤 Marie vient de partager l'alerte de Fatima (Ouagadougou)"
- "🔍 Ahmed recherche activement dans Bobo-Dioulasso"
- "💬 Nouveau témoignage reçu pour l'annonce #ABC123"
- "🎉 Karim a débloqué le badge 'Super Partageur'"
- "🙋 Nouvel ambassadeur rejoint la communauté"

**Architecture:**

**1. Collection Firestore (nouvelle):**
```typescript
// Collection: activityFeed
export interface ActivityEvent {
  id: string;
  type: 'share' | 'search' | 'sighting' | 'badge' | 'join' | 'resolved';
  timestamp: Date;
  actorName: string; // "Marie" (prénom uniquement pour privacy)
  actorRole: 'ambassador' | 'community' | 'family';
  action: string; // "a partagé", "recherche activement"
  targetType?: 'announcement' | 'zone' | 'badge';
  targetName?: string; // "Fatima (Ouagadougou)" ou badge name
  targetId?: string; // announcement shortCode
  zoneId?: string; // Pour filtrer par zone
  visibility: 'public' | 'ambassadors_only';
}
```

**2. Cloud Functions (logger events):**
```typescript
// functions/src/triggers/onActivityEvent.ts

import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Trigger: Quand ambassadeur partage
export const onAmbassadorShare = functions.firestore
  .document('ambassadors/{ambassadorId}/activity/{activityId}')
  .onCreate(async (snap, context) => {
    const activity = snap.data();

    if (activity.type !== 'share') return;

    const db = getFirestore();

    // Récupérer info annonce
    const announcementSnap = await db.collection('announcements')
      .doc(activity.announcementId)
      .get();

    if (!announcementSnap.exists) return;

    const announcement = announcementSnap.data()!;

    // Créer event dans feed
    await db.collection('activityFeed').add({
      type: 'share',
      timestamp: FieldValue.serverTimestamp(),
      actorName: activity.ambassadorName?.split(' ')[0], // Prénom uniquement
      actorRole: 'ambassador',
      action: 'a partagé',
      targetType: 'announcement',
      targetName: `l'alerte de ${announcement.childName} (${announcement.zone})`,
      targetId: announcement.shortCode,
      zoneId: announcement.zoneId,
      visibility: 'public',
    });
  });

// Trigger: Quand nouvel ambassadeur validé
export const onAmbassadorApproved = functions.firestore
  .document('ambassadors/{ambassadorId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status !== 'approved' && after.status === 'approved') {
      const db = getFirestore();

      await db.collection('activityFeed').add({
        type: 'join',
        timestamp: FieldValue.serverTimestamp(),
        actorName: after.name?.split(' ')[0],
        actorRole: 'ambassador',
        action: 'a rejoint la communauté',
        visibility: 'public',
      });
    }
  });

// Trigger: Quand témoignage soumis
export const onSightingCreated = functions.firestore
  .document('sightings/{sightingId}')
  .onCreate(async (snap, context) => {
    const sighting = snap.data();
    const db = getFirestore();

    // Récupérer annonce
    const announcementSnap = await db.collection('announcements')
      .doc(sighting.announcementId)
      .get();

    if (!announcementSnap.exists) return;
    const announcement = announcementSnap.data()!;

    await db.collection('activityFeed').add({
      type: 'sighting',
      timestamp: FieldValue.serverTimestamp(),
      actorName: 'Un témoin', // Anonyme
      actorRole: 'community',
      action: 'a signalé un témoin pour',
      targetType: 'announcement',
      targetName: announcement.childName,
      targetId: announcement.shortCode,
      zoneId: announcement.zoneId,
      visibility: 'public',
    });
  });

// Trigger: Quand badge débloqué
export const onBadgeUnlocked = functions.firestore
  .document('ambassadors/{ambassadorId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    const newBadges = (after.badges || []).filter((badge: any) =>
      !(before.badges || []).some((b: any) => b.id === badge.id)
    );

    if (newBadges.length === 0) return;

    const db = getFirestore();

    // Logger chaque nouveau badge
    for (const badge of newBadges) {
      await db.collection('activityFeed').add({
        type: 'badge',
        timestamp: FieldValue.serverTimestamp(),
        actorName: after.name?.split(' ')[0],
        actorRole: 'ambassador',
        action: 'a débloqué le badge',
        targetType: 'badge',
        targetName: badge.name,
        visibility: 'public',
      });
    }
  });
```

**3. Composant Feed:**
```tsx
// src/components/ActivityFeed.tsx
'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ActivityEvent } from '@/types/activity';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';

interface ActivityFeedProps {
  maxItems?: number;
  filterZone?: string;
  showHeader?: boolean;
}

const ACTIVITY_ICONS = {
  share: '📢',
  search: '🔍',
  sighting: '💬',
  badge: '🎉',
  join: '🙋',
  resolved: '✅',
};

export function ActivityFeed({
  maxItems = 20,
  filterZone,
  showHeader = true
}: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(
      collection(db, 'activityFeed'),
      orderBy('timestamp', 'desc'),
      limit(maxItems)
    );

    // Note: Firestore ne supporte pas filtre conditionnel dans query
    // On filtre côté client si nécessaire

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let events = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
      })) as ActivityEvent[];

      // Filtrer par zone si spécifié
      if (filterZone) {
        events = events.filter(e => !e.zoneId || e.zoneId === filterZone);
      }

      setActivities(events);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [maxItems, filterZone]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            🌍 Activité communautaire
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            En direct
          </div>
        </div>
      )}

      <div className="space-y-2">
        {activities.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Aucune activité récente
          </div>
        ) : (
          activities.map((event) => (
            <ActivityItem key={event.id} event={event} />
          ))
        )}
      </div>
    </div>
  );
}

function ActivityItem({ event }: { event: ActivityEvent }) {
  const icon = ACTIVITY_ICONS[event.type] || '📌';
  const timeAgo = event.timestamp
    ? formatDistanceToNow(event.timestamp, { addSuffix: true, locale: fr })
    : 'à l\'instant';

  const content = (
    <div className="flex items-start gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
      {/* Icon */}
      <div className="text-2xl flex-shrink-0">
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-900">
          <span className="font-semibold">{event.actorName}</span>
          {' '}{event.action}{' '}
          {event.targetName && (
            <span className="font-medium">{event.targetName}</span>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {timeAgo}
        </div>
      </div>

      {/* Action button si applicable */}
      {event.targetId && event.type === 'share' && (
        <Link
          href={`/annonce/${event.targetId}`}
          className="flex-shrink-0 px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700"
        >
          Voir
        </Link>
      )}
    </div>
  );

  // Si targetId existe et c'est une annonce, wrapper dans Link
  if (event.targetId && (event.type === 'share' || event.type === 'sighting')) {
    return (
      <Link href={`/annonce/${event.targetId}`}>
        {content}
      </Link>
    );
  }

  return content;
}
```

**4. Intégration Homepage:**
```tsx
// src/app/page.tsx

import { ActivityFeed } from '@/components/ActivityFeed';

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Existing hero, stats, etc. */}

      {/* Activity Feed */}
      <section className="max-w-2xl mx-auto px-4">
        <ActivityFeed maxItems={10} showHeader={true} />
      </section>

      {/* Existing announcements grid */}
    </div>
  );
}
```

**5. Intégration Page Annonce:**
```tsx
// src/app/annonce/[shortCode]/page.tsx

import { ActivityFeed } from '@/components/ActivityFeed';

export default async function AnnouncementPage({ params }: { params: { shortCode: string } }) {
  const announcement = await getAnnouncement(params.shortCode);

  return (
    <div className="space-y-6">
      {/* Existing announcement content */}

      {/* Activity related to this announcement */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="font-bold mb-4">📊 Mobilisation en cours</h3>
        <ActivityFeed
          maxItems={15}
          filterZone={announcement.zoneId}
          showHeader={false}
        />
      </div>
    </div>
  );
}
```

**Fichiers à créer/modifier:**
- ✅ `src/types/activity.ts` (nouveau - types ActivityEvent)
- ✅ `functions/src/triggers/onActivityEvent.ts` (nouveau - logger events)
- ✅ `src/components/ActivityFeed.tsx` (nouveau - composant feed)
- ✅ `src/app/page.tsx` (intégration homepage)
- ✅ `src/app/annonce/[shortCode]/page.tsx` (intégration annonce)

**Tests:**
- Partager annonce → vérifier event apparaît dans feed
- Nouveau ambassadeur → vérifier event "a rejoint"
- Soumettre témoignage → vérifier event feed
- Vérifier ordre chronologique (plus récent en haut)
- Tester filtrage par zone

**Impact utilisateur:**
- Famille voit mobilisation en temps réel → réassurance ✅
- Communauté se sent partie d'un mouvement → appartenance ✅
- Preuve sociale visible → confiance ✅
- FOMO pour ambassadeurs ("je veux être dans le feed") ✅

---

### 2.3 Barre de Statut Live Globale 📊
**Impact:** ⭐⭐⭐⭐ (Élevé - Visibilité constante)
**Effort:** 🔨 Faible (2-3 jours)
**Priorité:** P1 (Important)

**Problème actuel:**
- Pas de visibilité sur "ce qui se passe maintenant" sur toutes les pages
- Stats globales cachées

**Solution: Sticky header bar**

**Design:**
```
┌──────────────────────────────────────────────────────┐
│ 🔴 5 recherches actives · 👥 87 ambassadeurs · ✅ 23 retrouvailles │
└──────────────────────────────────────────────────────┘
```

**Implémentation:**

```tsx
// src/components/LiveStatusBar.tsx
'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, getCountFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export function LiveStatusBar() {
  const [stats, setStats] = useState({
    activeAnnouncements: 0,
    totalAmbassadors: 0,
    resolvedCases: 0,
  });

  useEffect(() => {
    // Active announcements (real-time)
    const activeQuery = query(
      collection(db, 'announcements'),
      where('status', '==', 'active')
    );

    const unsubActive = onSnapshot(activeQuery, (snapshot) => {
      setStats(prev => ({ ...prev, activeAnnouncements: snapshot.size }));
    });

    // Ambassadors count (fetch once, update périodiquement)
    const fetchAmbassadors = async () => {
      const ambassadorQuery = query(
        collection(db, 'ambassadors'),
        where('status', '==', 'approved')
      );
      const count = await getCountFromServer(ambassadorQuery);
      setStats(prev => ({ ...prev, totalAmbassadors: count.data().count }));
    };

    fetchAmbassadors();
    const intervalAmb = setInterval(fetchAmbassadors, 60000); // Update every minute

    // Resolved cases (fetch once)
    const fetchResolved = async () => {
      const resolvedQuery = query(
        collection(db, 'announcements'),
        where('status', '==', 'resolved')
      );
      const count = await getCountFromServer(resolvedQuery);
      setStats(prev => ({ ...prev, resolvedCases: count.data().count }));
    };

    fetchResolved();
    const intervalResolved = setInterval(fetchResolved, 300000); // Update every 5 minutes

    return () => {
      unsubActive();
      clearInterval(intervalAmb);
      clearInterval(intervalResolved);
    };
  }, []);

  return (
    <div className="sticky top-0 z-40 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-6 text-sm font-medium">
          <Link href="/" className="flex items-center gap-2 hover:underline">
            <span className={`w-2 h-2 rounded-full animate-pulse ${
              stats.activeAnnouncements > 0 ? 'bg-red-300' : 'bg-green-300'
            }`} />
            <span>
              {stats.activeAnnouncements > 0 ? '🔴' : '🟢'}
              {' '}{stats.activeAnnouncements} recherche{stats.activeAnnouncements !== 1 ? 's' : ''} active{stats.activeAnnouncements !== 1 ? 's' : ''}
            </span>
          </Link>

          <span className="hidden sm:inline text-white/50">·</span>

          <Link href="/devenir-ambassadeur" className="flex items-center gap-2 hover:underline hidden sm:flex">
            <span>👥</span>
            <span>{stats.totalAmbassadors} ambassadeur{stats.totalAmbassadors !== 1 ? 's' : ''}</span>
          </Link>

          <span className="hidden sm:inline text-white/50">·</span>

          <Link href="/retrouvailles" className="flex items-center gap-2 hover:underline hidden sm:flex">
            <span>✅</span>
            <span>{stats.resolvedCases} retrouvaille{stats.resolvedCases !== 1 ? 's' : ''}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

**Intégration layout:**
```tsx
// src/app/layout.tsx

import { LiveStatusBar } from '@/components/LiveStatusBar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <LiveStatusBar />
        {children}
      </body>
    </html>
  );
}
```

**Fichiers à créer/modifier:**
- ✅ `src/components/LiveStatusBar.tsx` (nouveau)
- ✅ `src/app/layout.tsx` (ajouter barre)

**Impact:**
- Visibilité constante de l'activité ✅
- Sentiment d'urgence si recherches actives ✅
- Appel à l'action implicite (devenir ambassadeur) ✅

---

### 2.4 Page "Mission Control" (Écosystème) 🎛️
**Impact:** ⭐⭐⭐⭐⭐ (Très Élevé - Crédibilité autorités)
**Effort:** 🔨🔨🔨 Élevé (7-10 jours)
**Priorité:** P1 (Important pour partenariats)

**Problème actuel:**
- Autorités/ONG ne voient pas l'infrastructure technique
- Pas de "wow factor" tech pour crédibilité
- Architecture invisible

**Solution: Page showcase technique**

**URL:** `/ecosysteme` ou `/mission-control`

**Sections:**

1. **Hero**: "L'Infrastructure derrière EnfantPerdu.bf"
2. **Architecture Diagram**: Visualisation interactive sync multi-canaux
3. **Performance SLA**: Uptime 99.9%, diffusion <30s, etc.
4. **Partner Logos**: Firebase, OneSignal, Facebook, etc.
5. **Live Dashboard**: Métriques temps réel (API calls, messages sent, etc.)
6. **Tech Stack**: Liste technologies utilisées

*Note: Cette feature est complexe, je vais la documenter en détail dans un fichier séparé car elle nécessite beaucoup de code. Pour l'instant, je place un placeholder.*

**Fichiers à créer:**
- `src/app/ecosysteme/page.tsx` (page principale)
- `src/components/ecosystem/ArchitectureDiagram.tsx` (viz interactive)
- `src/components/ecosystem/SLAMetrics.tsx` (perf metrics)
- `src/components/ecosystem/PartnerLogos.tsx` (logos)
- `src/components/ecosystem/TechStack.tsx` (liste tech)

**Impact:**
- Crédibilité institutionnelle ✅
- Trust pour partenariats ONG/gouvernement ✅
- Différenciation vs autres plateformes ✅
- Fierté communautaire ("on a une vraie tech derrière") ✅

---

## RÉCAPITULATIF PHASE 2

| Feature | Effort | Impact | Priorité | Score Gain |
|---------|--------|--------|----------|------------|
| **2.1 Morning Briefing** | 5-6 jours | ⭐⭐⭐⭐⭐ | P0 | +5% |
| **2.2 Activity Feed** | 6-8 jours | ⭐⭐⭐⭐⭐ | P0 | +5% |
| **2.3 Live Status Bar** | 2-3 jours | ⭐⭐⭐⭐ | P1 | +1% |
| **2.4 Mission Control** | 7-10 jours | ⭐⭐⭐⭐⭐ | P1 | +2% |
| **TOTAL** | **20-27 jours** | | | **+13%** |

**Score cible:** 72% → 85%

**Gains attendus:**
- Engagement quotidien ritualisé ✅
- Mobilisation communautaire visible ✅
- Crédibilité technique démontrée ✅
- Preuves sociales omniprésentes ✅

---

## PHASE 3: OPTIMISATION & POLISH 🎨
**Timeline:** 1-3 mois (4-12 semaines)
**Objectif:** Excellence UX, accessibilité complète, performance optimale
**Score cible:** 85% → 92% (+7%)

### Features Phase 3:

#### 3.1 Dark Mode 🌙
- Toggle dans profile ambassadeur
- CSS variables pour couleurs
- Respect `prefers-color-scheme`
- **Effort:** 5 jours (selon spec)

#### 3.2 Heatmap & Geographic Intelligence 🗺️
- Carte de chaleur zones recherche
- Témoignages géolocalisés
- Algorithme assignation zones
- **Effort:** 2-3 semaines

#### 3.3 Hall of Fame 🏆
- Top ambassadeurs mensuels
- Success stories attribution
- Certificats téléchargeables
- **Effort:** 1 semaine

#### 3.4 Professional UI Mode (Authorities) 💼
- Layout dense pour desktop
- Metrics dashboard avancé
- Export CSV/PDF rapports
- **Effort:** 3 jours (selon spec)

#### 3.5 Gestures & PWA 📱
- Pull-to-refresh
- Swipe actions
- Add to homescreen prompt
- Offline support (Service Worker)
- **Effort:** 2 semaines

#### 3.6 Performance Optimizations ⚡
- Bundle size reduction (<200KB JS)
- Font subsetting (Inter 400/600/700 only)
- WebP images + JPEG fallback
- Lazy loading aggressive
- **Effort:** 1 semaine

#### 3.7 Advanced Accessibility ♿
- Screen reader optimizations
- Keyboard navigation complet
- ARIA labels partout
- High contrast mode
- Focus states exhaustifs
- **Effort:** 2 semaines

#### 3.8 Multilingual (Mooré, Dioula) 🗣️
- i18n framework (next-intl)
- Traductions professionnelles
- Détection langue automatique
- **Effort:** 3 semaines

---

## PHASE 4: SCALE & ADVANCED FEATURES 🚀
**Timeline:** 3-6 mois
**Objectif:** Expansion régionale, features avancées
**Score cible:** 92% → 98%

#### 4.1 Whitelabel Multi-Pays 🌍
- Configuration par pays (Mali, Niger, Sénégal)
- Zones géographiques dynamiques
- Partenaires sociaux par pays
- **Effort:** 4-6 semaines

#### 4.2 Advanced Analytics 📈
- Sentry integration (error tracking)
- LogRocket (session replay)
- Mixpanel/Amplitude (product analytics)
- Custom dashboards
- **Effort:** 2 semaines

#### 4.3 E2E Testing (Playwright) 🧪
- Critical user flows
- Visual regression testing
- CI/CD integration
- **Effort:** 3 semaines

#### 4.4 Ambassador Tools Pro 🛠️
- Zone territory management
- Direct testimony validation
- Alert promotion powers
- Contributor rewards system
- **Effort:** 4 semaines

#### 4.5 AI-Powered Features 🤖
- Auto-description amélioration photo
- Similarité photo matching
- Chatbot support avancé
- **Effort:** 6+ semaines

---

## ROADMAP VISUELLE

```
TIMELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHASE 1: QUICK WINS (1-2 semaines)
├─ Live Counters ⚡ [P0] ████████░░ 80%
├─ Reduced Motion ♿ [P0] ██████████ 100%
├─ Badges System 🏅 [P0] ████████░░ 80%
└─ Diffusion Timeline 🕐 [P1] ██████░░░░ 60%

PHASE 2: ENGAGEMENT (2-4 semaines)
├─ Morning Briefing ☀️ [P0] ████░░░░░░ 40%
├─ Activity Feed 📊 [P0] ████░░░░░░ 40%
├─ Live Status Bar 📊 [P1] ██████░░░░ 60%
└─ Mission Control 🎛️ [P1] ██░░░░░░░░ 20%

PHASE 3: POLISH (1-3 mois)
├─ Dark Mode 🌙 [P2] ░░░░░░░░░░ 0%
├─ Heatmap 🗺️ [P2] ░░░░░░░░░░ 0%
├─ Hall of Fame 🏆 [P2] ░░░░░░░░░░ 0%
├─ Professional UI 💼 [P2] ░░░░░░░░░░ 0%
├─ PWA & Gestures 📱 [P2] ░░░░░░░░░░ 0%
├─ Performance ⚡ [P1] ░░░░░░░░░░ 0%
├─ A11y Advanced ♿ [P1] ░░░░░░░░░░ 0%
└─ Multilingual 🗣️ [P3] ░░░░░░░░░░ 0%

PHASE 4: SCALE (3-6 mois)
├─ Whitelabel 🌍 [P3] ░░░░░░░░░░ 0%
├─ Analytics 📈 [P2] ░░░░░░░░░░ 0%
├─ E2E Tests 🧪 [P1] ░░░░░░░░░░ 0%
├─ Ambassador Pro 🛠️ [P2] ░░░░░░░░░░ 0%
└─ AI Features 🤖 [P3] ░░░░░░░░░░ 0%
```

---

## PRIORISATION RECOMMANDÉE

### Sprint 1 (Semaine 1-2): Foundation Émotionnelle
**Objectif:** Créer "wow moments" et conformité
- ✅ Live Counter Animations (3 jours)
- ✅ Reduced Motion Support (1 jour)
- ✅ Badge System Base (4 jours)
- ✅ Diffusion Timeline (2 jours)

**Deliverable:** Page confirmation transformée, dashboard ambassadeur avec badges

### Sprint 2-3 (Semaine 3-6): Engagement Loop
**Objectif:** Rituel quotidien + visibilité communauté
- ✅ Morning Briefing Modal (6 jours)
- ✅ Activity Feed (8 jours)
- ✅ Live Status Bar (2 jours)

**Deliverable:** Ambassadeurs reviennent tous les jours, famille voit mobilisation

### Sprint 4-5 (Semaine 7-10): Crédibilité & Trust
**Objectif:** Showcase technique pour partenariats
- ✅ Mission Control Page (10 jours)
- ✅ Performance optimizations (5 jours)
- ✅ Advanced accessibility (10 jours)

**Deliverable:** Prêt pour pitch gouvernement/ONG, WCAG AAA

### Sprint 6+ (Semaine 11+): Scale & Polish
**Objectif:** Excellence UX totale
- Dark Mode
- Heatmap
- Hall of Fame
- PWA
- Multilingual

**Deliverable:** Produit world-class, prêt expansion régionale

---

## MÉTRIQUES DE SUCCÈS

### KPIs Phase 1 (après 2 semaines)
- [ ] 80%+ ambassadeurs voient badges sur dashboard
- [ ] Temps moyen page confirmation: +30 secondes (regardent compteurs)
- [ ] 0 plaintes motion sickness (reduced motion)
- [ ] Timeline diffusion visible sur 100% confirmations

### KPIs Phase 2 (après 6 semaines)
- [ ] 60%+ ambassadeurs ouvrent Morning Briefing quotidiennement
- [ ] Streak moyen: 3+ jours consécutifs
- [ ] Activity feed: 50+ events/jour
- [ ] Live status bar: CTR 5%+ vers ambassadeurs

### KPIs Phase 3 (après 3 mois)
- [ ] Lighthouse score: 95+ (desktop), 90+ (mobile)
- [ ] Accessibilité: WCAG AA complet
- [ ] Dark mode adoption: 20%+ users
- [ ] Heatmap utilisée par 50%+ ambassadeurs

### KPIs Phase 4 (après 6 mois)
- [ ] Multi-pays: 3+ pays déployés
- [ ] Error rate: <0.1% (Sentry)
- [ ] E2E tests: 95%+ coverage critical flows
- [ ] Ambassador retention 90 jours: 70%+

---

## RISQUES & MITIGATION

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| **Overload Firebase (activity feed)** | Moyen | Élevé | Pagination, indexation optimale, cleanup vieux events |
| **Push notifications spam** | Moyen | Moyen | Rate limiting strict, opt-in zones, smart batching |
| **Morning Briefing fatigue** | Élevé | Moyen | Variable rewards, A/B test timing, skip option |
| **Badge inflation (trop facile)** | Moyen | Faible | Balance thresholds, feedback community |
| **Performance régression (animations)** | Faible | Moyen | Profiling continu, budget performance |
| **Accessibilité non-testée** | Moyen | Élevé | Audit professionnel, user testing handicaps |

---

## RESSOURCES NÉCESSAIRES

### Développement
- **Phase 1:** 1 dev fullstack (10 jours)
- **Phase 2:** 1 dev fullstack + 1 dev backend (20-27 jours)
- **Phase 3:** 2 devs fullstack (30-60 jours)
- **Phase 4:** 2-3 devs + 1 QA (60-120 jours)

### Design
- **Phase 1-2:** Pas nécessaire (suivre spec existante)
- **Phase 3:** 1 designer UX (dark mode, illustrations)
- **Phase 4:** 1 designer + 1 motion designer (animations avancées)

### Externe
- **Traductions:** Agence professionnelle (Mooré, Dioula) - Phase 3
- **Accessibilité:** Audit A11y externe - Phase 3
- **Infrastructure:** DevOps pour scale - Phase 4

### Budget Estimé
- **Phase 1:** ~5,000 EUR (dev junior)
- **Phase 2:** ~15,000 EUR (dev senior)
- **Phase 3:** ~30,000 EUR (équipe + audit)
- **Phase 4:** ~60,000 EUR (équipe + infra)

**Total:** ~110,000 EUR pour roadmap complète (6 mois)

---

## CONCLUSION

**État actuel:** 63% (C+) - Fondation solide mais engagement faible
**Phase 1 target:** 72% (B-) - Quick wins émotionnels
**Phase 2 target:** 85% (B+) - Engagement quotidien installé
**Phase 3 target:** 92% (A-) - Excellence UX
**Phase 4 target:** 98% (A+) - World-class product

**Prochaine action recommandée:**
1. Valider roadmap avec stakeholders
2. Démarrer Sprint 1 (Phase 1)
3. Setup tracking métriques (KPIs)
4. Recruter ressources dev si nécessaire

**Date de fin estimée (Phase 1-2):** 6-8 semaines à partir de maintenant
**Date de fin complète (Phase 1-4):** 6 mois

---

**Document complet. Prêt pour implémentation.**

**Auteur:** Swabo
**Date:** 2026-04-02
**Statut:** ✅ ROADMAP VALIDÉE
