---
stepsCompleted: ["step-01-init", "step-02-context", "step-03-starter", "step-04-decisions", "step-05-patterns"]
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - '_bmad-output/planning-artifacts/about-enfantperdu-bf.md'
  - '_bmad-output/planning-artifacts/prd-validation-report.md'
workflowType: 'architecture'
project_name: 'EnfantPerdu.bf'
user_name: 'Swabo'
date: '2026-03-29'
---

# Architecture Decision Document - EnfantPerdu.bf

_Ce document se construit collaborativement à travers une découverte étape par étape. Les sections sont ajoutées au fur et à mesure que nous travaillons ensemble sur chaque décision architecturale._

**Auteur:** Swabo
**Date:** 2026-03-29
**Projet:** EnfantPerdu.bf

---

## Analyse du Contexte Projet

### Vue d'Ensemble des Exigences

**Fonctionnalités Principales:**

EnfantPerdu.bf est une plateforme PWA mobile-first de signalement et recherche d'enfants disparus au Burkina Faso avec 47 Functional Requirements organisés en 10 domaines:

1. **Gestion Signalements** (FR1-7): Formulaire rapide, upload photo, génération affiche automatique, archivage
2. **Notifications & Diffusion** (FR8-13): Push géolocalisés < 30s, ciblage ville/quartier, compteurs live, batch 10K
3. **Messagerie & Témoignages** (FR14-18): Participation sans compte, badges rôles, coordination temps réel
4. **Gestion Utilisateurs** (FR19-23): 4 rôles (Visiteur, Famille, Ambassadeur, Admin), permissions différenciées
5. **Coordination Ambassadeurs** (FR24-29): Dashboard, Morning Briefing, modération, carte interactive
6. **Gamification** (FR30-33): Points, streaks, leaderboard, badges accomplissements
7. **Partenaires & Institutionnel** (FR34-37): Page Impact, rapports exportables, formulaires partenariat
8. **Assistance** (FR38-39): Chatbot IA, partage social
9. **Administration Système** (FR40-43): Métriques techniques, logs, alertes anomalies, configuration
10. **Sécurité & Conformité** (FR44-47): Compression photos, suppression métadonnées localisation, filigrane, rétention 5 ans

**Exigences Non-Fonctionnelles Critiques:**

**Performance (8 NFRs):**
- FCP < 1.5s sur connexion 3G (Burkina Faso)
- LCP < 2.5s, TTI < 3.5s, CLS < 0.1
- Lighthouse Mobile > 80
- Bundle initial < 200KB (bande passante limitée)
- Notifications push < 30s après publication
- Batch 10,000 notifications < 2 min

**Scalabilité (5 NFRs):**
- Support 100,000 abonnés push (objectif 12 mois)
- 500 annonces actives simultanées
- 1,000 messages par annonce
- Pic trafic 10x baseline (annonce virale)
- Dégradation gracieuse < 20% latence sous charge max

**Sécurité (7 NFRs):**
- Chiffrement transit (protocole standard actuel)
- Chiffrement repos AES-256
- Suppression 100% métadonnées localisation photos
- Accès coordonnées famille: Ambassadeurs uniquement
- Logs d'accès 90 jours (audit trail)
- Rate limiting 100 req/min/IP
- Rétention données archivées 5 ans max

**Accessibilité (7 NFRs):**
- WCAG 2.1 AA conformité obligatoire
- Contraste 4.5:1 minimum
- Touch targets 44x44px minimum
- Focus clavier visible
- Alt text 100% images
- Labels formulaires explicites
- Support prefers-reduced-motion

**Intégration (5 NFRs):**
- Service push > 99% disponibilité
- Taux délivrabilité push > 95%
- Latence base de données temps réel < 200ms
- Partage 5 plateformes (Facebook, WhatsApp, X, Instagram, LinkedIn)
- Cache ressources hors-ligne (page accueil, assets)

**Fiabilité (5 NFRs):**
- Uptime plateforme > 99.5%
- RTO < 1 heure
- RPO < 15 min
- Alertes anomalies < 5 min
- Backup quotidien (base de données + stockage fichiers)

### Échelle & Complexité

**Domaine Technique Principal:** Full-Stack Web Application (PWA mobile-first)

**Niveau de Complexité:** **HAUTE**

**Justification:**
- Système distribué avec temps réel critique (compteurs live, notifications instantanées)
- Scalabilité massive (100K utilisateurs, batch 10K notifications < 2 min)
- Conformité réglementaire stricte (civic_tech, protection données enfants mineurs)
- Optimisation réseau extrême (3G Burkina Faso, bundle < 200KB)
- Intégrations multi-plateformes complexes (5 réseaux sociaux, push, géolocalisation)
- Gestion utilisateurs sophistiquée (4 rôles, permissions granulaires, validation ambassadeurs)

**Composants Architecturaux Estimés:** 12-15 composants principaux

### Contraintes Techniques & Dépendances

**Contraintes Critiques:**

1. **Réseau & Performance:**
   - Optimisation obligatoire 3G (connexions lentes Burkina Faso)
   - Bundle initial < 200KB strict
   - First load < 1.5s sur 3G

2. **Plateforme & Compatibilité:**
   - PWA requis (installable, offline-capable, push notifications)
   - Browser support: Chrome Android 80+, Safari iOS 14+ (critique)
   - 6 breakpoints responsive (320px → 1280px+)

3. **Accessibilité & Inclusion:**
   - WCAG 2.1 AA non-négociable
   - Mobile-first obligatoire (60% utilisateurs mobiles)
   - Sans friction: fonctionnalités publiques sans compte

4. **Sécurité & Conformité:**
   - Données sensibles enfants (protection renforcée)
   - Aucune fuite métadonnées localisation (suppression EXIF 100%)
   - Audit trails obligatoires (logs 90 jours)
   - Rétention données 5 ans max (conformité cycle de vie)

5. **Temps Réel & Latence:**
   - Compteurs live < 200ms latence base de données
   - Notifications push < 30s délai
   - Synchronisation multi-utilisateurs temps réel

**Dépendances Externes Critiques:**

- **Service Push Notifications** (> 99% uptime, batch 10K < 2 min, délivrabilité > 95%)
- **Base de Données Temps Réel** (latence < 200ms, 100K utilisateurs concurrent)
- **Stockage Fichiers** (compression automatique, suppression métadonnées, backup quotidien)
- **APIs Réseaux Sociaux** (5 plateformes: Facebook, WhatsApp, X, Instagram, LinkedIn)
- **Service Géolocalisation/Cartes** (zones recherche, ciblage ville/quartier)
- **CDN Global** (assets statiques, optimisation 3G)

### Cross-Cutting Concerns Identifiés

**1. Authentification & Autorisation**
- 4 rôles avec permissions différenciées (Visiteur anonyme, Famille, Ambassadeur validé, Admin)
- Fonctionnalités publiques sans compte (signaler enfant, poster témoignage, consulter annonces)
- Validation manuelle ambassadeurs (< 48h SLA)
- Contrôle accès coordonnées famille (Ambassadeurs uniquement)

**2. Notifications & Alertes Temps Réel**
- Push notifications géolocalisées (ciblage ville/quartier)
- Batch notifications massives (10K < 2 min)
- Alertes admin anomalies (< 5 min détection)
- Notifications famille nouveaux témoignages (< 30s)

**3. Synchronisation & Données Temps Réel**
- Compteurs live multi-utilisateurs (personnes notifiées, partages, vues)
- Mise à jour statut annonces (archivage automatique enfant retrouvé)
- Fil messages temps réel (témoignages, coordination ambassadeurs)
- Dashboard live (Morning Briefing, cas actifs, statistiques)

