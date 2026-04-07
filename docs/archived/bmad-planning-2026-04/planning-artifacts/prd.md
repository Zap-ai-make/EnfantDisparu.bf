---
stepsCompleted: ["step-01-init", "step-02-discovery", "step-02b-vision", "step-02c-executive-summary", "step-03-success", "step-04-journeys", "step-05-domain", "step-06-innovation", "step-07-project-type", "step-08-scoping", "step-09-functional", "step-10-nonfunctional", "step-11-polish"]
inputDocuments: ["_bmad-output/planning-artifacts/ux-design-specification.md"]
workflowType: 'prd'
briefCount: 0
researchCount: 0
brainstormingCount: 0
projectDocsCount: 1
classification:
  projectType: web_app
  domain: civic_tech
  complexity: high
  projectContext: brownfield
  inProduction: true
  regulatoryRequirements: true
---

# Product Requirements Document - EnfantPerdu.bf

**Author:** Swabo
**Date:** 2026-03-28

---

## Executive Summary

**EnfantPerdu.bf** est une plateforme communautaire mobile-first de signalement et de recherche d'enfants disparus au Burkina Faso. L'application transforme la recherche d'enfants disparus d'une démarche isolée et inefficace en une **mobilisation collective coordonnée** touchant toutes les couches sociales.

**Problème résolu :** Les canaux actuels (stories Instagram, partages Facebook) créent l'illusion de l'action sans impact réel. Les annonces circulent dans des bulles sociales homogènes et n'atteignent jamais les personnes capables d'aider : commerçants des marchés, femmes de la rue, citoyens présents aux points de passage stratégiques.

**Solution :** EnfantPerdu.bf cible les "yeux de la rue" via un modèle **"visit once, alert forever"**. Un visiteur accepte les notifications push (OneSignal), et chaque nouvelle annonce lui parvient automatiquement — sans compte, sans app, sans retour sur le site. L'annonce atteint des milliers de personnes en quelques minutes.

**Utilisateurs cibles :**
- **Familles en détresse** : Signalement rapide avec réassurance visible (compteurs live de mobilisation)
- **Communauté citoyenne** : Participation sans friction via notifications push géolocalisées
- **Ambassadeurs** : Bénévoles validés coordonnant les recherches terrain avec gamification éthique
- **Autorités/ONG** : Partenaires institutionnels accédant aux métriques d'impact

### What Makes This Special

1. **Reach ciblé vs bruit social** — L'annonce touche les personnes en position d'aider (présence physique aux lieux de passage), pas seulement les contacts Facebook de la famille.

2. **Zéro friction** — Pas d'inscription, pas d'app à télécharger, pas de compte à créer. Une visite + acceptation des notifications = membre permanent du réseau de veille.

3. **Transparence radicale** — Compteurs live de partages, notifications envoyées, personnes mobilisées. La famille voit que des actions concrètes sont en cours.

4. **Modération distribuée** — Les ambassadeurs modèrent les discussions publiques sous chaque annonce, garantissant la qualité sans bureaucratie centrale.

## Project Classification

| Attribut | Valeur |
|----------|--------|
| **Type de projet** | Application Web (PWA mobile-first) |
| **Domaine** | Civic Tech / Protection de l'enfance |
| **Complexité** | Élevée (en production, exigences réglementaires BF) |
| **Contexte** | Brownfield (application existante en production) |
| **Conformité** | Protection des données d'enfants (réglementation Burkina Faso) |

---

## Success Criteria

### User Success

**Familles en détresse :**
- ✅ Signalement complété en moins de **3 minutes** (formulaire simple, mobile-optimisé)
- ✅ Première notification push envoyée en moins de **30 secondes** après publication
- ✅ Premiers témoignages/messages reçus dans l'heure suivant la publication
- ✅ Sentiment de "mobilisation visible" : compteurs live affichés immédiatement
- ✅ **Moment "Aha!"** : La famille voit le nombre de personnes notifiées dépasser 1,000 en moins de 5 minutes

**Communauté citoyenne :**
- ✅ Acceptation des notifications en **2 clics maximum** (aucune inscription)
- ✅ Notification reçue = compréhension immédiate (photo + nom + zone en une vue)
- ✅ Action possible en **1 clic** : "J'ai vu cet enfant" ou "Partager"

**Ambassadeurs :**
- ✅ Dashboard Morning Briefing accessible en moins de **10 secondes**
- ✅ Progression gamification visible (streaks, badges, leaderboard)
- ✅ Outils de modération simples : masquer/escalader en **1 clic**

### Business Success

**Métriques de croissance (12 mois) :**