**4. Sécurité, Compliance & Audit**
- Chiffrement données sensibles (transit + repos)
- Suppression métadonnées localisation 100% photos
- Audit trails complets (logs accès 90 jours)
- Rate limiting anti-spam (100 req/min/IP)
- Rétention données conforme (5 ans archivées, suppression automatique)

**5. Performance & Optimisation Mobile**
- Compression images automatique (upload photos enfants)
- Lazy loading (images hors viewport)
- Bundle splitting intelligent (< 200KB initial)
- Cache offline Service Worker (page accueil, assets critiques)
- CDN assets statiques (optimisation 3G)

**6. Intégrations Externes & APIs**
- Auto-diffusion 5 réseaux sociaux (< 60s post publication)
- Service push notifications (OneSignal ou équivalent)
- Géolocalisation/cartes interactives (zones recherche)
- Analytics & monitoring (métriques techniques, alertes)
- Exports partenaires (rapports impact PDF/Excel)

---

Ces préoccupations transversales affecteront toutes les décisions architecturales et doivent être considérées dans chaque composant du système.

## Stack Technique Existante

### Vue d'Ensemble

Le projet EnfantPerdu.bf utilise une architecture **Next.js App Router** avec Firebase comme backend, optimisée pour les performances mobiles (3G) et la scalabilité.

### Décisions Architecturales Établies

#### **Language & Runtime**

- **TypeScript 5** en mode strict
  - Target: ES2017 pour compatibilité navigateurs
  - Path aliases: `@/*` → `./src/*`
  - Strict null checks et type safety activés
  
**Rationale:** TypeScript assure la cohérence du code entre agents AI et détecte les erreurs à la compilation.

#### **Framework Frontend**

- **Next.js 15.2.0** (App Router)
  - Server Components par défaut
  - API Routes pour endpoints backend
  - Image optimization avec next/image
  - Remote patterns: Firebase Storage
  
**Rationale:** App Router optimise les performances avec Server Components et simplifie le data fetching.

#### **UI Library & Styling**

- **React 19.0.0** avec composition de composants
- **Tailwind CSS 3.4.17**
  - Custom colors: `brand-{red|orange|green}`
  - Font: Inter (system fallback)
  - Utility-first approach
  
**Rationale:** Tailwind accélère le développement mobile-first et réduit le CSS custom.

#### **Backend & Database**

- **Firebase 11.3.0** (client-side)
  - Firestore: Base de données temps réel
  - Storage: Images enfants + assets
  - Auth: Authentification (future)
  
- **Firebase Admin 13.7.0** (server-side)
  - API routes sécurisées
  - Operations admin
  
**Rationale:** Firebase offre scalabilité automatique et temps réel natif (FR8, FR23).

#### **Push Notifications**

- **OneSignal** via react-onesignal 3.5.1
  - Service Worker configuré (`/OneSignalSDKWorker.js`)
  - Segmentation géographique (zones)
  - "Visit once, alert forever" model
  
**Rationale:** OneSignal permet envoi massif de notifications sans app native (NFR-I1 > 99% uptime).

#### **Geolocalisation**

- **@react-google-maps/api 2.20.8**
  - Sélection de zones géographiques
  - Carte interactive dernière position connue
  
**Rationale:** Google Maps API offre précision et familiarité UX (FR6, FR7).

#### **Forms & Validation**

- **react-hook-form 7.54.2**
  - Validation côté client
  - Performance optimisée (re-renders minimaux)
  - Integration avec TypeScript types
  
**Rationale:** Formulaires critiques (signalement) nécessitent validation robuste et UX fluide.

#### **Testing Framework**

- **Vitest 4.1.0** + React Testing Library 16.3.2
  - Tests unitaires composants
  - Tests intégration utils
  - Coverage reporting
  
**Rationale:** Vitest est rapide et natif ESM (compatible Next.js 15).

#### **Security Headers**

Configuration Next.js `headers()`:
- **CSP**: Script-src limité à CDN fiables (OneSignal, Firebase, Google)
- **X-Frame-Options**: SAMEORIGIN (anti-clickjacking)
- **X-Content-Type-Options**: nosniff
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Permissions-Policy**: Géolocalisation self uniquement

**Rationale:** Conformité NFR-S1 à NFR-S6 (sécurité, RGPD, données sensibles).

#### **Project Structure**

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage (FR1: flux annonces)
│   ├── signaler/          # Formulaire signalement (FR2-FR7)
│   ├── annonce/[code]/    # Page annonce (FR13-FR19)
│   ├── admin/             # Interface admin (FR38-FR42)
│   └── api/               # API routes backend
├── components/            # Composants réutilisables
│   ├── AnnouncementCard   # Card annonce (FR1)
│   ├── ChatBot            # Assistant IA (FR45-FR47)
│   ├── StatsBar           # Compteurs live (FR16)
│   └── ShareButtons       # Partage social (FR14)
├── lib/                   # Business logic
│   ├── firebase.ts        # Config Firebase client
│   ├── firebase-admin.ts  # Config Firebase admin
│   ├── firestore.ts       # Helpers Firestore
│   ├── zones.ts           # Gestion zones géographiques
│   └── auth.ts            # Authentification admin
├── types/                 # TypeScript definitions
│   ├── announcement.ts    # Type Announcement
│   └── ambassador.ts      # Type Ambassador
└── __tests__/             # Tests Vitest
```

**Rationale:** Séparation claire client/server, colocation composants/logic, types centralisés.

#### **Environment Configuration**

Variables d'environnement requises:
- `NEXT_PUBLIC_FIREBASE_*` - Config Firebase client
- `NEXT_PUBLIC_ONESIGNAL_APP_ID` - OneSignal app
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps
- `NEXT_PUBLIC_CHATBOT_API_URL` - API chatbot externe
- `ADMIN_PASSWORD` - Mot de passe admin (server-only)

**Rationale:** Variables `NEXT_PUBLIC_*` exposées client, autres server-only (sécurité).

#### **Deployment Platform**

- **Vercel**
  - Edge Functions pour API routes
  - CDN global pour assets statiques
  - Preview deployments pour PR
  - Analytics et monitoring intégrés

**Rationale:** Vercel optimisé pour Next.js, déploiement automatique, serverless scalable.

### Patterns de Développement Établis

1. **Server Components First**: Utiliser Server Components par défaut, Client Components (`'use client'`) uniquement si interactivité requise
2. **Type Safety**: Tous les props, functions, et API responses typés TypeScript
3. **Mobile-First**: Design responsive Tailwind, tester sur viewport 375px minimum
4. **Error Boundaries**: `error.tsx` et `global-error.tsx` pour capture erreurs
5. **Loading States**: `loading.tsx` dans chaque route segment
6. **API Routes**: Toutes les operations Firestore Admin via API routes (sécurité)

### Intégrations 3rd-Party

- **Facebook Graph API**: Diffusion automatique annonces (FR33-FR35)
- **WhatsApp Business API**: Envoi sur chaîne WhatsApp (FR34)
- **OpenClaw Chatbot**: Assistant IA externe hébergé (FR45-FR47)

### Limitations & Contraintes Techniques

- **3G Optimization**: Bundle size < 200KB initial (NFR-P3)
- **PWA Required**: Service Worker OneSignal bloque installations PWA custom
- **Real-time**: Firestore listeners pour stats live (FR16)
- **WCAG 2.1 AA**: Contraste, navigation clavier, screen readers (NFR-A1-NFR-A3)

---

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Already Implemented):**
- Database: Firestore (temps réel natif, NoSQL)
- Frontend Framework: Next.js 15.2.0 App Router
- Language: TypeScript 5 (strict mode)
- Hosting: Vercel (serverless, automatic scaling)
- Push Notifications: OneSignal (batch 10K, segmentation géographique)

**Important Decisions (Shape Architecture):**
- State Management: React hooks + Firestore listeners (pas de store centralisé)
- Styling: Tailwind CSS utility-first
- Forms: react-hook-form avec validation client
- Testing: Vitest + React Testing Library
- Security: CSP headers, Firebase Auth, role-based access

**Deferred Decisions (Post-MVP):**
- API Documentation: Swagger/OpenAPI (peut être ajouté plus tard)
- E2E Testing: Playwright/Cypress (tests manuels pour l'instant)
- Advanced Monitoring: Sentry/LogRocket (Vercel Analytics suffit MVP)
- Structured Logging: Winston/Pino (console.log suffit MVP)

---

### 1. Data Architecture

#### **Database Choice**

**Decision:** Firestore (Firebase 11.3.0)

**Rationale:**
- Temps réel natif requis pour compteurs live (FR16: notifications envoyées, partages, vues)
- Scalabilité automatique jusqu'à 100K utilisateurs (NFR-SC1)
- Latence < 200ms garantie (NFR-I3)
- NoSQL flexible pour évolution rapide du schéma
- Intégration native avec Firebase Storage et Auth

**Collections principales:**
- `announcements` - Annonces enfants disparus
- `ambassadors` - Ambassadeurs validés
- `zones` - Zones géographiques (Ouagadougou, etc.)
- `messages` - Témoignages et coordination (sous-collection)
- `stats` - Compteurs live par annonce

**Affects:** FR8, FR16, FR23, NFR-P4, NFR-SC1-SC5, NFR-I3

---

#### **Data Modeling Approach**

**Decision:** NoSQL document-oriented avec sous-collections

**Pattern:**
```typescript
announcements/{shortCode}/
  - childName, childAge, lastSeenAt, etc.
  - messages/{messageId}/ - Sous-collection témoignages
  - stats/ - Compteurs live (vues, partages, notifications)