| Métrique | Cible 3 mois | Cible 12 mois |
|----------|--------------|---------------|
| Abonnés push actifs | 10,000 | 50,000 |
| Ambassadeurs validés | 50 | 200 |
| Couverture géographique | 3 villes | 10 villes + zones rurales |
| Taux de clic notifications | > 15% | > 20% |

**Métriques d'impact :**

| Métrique | Cible annuelle |
|----------|----------------|
| Signalements traités | 100+ |
| Taux de retrouvaille | > 60% |
| Temps moyen de retrouvaille | < 72 heures |
| Témoignages utiles par cas | > 5 |

**Partenariats institutionnels (12 mois) :**
- ✅ 1 partenariat ONG internationale (UNICEF, Save the Children, ou équivalent)
- ✅ 1 partenariat autorité locale (Ministère Action Sociale, Police Nationale)
- ✅ 3 partenariats associations locales de protection de l'enfance

### Technical Success

| Critère | Cible |
|---------|-------|
| Uptime plateforme | > 99.5% |
| Temps de diffusion (10,000 notifications) | < 2 minutes |
| Temps de chargement page (3G) | < 3 secondes |
| Score Lighthouse mobile | > 80 |
| Notifications délivrées | > 95% |

### Measurable Outcomes

**Indicateurs clés de succès (KPIs) :**