ambassadors/{ambassadorId}/
  - name, phone, zones[], approvedAt, etc.
  - referralStats/ - Statistiques QR code tracking
```

**Rationale:**
- Sous-collections évitent documents > 1MB (limite Firestore)
- Permet 1,000 messages par annonce (NFR-SC3)
- Isolation données sensibles (coordonnées famille)
- Queries efficaces avec index Firestore

**Affects:** FR1-FR47 (toutes les features)

---

#### **Data Validation Strategy**

**Decision:** Validation double (client + server)

**Client-side:**
- react-hook-form 7.54.2 avec TypeScript schemas
- Validation synchrone avant submit
- UX immédiate (messages erreur inline)

**Server-side:**
- API Routes Next.js avec Firebase Admin SDK
- Validation TypeScript types + runtime checks
- Rate limiting 100 req/min/IP (NFR-S4)

**Rationale:**
- Client-side: UX fluide, feedback immédiat
- Server-side: Sécurité, protection contre manipulation
- Double validation critique pour données sensibles enfants

**Affects:** FR2-FR7 (signalement), FR24 (candidature ambassadeur)

---

#### **Caching Strategy**

**Decision:** Multi-layer caching

**Layers:**
1. **Service Worker**: OneSignal cache page accueil + assets (NFR-I5)
2. **CDN Vercel**: Assets statiques (images, fonts, scripts)
3. **Browser Cache**: Images Firebase Storage (cache-control headers)
4. **No Application Cache**: Firestore real-time = toujours fresh data

**Rationale:**
- Service Worker cache hors-ligne pour PWA
- CDN réduit latency 3G (Burkina Faso)
- Pas de cache applicatif pour éviter stale data (compteurs live)

**Affects:** NFR-P1-P3 (performance 3G), NFR-I5 (offline)

---

### 2. Authentication & Security

#### **Authentication Method**

**Decision:** Firebase Auth (préparé, pas encore activé)

**Future Implementation:**
- Phone authentication (SMS OTP) pour familles
- Email/password pour ambassadeurs et admin
- Anonymous auth pour visiteurs (fonctionnalités publiques)

**Current State:**
- Pas d'auth requise pour signalement (FR2: sans friction)
- ADMIN_PASSWORD pour routes API admin
- Token secret pour gestion annonces (generate unique token)

**Rationale:**
- Phone auth adapté au contexte Burkina Faso
- Anonymous auth préserve "visit once, alert forever"
- Pas d'auth = zéro friction signalement (critique UX)

**Affects:** FR19-FR23 (rôles), FR40-FR42 (admin)

---

#### **Authorization Patterns**

**Decision:** Role-Based Access Control (RBAC)

**Roles:**
1. **Visiteur** (anonyme): Consulter annonces, poster témoignages, signaler enfant
2. **Famille**: Gérer son annonce, voir stats détaillées
3. **Ambassadeur**: Coordonner recherches, modérer messages, accès coordonnées
4. **Admin**: Toutes permissions, validation ambassadeurs, métriques système

**Implementation:**
- Types TypeScript (src/types/ambassador.ts, src/types/announcement.ts)
- Firestore Security Rules (à créer)
- API Routes middleware checks

**Rationale:**
- 4 rôles couvrent tous les use cases PRD
- Permissions granulaires (ex: coordonnées = Ambassadeurs uniquement)
- Évolutif (nouveaux rôles faciles à ajouter)

**Affects:** FR19-FR23, FR27 (modération), NFR-S3 (accès données)

---

#### **Security Middleware**

**Decision:** Next.js middleware + CSP headers

**Implementation:**
- CSP headers dans next.config.ts
- Rate limiting dans src/lib/rate-limit.ts
- Admin auth dans src/lib/auth.ts

**Security Measures:**
- X-Frame-Options: SAMEORIGIN (anti-clickjacking)
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: Geolocation self uniquement
- Rate limiting: 100 req/min/IP

**Rationale:**
- CSP empêche XSS (NFR-S1)
- Rate limiting empêche spam/DoS (NFR-S4)
- Headers conformes OWASP best practices

**Affects:** NFR-S1-S7 (toutes les NFRs sécurité)

---

#### **Data Encryption Approach**

**Decision:** Encryption automatique Firebase

**Transit:**
- TLS 1.3 automatique (Firebase, Vercel)
- HTTPS obligatoire (next.config force upgrade)

**At-Rest:**
- AES-256 automatique Firestore (NFR-S2)
- Firebase Storage encryption automatique

**Metadata Stripping:**
- EXIF removal 100% photos uploadées (NFR-S3)
- Implémentation dans upload handler (à créer)

**Rationale:**
- Firebase gère encryption (pas de custom implementation)
- EXIF removal critique: empêche leak localisation enfant
- Conformité protection données enfants mineurs

**Affects:** NFR-S1-S3, FR44 (compression photos)

---

### 3. API & Communication Patterns

#### **API Design Pattern**

**Decision:** REST-like via Next.js API Routes

**Structure:**
```
src/app/api/
├── ambassador/
│   ├── submit/route.ts      # POST - Candidature ambassadeur
│   ├── approve/route.ts     # POST - Validation admin
│   ├── reject/route.ts      # POST - Rejet candidature
│   └── stats/route.ts       # GET - Stats ambassadeur
├── admin/
│   ├── verify-password/     # POST - Auth admin
│   └── delete-announcement/ # DELETE - Suppression annonce
└── dev/
    └── seed-stats/          # POST - Dev seeding