1. **KPI Impact** : Nombre d'enfants retrouvés grâce à la plateforme
2. **KPI Reach** : Nombre d'abonnés push actifs par ville
3. **KPI Engagement** : Taux de clic moyen sur notifications
4. **KPI Communauté** : Nombre d'ambassadeurs actifs (≥1 action/semaine)
5. **KPI Confiance** : Nombre de signalements par mois (indicateur d'adoption)

---

## Product Scope

### MVP - Minimum Viable Product

**Fonctionnalités essentielles (déjà en production) :**
- ✅ Formulaire de signalement rapide (photo, nom, âge, zone, description)
- ✅ Page d'annonce publique avec partage social
- ✅ Notifications push via OneSignal
- ✅ Compteurs live (partages, notifications envoyées)
- ✅ Diffusion automatique réseaux sociaux (Facebook, WhatsApp, etc.)

**À compléter pour MVP solide :**
- 🔲 Géolocalisation des notifications par ville/quartier
- 🔲 Messagerie publique sous chaque annonce (badges visiteur/famille/ambassadeur)
- 🔲 Dashboard ambassadeur basique (liste des cas actifs)

### Growth Features (Post-MVP)

**Phase 2 - Engagement & Coordination :**
- 🔲 Gamification ambassadeurs (streaks, badges, leaderboard)
- 🔲 Morning Briefing quotidien
- 🔲 Carte interactive des zones de recherche
- 🔲 Statistiques d'impact personnalisées

**Phase 3 - Institutionnel :**
- 🔲 Dashboard autorités/ONG (métriques agrégées)
- 🔲 Export rapports pour bailleurs (UNICEF, USAID)
- 🔲 API partenaires pour intégration systèmes tiers

### Vision (Future)

**Horizon 2-3 ans :**
- 🌍 Extension régionale (Côte d'Ivoire, Mali, Niger, Sénégal)
- 🤖 IA de reconnaissance faciale pour matching témoignages/photos
- 📱 Application mobile native (si justifié par l'usage)
- 🔗 Intégration bases de données officielles (police, état civil)
- 🏆 Référence régionale pour la protection de l'enfance en Afrique de l'Ouest

---

## User Journeys

### Journey 1 : Mariam, la mère désespérée (Famille en détresse)

**Persona :** Mariam, 35 ans, commerçante au marché de Ouagadougou. Son fils Amadou, 8 ans, n'est pas rentré de l'école. Il est 18h, la nuit tombe.

**Scène d'ouverture :**
Mariam fait les dernières boutiques du quartier. Son cœur bat la chamade. Elle a appelé tous les voisins, personne n'a vu Amadou. Son téléphone vibre - une voisine lui envoie un lien : "Essaie EnfantPerdu.bf".

**Action montante :**
1. Mariam ouvre le site sur son téléphone. En une vue, elle comprend : "Signaler un enfant disparu".
2. Elle clique, remplit le formulaire : photo d'Amadou (celle du téléphone), nom, âge, quartier, dernière vue à l'école à 16h.
3. Elle appuie sur "Publier". **30 secondes**.

**Climax :**
L'écran affiche : "🚨 Annonce publiée ! 847 personnes notifiées dans votre zone." Le compteur monte en temps réel : 1,200... 2,500... 5,000. Mariam pleure - pour la première fois depuis des heures, elle sent qu'elle n'est pas seule.

**Résolution :**
20 minutes plus tard, une notification : "Nouveau témoignage sur votre annonce". Un commerçant du marché Rood Woko écrit : "Je l'ai vu il y a 15 minutes, il pleurait près de la gare routière." Mariam court vers la gare. À 19h30, elle retrouve Amadou, perdu mais sain et sauf.

**Besoins révélés :**
- Formulaire ultra-rapide (< 3 min)
- Feedback immédiat (compteur live)
- Notifications de témoignages en temps réel
- Interface mobile-first, connexion 3G

---

### Journey 2 : Fatou, la vendeuse du marché (Communauté citoyenne)

**Persona :** Fatou, 45 ans, vendeuse de légumes au marché Rood Woko. Elle ne connaît pas bien les réseaux sociaux mais son neveu lui a montré comment accepter les notifications.

**Scène d'ouverture :**
Fatou range son étal en fin de journée. Son téléphone vibre avec une notification inhabituelle : une photo d'enfant avec "🚨 DISPARU - Amadou, 8 ans - Secteur 12".

**Action montante :**
1. Fatou regarde la photo attentivement. Elle a vu des centaines d'enfants aujourd'hui.
2. Elle se souvient : un petit garçon pleurait près de la gare il y a 20 minutes, même t-shirt bleu.
3. Elle clique sur la notification, atterrit sur la page de l'annonce.

**Climax :**
Elle voit le bouton "J'ai vu cet enfant". Elle clique, tape rapidement : "Je l'ai vu il y a 15 minutes près de la gare routière, il pleurait." Elle envoie.

**Résolution :**
Son message apparaît avec un badge "👤 Visiteur". Elle voit d'autres messages arriver. Le lendemain, une notification : "✅ Amadou a été retrouvé ! Merci pour votre témoignage." Fatou sourit. Elle a sauvé un enfant.

**Besoins révélés :**
- Notification claire avec photo visible
- Action en 1 clic ("J'ai vu cet enfant")
- Pas besoin de compte pour témoigner
- Feedback de résolution (enfant retrouvé)

---

### Journey 3 : Ibrahim, l'ambassadeur du quartier (Ambassadeur)

**Persona :** Ibrahim, 28 ans, enseignant. Ambassadeur EnfantPerdu.bf depuis 6 mois. Il coordonne les recherches dans le secteur 15.

**Scène d'ouverture :**
7h du matin. Ibrahim ouvre son Morning Briefing sur EnfantPerdu.bf. Il voit : "2 cas actifs dans votre zone. Votre streak : 45 jours. Rang : #3 national."

**Action montante :**
1. Ibrahim consulte les 2 cas actifs. Le premier date de 3 jours - statut "ongoing". Le second est nouveau - Amadou, disparu hier soir.
2. Il lit les témoignages sur le cas d'Amadou : "Vu près de la gare routière". Il décide de coordonner une recherche.
3. Il poste dans la discussion : "🎖️ Ambassadeur Ibrahim : Équipe de recherche en route vers gare routière, secteur nord. Qui peut couvrir le secteur sud ?"

**Climax :**
Deux autres ambassadeurs répondent. La carte interactive montre leurs positions. Ibrahim voit un nouveau témoignage : "Il est toujours là !" Il appelle la famille directement via le numéro affiché.

**Résolution :**
30 minutes plus tard, il marque le cas comme "Retrouvé". Son écran affiche : "🎉 +50 points ! Streak : 46 jours. Vous avez contribué à 23 retrouvailles." Ibrahim ferme l'app avec fierté - il fait une vraie différence.

**Besoins révélés :**
- Dashboard Morning Briefing
- Gamification (streaks, points, classement)
- Outils de coordination (messagerie, carte)
- Statut des cas en temps réel
- Contact direct avec famille

---

### Journey 4 : Awa, la représentante UNICEF (Autorité/ONG)

**Persona :** Awa, 40 ans, responsable protection de l'enfance à UNICEF Burkina Faso. Elle évalue des partenariats potentiels pour un programme régional.

**Scène d'ouverture :**
Awa a entendu parler d'EnfantPerdu.bf lors d'une conférence. Elle visite le site pour évaluer la crédibilité de l'initiative.

**Action montante :**
1. Elle navigue vers la page "Impact" et voit les statistiques : 150 enfants retrouvés, 50,000 abonnés, 200 ambassadeurs.
2. Elle explore la section "Partenaires" et voit les logos d'associations locales.
3. Elle clique sur "Devenir partenaire institutionnel" et remplit un formulaire de contact.

**Climax :**
Une semaine plus tard, elle reçoit un rapport d'impact détaillé : métriques par région, temps moyens de retrouvaille, témoignages de familles. Elle est impressionnée par la rigueur.

**Résolution :**
Awa propose un partenariat pilote : financement pour l'extension dans 3 nouvelles régions. EnfantPerdu.bf gagne sa première subvention internationale.

**Besoins révélés :**
- Page "Impact" avec métriques publiques
- Export rapports pour bailleurs
- Section partenaires crédible
- Formulaire contact institutionnel

---

### Journey 5 : Moussa, l'admin technique (Admin système)

**Persona :** Moussa, 30 ans, développeur bénévole qui gère la plateforme techniquement.

**Scène d'ouverture :**
Moussa reçoit une alerte : le taux de délivrabilité des notifications a chuté à 85%. Il doit investiguer.

**Action montante :**
1. Il accède au dashboard admin et consulte les logs OneSignal.
2. Il identifie le problème : un pic de signalements a saturé les quotas.
3. Il ajuste les paramètres de batch et relance les notifications en attente.

**Climax :**
Le taux remonte à 98%. Il vérifie que toutes les notifications du cas d'Amadou sont bien parties.

**Résolution :**
Moussa documente l'incident et propose une amélioration pour gérer les pics futurs. La plateforme est plus robuste.

**Besoins révélés :**
- Dashboard admin avec métriques techniques
- Accès logs et monitoring
- Outils de configuration OneSignal
- Alertes automatiques sur anomalies

---

### Journey Requirements Summary

| Parcours | Capacités révélées |
|----------|-------------------|
| **Mariam (Famille)** | Formulaire rapide, compteurs live, notifications témoignages |
| **Fatou (Communauté)** | Notifications push claires, témoignage sans compte, feedback résolution |
| **Ibrahim (Ambassadeur)** | Dashboard, gamification, coordination, carte interactive |
| **Awa (Autorité)** | Page impact, rapports export, section partenaires |
| **Moussa (Admin)** | Dashboard admin, monitoring, logs, alertes |

---

## Domain-Specific Requirements

### Conformité & Réglementaire

**Protection des données d'enfants :**
- Les photos et informations personnelles d'enfants sont des **données sensibles** nécessitant une protection renforcée
- Consentement implicite de la famille lors du signalement (acceptation des CGU)
- Pas d'indexation par les moteurs de recherche (meta robots noindex sur les annonces)
- Transmission HTTPS obligatoire pour toutes les données

**Cycle de vie des données :**

| Statut | Action | Délai |
|--------|--------|-------|
| Enfant retrouvé | Archivage automatique | Immédiat |
| Annonce archivée | Retrait de l'affichage public | 24h |
| Données archivées | Conservation sécurisée | 5 ans (statistiques anonymisées) |
| Après 5 ans | Suppression définitive | Automatique |

**Recommandations futures :**
- Établir un protocole formel avec la Police Nationale du Burkina Faso
- Consulter un juriste sur la loi burkinabè de protection des données
- Obtenir une reconnaissance officielle du Ministère de l'Action Sociale

### Contraintes Techniques

**Sécurité des données :**
- Chiffrement des données au repos (base de données)
- Chiffrement en transit (HTTPS/TLS 1.3)
- Accès restreint aux informations complètes (téléphone famille) : uniquement ambassadeurs validés
- Logs d'accès pour audit

**Confidentialité des témoignages :**
- Les visiteurs peuvent témoigner anonymement (pas de compte requis)
- Option pour les familles de masquer leur numéro de téléphone du public
- Seuls les ambassadeurs/modérateurs voient les coordonnées complètes

**Gestion des photos :**
- Compression automatique pour optimiser la bande passante
- Pas de stockage des métadonnées EXIF (géolocalisation cachée dans les photos)
- Filigrane optionnel "EnfantPerdu.bf" pour éviter le détournement

### Exigences d'Intégration

**Intégrations actuelles :**
- OneSignal (notifications push) - déjà en place
- Réseaux sociaux (partage automatique) - déjà en place
- Firebase (authentification, base de données) - déjà en place

**Intégrations futures recommandées :**
- API Police Nationale (quand partenariat établi)
- Système d'alerte SMS pour zones sans internet
- Base de données régionale ECOWAS (vision long terme)

### Risques & Mitigations

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Utilisation malveillante (prédateur) | Critique | Faible | Modération ambassadeurs, pas de géolocalisation précise publique |
| Faux signalement | Moyen | Faible | Contexte BF favorable, modération réactive |
| Données exposées (fuite) | Critique | Faible | Chiffrement, accès restreint, logs |
| Spam/trolls dans messagerie | Moyen | Moyen | Rate limiting, modération ambassadeurs |
| Photo d'enfant détournée | Moyen | Moyen | Filigrane, archivage rapide après retrouvaille |

### Considérations Éthiques

**Principes directeurs :**
1. **Mission first** - Chaque décision priorise la retrouvaille de l'enfant
2. **Do no harm** - Éviter que la plateforme soit utilisée pour nuire
3. **Transparence** - Les familles savent comment leurs données sont utilisées
4. **Dignité** - Les photos et informations sont traitées avec respect

**Cas particuliers à gérer :**
- Conflit parental (garde d'enfant) → Contexte BF : rare, géré au cas par cas
- Enfant retrouvé décédé → Protocole de communication sensible avec famille
- Signalement d'abus (pas de disparition) → Redirection vers autorités compétentes

---

## Web App Specific Requirements

### Project-Type Overview

EnfantPerdu.bf est une **Progressive Web App (PWA) mobile-first** conçue pour fonctionner sur des connexions 3G/4G au Burkina Faso. L'architecture privilégie la rapidité, l'accessibilité et les fonctionnalités temps réel.

### Browser Matrix

| Navigateur | Priorité | Version min | Notes |
|------------|----------|-------------|-------|
| Chrome Android | 🔴 Critique | 80+ | Cible principale (~60% users BF) |
| Safari iOS | 🔴 Critique | 14+ | iPhone users |
| Firefox Mobile | 🟡 Important | 78+ | Alternative Android |
| Samsung Internet | 🟡 Important | 12+ | Téléphones Samsung populaires |
| Chrome Desktop | 🟢 Secondaire | 90+ | Admin, ONG |
| Firefox Desktop | 🟢 Secondaire | 90+ | Admin |
| Edge | 🟢 Secondaire | 90+ | Admin |

### Responsive Design

**Stratégie Mobile-First :**

| Breakpoint | Device | Priorité |
|------------|--------|----------|
| 320px | iPhone SE, petits Android | 🔴 Critique |
| 375px | iPhone standard | 🔴 Critique |
| 414px | iPhone Plus/Max | 🔴 Critique |
| 768px | Tablette portrait | 🟡 Important |
| 1024px | Desktop | 🟢 Secondaire |
| 1280px+ | Large desktop | 🟢 Secondaire |

**Navigation :**
- Mobile : Bottom navigation bar (4 items max)
- Desktop : Header navigation

### Performance Targets

| Métrique | Cible | Contexte |
|----------|-------|----------|
| First Contentful Paint (FCP) | < 1.5s | Connexion 3G |
| Largest Contentful Paint (LCP) | < 2.5s | Photo enfant visible |
| Time to Interactive (TTI) | < 3.5s | Formulaire utilisable |
| Cumulative Layout Shift (CLS) | < 0.1 | Stabilité compteurs live |
| Lighthouse Score Mobile | > 80 | Performance globale |
| Bundle Size (gzip) | < 200KB | Initial load |

**Optimisations réseau :**
- Lazy loading des images hors viewport
- Service Worker pour cache offline (page d'accueil, assets)
- Compression images WebP avec fallback JPEG
- CDN pour assets statiques

### SEO Strategy

**Indexation sélective :**

| Page | Indexation | Raison |
|------|------------|--------|
| Accueil | ✅ Oui | Visibilité, acquisition |
| Page Impact | ✅ Oui | Crédibilité, partenaires |
| Page Partenaires | ✅ Oui | Institutionnel |
| Annonces individuelles | ❌ Non | Confidentialité enfants |
| Dashboard ambassadeur | ❌ Non | Privé |
| Pages admin | ❌ Non | Privé |

### Accessibility Level

**Conformité : WCAG 2.1 Level AA**

| Critère | Exigence | Implémentation |
|---------|----------|----------------|
| Contraste couleurs | 4.5:1 minimum | Palette validée |
| Touch targets | 44x44px minimum | Boutons, liens |
| Focus visible | Outline visible | Navigation clavier |
| Alt text | Obligatoire | Photos, icônes |
| Labels formulaires | Explicites | Tous champs |
| Annonces ARIA | Live regions | Compteurs temps réel |
| Réduction mouvement | `prefers-reduced-motion` | Animations optionnelles |

### Real-Time Features

| Feature | Technologie | Fréquence |
|---------|-------------|-----------|
| Compteurs live | Firebase Realtime / WebSocket | Temps réel |
| Nouveaux témoignages | Push notification + polling | Immédiat |
| Statut annonce | Firebase Realtime | Temps réel |
| Leaderboard ambassadeurs | Polling 5 min | Quasi temps réel |

### Implementation Considerations

**Stack technique actuel :**
- Frontend : Next.js / React
- Backend : Firebase (Auth, Firestore, Storage)
- Notifications : OneSignal
- Hosting : Vercel / Firebase Hosting

**PWA Features :**
- Service Worker : Cache assets, offline fallback
- Web App Manifest : Add to Home Screen
- Push Notifications : OneSignal integration

---

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-Solving MVP
- Focus sur la résolution immédiate du problème : diffuser une alerte efficacement
- Validation par l'usage réel : chaque enfant retrouvé = validation du modèle
- Itération rapide basée sur les retours terrain des ambassadeurs

**Ressources MVP:**
- 1 développeur full-stack (maintenance)
- Ambassadeurs bénévoles pour la modération
- Budget hosting minimal (~20$/mois)

### MVP Feature Set (Phase 1)

**Fonctionnalités actuellement en production :**
- ✅ Soumission d'annonce (photo, description, localisation)
- ✅ Diffusion automatique sur réseaux sociaux
- ✅ Notifications push via OneSignal
- ✅ Page d'annonce publique avec partage
- ✅ Chatbot IA d'assistance
- ✅ Page de confirmation avec affiche générée
- ✅ Système de badges (Visiteur, Famille, Ambassadeur, Modérateur)

**Core User Journeys Supported:**
1. Parent signale → Annonce publiée → Diffusion automatique
2. Citoyen reçoit notification → Consulte annonce → Partage ou signale
3. Ambassadeur modère les annonces et messages

**Fonctionnalités MVP à compléter :**
1. **Géolocalisation par ville/quartier** - Cibler les notifications par zone
2. **Système de messagerie publique** - Permettre les échanges sous chaque annonce
3. **Dashboard Ambassadeur** - Interface de modération simplifiée

### Post-MVP Features

**Phase 2 : Croissance (Post-MVP)**
- Gamification ambassadeurs (badges, points, classement)
- Statistiques détaillées par région
- API pour intégration partenaires (médias, ONG)
- Application mobile native (si budget)
- Système de récompenses communautaires

**Phase 3 : Expansion Institutionnelle**
- Intégration police/gendarmerie nationale
- Partenariat officiel UNICEF/ONG
- Extension régionale (pays voisins francophones)
- Formation ambassadeurs certifiée
- Rapports d'impact pour bailleurs de fonds

### Risk Mitigation Strategy

**Risques Techniques:**
- *Risque :* Scalabilité si pic de trafic → *Mitigation :* Architecture serverless Firebase auto-scale
- *Risque :* Fiabilité OneSignal → *Mitigation :* Fallback SMS pour annonces critiques (Phase 2)

**Risques Marché:**
- *Risque :* Faible adoption initiale → *Mitigation :* Partenariat radios locales, bouche-à-oreille ambassadeurs
- *Risque :* Fausses alertes/abus → *Mitigation :* Modération ambassadeurs, archivage rapide si trouvé

**Risques Ressources:**
- *Risque :* Budget limité → *Mitigation :* Stack gratuit/low-cost (Firebase free tier, Vercel free)
- *Risque :* Développeur unique → *Mitigation :* Code documenté, architecture simple, communauté open-source potentielle

---

## Functional Requirements

### Gestion des Signalements

- **FR1:** La Famille peut soumettre un signalement avec photo, nom, âge, genre, zone et description de l'enfant
- **FR2:** La Famille peut ajouter des signes distinctifs optionnels à l'annonce
- **FR3:** La Famille peut voir sa page d'annonce publique immédiatement après publication
- **FR4:** La Famille peut recevoir une affiche générée automatiquement après publication
- **FR5:** Archive automatiquement une annonce lorsque l'enfant est marqué comme retrouvé
- **FR6:** La Famille peut marquer son annonce comme "Enfant retrouvé"
- **FR7:** Le Modérateur peut archiver manuellement une annonce si nécessaire

### Notifications & Diffusion

- **FR8:** Envoie des notifications push à tous les abonnés lors d'une nouvelle annonce
- **FR9:** Le Visiteur peut accepter les notifications push sans créer de compte
- **FR10:** Diffusion automatique cross-plateforme
  - **En tant que** Famille
  - **Je veux** que mon annonce soit diffusée automatiquement sur 5 plateformes sociales dans les 60 secondes
  - **Afin de** maximiser la portée sans effort manuel répétitif
  - **Critères d'acceptation:**
    - [ ] Diffusion sur Facebook, WhatsApp, X (Twitter), Instagram, LinkedIn
    - [ ] Délai publication → diffusion < 60 secondes (95e percentile)
    - [ ] Format adapté à chaque plateforme (ratio image, limites texte)
    - [ ] Lien de retour vers page d'annonce inclus dans chaque post
    - [ ] Compteur "Partages" incrémenté automatiquement
    - [ ] Logs succès/échec accessibles en dashboard admin
- **FR11:** Affiche des compteurs live du nombre de personnes notifiées
- **FR12:** Ciblage géographique des notifications
  - **En tant que** Visiteur
  - **Je veux** recevoir uniquement les notifications pour ma zone géographique sélectionnée
  - **Afin de** éviter la fatigue de notification et rester pertinent
  - **Critères d'acceptation:**
    - [ ] Sélection à 2 niveaux: Ville entière OU secteurs spécifiques
    - [ ] Interface choix géographique lors du 1er abonnement notifications
    - [ ] Base données standardisée: villes et secteurs du Burkina Faso
    - [ ] Annonce dans "Secteur 12" notifie: abonnés "Ouagadougou" (niveau ville) + abonnés "Secteur 12" (niveau quartier)
    - [ ] Ciblage respecté à 100% (aucune notification hors zone)
    - [ ] Compteur "X personnes notifiées dans votre zone" basé sur ces critères
- **FR13:** La Famille reçoit une notification lorsqu'un nouveau témoignage est posté sur son annonce

### Messagerie & Témoignages

- **FR14:** Le Visiteur peut poster un témoignage public sous une annonce sans créer de compte
- **FR15:** Affiche un badge (Visiteur, Famille, Ambassadeur, Modérateur) à côté de chaque message
- **FR16:** L'Utilisateur peut utiliser le bouton "J'ai vu cet enfant" pour signaler rapidement
- **FR17:** Tous les utilisateurs peuvent lire les témoignages publics sous chaque annonce
- **FR18:** Notifie les participants d'une discussion lorsqu'un nouveau message est posté

### Gestion des Utilisateurs & Rôles

- **FR19:** L'Utilisateur peut utiliser les fonctionnalités publiques sans créer de compte
- **FR20:** L'Ambassadeur peut s'inscrire et créer un compte avec validation
- **FR21:** Attribue automatiquement le badge approprié selon le rôle de l'utilisateur
- **FR22:** L'Ambassadeur peut accéder aux coordonnées complètes de la famille (téléphone)
- **FR23:** Le Visiteur ne peut pas voir les coordonnées complètes de la famille

### Coordination Ambassadeurs

- **FR24:** L'Ambassadeur peut accéder à un dashboard avec la liste des cas actifs dans sa zone
- **FR25:** L'Ambassadeur peut voir son Morning Briefing quotidien (cas actifs, statistiques)
- **FR26:** L'Ambassadeur peut modérer les messages (masquer, signaler)
- **FR27:** L'Ambassadeur peut contacter directement la famille via le numéro affiché
- **FR28:** Coordination de recherche via messagerie publique
  - **En tant qu'** Ambassadeur
  - **Je veux** utiliser des outils de coordination dans la messagerie publique
  - **Afin de** organiser efficacement les recherches terrain avec d'autres bénévoles
  - **Critères d'acceptation:**
    - [ ] Poster message avec badge "🎖️ Ambassadeur" visible
    - [ ] Épingler 1 message de coordination (affiché en haut discussion)
    - [ ] Marquer témoignage comme "✓ Ambassadeur vérifie" (tag visible)
    - [ ] Bouton épingler/dé-épingler accessible en 1 clic
    - [ ] Logs de coordination pour analytics (nombre actions/ambassadeur/cas)
  - **Scénario Given/When/Then:**
    - **Given** Une annonce active avec 15 témoignages
    - **When** Ambassadeur poste "Équipe en route vers Marché Rood Woko. Qui peut couvrir Gare Routière?" et l'épingle
    - **Then** Message affiché en haut avec badge ambassadeur visible
    - **And** Autres ambassadeurs voient appel à l'aide prioritaire
- **FR29:** L'Ambassadeur peut voir une carte interactive des zones de recherche

### Gamification Ambassadeurs

- **FR30:** L'Ambassadeur accumule des points pour ses actions (témoignages, coordination, retrouvailles)
- **FR31:** L'Ambassadeur peut voir son streak (jours consécutifs d'activité)
- **FR32:** L'Ambassadeur peut consulter le leaderboard national
- **FR33:** L'Ambassadeur gagne des badges selon ses accomplissements

### Partenaires & Institutionnel

- **FR34:** Le Visiteur peut consulter la page Impact avec les statistiques publiques (enfants retrouvés, abonnés)
- **FR35:** Le Partenaire peut accéder à des rapports d'impact exportables
- **FR36:** Le Partenaire peut remplir un formulaire de demande de partenariat
- **FR37:** Affiche une section Partenaires avec les logos des partenaires validés

### Assistance & Support

- **FR38:** L'Utilisateur peut interagir avec un chatbot IA pour obtenir de l'aide
- **FR39:** L'Utilisateur peut partager une annonce via les boutons de partage social

### Administration Système

- **FR40:** L'Admin peut consulter un dashboard avec les métriques techniques (notifications, uptime)
- **FR41:** L'Admin peut accéder aux logs système et service de notifications
- **FR42:** L'Admin reçoit des alertes automatiques en cas d'anomalie (taux de délivrabilité bas)
- **FR43:** L'Admin peut configurer les paramètres de notifications (batch, quotas)

### Sécurité & Conformité

- **FR44:** Compresse automatiquement les photos uploadées
- **FR45:** Supprime les métadonnées de localisation des photos
- **FR46:** Applique un filigrane optionnel sur les photos
- **FR47:** Conserve les données archivées pendant 5 ans avant suppression

---

## Non-Functional Requirements

### Performance

| Critère | Mesure | Contexte |
|---------|--------|----------|
| **NFR-P1** First Contentful Paint | < 1.5s | Connexion 3G Burkina Faso |
| **NFR-P2** Largest Contentful Paint | < 2.5s | Photo enfant visible rapidement |
| **NFR-P3** Time to Interactive | < 3.5s | Formulaire utilisable |
| **NFR-P4** Cumulative Layout Shift | < 0.1 | Stabilité compteurs live |
| **NFR-P5** Lighthouse Score Mobile | > 80 | Performance globale |
| **NFR-P6** Bundle Size Initial (gzip) | < 200KB | Bande passante limitée |
| **NFR-P7** Délai notification push | < 30s | Après publication annonce |
| **NFR-P8** Batch 10,000 notifications | < 2 min | Diffusion massive |

### Sécurité

| Critère | Mesure | Contexte |
|---------|--------|----------|
| **NFR-S1** Chiffrement transit | Protocole standard actuel | Toutes communications chiffrées |
| **NFR-S2** Chiffrement repos | AES-256 | Base de données chiffrée |
| **NFR-S3** Suppression métadonnées localisation | 100% photos | Pas de géolocalisation cachée |
| **NFR-S4** Accès coordonnées famille | Ambassadeurs uniquement | Contrôle d'accès par rôle |
| **NFR-S5** Logs d'accès | Conservation 90 jours | Audit trail |
| **NFR-S6** Rate limiting | 100 req/min/IP | Protection anti-spam |
| **NFR-S7** Rétention données archivées | 5 ans max | Conformité cycle de vie |

### Scalabilité

| Critère | Mesure | Contexte |
|---------|--------|----------|
| **NFR-SC1** Abonnés push supportés | 100,000 | Objectif 12 mois + marge |
| **NFR-SC2** Annonces actives simultanées | 500 | Cas multiples en parallèle |
| **NFR-SC3** Messages/annonce | 1,000 | Témoignages massifs possibles |
| **NFR-SC4** Pic de trafic | 10x baseline | Lors d'annonce virale |
| **NFR-SC5** Dégradation gracieuse | < 20% latence | Sous charge maximale |

### Accessibilité

| Critère | Mesure | Contexte |
|---------|--------|----------|
| **NFR-A1** Niveau conformité | WCAG 2.1 AA | Standard international |
| **NFR-A2** Contraste couleurs | 4.5:1 minimum | Lisibilité tous écrans |
| **NFR-A3** Touch targets | 44x44px minimum | Utilisabilité mobile |
| **NFR-A4** Focus clavier | Visible sur tous éléments | Navigation accessible |
| **NFR-A5** Alt text images | 100% images | Lecteurs d'écran |
| **NFR-A6** Labels formulaires | Explicites et associés | Compréhension champs |
| **NFR-A7** Réduction mouvement | `prefers-reduced-motion` | Respect préférences |

### Intégration

| Critère | Mesure | Contexte |
|---------|--------|----------|
| **NFR-I1** Disponibilité service push | > 99% | Notifications critiques |
| **NFR-I2** Taux délivrabilité push | > 95% | Efficacité diffusion |
| **NFR-I3** Latence base de données temps réel | < 200ms | Mise à jour compteurs live |
| **NFR-I4** Partage social | 5 plateformes | Facebook, WhatsApp, X, Instagram, LinkedIn |
| **NFR-I5** Fallback hors-ligne | Cache ressources essentielles | Page d'accueil, assets |

### Fiabilité

| Critère | Mesure | Contexte |
|---------|--------|----------|
| **NFR-R1** Uptime plateforme | > 99.5% | Mission critique |
| **NFR-R2** Recovery Time Objective | < 1 heure | Reprise après incident |
| **NFR-R3** Recovery Point Objective | < 15 min | Perte de données max |
| **NFR-R4** Alertes anomalies | < 5 min | Détection problèmes |
| **NFR-R5** Backup données | Quotidien | Base de données + stockage fichiers |