```

**Conventions:**
- HTTP verbs: GET (read), POST (create/action), DELETE (remove)
- JSON payloads
- TypeScript types pour request/response
- Error responses: `{ error: string, code?: number }`

**Rationale:**
- REST simple, familier, bien supporté
- Next.js API Routes = serverless automatic scaling
- Pas besoin GraphQL (queries simples, pas de over-fetching)

**Affects:** FR24 (candidature), FR40-42 (admin), intégrations externes

---

#### **API Documentation Approach**

**Decision:** TypeScript types as documentation (MVP)

**Current State:**
- Types dans `/src/types/` servent de contrat
- Pas de Swagger/OpenAPI pour l'instant

**Future:**
- Ajouter OpenAPI si API publique partenaires (FR34-FR36)
- tRPC ou Zodios si complexité augmente

**Rationale:**
- Types TypeScript suffisent pour agents AI (lisent code directement)
- API pas encore publique (pas de partenaires externes)
- Overhead OpenAPI non justifié MVP

**Affects:** FR34-FR36 (partenaires), documentation agents AI

---

#### **Error Handling Standards**

**Decision:** Error Boundaries React + API error responses

**Frontend:**
- `error.tsx` dans chaque route segment
- `global-error.tsx` pour erreurs non catchées
- Toast notifications (react-hot-toast) pour erreurs user-facing

**Backend:**
- Try/catch dans API routes
- Status codes HTTP standards (400, 401, 403, 404, 500)
- Error logging vers console (Vercel logs)

**Pattern:**
```typescript
try {
  // Operation
} catch (error) {
  console.error('[API Error]', error);
  return Response.json({ error: 'Message user-friendly' }, { status: 500 });
}
```

**Rationale:**
- Error boundaries empêchent crash app entière
- Status codes standards facilitent debugging
- Toast UX > alert() JavaScript

**Affects:** Toutes les features (résilience)

---

#### **Rate Limiting Strategy**

**Decision:** IP-based rate limiting 100 req/min

**Implementation:**
- src/lib/rate-limit.ts avec Map in-memory
- Applied dans API routes critiques (submit, upload)
- 429 Too Many Requests si dépassé

**Limitations:**
- In-memory (reset au redémarrage serverless)
- Pas de distributed rate limiting (acceptable MVP)

**Future:**
- Redis/Upstash si besoin persistent rate limiting
- Par user ID au lieu de IP (après auth)

**Rationale:**
- Empêche spam signalements (NFR-S4)
- In-memory suffisant pour trafic MVP
- 100 req/min = balance protection vs UX

**Affects:** NFR-S4 (rate limiting), protection spam

---

### 4. Frontend Architecture

#### **State Management Approach**

**Decision:** React hooks + Firestore real-time listeners (pas de store global)

**Pattern:**
```typescript
// Component utilise Firestore directement
const [announcements, setAnnouncements] = useState<Announcement[]>([]);

useEffect(() => {
  const unsubscribe = onSnapshot(
    query(collection(db, 'announcements'), where('status', '==', 'active')),
    (snapshot) => setAnnouncements(snapshot.docs.map(doc => doc.data()))
  );
  return unsubscribe;
}, []);
```

**Why no Redux/Zustand:**
- Firestore listeners = source of truth
- Pas de state complexe à partager entre components
- Real-time sync automatique (pas de manual sync)

**Rationale:**
- Simplicité (moins de boilerplate)
- Real-time natif (compteurs live FR16)
- Performance (Firestore cache local automatique)

**Affects:** FR1, FR16 (compteurs live), FR23 (dashboard)

---

#### **Component Architecture**

**Decision:** Functional components, Server Components first

**Patterns:**
- **Server Components** (default): Pages, layouts, composants statiques
- **Client Components** (`'use client'`): Interactivité (forms, maps, chatbot)
- **Composition**: Petits composants réutilisables (src/components/)

**Organization:**
```
components/
├── ui/              # Primitives (Badge, etc.)
├── forms/           # Form components (FormField)
├── AnnouncementCard.tsx
├── ChatBot.tsx
├── StatsBar.tsx
└── ShareButtons.tsx
```

**Rationale:**
- Server Components = performance (moins de JS client)
- Composition = réutilisabilité, testabilité
- Flat structure = facile à naviguer (< 50 components)

**Affects:** Toutes les pages, NFR-P3 (bundle < 200KB)

---

#### **Routing Strategy**

**Decision:** Next.js App Router (file-based)

**Structure:**
```
app/
├── page.tsx                    # / - Homepage
├── signaler/page.tsx          # /signaler - Formulaire
├── annonce/[shortCode]/       # /annonce/EPB-XXX - Page annonce
├── admin/                     # /admin/* - Interface admin
└── api/                       # /api/* - Backend routes
```

**Features:**
- Dynamic routes: `[shortCode]`, `[zoneId]`
- Layouts imbriqués: `signaler/layout.tsx`
- Loading states: `loading.tsx`
- Error boundaries: `error.tsx`

**Rationale:**
- File-based = intuitif, découvrable
- Layouts évitent duplication (header, footer)
- Automatic code splitting par route

**Affects:** Navigation, NFR-P3 (bundle splitting)

---

#### **Performance Optimization**

**Decision:** Multi-strategy optimization

**Strategies:**
1. **Server Components**: Reduce client JS (default)
2. **next/image**: Automatic optimization, lazy loading
3. **Code splitting**: Automatic par route
4. **Compression**: Gzip/Brotli automatique Vercel
5. **Fonts**: Inter via next/font (self-hosted)

**Monitoring:**
- Lighthouse CI (target mobile > 80)
- Vercel Analytics (Core Web Vitals)

**Rationale:**
- 3G optimization critique (Burkina Faso)
- Bundle < 200KB requis (NFR-P3)
- FCP < 1.5s, LCP < 2.5s (NFR-P1, NFR-P2)

**Affects:** NFR-P1-P8 (toutes les NFRs performance)

---

#### **Bundle Optimization**

**Decision:** Next.js automatic splitting + lazy loading

**Techniques:**
- Route-based splitting (automatique)
- Dynamic imports pour heavy components
- Tree shaking (automatic)
- No moment.js (date-fns instead, plus léger)

**Bundle targets:**
- Initial: < 200KB (NFR-P3)
- Per route: < 100KB
- Images: WebP avec fallback, lazy load

**Rationale:**
- Bande passante limitée 3G Burkina Faso
- Lighthouse mobile > 80 requis (NFR-P7)
- TTI < 3.5s critique UX mobile (NFR-P6)

**Affects:** NFR-P3, NFR-P6, NFR-P7

---

### 5. Infrastructure & Deployment

#### **Hosting Strategy**

**Decision:** Vercel (serverless)

**Features:**
- Automatic deployments (Git push)
- Edge Functions (API routes)
- CDN global (assets statiques)
- Preview deployments (PR)
- Vercel Analytics (Core Web Vitals)

**Rationale:**
- Next.js official platform (optimisé)
- Serverless = scaling automatique (NFR-SC1-SC5)
- CDN global = latency réduite 3G
- Zero config (pas d'ops)

**Affects:** NFR-SC1-SC5 (scalabilité), NFR-R1 (uptime > 99.5%)

---

#### **CI/CD Pipeline Approach**

**Decision:** Vercel automatic deployments

**Workflow:**
```
Git push → Vercel build → Deploy preview (PR) ou production (main)
```

**Stages:**
1. Install deps (npm ci)
2. TypeScript check (tsc --noEmit)
3. Lint (next lint)
4. Build (next build)
5. Deploy (Vercel)

**No separate CI:**
- Vercel fait tout automatiquement
- Pas besoin GitHub Actions pour build

**Future:**
- Ajouter tests dans Vercel build (`npm test`)

**Rationale:**
- Simplicité (zero config)
- Déploiements rapides (< 2 min)
- Preview URLs pour chaque PR

**Affects:** Velocity développement, NFR-R1 (uptime)

---

#### **Environment Configuration**

**Decision:** .env.local + Vercel environment variables

**Structure:**
```
.env.local (dev local):
- NEXT_PUBLIC_FIREBASE_*
- NEXT_PUBLIC_ONESIGNAL_APP_ID
- NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
- NEXT_PUBLIC_CHATBOT_API_URL
- ADMIN_PASSWORD

Vercel (production):
- Mêmes variables configurées dans dashboard
- Secrets: ADMIN_PASSWORD (pas dans Git)
```

**Rationale:**
- NEXT_PUBLIC_* = exposé client (safe)
- ADMIN_PASSWORD = server-only (sécurisé)
- Vercel env vars = per environment (dev, preview, prod)

**Affects:** Configuration, sécurité

---

#### **Monitoring and Logging**

**Decision:** Vercel Analytics + console.log (MVP)

**Current:**
- Vercel Analytics: Core Web Vitals, errors frontend
- Console.log: API routes logs (Vercel dashboard)
- No structured logging (Winston, Pino)

**Future (si besoin):**
- Sentry: Error tracking + alerting
- LogRocket: Session replay
- Custom structured logging

**Rationale:**
- Vercel Analytics suffit MVP (NFR-R4: alertes < 5 min)
- Console.log visible dans Vercel logs (RTO < 1h)
- Overhead Sentry non justifié sans trafic

**Affects:** NFR-R4 (alertes anomalies), debugging

---

#### **Scaling Strategy**

**Decision:** Serverless automatic scaling

**Components:**
- **Vercel**: Automatic scaling fonctions serverless
- **Firebase**: Automatic scaling Firestore + Storage
- **OneSignal**: Scaling notifications (batch 10K garanti)

**No manual scaling:**
- Pas de load balancer
- Pas de Kubernetes
- Pas de server provisioning

**Capacity:**
- Vercel: Illimité (pay-per-use)
- Firestore: 100K concurrent users (NFR-SC1)
- OneSignal: 10K batch < 2 min (NFR-SC2, NFR-P5)

**Rationale:**
- Serverless = zero ops
- Auto-scaling = handle pic trafic 10x (NFR-SC4)
- Pay-per-use = cost-efficient MVP

**Affects:** NFR-SC1-SC5 (scalabilité), NFR-R1 (uptime)

---

### Decision Impact Analysis

#### **Implementation Sequence**

**Phase 1 - Foundation (Déjà implémenté):**
1. ✅ Next.js + TypeScript setup
2. ✅ Firebase configuration (Firestore, Storage)
3. ✅ Tailwind CSS + design system
4. ✅ Next.js API Routes structure
5. ✅ OneSignal integration

**Phase 2 - Core Features (En cours):**
6. ✅ Formulaire signalement (react-hook-form)
7. ✅ Page annonce + compteurs live
8. ✅ Interface admin
9. 🚧 Candidature ambassadeurs
10. 🚧 Diffusion automatique réseaux sociaux

**Phase 3 - Advanced (Future):**
11. ⏳ Dashboard ambassadeur
12. ⏳ Gamification (points, leaderboard)
13. ⏳ Partenaires (rapports, exports)
14. ⏳ E2E tests, monitoring avancé

---

#### **Cross-Component Dependencies**

**Firestore → Toutes les features:**
- Annonces, ambassadeurs, zones, messages = tout stocké Firestore
- Real-time listeners = compteurs live, dashboard, notifications

**OneSignal → Notifications:**
- Segmentation géographique dépend de zones Firestore
- Batch notifications requiert API OneSignal

**Firebase Storage → Photos:**
- Upload photos = dépendance Storage
- EXIF removal avant upload (critique sécurité)

**API Routes → Admin:**
- Toutes operations admin passent par API routes
- ADMIN_PASSWORD requis pour auth

**TypeScript → Tout:**
- Types centralisés dans `/src/types/`
- Contrat entre frontend/backend/Firestore

---
## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 28 areas où les agents AI pourraient faire des choix différents sans ces règles.

---

### 1. Naming Patterns

#### **TypeScript Types & Interfaces**

**Rules:**
- Type aliases: PascalCase (`AnnouncementStatus`, `ChildGender`, `AnnouncementType`)
- Interfaces: PascalCase (`Announcement`, `Ambassador`, `Zone`, `Sighting`)
- Input interfaces: PascalCase + `Input` suffix (`CreateAnnouncementInput`, `SubmitApplicationInput`)
- Result interfaces: PascalCase + `Result` suffix (`SubmitApplicationResult`, `ApproveAmbassadorResult`)
- Enum-like types: Union of string literals (`"active" | "resolved" | "archived"`)

**Examples:**
```typescript
// ✅ CORRECT
export type AnnouncementStatus = "active" | "resolved" | "archived";
export interface Announcement { ... }
export interface CreateAnnouncementInput { ... }
export interface SubmitApplicationResult { ... }

// ❌ INCORRECT
export type announcement_status = "active" | "resolved";
export interface announcementInput { ... }
export type CreateAnnouncementData = { ... }; // Use interface instead
```

**Rationale:** PascalCase cohérent avec conventions TypeScript, suffixes Input/Result clarissent l'usage.

---

#### **Functions & Methods**

**Rules:**
- Function names: camelCase
- Read operations: `get` prefix (`getAnnouncementByShortCode`, `getAmbassadorByPhone`)
- Create operations: `create` prefix (`createAnnouncement`, `createSighting`)
- Update operations: `update` prefix (`updateAnnouncement`, `updateDoc`)
- Delete operations: `delete` or `remove` prefix (none yet, but would be `deleteAnnouncement`)
- Real-time listeners: `subscribe` prefix + `Unsubscribe` return (`subscribeToActiveAnnouncements`)
- Atomic operations: action verb (`increment`, `resolve`, `approve`, `reject`)
- Boolean helpers: `is` prefix (`isMinimumAge`, `isSecureID`)
- Validation helpers: `validate` prefix (`validateZoneHierarchy`)
- Transformation helpers: action verb (`normalizePhone`, `maskPhone`, `generateShortCode`)

**Examples:**
```typescript
// ✅ CORRECT
export async function getAnnouncementByShortCode(shortCode: string): Promise<Announcement | null>
export async function createAnnouncement(input: CreateAnnouncementInput): Promise<{...}>
export function subscribeToActiveAnnouncements(callback: ..., ...): Unsubscribe
export async function incrementPageViews(announcementId: string): Promise<void>
export function isMinimumAge(dob: Date, minAge: number): boolean
export function normalizePhone(phone: string): string

// ❌ INCORRECT
export async function announcement_get(shortCode: string)  // Wrong case & order
export async function newAnnouncement(...)  // Use "create" prefix
export function listenAnnouncements(...)  // Use "subscribe" prefix
export function checkAge(...)  // Use "is" prefix for boolean
```

**Rationale:** Prefixes clairs = pattern prévisible pour tous les agents AI, évite confusion.

---

#### **Variables & Constants**

**Rules:**
- Local variables: camelCase (`normalizedPhone`, `shortCode`, `refCode`)
- Global constants: UPPER_SNAKE_CASE (`MAX_ZONES_PER_AMBASSADOR`, `RATE_LIMIT`, `ACCESS_TOKEN_EXPIRY_DAYS`)
- File-scoped constants: UPPER_SNAKE_CASE
- Magic numbers: Extract to named constants

**Examples:**
```typescript
// ✅ CORRECT
const normalizedPhone = normalizePhone(input.phone);
const MAX_ZONES_PER_AMBASSADOR = 5;
const RATE_LIMIT = { windowMs: 60 * 60 * 1000, max: 3 };

// ❌ INCORRECT
const NormalizedPhone = normalizePhone(input.phone);  // Wrong case
const max_zones = 5;  // Should be UPPER_SNAKE_CASE
if (data.zones.length >= 5)  // Use MAX_ZONES_PER_AMBASSADOR constant
```

**Rationale:** camelCase = variables mutables, UPPER_SNAKE_CASE = constants immutables, lisibilité.

---

#### **Files & Directories**

**Rules:**
- React components: PascalCase.tsx (`StatsBar.tsx`, `ChatBot.tsx`, `AnnouncementCard.tsx`)
- Utility files: kebab-case.ts (`firebase-admin.ts`, `ambassador-utils.ts`, `rate-limit.ts`)
- Type definition files: singular kebab-case.ts (`announcement.ts`, `ambassador.ts`)
- Test files: Same name + `.test.ts` suffix (`ambassador-utils.test.ts`)
- Page files: Next.js App Router = `page.tsx`, `layout.tsx`, `error.tsx`, `loading.tsx`
- API routes: `route.ts` in descriptive folders (`api/ambassador/submit/route.ts`)

**Examples:**
```
✅ CORRECT structure:
src/
├── components/
│   ├── StatsBar.tsx
│   ├── ChatBot.tsx
│   └── AnnouncementCard.tsx
├── lib/
│   ├── firebase-admin.ts
│   ├── ambassador-utils.ts
│   └── rate-limit.ts
├── types/
│   ├── announcement.ts
│   └── ambassador.ts
├── __tests__/
│   └── lib/
│       └── ambassador-utils.test.ts
└── app/
    ├── page.tsx
    └── api/
        └── ambassador/
            └── submit/
                └── route.ts

❌ INCORRECT:
- stats-bar.tsx (component should be PascalCase)
- FirebaseAdmin.ts (utility should be kebab-case)
- Announcement_types.ts (types should be singular kebab-case)
- ambassador-utils-test.ts (test should use .test.ts suffix)
```

**Rationale:** Conventions Next.js + cohérence visuelle (components = PascalCase, utils = kebab-case).

---

#### **Firestore Collections & Fields**

**Rules:**
- Collection names: snake_case pluriel (`announcements`, `ambassadors`, `vigies`, `customZones`)
- Sub-collections: snake_case pluriel (`messages`, `alert_subscribers`, `ambassador_audit_log`)
- Document fields: camelCase (`shortCode`, `childName`, `createdAt`, `parentPhone`, `stats`)
- Nested object fields: camelCase (`stats.pageViews`, `stats.pushSent`)
- Document IDs: Firestore auto-ID OU custom nanoid (`EPB-xxx`, `ETR-xxx`, `AMB-xxx`)

**Examples:**
```typescript
// ✅ CORRECT
await addDoc(collection(db, "announcements"), { ... });
await updateDoc(doc(db, "ambassadors", id), {
  "stats.notificationsActivated": increment(1),
});

// Collection structure:
announcements/
  {docId}/
    shortCode: "EPB-A7xK9mP2"
    childName: "Jean"
    createdAt: Timestamp
    stats: {
      pageViews: 150,
      pushSent: 320
    }
    messages/  // Sub-collection
      {messageId}/
        ...

// ❌ INCORRECT
await addDoc(collection(db, "Announcements"), { ... });  // Should be lowercase
await addDoc(collection(db, "announcement"), { ... });  // Should be plural
{
  short_code: "EPB-xxx",  // Should be camelCase
  child_name: "Jean"      // Should be camelCase
}
```

**Rationale:** Firestore = snake_case collections standard, camelCase fields = cohérence TypeScript.

---

### 2. Structure Patterns

#### **Project Organization**

**Directory Structure:**
```
src/
├── app/                    # Next.js App Router (pages + API routes)
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout
│   ├── signaler/          # Feature pages
│   ├── annonce/[code]/    # Dynamic routes
│   ├── admin/             # Protected pages
│   └── api/               # Backend API routes
├── components/            # React components
│   ├── ui/               # Primitives (Badge, etc.)
│   ├── forms/            # Form components
│   └── [ComponentName].tsx
├── lib/                   # Business logic & utilities
│   ├── firebase.ts       # Firebase client config
│   ├── firebase-admin.ts # Firebase Admin SDK
│   ├── firestore.ts      # Firestore helpers
│   └── [utility].ts
├── types/                 # TypeScript type definitions
│   ├── announcement.ts
│   └── ambassador.ts
└── __tests__/             # Test files (mirrors src/)
    ├── components/
    └── lib/
```

**Rules:**
- Components: Flat structure in `/components`, sub-folders pour categories (`ui/`, `forms/`)
- One component per file (no multiple exports)
- Utilities: Grouped by domain (`firebase.ts`, `firestore.ts`, `ambassador-utils.ts`)
- Types: One file per domain entity
- Tests: Mirror structure de `/src` dans `/__tests__`
- API routes: RESTful hierarchy (`api/ambassador/submit/route.ts`)

**Rationale:** Flat structure = découvrabilité, grouping par domaine = cohésion, mirror tests = facile à trouver.

---

#### **File Structure Patterns**

**Utility File Structure:**
```typescript
// 1. Imports (grouped: external, then internal)
import { collection, addDoc, ... } from "firebase/firestore";
import { db } from "./firebase";
import type { Announcement } from "@/types/announcement";

// 2. Types & Constants (file-scoped)
const MAX_RETRIES = 3;

// 3. Helper functions (private)
function generateShortCode(): string { ... }

// 4. Exported functions (public API)
export async function createAnnouncement(...) { ... }
export async function getAnnouncementByShortCode(...) { ... }
```

**Component File Structure:**
```typescript
// 1. Imports
import { useState, useEffect } from "react";
import type { Announcement } from "@/types/announcement";

// 2. Types (component-specific)
interface StatsBarProps { ... }

// 3. Component
export default function StatsBar({ announcement }: StatsBarProps) {
  // Hooks first
  const [stats, setStats] = useState(...);
  useEffect(...);

  // Handlers
  const handleClick = () => { ... };

  // Render
  return <div>...</div>;
}
```

**API Route File Structure:**
```typescript
// 1. Imports
import { NextRequest, NextResponse } from "next/server";
import type { Input, Result } from "@/types/...";
import { helper } from "@/lib/...";

// 2. Constants (rate limits, etc.)
const RATE_LIMIT = { ... };

// 3. Handler function
export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    // 2. Parse & validate input
    // 3. Business logic
    // 4. Return response
  } catch (error) {
    console.error("...", error);
    return NextResponse.json({ error: "..." }, { status: 500 });
  }
}
```

**Rationale:** Structure prévisible = agents AI savent où ajouter code, cohérence maintenance.

---

### 3. Format Patterns

#### **API Response Formats**

**Success Response:**
```typescript
// Simple success
{ success: true }

// Success with data
{
  success: true,
  shortCode: "EPB-xxx",
  secretToken: "abc123...",
  docId: "firestore-id"
}
```

**Error Response:**
```typescript
{
  success: false,
  error: "error_code_snake_case"  // Standard error codes
}

// With additional context (optional)
{
  success: false,
  error: "duplicate_pending",
  existingAmbassadorId: "doc-id"
}
```

**HTTP Status Codes:**
- 200: Success
- 400: Bad request (validation error, missing fields)
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 429: Too many requests (rate limit)
- 500: Internal server error

**Rationale:** Structure cohérente = agents AI génèrent APIs compatibles, error codes = i18n facile.

---

#### **Date/Time Formats**

**Firestore:**
- Use `serverTimestamp()` for creation/update times
- Use `Timestamp.fromDate(jsDate)` for user-provided dates
- Use `timestamp.toDate()` when reading from Firestore

**TypeScript/JavaScript:**
- Type: `Date` objects
- Input forms: ISO string (`lastSeenAt: string` from datetime-local)
- Conversion: `new Date(isoString)`

**Display:**
- French locale: `date.toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })`

**Examples:**
```typescript
// ✅ CORRECT
await addDoc(collection(db, "announcements"), {
  createdAt: serverTimestamp(),
  lastSeenAt: new Date(input.lastSeenAt),  // ISO string -> Date
});

const docData = docSnap.data();
const createdAt: Date = docData.createdAt.toDate();  // Timestamp -> Date

// ❌ INCORRECT
createdAt: new Date()  // Use serverTimestamp() for server dates
createdAt: Date.now()  // Use serverTimestamp() or Date object
```

**Rationale:** serverTimestamp() = cohérence serveur, Date objects = manipulation facile TypeScript.

---

#### **ID & Token Generation**

**Short Codes (user-facing):**
- Pattern: `PREFIX-{nanoid(8)}`
- Prefixes: `EPB` (Enfant Perdu BF), `ETR` (Enfant TRouvé), `AMB` (AMBassadeur)
- Generator: `nanoid(8)` → 8 caractères URL-safe
- Example: `EPB-A7xK9mP2`, `ETR-xM3pQr9K`, `AMB-K7PQ`

**Secret Tokens (internal):**
- Length: 32 hex characters (128 bits entropy)
- Generator: `crypto.getRandomValues(new Uint8Array(16))`
- Usage: Gestion annonces, access tokens

**Firestore IDs:**
- Default: Auto-generated by `addDoc()`
- Custom: Only when needed (ex: customZones uses generated ID from location)

**Examples:**
```typescript
// ✅ CORRECT
function generateShortCode(): string {
  const id = nanoid(8);
  return `EPB-${id}`;
}

function generateSecretToken(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

// ❌ INCORRECT
const shortCode = Math.random().toString(36).slice(2);  // Use nanoid
const token = nanoid(16);  // Use crypto for secrets
```

**Rationale:** nanoid = URL-safe + collision-resistant, crypto = sécurité tokens, prefixes = type visible.

---

#### **Phone Number Handling**

**Normalization:**
```typescript
export function normalizePhone(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Ensure it starts with country code (assume +226 for Burkina Faso if missing)
  if (!cleaned.startsWith("226")) {
    return `226${cleaned}`;
  }
  return cleaned;
}
```

**Masking (public display):**
```typescript
export function maskPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length >= 11) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} XX XX XX`;
  }
  return phone.slice(0, 6) + "XXXXXX";
}
```

**Storage:**
- Always store normalized format (`22670123456`)
- Never store masked format
- Create separate display field if needed (`parentPhoneDisplay`)

**Rationale:** Normalization = queries cohérentes, masking = protection données, séparation = flexibilité.

---

### 4. Communication Patterns

#### **Firestore Real-time Listeners**

**Pattern:**
```typescript
export function subscribeToActiveAnnouncements(
  callback: (announcements: Announcement[]) => void,
  zoneId?: string,
  maxResults = 20
): Unsubscribe {
  const q = query(
    collection(db, "announcements"),
    where("status", "==", "active"),
    orderBy("createdAt", "desc"),
    limit(maxResults)
  );

  return onSnapshot(q, (snapshot) => {
    const announcements = snapshot.docs.map(
      (d) => ({ id: d.id, ...d.data() } as Announcement)
    );
    callback(announcements);
  });
}
```

**Rules:**
- Function name: `subscribeTo{Entity}` (plural if list, singular if one)
- Return type: `Unsubscribe` (Firestore type)
- Callback parameter: First parameter, strongly typed
- Options: Optional parameters with defaults
- Query: Build query, then onSnapshot
- Mapping: Include `id: d.id` in mapped objects

**Usage in Components:**
```typescript
useEffect(() => {
  const unsubscribe = subscribeToActiveAnnouncements((announcements) => {
    setAnnouncements(announcements);
  });
  return unsubscribe;  // Cleanup on unmount
}, []);
```

**Rationale:** Pattern cohérent = agents AI génèrent listeners compatibles, Unsubscribe = cleanup automatique.

---

#### **Error Handling Patterns**

**API Routes:**
```typescript
export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const rateLimitResult = rateLimit(...);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: "too_many_requests" },
        { status: 429, headers: { "Retry-After": "..." } }
      );
    }

    // 2. Input validation
    if (!body.requiredField) {
      return NextResponse.json(
        { success: false, error: "missing_fields" },
        { status: 400 }
      );
    }

    // 3. Business logic
    const result = await doSomething();

    // 4. Success response
    return NextResponse.json({ success: true, ...result });

  } catch (error) {
    console.error("[API Error] Route description:", error);
    return NextResponse.json(
      { success: false, error: "internal_error" },
      { status: 500 }
    );
  }
}
```

**Frontend Components:**
```typescript
try {
  const response = await fetch("/api/...", { ... });
  const data = await response.json();

  if (!data.success) {
    toast.error(translateError(data.error));
    return;
  }

  toast.success("Operation réussie!");
  // Handle success
} catch (error) {
  console.error("Operation failed:", error);
  toast.error("Une erreur est survenue. Veuillez réessayer.");
}
```

**Error Boundaries (Next.js):**
- `error.tsx` in each route segment
- `global-error.tsx` at root level

**Rationale:** Try/catch systématique = robustesse, error codes = debugging facile, toast UX = feedback user.

---

#### **Loading State Patterns**

**Component State:**
```typescript
const [loading, setLoading] = useState(false);
const [submitting, setSubmitting] = useState(false);  // For forms

const handleSubmit = async () => {
  setSubmitting(true);
  try {
    await submitData();
  } finally {
    setSubmitting(false);  // Always reset
  }
};
```

**Next.js Loading UI:**
- `loading.tsx` files in route segments
- Show skeleton loaders, not spinners

**Button States:**
```tsx
<button disabled={submitting}>
  {submitting ? "Publication..." : "Publier l'annonce"}
</button>
```

**Rationale:** Naming cohérent (loading/submitting), finally = toujours reset state, disabled = prevent double-submit.

---

### 5. Process Patterns

#### **Validation Strategy**

**Double Validation (Client + Server):**

**Client-side (react-hook-form):**
```typescript
const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

<input
  {...register("childName", {
    required: "Le nom est requis",
    minLength: { value: 2, message: "Minimum 2 caractères" }
  })}
/>
{errors.childName && <p className="error">{errors.childName.message}</p>}
```

**Server-side (API route):**
```typescript
// 1. Required fields check
if (!body.requiredField || !body.anotherField) {
  return NextResponse.json(
    { success: false, error: "missing_fields" },
    { status: 400 }
  );
}

// 2. Format validation
if (!validateEmail(body.email)) {
  return NextResponse.json(
    { success: false, error: "invalid_email" },
    { status: 400 }
  );
}

// 3. Business rules validation
if (!isMinimumAge(dob, 20)) {
  return NextResponse.json(
    { success: false, error: "too_young" },
    { status: 400 }
  );
}
```

**Rationale:** Client = UX immédiate, Server = sécurité garantie, double validation critique données sensibles.

---

#### **Rate Limiting Pattern**

**Implementation:**
```typescript
// lib/rate-limit.ts
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  key: string,
  options: { windowMs: number; max: number }
): { success: boolean; resetTime: number } {
  const now = Date.now();
  const entry = requestCounts.get(key);

  if (!entry || now > entry.resetTime) {
    requestCounts.set(key, {
      count: 1,
      resetTime: now + options.windowMs,
    });
    return { success: true, resetTime: now + options.windowMs };
  }

  if (entry.count >= options.max) {
    return { success: false, resetTime: entry.resetTime };
  }

  entry.count++;
  return { success: true, resetTime: entry.resetTime };
}
```

**Usage in API routes:**
```typescript
const RATE_LIMIT = { windowMs: 60 * 60 * 1000, max: 3 };  // 3 per hour

const clientId = getClientIdentifier(request, "route-name");
const rateLimitResult = rateLimit(clientId, RATE_LIMIT);

if (!rateLimitResult.success) {
  return NextResponse.json(
    { success: false, error: "too_many_requests" },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)),
      },
    }
  );
}
```

**Rationale:** In-memory suffisant MVP, 429 status standard, Retry-After header = bonne pratique.

---

#### **Code Comments Pattern**

**Section Separators (unique to this project):**
```typescript
// ─── Upload photo ────────────────────────────────────────────────────────────

export async function uploadAnnouncementPhoto(...) { ... }

// ─── Créer une annonce ───────────────────────────────────────────────────────

export async function createAnnouncement(...) { ... }
```

**Function Comments:**
```typescript
/**
 * Génère un code court unique pour l'annonce (ex: EPB-A7xK9mP2)
 * Utilise nanoid pour une génération cryptographiquement sécurisée
 */
function generateShortCode(): string {
  // nanoid génère des IDs URL-safe avec 21 caractères par défaut
  // On utilise 8 caractères pour un bon équilibre lisibilité/unicité
  const id = nanoid(8);
  return `EPB-${id}`;
}
```

**Rules:**
- Use section separators (`// ─── Title ───...`) to group related functions
- JSDoc for public functions (optional but recommended)
- Inline comments for complex logic (French OK)
- NO comments for obvious code

**Rationale:** Section separators = navigation facile, JSDoc = documentation auto, inline = clarté logic.

---

### Enforcement Guidelines

#### **All AI Agents MUST:**

1. **Naming:**
   - Follow PascalCase for types/interfaces/components
   - Follow camelCase for functions/variables
   - Follow kebab-case for utility files
   - Follow snake_case for Firestore collections
   - Use established prefixes (`get`, `create`, `subscribe`, `is`, etc.)

2. **Structure:**
   - Place components in `/components` with PascalCase.tsx
   - Place utilities in `/lib` with kebab-case.ts
   - Place types in `/types` with kebab-case.ts
   - Mirror `/src` structure in `/__tests__`
   - Use section separator comments (`// ─── Title ───...`)

3. **API Patterns:**
   - Return `{ success: boolean, error?: string, ...data }` format
   - Use HTTP status codes: 200, 400, 401, 403, 404, 429, 500
   - Implement rate limiting on mutation endpoints
   - Validate inputs server-side (never trust client)
   - Use try/catch with proper error logging

4. **Firestore Patterns:**
   - Use `serverTimestamp()` for timestamps
   - Use `increment()` for counters
   - Normalize data before storing (phone numbers, etc.)
   - Map `{ id: d.id, ...d.data() }` when reading
   - Return `Unsubscribe` from listener functions

5. **Error Handling:**
   - Wrap all async operations in try/catch
   - Log errors with `console.error("[Context]", error)`
   - Return user-friendly error messages
   - Use error boundaries in components

#### **Pattern Verification:**

**Pre-commit checks:**
- TypeScript compilation (`tsc --noEmit`)
- Linting (`next lint`)
- Tests (`npm test`)

**Code Review checklist:**
- ✅ File names follow conventions
- ✅ Function names follow prefix patterns
- ✅ API responses follow `{ success, error, ...data }` format
- ✅ Firestore queries use established patterns
- ✅ Error handling present and consistent
- ✅ Section separator comments used

**Pattern Documentation:**
- This document is source of truth
- Update patterns when making architectural decisions
- Never deviate without documenting new pattern

---

### Pattern Examples

#### **Good Examples:**

**Creating an entity:**
```typescript
// ✅ lib/firestore.ts
export async function createAnnouncement(
  input: CreateAnnouncementInput
): Promise<{ shortCode: string; secretToken: string; docId: string }> {
  const shortCode = generateShortCode();
  const secretToken = generateSecretToken();

  const docRef = await addDoc(collection(db, "announcements"), {
    shortCode,
    secretToken,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    status: "active" as AnnouncementStatus,
    childName: input.childName.trim(),
    // ...
  });

  return { shortCode, secretToken, docId: docRef.id };
}
```

**API route:**
```typescript
// ✅ app/api/ambassador/submit/route.ts
export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const clientId = getClientIdentifier(request, "ambassador-submit");
    const rateLimitResult = rateLimit(clientId, RATE_LIMIT);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: "too_many_requests" },
        { status: 429, headers: { "Retry-After": "..." } }
      );
    }

    // Validate
    const body = await request.json();
    if (!body.firstName || !body.lastName) {
      return NextResponse.json(
        { success: false, error: "missing_fields" },
        { status: 400 }
      );
    }

    // Business logic
    const result = await submitAmbassadorApplication(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Submit ambassador error:", error);
    return NextResponse.json(
      { success: false, error: "internal_error" },
      { status: 500 }
    );
  }
}
```

**Real-time listener:**
```typescript
// ✅ lib/firestore.ts
export function subscribeToAnnouncement(
  shortCode: string,
  callback: (a: Announcement | null) => void
): Unsubscribe {
  const q = query(
    collection(db, "announcements"),
    where("shortCode", "==", shortCode),
    limit(1)
  );

  return onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      callback(null);
      return;
    }
    const d = snapshot.docs[0];
    callback({ id: d.id, ...d.data() } as Announcement);
  });
}
```

---

#### **Anti-Patterns (What to Avoid):**

**❌ Wrong naming:**
```typescript
// ❌ WRONG
export type announcement_status = "active" | "resolved";  // Should be PascalCase
export interface announcementData { ... }  // Should be PascalCase
export async function get_announcement(id: string) { ... }  // Should be camelCase
const NORMALIZED_PHONE = normalize(phone);  // Should be camelCase (not constant)
```

**❌ Wrong API response:**
```typescript
// ❌ WRONG
return NextResponse.json({ error: "Invalid input" });  // Missing success field
return NextResponse.json({ ok: true, data: {...} });  // Use success, not ok
throw new Error("Not found");  // Use structured response, not throw
```

**❌ Wrong Firestore pattern:**
```typescript
// ❌ WRONG
await addDoc(collection(db, "Announcements"), { ... });  // Should be lowercase
await addDoc(collection(db, "announcement"), { ... });  // Should be plural
{
  created_at: Date.now(),  // Should use serverTimestamp()
  child_name: "Jean"       // Should use camelCase
}
const announcements = snapshot.docs.map(d => d.data());  // Missing id field
```

**❌ Wrong error handling:**
```typescript
// ❌ WRONG
const result = await fetch("/api/...");  // No try/catch
const data = await result.json();
if (data.error) alert(data.error);  // Use toast, not alert

// ❌ WRONG
export async function POST(request: NextRequest) {
  const body = await request.json();  // No try/catch
  // Do something
  return NextResponse.json({ data: "success" });  // Wrong format
}
```

---

**Rationale Finale:** Ces patterns ont été extraits du code existant. Tout agent AI implémentant une nouvelle feature DOIT suivre ces patterns pour garantir la cohérence et éviter les conflits entre agents.
