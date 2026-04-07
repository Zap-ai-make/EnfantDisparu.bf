---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
workflowComplete: true
completedDate: 2026-03-28
inputDocuments: []
---

# UX Design Specification EnfantPerdu.bf

**Author:** Swabo
**Date:** 2026-03-28

---

## Executive Summary

### Project Vision

**EnfantDisparu.bf** est une plateforme communautaire mobile-first de signalement et de recherche d'enfants disparus au Burkina Faso. La vision est de créer un **mouvement de solidarité nationale** où chaque citoyen devient un acteur de la protection de l'enfance.

**Mission:** Transformer la recherche d'enfants disparus d'une démarche isolée et désespérée en une mobilisation collective, coordonnée et efficace, inspirant **confiance**, **espoir** et **action immédiate**.

**Proposition de valeur unique:**
- Diffusion virale instantanée sur tous les canaux sociaux (synchronisation automatique Facebook, WhatsApp, Instagram, X, TikTok, LinkedIn)
- Mobilisation géolocalisée de la communauté en temps réel avec notifications push intelligentes
- Coordination intelligente des recherches sur le terrain via carte interactive
- Transparence radicale sur l'impact et la portée des actions (métriques live)
- Écosystème technique sophistiqué visible pour crédibilité institutionnelle
- Engagement addictif des ambassadeurs via gamification éthique

### Target Users

#### 1. **Familles en Détresse** (Utilisateurs primaires)
- **Profil:** Parents/proches d'enfants disparus au Burkina Faso
- **État émotionnel:** Urgence, panique, besoin de réassurance immédiate
- **Compétence tech:** À l'aise avec le numérique, 99% mobile, connexion internet stable
- **Besoin principal:** Sentir qu'une communauté entière se mobilise MAINTENANT et voir les actions en temps réel
- **Motivation:** Retrouver leur enfant le plus vite possible
- **Point de friction:** Incertitude sur ce qui se passe après le signalement, manque de visibilité sur la mobilisation

#### 2. **Communauté Active** (Utilisateurs contributeurs)
- **Profil:** Citoyens burkinabè souhaitant aider activement
- **État émotionnel:** Empathie, volonté d'agir concrètement
- **Compétence tech:** À l'aise, mobile-first, connexion stable
- **Besoin principal:** Savoir comment aider efficacement, voir l'impact de leurs actions, recevoir notifications géolocalisées
- **Motivation:** Contribuer à une cause noble, faire partie d'un mouvement solidaire
- **Point de friction:** Ne pas savoir où/comment participer aux recherches, duplication d'efforts

#### 3. **Ambassadeurs** (Super-utilisateurs)
- **Profil:** Bénévoles validés, leaders communautaires engagés
- **État émotionnel:** Engagement, responsabilité, fierté
- **Compétence tech:** À l'aise, multi-plateforme
- **Besoin principal:** Outils de coordination, visibilité sur l'impact, reconnaissance sociale, rituel quotidien motivant
- **Motivation:** Maximiser l'efficacité des recherches, sauver des vies, obtenir statut social
- **Point de friction:** Coordination manuelle, manque de routine engageante, pas de feedback sur contribution

#### 4. **Autorités, ONG, Associations** (Partenaires institutionnels)
- **Profil:** Décideurs institutionnels, organismes officiels
- **État émotionnel:** Méfiance initiale, besoin de preuves de sérieux
- **Besoin principal:** Comprendre l'infrastructure technique, la crédibilité, l'écosystème complet
- **Motivation:** S'associer à une initiative efficace et professionnelle
- **Point de friction:** Doute sur le professionnalisme, manque de visibilité sur la tech derrière

### Key Design Challenges

#### 1. **Réassurance Immédiate en Situation de Crise**
**Défi:** Un parent signalant une disparition est dans un état de panique extrême. Le design doit instantanément lui montrer que :
- Son signalement est pris au sérieux
- Des actions concrètes sont en cours
- Une communauté se mobilise pour l'aider

**Implications UX:**
- Feedback visuel immédiat et constant (animations fluides, compteurs live)
- Langage rassurant et empathique dans tous les messages
- Preuves sociales omniprésentes (X personnes notifiées, Y recherches actives)
- Indicateurs de progression clairs à chaque étape
- Timeline de mobilisation visible en temps réel

#### 2. **Coordination de Masse sans Chaos**
**Défi:** Des centaines/milliers de personnes veulent aider mais sans coordination, ça crée du bruit et de l'inefficacité.

**Implications UX:**
- Carte interactive intelligente avec zones de recherche assignées dynamiquement
- Système de "check-in" pour les chercheurs actifs avec géolocalisation
- Priorisation automatique des zones basée sur algorithme
- Communication bidirectionnelle (témoignages géolocalisés → famille)
- Dashboard de coordination pour éviter doublons

#### 3. **Engagement Communautaire Soutenu**
**Défi:** Maintenir la motivation de la communauté sur la durée, éviter l'apathie.

**Implications UX:**
- Gamification éthique (badges, niveaux, impact personnel visible)
- Statistiques de portée transparentes et actualisées en temps réel
- Célébration des retrouvailles (section dédiée avec émotions)
- Messages de soutien visibles pour la famille
- Reconnaissance des contributeurs actifs (hall of fame)

#### 4. **Mobile-First à 99%**
**Défi:** Toute l'expérience doit être optimale sur mobile avec connexion stable.

**Implications UX:**
- Interface thumb-friendly (zones de touch optimales, boutons > 44px)
- Performance maximale (temps de chargement < 2s)
- Notifications push stratégiques et géolocalisées
- Formulaires multi-étapes digestibles (wizard pattern)
- PWA pour installation native et accès rapide
- Design responsive adaptatif (mobile → desktop)

#### 5. **Crédibilité et Confiance Institutionnelle**
**Défi:** Inspirer confiance dans un contexte sensible (enfants disparus).

**Implications UX:**
- Partenariats officiels visibles en permanence (logos autorités, ONG)
- Transparence totale (statistiques publiques, méthodologie ouverte)
- Design professionnel et soigné (pas amateur)
- Section "Retrouvailles" prouvant l'efficacité du système
- Validation rigoureuse des ambassadeurs avec badges

#### 6. **Démonstration de Force Technique pour Crédibilité Institutionnelle**
**Défi:** Convaincre autorités/ONG/associations que c'est un système professionnel et robuste, pas juste "un site web".

**Implications UX:**
- **Landing page dédiée "Écosystème"** avec schéma technique interactif animé
- **Visualisation en temps réel** de la synchronisation multi-canaux (comme un dashboard de mission control NASA)
- **Section "Infrastructure"** montrant l'architecture technique (APIs, intégrations, webhooks, partenariats tech)
- **Badges de partenariat** affichés de manière proéminente (logos autorités, ONG, sponsors tech)
- **Métriques techniques** professionnelles (temps de diffusion < 30s, taux de disponibilité 99.9%, SLA)
- **Garanties de performance** visibles et mesurables

#### 7. **Création d'Habitude Quotidienne (Hook Model pour Ambassadeurs)**
**Défi:** Transformer la vérification des annonces en rituel quotidien addictif, sans trivialiser la mission.

**Implications UX:**
- **Notifications push intelligentes** espacées stratégiquement (matin, midi, soir)
- **"Morning Briefing" personnalisé** avec stats d'impact personnel
- **Gamification quotidienne** avec streaks, défis, leaderboards dynamiques
- **Feed addictif "Fil de Vie"** (scroll vertical comme TikTok/Instagram)
- **Pull-to-refresh satisfaisant** avec animations et feedback
- **Variable rewards** (imprévisibilité pour créer accoutumance)
- **Social proof continu** pour FOMO et motivation
- **Dashboard ambassadeur** comme jeu vidéo (niveaux, XP, achievements)

### Design Opportunities

#### 1. **Révolutionner la Mobilisation Communautaire**
**Opportunité:** Créer le premier "réseau social d'urgence" où chaque action compte et est visible.

**Innovation UX:**
- **Feed d'activité en temps réel:** Voir les recherches actives, partages, témoignages (comme un Twitter de la solidarité)
- **Heatmap de mobilisation:** Visualiser l'intensité des recherches par zone géographique
- **Compteur de portée live:** Montrer le nombre de personnes notifiées qui augmente en temps réel (animation satisfaisante)
- **Stories de recherche:** Format inspiré Instagram Stories pour suivre l'évolution d'une recherche active
- **Live indicators:** Badges "LIVE" sur recherches en cours pour urgence

#### 2. **Gamification Éthique pour Maximiser l'Impact**
**Opportunité:** Utiliser la psychologie du jeu pour motiver sans trivialiser la mission sacrée.

**Innovation UX:**
- **Système de niveaux progressifs:** "Veilleur" → "Gardien" → "Protecteur" → "Protecteur Elite" basé sur l'engagement réel
- **Badges d'impact collectibles:** "Premier témoin", "Chercheur actif", "Super-partageur", "Ange Gardien"
- **Tableau de bord personnel XP:** Statistiques visuelles de contribution (X partages, Y personnes touchées, Z recherches)
- **Classement des ambassadeurs:** Gamification compétitive positive par ville/région
- **Récompenses déblocables:** Certificats mensuels téléchargeables, reconnaissance officielle
- **"Daily Spin":** Roue de la chance quotidienne pour bonus (points, badges exclusifs)

#### 3. **Intelligence Collective pour Recherches Coordonnées**
**Opportunité:** Transformer le chaos en organisation militaire efficace.

**Innovation UX:**
- **Carte intelligente avec zones dynamiques:** Algorithme assignant automatiquement des zones en fonction de la densité de chercheurs
- **Check-in de recherche géolocalisé:** "Je cherche ici maintenant" avec timer et notification automatique
- **Système de témoignages géolocalisés:** Signaler des indices avec photo/localisation GPS précise
- **Notifications push contextuelles:** Alerter uniquement les personnes à proximité immédiate (rayon paramétrable)
- **Coordination anti-doublon:** Éviter que 10 personnes cherchent au même endroit
- **Heatmap des zones couvertes:** Visualiser où la recherche a déjà eu lieu

#### 4. **Transparence Radicale pour Bâtir la Confiance**
**Opportunité:** Montrer TOUT ce qui se passe, tout le temps, sans filtre.

**Innovation UX:**
- **Tableau de bord de diffusion:** Voir exactement où l'annonce a été partagée (Facebook 2,450 vues, WhatsApp 156 groupes, etc.)
- **Métriques d'impact live:** Nombre de vues, partages, chercheurs actifs, témoignages reçus (mise à jour temps réel)
- **Timeline de mobilisation:** Historique chronologique détaillé de toutes les actions minute par minute
- **Espace famille privé:** Zone sécurisée pour suivre les pistes confidentielles, coordonner avec ambassadeurs
- **Statistiques publiques:** Taux de succès, temps moyen de retrouvaille, performance du système

#### 5. **Célébration et Preuve Sociale**
**Opportunité:** Transformer les succès en inspiration et preuve d'efficacité du système.

**Innovation UX:**
- **Section "Retrouvailles" émotionnelle:** Photos avant/après, témoignages vidéo de familles, stats de mobilisation pour ce cas
- **Compteur de succès en page d'accueil:** "X enfants retrouvés grâce à vous" (chiffre proéminent et fier)
- **Wall of Fame des ambassadeurs:** Reconnaissance publique des super-contributeurs avec photos et témoignages
- **Messages de gratitude publics:** Système pour familles de remercier la communauté (vidéos, textes)
- **Impact stories:** Articles détaillés sur chaque retrouvaille réussie

#### 6. **"Mission Control" - Dashboard Public de l'Écosystème**
**Opportunité:** Impressionner autorités/ONG en montrant la sophistication technique.

**Innovation UX:**
- **Page d'accueil avec visualisation live de l'écosystème :**
  - Animation interactive montrant la propagation d'une alerte (site → Facebook → WhatsApp → Notifications → Ambassadeurs)
  - Compteurs en temps réel impressionnants : "X annonces diffusées en < 30 secondes"
  - Map de couverture géographique avec zones actives en temps réel
  - Liste des intégrations techniques (APIs, webhooks, services cloud)
  - Graphiques de performance (uptime, vitesse de diffusion, reach)

- **Section "Comment ça marche techniquement" dédiée :**
  - Schéma d'architecture technique simplifié mais impressionnant
  - Timeline de diffusion automatisée étape par étape
  - Garanties de performance (SLA : 99.9% uptime, diffusion < 30s)
  - Technologies utilisées (Next.js, Firebase, OneSignal, etc.)

- **Wall of Trust institutionnel :**
  - Logos des partenaires officiels bien visibles et cliquables
  - Certifications/validations d'autorités
  - Témoignages vidéo d'autorités et responsables ONG
  - Métriques de crédibilité (X partenaires, Y certifications)

#### 7. **Hook Model - Dashboard Ambassadeur Addictif**
**Opportunité:** Créer une routine matinale où les ambassadeurs VEULENT vérifier le site comme on checke Instagram.

**Innovation UX:**

**a) Notifications Push Intelligentes (Trigger)**
- 🌅 "Bonjour [Nom] ! 12 nouvelles recherches actives dans votre zone"
- 🎯 "Votre aide est demandée : 3 alertes à moins de 5 km de vous"
- ⚡ Notification toutes les 2h si nouvelle annonce (fréquence optimale)
- 🎉 "Un enfant retrouvé grâce à votre secteur !" (variable reward)

**b) "Morning Briefing" Personnalisé (Action)**
Dès l'ouverture de l'app/site :
```
☀️ Bonjour Champion !

📊 Votre Impact Hier :
- Vos partages ont touché 2,450 personnes
- Vous êtes classé 3ème ambassadeur de Ouagadougou
- +120 points XP (vous montez niveau "Protecteur Elite")

🚨 Aujourd'hui :
- 2 recherches actives dans votre secteur
- 5 nouvelles annonces au Burkina Faso
- 156 ambassadeurs actifs maintenant

🎯 Défi du Jour :
"Partager 3 annonces avant midi" → +50 points bonus
```

**c) Gamification Quotidienne (Reward Variable)**
- **Streaks visuels:** "15 jours consécutifs de connexion ! 🔥" (motivation continue)
- **Défis quotidiens:** Missions simples et atteignables (partager, chercher, témoigner)
- **Leaderboard dynamique:** "Vous êtes à 20 points du TOP 10 !" (FOMO motivant)
- **Récompenses visuelles:** Badges collectibles animés, niveau qui évolue avec barres de progression
- **"Daily Spin":** Roue de la chance quotidienne pour bonus aléatoires (addiction variable reward)

**d) Feed Addictif "Fil de Vie" (Investment)**
Comme Instagram/TikTok mais pour la solidarité :
- Stories verticales des recherches actives (scroll infini satisfaisant)
- Updates en temps réel des annonces (toujours nouveau contenu)
- Célébrations de retrouvailles (émotions positives)
- Témoignages de familles (connexion émotionnelle)
- Actions d'autres ambassadeurs (X a partagé, Y cherche activement - social proof)

**e) Pull-to-Refresh Satisfaisant (Action + Reward)**
- Animation réconfortante et fluide quand on rafraîchit
- Son/haptic feedback agréable (sensation tactile)
- Toujours quelque chose de nouveau (même si "Aucune nouvelle annonce - Merci de rester vigilant !")
- Mini-célébration si nouveau contenu chargé

**f) Statut Social & Reconnaissance (Investment)**
- **Profil ambassadeur public:** Portfolio d'impact personnel partageable
- **Badges rares:** "Premier à signaler un témoin", "Recherche nocturne", "Marathon 7 jours"
- **Hall of Fame mensuel:** Top ambassadeurs avec photos/témoignages publics
- **Certificats mensuels** téléchargeables et partageables (fierté sociale)
- **Niveaux prestigieux:** Déblocage de titres (Ange Gardien, Héros National)

**g) Variable Rewards - Psychologie de Skinner (Cœur de l'addiction)**
- Parfois une notification normale d'annonce
- Parfois "🚨 URGENT - Enfant disparu près de vous !"
- Parfois "🎉 Un enfant retrouvé grâce à votre zone !"
- Parfois "🏆 Nouveau badge débloqué !"
- Parfois "⭐ Vous êtes dans le TOP 5 cette semaine !"
→ L'imprévisibilité crée l'addiction (on ne sait jamais ce qu'on va trouver)

**h) Social Proof & FOMO (Motivation Continue)**
- "127 ambassadeurs actifs EN CE MOMENT" (urgence sociale)
- "Ahmed vient de gagner le badge 'Ange Gardien'" (jalousie positive)
- "Top 3 ambassadeurs de la semaine : Fatou, Ibrahim, Aïcha" (compétition saine)
- "Votre ami Karim a partagé 5 annonces aujourd'hui" (comparaison sociale)
→ Créer l'envie de ne pas être à la traîne

---
## Core User Experience

### Defining Experience

**L'essence de l'expérience EnfantDisparu.bf se décline en trois boucles d'engagement distinctes :**

**1. Boucle Famille (Réassurance Immédiate)**
- **Action Core:** Voir immédiatement la mobilisation en temps réel, pas seulement "confirmer" le signalement
- **Flow:** Signalement → Explosion visuelle de diffusion → Compteur live qui grimpe → Sentiment de soulagement
- **Principe:** Le parent ne doit JAMAIS se sentir seul. Dès la validation du formulaire, il voit la communauté se mobiliser sous ses yeux.

**2. Boucle Communauté (Contribution Valorisée)**
- **Actions Core:** 
  - Partager l'annonce sur ses réseaux sociaux (one-click)
  - Signaler un témoignage/indice géolocalisé
- **Flow:** Notification → Partage rapide → Feedback d'impact ("10,000 personnes touchées") → Motivation renforcée
- **Principe:** Chaque action compte et est mesurée. La communauté voit son impact concret.

**3. Boucle Ambassadeur (Ownership & Coordination)**
- **Actions Core:**
  - Coordonner les recherches sur carte interactive (assigner zones, valider témoignages)
  - Recevoir notifications prioritaires géolocalisées
  - **Mener des actions autonomes sans validation admin** (sentiment de pouvoir)
- **Flow:** Morning briefing → Coordination active → Impact visible → Reconnaissance sociale → Addiction quotidienne
- **Principe:** Les ambassadeurs sont des "super-utilisateurs" avec pouvoirs réels, pas de simples bénévoles. Ils POSSÈDENT leur territoire.

**Si nous réussissons une seule chose:** Faire sentir à chaque utilisateur qu'il fait partie d'une **machine de sauvetage collective** où chaque rouage compte.


### Platform Strategy

**Platform Principale: Web Mobile-First (PWA)**

**Décision Stratégique:**
- **Phase 1 (Maintenant):** Progressive Web App (PWA) optimisée mobile
  - Raisons: Déploiement rapide, pas de validation App Store, updates instantanés
  - Installable sur écran d'accueil (icône native)
  - Push notifications via OneSignal
  - Fonctionnement en mode connecté (connexion stable au Burkina Faso)

- **Phase 2 (Futur):** App native iOS/Android si besoin
  - Seulement si limitations PWA deviennent bloquantes
  - Pour l'instant, PWA suffit amplement

**Capabilities Device Requises:**
- ✅ **Géolocalisation GPS temps réel** (essentiel pour carte et notifications de proximité)
- ✅ **Appareil photo** (upload photos enfant, preuves témoignages)
- ✅ **Push notifications** (déjà OneSignal intégré)
- ✅ **Partage natif** (Share API pour partager sur WhatsApp/Facebook)
- ❌ **Mode offline** (pas nécessaire, connexion stable)

**Interface Paradigm:**
- 100% touch-optimized (boutons min 44x44px)
- Scroll vertical infini pour feeds
- Gestes natifs (swipe, pull-to-refresh)
- Navigation bottom-bar pour pouces (pas top)
- One-handed operation prioritaire


### Effortless Interactions

**Ce qui DOIT être magique (zéro friction) :**

**1. Géolocalisation Automatique**
- ❌ **Pas ça:** "Entrez votre adresse manuellement"
- ✅ **Ça:** Bouton "📍 Utiliser ma position actuelle" → GPS automatique → Adresse pré-remplie
- **Impact:** Réduit la charge cognitive en situation de stress

**2. Auto-Complétion des Adresses**
- ❌ **Pas ça:** Champs vides à remplir entièrement
- ✅ **Ça:** Google Places Autocomplete avec suggestions du Burkina Faso
- **Impact:** 90% plus rapide, 0% d'erreurs d'orthographe

**3. Partage One-Click**
- ❌ **Pas ça:** "Copiez ce lien et collez-le sur WhatsApp"
- ✅ **Ça:** Bouton "Partager sur WhatsApp" → Share API native → Message pré-formaté avec lien + photo
- **Impact:** De 5 étapes à 1 clic

**4. Upload Photo Instantané**
- ❌ **Pas ça:** Upload → Crop → Rotate → Resize → Confirmer
- ✅ **Ça:** Sélection photo → Crop simple → Upload background → Preview immédiat
- **Impact:** Déjà implémenté, continuer cette approche

**5. Compteur Live Sans Refresh**
- ❌ **Pas ça:** "Actualisez la page pour voir les stats"
- ✅ **Ça:** WebSocket/Real-time DB → Compteur anime automatiquement
- **Impact:** Magie pure, réassurance continue

**6. Notifications Géo-Contextuelles Intelligentes**
- ❌ **Pas ça:** Notifier tout le monde pour toute annonce
- ✅ **Ça:** Algorithme de proximité → Notifier seulement si < 5km + matching profil
- **Impact:** Pertinence maximale, pas de spam

**7. Actions Ambassadeur Autonomes (NOUVEAU)**
- ❌ **Pas ça:** "Votre demande a été envoyée à l'admin pour validation"
- ✅ **Ça:** Ambassadeur peut directement :
  - Valider/publier témoignages vérifiés
  - Assigner zones de recherche
  - Promouvoir annonces urgentes
  - Récompenser contributeurs
  - Gérer leur "territoire" géographique
- **Impact:** Sentiment de propriété, engagement x10, rapidité d'action


### Critical Success Moments

**Les moments make-or-break de l'expérience :**

**1. Moment "OMG ça diffuse vraiment" (Famille - 30 secondes après signalement)**
- **Contexte:** Parent vient de valider le signalement, est en panique
- **Moment:** Écran de confirmation avec animation de propagation
- **Indicateurs visuels:**
  - Animation vagues concentriques partant de la map
  - Compteur "Diffusion en cours..." qui monte vers "2,450 personnes notifiées"
  - Liste déroulante temps réel: "✓ Facebook", "✓ WhatsApp", "✓ Instagram"...
  - "🔥 156 ambassadeurs alertés dans votre zone"
- **Émotion cible:** Soulagement, espoir, "Je ne suis pas seul"
- **Si raté:** Parent perd confiance immédiatement

**2. Moment "Mon action compte vraiment" (Communauté - après 1er partage)**
- **Contexte:** Citoyen vient de partager une annonce
- **Moment:** Toast notification + update stats personnelles
- **Indicateurs visuels:**
  - "🎉 Partagé ! Vous avez touché 1,247 nouvelles personnes"
  - Badge débloqué: "Premier Partage"
  - "Votre impact total: 10,000 personnes touchées"
- **Émotion cible:** Fierté, validation sociale, motivation
- **Si raté:** Contributeur ne revient jamais

**3. Moment "Je suis un super-héros" (Ambassadeur - Morning Briefing)**
- **Contexte:** Ambassadeur ouvre le site le matin avec son café
- **Moment:** Dashboard personnalisé explosif avec stats hier, aujourd'hui et défis
- **Émotion cible:** Addiction, fierté, FOMO, motivation compétitive
- **Si raté:** Ambassadeur perd intérêt, check moins souvent

**4. Moment "C'est grâce à moi !" (Contributeur - Annonce de retrouvaille)**
- **Contexte:** Enfant retrouvé dans une zone où l'utilisateur a agi
- **Moment:** Notification push + célébration in-app
- **Indicateurs visuels:**
  - Notification: "🎉 ENFANT RETROUVÉ ! Grâce à vous et 234 autres héros"
  - Page retrouvailles avec mention contributeurs
  - Badge spécial: "Sauveur - Cas #12"
  - Témoignage vidéo de la famille (optionnel)
- **Émotion cible:** Accomplissement profond, larmes de joie, motivation éternelle
- **Si raté:** Contributeur ne sait pas que son action a aidé

**5. Moment "Je contrôle mon territoire" (Ambassadeur - 1ère action autonome)**
- **Contexte:** Ambassadeur vient d'être validé, découvre ses pouvoirs
- **Moment:** Première validation de témoignage SANS attendre admin
- **Indicateurs visuels:**
  - "✅ Témoignage publié dans votre zone"
  - "Vous gérez maintenant Ouagadougou Secteur 5 (24,000 habitants)"
  - "Vos actions autonomes: Valider témoignages, Assigner zones, Promouvoir alertes"
- **Émotion cible:** Empowerment, responsabilité, ownership
- **Si raté:** Ambassadeur se sent comme simple "messager" sans pouvoir

### Experience Principles

**Principes directeurs pour TOUTES les décisions UX:**

**1. "Mobilisation Visible = Confiance" (Réassurance)**
- Chaque action système doit être VISIBLE par l'utilisateur
- Jamais de processus cachés ou "en attente"
- Compteurs, animations, notifications en temps réel
- **Application:** Toute page doit montrer l'activité live (X personnes en ligne, Y recherches actives)

**2. "Zéro Friction en Situation de Crise" (Effortless)**
- En urgence, chaque seconde compte
- Auto-complétion, géolocalisation auto, one-click sharing
- Minimum 3 clics max pour actions critiques
- **Application:** Signalement complet en < 2 minutes

**3. "Chaque Action Compte et Se Voit" (Impact Visible)**
- Pas de contribution invisible
- Feedback immédiat sur impact personnel
- Stats transparentes, gamification éthique
- **Application:** Toast après chaque partage: "Vous avez touché X personnes"

**4. "Ambassadeurs = Propriétaires, Pas Employés" (Ownership)**
- Pouvoirs réels, pas symboliques
- Actions autonomes sans gatekeeper admin
- Territoire géographique assigné ("votre zone")
- Dashboard personnel comme CEO de leur secteur
- **Application:** Ambassadeur peut valider témoignages, assigner zones, promouvoir alertes SANS admin

**5. "Mobile-First, Thumb-Friendly, Fast" (Performance)**
- Design pour une main, connexion stable
- < 2s load time, animations 60fps
- PWA installable, notifications push
- **Application:** Boutons actions en bas, accessibles au pouce

**6. "Transparence Radicale pour Crédibilité" (Trust)**
- Montrer la tech derrière (écosystème, APIs, SLA)
- Stats publiques, méthodologie ouverte
- Partenariats officiels visibles
- **Application:** Page "Infrastructure" montrant synchronisation multi-canaux

**7. "Addiction Éthique pour Engagement Soutenu" (Hook Model)**
- Variable rewards, streaks, FOMO
- Mais toujours au service de la mission
- Gamification ne trivialise jamais le sujet
- **Application:** Daily briefing, défis, leaderboards, mais contexte sérieux

---
## Desired Emotional Response

### Primary Emotional Goals

**EnfantDisparu.bf doit créer des réponses émotionnelles distinctes pour chaque type d'utilisateur :**

**1. Famille en Détresse (Triple Émotion Immédiate)**
- **Soulagement** : "Je ne suis plus seul dans cette épreuve"
  - Déclenché par la visualisation immédiate de la mobilisation (compteur live, animations)
  - Temps critique: < 30 secondes après validation du signalement
- **Espoir** : "On va retrouver mon enfant"
  - Renforcé par les preuves sociales (X ambassadeurs alertés, Y personnes notifiées)
  - Maintenu par updates continues de mobilisation
- **Confiance** : "Le système fonctionne vraiment"
  - Créé par transparence radicale (diffusion multi-canaux visible, SLA respectés)
  - Consolidé par partenariats officiels et succès stories

**2. Communauté Active (Gratification Sociale)**
- **Accomplissement** : "Mon action a compté"
  - Déclenché par feedback immédiat quantifié ("Vous avez touché 1,247 personnes")
  - Renforcé par badges débloqués et stats personnelles visibles
- **Fierté** : "Je fais ma part pour protéger nos enfants"
  - Créé par validation sociale (partage impact, reconnaissance publique)
  - Amplifié lors de retrouvailles réussies ("C'est grâce à vous")

**3. Ambassadeurs (Triple Motivation Addictive)**
- **Héroïsme** : "Je sauve des vies"
  - Cultivé par narrative de super-héros (badges "Sauveur", "Ange Gardien")
  - Célébré lors de retrouvailles dans leur zone ("Grâce à votre territoire")
- **Empowerment** : "Je contrôle quelque chose d'important"
  - Créé par pouvoirs réels (validation autonome, gestion territoriale)
  - Renforcé par dashboard "CEO de mon secteur"
- **Appartenance Elite** : "Je fais partie des meilleurs"
  - Déclenché par leaderboards, classements, niveaux prestigieux
  - Maintenu par compétition positive et streaks

### Emotional Journey Mapping

**Parcours émotionnel type à travers l'expérience:**

**Étape 1: Première Visite (Impression Initiale)**
- **Émotion cible:** Professionnalisme Rassurant
- **Comment:** Design soigné + écosystème technique visible + partenariats officiels
- **Indicateurs:** Logos autorités, schéma synchronisation multi-canaux, stats de succès
- **Message subliminal:** "C'est sérieux, sophistiqué et fiable"

**Étape 2: Pendant l'Action (Signalement ou Partage)**
- **Émotion cible:** Efficacité
- **Comment:** UX fluide, auto-complétion, géolocalisation auto, one-click actions
- **Temps:** Signalement complet en < 2 minutes
- **Message subliminal:** "C'est simple, rapide, je maîtrise"

**Étape 3: Après l'Action (Juste Après)**
- **Émotion cible:** Impatience de Voir les Résultats
- **Comment:** Redirections immédiates vers dashboards live, compteurs qui montent
- **Feedback:** Toast notifications, animations satisfaisantes
- **Message subliminal:** "Ça se passe MAINTENANT, regardez !"

**Étape 4: Retrouvaille (Succès Collectif)**
- **Émotion cible:** Joie Explosive
- **Comment:** Notification push célébration + page retrouvailles émotionnelle
- **Partage:** Témoignages famille, vidéos, reconnaissance contributeurs
- **Message subliminal:** "NOUS avons sauvé une vie ensemble !"

**Étape 5: Retour sur la Plateforme (Engagement Continu)**
- **Émotion cible (Ambassadeurs):** FOMO + Curiosité + Compétition
- **Comment:** Morning briefing personnalisé, nouveaux défis, leaderboards dynamiques
- **Hook:** "Que s'est-il passé pendant mon absence ?"

### Micro-Emotions

**États émotionnels subtils mais critiques à orchestrer:**

**1. Confiance vs Scepticisme**
- **Objectif:** Éliminer TOUT scepticisme dès les premières 60 secondes
- **Comment:**
  - Transparence technique visible (schéma diffusion multi-canaux)
  - Preuves sociales omniprésentes (compteurs live, témoignages)
  - Partenariats officiels proéminents
  - Performance mesurable (SLA, temps < 30s)
- **Test:** Utilisateur doit penser "Wow, c'est du sérieux" pas "Est-ce que ça marche ?"

**2. Appartenance vs Isolation**
- **Objectif:** Personne ne doit se sentir seul face à la disparition
- **Comment:**
  - Feed d'activité temps réel ("127 ambassadeurs actifs EN CE MOMENT")
  - Social proof constant ("Ahmed vient de partager")
  - Messages communautaires de soutien visibles
  - Langage inclusif ("Nous", "Ensemble", "Notre mission")
- **Test:** Parent doit sentir "Toute une nation m'aide" pas "Je suis seul"

**3. Accomplissement vs Frustration**
- **Objectif:** Chaque action, même petite, doit générer accomplissement
- **Comment:**
  - Feedback immédiat quantifié ("Vous avez touché X personnes")
  - Badges progressifs (même pour première action)
  - Barres de progression visibles
  - Célébration de micro-victoires
- **Test:** Après 1 partage, utilisateur doit penser "J'ai fait quelque chose d'important"

**4. Empowerment vs Impuissance**
- **Objectif:** Ambassadeurs doivent se sentir puissants, pas spectateurs
- **Comment:**
  - Actions autonomes SANS validation admin
  - Dashboard de contrôle territorial
  - Pouvoir de décision réel (valider témoignages, assigner zones)
  - Titre "Vous gérez Ouagadougou Secteur 5"
- **Test:** Ambassadeur doit penser "Je CONTRÔLE mon territoire" pas "J'attends qu'on me dise quoi faire"

**5. Urgence vs Apathie**
- **Objectif:** Maintenir mobilisation rapide sans créer panique paralysante
- **Comment:**
  - Notifications push dosées stratégiquement
  - Badges "LIVE" sur recherches actives
  - Timers visuels ("Disparu depuis 4 heures")
  - Language actionnable ("Agir maintenant" pas "Prenez connaissance")
- **Test:** Utilisateur doit penser "Je dois agir vite" pas "Je regarderai plus tard"

**6. Héroïsme vs Insignifiance**
- **Objectif:** Ambassadeurs doivent se voir comme super-héros, pas simples bénévoles
- **Comment:**
  - Narrative héroïque (badges "Sauveur", "Protecteur", "Ange Gardien")
  - Stats d'impact impressionnantes ("Vous avez touché 50,000 personnes ce mois")
  - Reconnaissance publique (Hall of Fame, certificats)
  - Témoignages familles "Grâce à vous, j'ai retrouvé mon enfant"
- **Test:** Ambassadeur doit penser "Je SAUVE des vies" pas "Je fais ma petite part"

### Design Implications

**Connexions directes entre émotions cibles et décisions UX:**

**Pour Créer SOULAGEMENT:**
- ✅ Animation propagation diffusion immédiate après signalement
- ✅ Compteur live "X personnes notifiées" qui monte en temps réel
- ✅ Liste déroulante canaux: "✓ Facebook", "✓ WhatsApp", "✓ Instagram"
- ✅ Message rassurant: "Votre signalement est diffusé. Une communauté se mobilise."
- ❌ PAS de "Votre demande a été envoyée" sans feedback visible

**Pour Créer ACCOMPLISSEMENT:**
- ✅ Toast notification après CHAQUE action: "🎉 Partagé ! 1,247 nouvelles personnes touchées"
- ✅ Dashboard personnel avec métriques cumulées
- ✅ Badges progressifs débloqués immédiatement
- ✅ Barres de progression XP/niveaux visibles
- ❌ PAS d'actions invisibles ou sans feedback

**Pour Créer EMPOWERMENT:**
- ✅ Boutons d'action ambassadeur SANS "Demander validation admin"
- ✅ Interface de gestion territoriale ("Votre zone: Ouagadougou Secteur 5")
- ✅ Pouvoirs clairement listés: "Vous pouvez: Valider témoignages, Assigner zones..."
- ✅ Notifications "Vous avez publié" pas "En attente de validation"
- ❌ PAS de processus approval bloquants pour ambassadeurs validés

**Pour Créer CONFIANCE:**
- ✅ Page "Écosystème" avec schéma technique interactif
- ✅ Métriques de performance visibles (SLA 99.9%, diffusion < 30s)
- ✅ Logos partenaires officiels en header/footer
- ✅ Section "Comment ça marche techniquement" détaillée
- ❌ PAS de promesses vagues ou processus opaques

**Pour Créer APPARTENANCE:**
- ✅ Feed activité live: "Ahmed a partagé", "Fatou cherche activement"
- ✅ Compteurs sociaux partout: "156 ambassadeurs actifs maintenant"
- ✅ Messages de soutien famille visibles
- ✅ Langage inclusif constant ("Nous", "Ensemble", "Notre mission")
- ❌ PAS d'expérience isolée ou solitaire

**Pour Créer URGENCE (Sans Panique):**
- ✅ Badges "LIVE" rouges sur recherches actives
- ✅ Timers relatifs: "Disparu depuis 4 heures"
- ✅ Notifications push géolocalisées: "Enfant disparu à 2 km de vous"
- ✅ CTA action: "Aider maintenant" (bouton proéminent)
- ❌ PAS de countdown stressant ou "Il est trop tard"

### Emotional Design Principles

**Principes directeurs pour orchestrer les émotions:**

**1. "L'Émotion Suit l'Action Visible" (Transparence Émotionnelle)**
- Principe: Chaque émotion doit être déclenchée par un élément UX tangible et visible
- Application: Jamais de "processus en arrière-plan" - tout doit être montré
- Exemple: Compteur qui monte = Soulagement. Badge débloqué = Accomplissement.

**2. "Feedback Immédiat = Émotion Immédiate" (Réactivité)**
- Principe: < 500ms entre action utilisateur et réponse émotionnelle visuelle
- Application: Toast, animations, sons, haptic feedback systématiques
- Exemple: Click "Partager" → < 0.5s → "🎉 Partagé ! 1,247 personnes touchées"

**3. "Quantifier Pour Amplifier" (Concret > Abstrait)**
- Principe: Émotions sont plus fortes avec chiffres précis qu'avec mots vagues
- Application: Toujours quantifier l'impact (X personnes, Y ambassadeurs, Z km)
- Exemple: "Vous avez touché 10,247 personnes" > "Merci pour votre contribution"

**4. "Célébrer Chaque Victoire, Petite ou Grande" (Gamification Positive)**
- Principe: Reconnaissance émotionnelle pour toute contribution, même minime
- Application: Badges progressifs, niveaux, streaks, leaderboards
- Exemple: Badge "Premier Partage" dès la 1ère action

**5. "Émotion Collective > Émotion Individuelle" (Solidarité)**
- Principe: Amplifier sentiment d'appartenance à mouvement plus grand que soi
- Application: Social proof constant, feed communautaire, stats collectives
- Exemple: "Grâce à VOUS et 234 autres héros" > "Grâce à vous"

**6. "Jamais de Culpabilité, Toujours d'Inspiration" (Motivation Positive)**
- Principe: Motiver par aspiration et célébration, jamais par culpabilité ou peur
- Application: Défis fun, compétition saine, pas de "Vous devriez faire plus"
- Exemple: "Défi du jour: Partager 3 annonces (+50 XP bonus)" > "Vous n'avez partagé que 1 fois"

**7. "L'Empathie Dans Chaque Mot" (Langage Émotionnel)**
- Principe: Ton empathique, rassurant, jamais froid ou bureaucratique
- Application: Micro-copy soigné, messages personnalisés, emojis dosés
- Exemple: "Nous comprenons votre angoisse. Toute une communauté se mobilise pour vous." > "Signalement enregistré."

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

**TikTok - Maître de l'Attention & de l'Addiction**

TikTok excelle dans la rétention d'attention et la création d'habitudes quotidiennes grâce à:
- **Variable Reward System**: Contenu imprévisible qui maintient la curiosité
- **Friction ultra-faible**: Swipe vertical = geste minimal pour engagement maximal
- **Auto-play instantané**: Pas de décision à prendre, l'expérience commence immédiatement
- **Session hooks**: "Juste une dernière vidéo" devient 30 minutes
- **Algorithme personnalisé**: Pertinence maximale dès les premières minutes

**Leçons clés pour EnfantPerdu.bf:**
L'addiction de TikTok vient du cycle rapide action → gratification → curiosité. Nous pouvons adapter ce cycle pour le morning briefing ambassadeur: notification → ouverture app → découverte contenu imprévisible (nouvelle annonce OU impact personnel OU success story) → investissement psychologique.

**WhatsApp - Sentiment de Connexion & Routine Quotidienne**

WhatsApp crée un sentiment de connexion humaine grâce à:
- **Indicateurs de présence**: "En ligne", "...est en train d'écrire" = sentiment temps réel
- **Stories (Statuts)**: Fenêtre sur le quotidien des proches, format éphémère créant urgence
- **Push notifications immédiates**: Chaque message = rappel de connexion
- **Groupes dynamiques**: Sentiment d'appartenance communautaire
- **Interface familière**: Zéro courbe d'apprentissage, adoption universelle

**Leçons clés pour EnfantPerdu.bf:**
Le succès de WhatsApp repose sur la sensation de "communauté vivante" et le rituel quotidien de vérifier les stories. Nous pouvons adapter ces principes pour créer un sentiment de "communauté de recherche active" avec indicateurs temps réel et timeline de recherche style story.

### Transferable UX Patterns

**Navigation Patterns:**

1. **Feed Vertical "Fil de Vie"** (adapté de TikTok)
   - Application: Dashboard ambassadeur avec scroll vertical des recherches actives
   - Chaque carte = annonce + photo + compteur mobilisation + actions rapides
   - Swipe gauche/droite pour actions (Partager / Témoigner)
   - Remplace liste statique par feed dynamique addictif

2. **Status Bar de Connexion** (adapté de WhatsApp)
   - Application: Header dynamique "🔴 X recherches actives · 👥 Y ambassadeurs mobilisés"
   - Crée sentiment de mouvement permanent et communauté vivante
   - Visible sur toutes les pages

3. **Morning Briefing Modal** (hybride)
   - Application: Notification push matinale → Modal plein écran avec:
     - Nouvelles annonces zone (variable reward)
     - Vos impacts hier (gratification)
     - Actions suggérées (call-to-action)
   - Hook quotidien pour maintenir ritual ambassadeurs

**Interaction Patterns:**

1. **Partage Ultra-Rapide** (adapté de WhatsApp)
   - Application: Bouton partage → Sheet native contacts WhatsApp
   - Texte + image pré-remplis, optimisés
   - Feedback immédiat: "✅ Partagé à X contacts"
   - Friction minimale = diffusion virale facilitée

2. **Variable Reward Feed** (adapté de TikTok)
   - Application: Pull-to-refresh avec contenu toujours changeant
   - Compteurs animés (chiffres qui montent en direct)
   - Nouveaux témoignages, stats actualisées
   - Maintient curiosité et vérifications répétées

3. **Timeline Story "Fil de Recherche"** (adapté de WhatsApp)
   - Application: Format chronologique visuel pour chaque recherche:
     - Story 1: Signalement initial
     - Story 2: X personnes notifiées
     - Story 3: Premiers témoignages
     - Story 4: Enfant retrouvé
   - Transforme données froides en narration émotionnelle

4. **Engagement Passif → Actif** (adapté de TikTok)
   - Application: Ambassadeur peut scroller passivement (découverte)
   - Boutons d'action apparaissent au touch/hover (engagement actif)
   - Gradient progressif baisse barrière psychologique

**Visual Patterns:**

1. **Compteurs Temps Réel** (adapté de TikTok)
   - Application: Chiffres qui s'incrémentent en direct avec animations +1, +10, +100
   - Compteur mobilisation page annonce avec momentum visuel
   - Crée sensation d'impact immédiat

2. **Feed Activité Communautaire** (adapté de WhatsApp)
   - Application: "Marie a partagé · Jean a signalé un témoignage · etc."
   - Avatars + timestamps "🟢 Actif il y a 2 min"
   - Humanise plateforme, crée connexion entre ambassadeurs

3. **Design Audio-Visuel Fort** (adapté de TikTok)
   - Application: Son notification distinctif + haptic feedback mobile
   - Micro-animations sur chaque action
   - Renforce sensation impact immédiat

### Anti-Patterns to Avoid

**❌ Gamification Superficielle**
- Problème: TikTok valorise vanity metrics (likes, vues)
- Risque: Badge "100 partages !" trivialise mission sérieuse
- Alternative: Quantifier IMPACT réel ("Vos actions ont touché 50,000 personnes")

**❌ Algorithme qui Filtre le Contenu**
- Problème: TikTok cache du contenu selon préférences
- Risque: Certaines annonces deviendraient invisibles
- Alternative: Ordre chronologique + filtre géographique explicite opt-in

**❌ Distraction par Contenu Non-Pertinent**
- Problème: TikTok détourne vers contenus variés
- Risque: Dilution mission, perte crédibilité
- Alternative: Addiction via impact tracking, pas entertainment

**❌ Notifications Spam**
- Problème: WhatsApp groupes actifs peuvent spammer
- Risque: Fatigue notification → désactivation push
- Alternative: Notifications intelligentes (nouvelles annonces zone, impacts majeurs uniquement)

**❌ FOMO Toxique et Culpabilisation**
- Problème: TikTok crée anxiété "tu rates du contenu"
- Risque: Burn-out ambassadeurs, pression négative
- Alternative: Résumé quotidien opt-in, célébration contributions, jamais reproche

**❌ Éphémérité pour Contenu Critique**
- Problème: WhatsApp stories disparaissent 24h
- Risque: Recherches durent semaines/mois
- Alternative: Timeline permanente, format story pour chronologie seulement

### Design Inspiration Strategy

**Architecture d'Addiction Éthique (Hook Model pour Ambassadeurs):**

1. **Trigger (Déclencheur)**
   - Externe: Notification push morning briefing 7h-8h
   - Interne: Sentiment responsabilité communautaire

2. **Action (Action minimale)**
   - Ouvrir app via swipe notification
   - Scroller feed recherches actives (geste naturel TikTok)

3. **Variable Reward (Récompense imprévisible)**
   - Jour 1: Nouvelle annonce zone → Sentiment urgence
   - Jour 2: "Vos partages ont touché 5000 personnes" → Gratification
   - Jour 3: "Enfant retrouvé grâce à témoignage zone" → Héroïsme
   - Clé: Imprévisibilité maintient curiosité quotidienne

4. **Investment (Investissement psychologique)**
   - Chaque action enrichit historique impact ambassadeur
   - Dashboard personnel grandit avec contributions
   - Sentiment ownership: "MES recherches", "MON territoire"

**Différence éthique vs TikTok:**
- TikTok: Addiction pour profit (temps écran = ad revenue)
- EnfantPerdu.bf: Addiction pour mission (temps = vies sauvées)

**À Adopter Directement:**

1. **Variable Reward Morning Briefing** - Rituel quotidien avec contenu imprévisible
2. **Indicateurs Temps Réel** - "🔴 X recherches actives · 👥 Y ambassadeurs mobilisés"
3. **Partage Friction Zéro** - Sheet native contacts, one-tap, pré-rempli

**À Adapter:**

1. **Feed Scroll Vertical** - Garde gesture naturel, ajoute contexte riche (pas juste vidéo)
2. **Timeline Story** - Format visuel chronologique mais permanent (pas 24h)
3. **Compteurs Engagement** - Chiffres animés mais mesure impact réel, pas vanity metrics

**À Éviter:**

1. **Algorithme de Filtrage** - Toutes annonces méritent visibilité égale
2. **Contenu Distraction** - Focus mission constant
3. **Notifications Passives** - Seulement notifications actionnables
4. **FOMO Culpabilisant** - Célébration uniquement, jamais reproche

**Vision Synthèse:**
*"L'addiction de TikTok au service de la mission WhatsApp"*

Dashboard ambassadeur combine:
- Addiction TikTok feed (scroll vertical, variable rewards, friction minimale)
- Connexion WhatsApp (présence temps réel, sentiment communauté)
- Mission focus constant (impact quantifié, pas vanity metrics)
- Éthique transparente (addiction pour mission, pas profit)

---
## Design System Foundation

### Design System Choice

**Chosen System: shadcn/ui + Tailwind CSS + Custom Components**

EnfantPerdu.bf utilisera shadcn/ui comme fondation de design system, construit sur Tailwind CSS et Radix UI, avec des composants custom pour les besoins métier spécifiques.

**Composants shadcn/ui adoptés:**
- Button, Card, Badge, Modal, Dialog, Toast, Alert
- Form inputs (Input, Textarea, Select, Checkbox, Radio)
- Navigation (Tabs, DropdownMenu)
- Data Display (Table, Avatar, Skeleton)
- Overlay (Sheet, Popover, Tooltip)

**Composants custom à créer:**
- StatsCard (compteurs mobilisation temps réel)
- AlertBanner (annonces enfants disparus)
- SearchCard (cartes feed recherches)
- MapOverlay (carte interactive avec zones)
- MorningBriefing (modal dashboard ambassadeur)
- TimelineStory (format story WhatsApp pour recherche)

### Rationale for Selection

**Alignement technique parfait:**
- Intégration native avec Next.js 15 + Tailwind CSS (stack actuel)
- Zéro friction d'adoption, pas de refactoring
- Utilisation de l'expertise Tailwind existante

**Professionnalisme institutionnel:**
- Design moderne et soigné par défaut (crédibilité autorités/ONG)
- Accessibilité WCAG AA+ via Radix UI (compliance institutions)
- Look "enterprise-grade" nécessaire pour partenariats officiels

**Customisable pour "révolutionnaire":**
- Thème entièrement modifiable (couleurs, espacements, animations)
- Composants custom illimités pour identité unique
- Pas de contrainte "template générique"

**Vélocité et maintenabilité:**
- Développement rapide (copier-coller composants documentés)
- Ownership du code (pas de dépendance externe cassable)
- Maintenance simplifiée pour petite équipe

**Écosystème robuste:**
- Documentation excellente avec exemples interactifs
- Communauté active (Discord, GitHub)
- Mises à jour régulières et bonnes pratiques

### Implementation Approach

**Phase 1: Setup & Configuration (Jour 1-2)**

1. **Installation shadcn/ui:**
   ```bash
   npx shadcn-ui@latest init
   ```

2. **Configuration thème EnfantPerdu.bf:**
   - Couleurs primaires: Orange (#FF6B2C) pour urgence, Bleu (#3B82F6) pour confiance
   - Couleurs d'état: Rouge (#EF4444) alerte, Vert (#10B981) succès
   - Typographie: Inter (sans-serif moderne, lisible mobile)
   - Border radius: 0.75rem (moderne mais pas excessif)
   - Animations: duration-300 (rapides et réactives)

3. **Import composants de base:**
   ```bash
   npx shadcn-ui@latest add button card badge dialog toast alert input textarea select
   ```

**Phase 2: Composants Core (Semaine 1-2)**

1. **Customisation composants shadcn:**
   - Ajuster variantes Button pour urgence (variant="destructive")
   - Card avec shadow animations hover
   - Badge avec pulse animation pour "LIVE"
   - Toast avec success/error states émotionnels

2. **Création composants custom métier:**
   - `<StatsCard>`: Compteur animé avec icône, label, trend
   - `<AlertBanner>`: Photo enfant + infos + CTA urgents
   - `<SearchCard>`: Carte feed avec actions swipe
   - `<AmbassadorBadge>`: Badge niveau avec animation

**Phase 3: Patterns Avancés (Semaine 3-4)**

1. **Dashboard Ambassadeur:**
   - Layout avec shadcn Tabs
   - Morning Briefing Modal avec Dialog
   - Stats grid avec Cards animées

2. **Feed "Fil de Vie":**
   - Infinite scroll avec Intersection Observer
   - Pull-to-refresh animation
   - Skeleton loaders avec shadcn Skeleton

3. **Carte Interactive:**
   - Overlay custom sur Leaflet/Mapbox
   - Popover shadcn pour info bulles
   - Sheet pour détails annonce

**Outils de Développement:**

- **Storybook (optionnel):** Catalogue composants isolés
- **Tailwind IntelliSense:** Autocomplétion VSCode
- **Prettier + Tailwind Plugin:** Formatage consistant

### Customization Strategy

**Design Tokens (Tailwind Config):**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Couleurs EnfantPerdu.bf
        primary: {
          DEFAULT: '#FF6B2C', // Orange urgence
          50: '#FFF4ED',
          100: '#FFE4D3',
          // ...
        },
        trust: {
          DEFAULT: '#3B82F6', // Bleu confiance
          // ...
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 1s ease-in-out 3',
      }
    }
  }
}
```

**Composants à Personnaliser:**

1. **Typographie:**
   - H1-H6 avec poids custom (font-bold pour titres urgents)
   - Body text optimisé mobile (16px base, line-height 1.6)
   - Labels uppercase pour sections importantes

2. **Interactions:**
   - Hover states avec scale légère (hover:scale-102)
   - Active states avec haptic feel (active:scale-98)
   - Focus states accessibles (ring-2 ring-primary)

3. **Animations:**
   - Toast slide-in from top (urgence)
   - Compteurs count-up animation (satisfaction)
   - Pulse sur badges "LIVE" (attention)
   - Skeleton shimmer (loading states)

4. **Responsive:**
   - Mobile-first breakpoints (sm: 640px, md: 768px, lg: 1024px)
   - Touch targets min 44x44px
   - Bottom navigation mobile, sidebar desktop

**Principes de Customisation:**

- **Conserver:** Structure et accessibilité des composants shadcn
- **Modifier:** Couleurs, espacements, animations pour brand identity
- **Ajouter:** Composants métier spécifiques non couverts par shadcn
- **Tester:** Accessibilité avec Lighthouse et screen readers

---
## Core User Experience - L'Expérience Signature

### Defining Experience

**L'expérience signature d'EnfantPerdu.bf: "Machine de Mobilisation Collective Visible"**

EnfantPerdu.bf se distingue par une expérience core unique qui traverse tous les types d'utilisateurs: **la visualisation permanente de l'impact collectif en temps réel**. Ce n'est pas une interaction isolée, mais un principe fondamental qui infuse chaque moment de l'expérience.

**Principe Core:**
Chaque action sur la plateforme déclenche une réponse visuelle immédiate et quantifiée qui montre l'écosystème entier en mouvement. Pas de silence, pas d'attente, pas d'incertitude - seulement le sentiment puissant d'une communauté qui agit ensemble, maintenant.

**Trois Manifestations de l'Expérience Signature:**

**1. Famille: "L'Explosion de Mobilisation"**
- **Action déclencheur:** Validation du formulaire signalement
- **Moment magique:** Écran de confirmation avec compteur live qui explose de 0 à 2,450+ personnes en 30 secondes
- **Éléments visuels:**
  - Animation vagues concentriques partant de la localisation
  - Compteur animé avec chiffres qui montent: +10, +50, +100, +500...
  - Liste déroulante temps réel: "✓ Facebook", "✓ WhatsApp", "✓ Instagram", "✓ Notifications push"
  - "🔥 156 ambassadeurs alertés dans votre zone"
- **Émotion:** Soulagement immédiat, espoir, "Je ne suis pas seul"
- **Phrase signature:** "Je viens de lancer le plus grand SOS de ma vie"

**2. Ambassadeur: "Le Rituel Quotidien Addictif"**
- **Action déclencheur:** Ouvrir le site le matin (7h-8h)
- **Moment magique:** Morning briefing personnalisé avec contenu imprévisible (Hook Model - Variable Reward)
- **Éléments visuels:**
  - Modal plein écran "☀️ Bonjour Champion !"
  - Stats impact hier: "Vos partages ont touché 2,450 personnes"
  - Classement: "Vous êtes 3ème ambassadeur de Ouagadougou"
  - Niveau XP avec barre de progression
  - Nouvelles annonces zone + Défi du jour
- **Émotion:** Addiction positive, fierté, FOMO, motivation compétitive
- **Phrase signature:** "Je ne peux pas commencer ma journée sans checker mon territoire"

**3. Communauté: "La Gratification Immédiate Mesurable"**
- **Action déclencheur:** Clic sur "Partager sur WhatsApp"
- **Moment magique:** Toast notification "🎉 Partagé ! Vous avez touché 1,247 nouvelles personnes"
- **Éléments visuels:**
  - Toast animé slide-in depuis le haut
  - Chiffre impact précis et personnalisé
  - Badge débloqué si première fois
  - Compteur cumulé "Votre impact total: 10,000 personnes"
- **Émotion:** Accomplissement, validation sociale, motivation à continuer
- **Phrase signature:** "Chaque partage compte et je le vois immédiatement"

**Fil Rouge Universel:**

Sur TOUTES les pages, en permanence:
- **Status Bar Live:** "🔴 5 recherches actives · 👥 87 ambassadeurs mobilisés · 📍 Ouagadougou"
- **Feed Activité:** "Marie a partagé il y a 2 min · Ahmed cherche activement · Fatou a signalé un témoin"
- **Compteurs Impact:** Chiffres qui bougent en temps réel, jamais statiques

### User Mental Model

**Ce que les utilisateurs attendent (Mental Model Actuel):**

**Familles en détresse:**
- Mental model traditionnel: "Je signale aux autorités → J'attends qu'ils agissent → Silence angoissant"
- Frustration: Manque total de visibilité sur ce qui se passe après le signalement
- Besoin: Réassurance immédiate que quelque chose se passe MAINTENANT

**Communauté solidaire:**
- Mental model traditionnel: "Je partage → Peut-être que ça aide → Je ne saurai jamais"
- Frustration: Actions dans le vide, pas de feedback, pas de sens d'accomplissement
- Besoin: Voir l'impact concret de chaque action, aussi petite soit-elle

**Ambassadeurs engagés:**
- Mental model traditionnel: "Je me dévoue → J'attends qu'on me dise quoi faire → Je suis un exécutant"
- Frustration: Pas de pouvoir décisionnel, pas de vision d'impact, routine ennuyeuse
- Besoin: Sentiment de propriété, impact visible, rituel engageant

**Mental Model EnfantPerdu.bf (Révolutionnaire):**

**Pour tous:** "J'agis → Je VOIS immédiatement l'impact → J'ai envie de faire plus"

- **Transparence radicale:** Rien n'est caché, tout est visible en temps réel
- **Quantification systématique:** Chaque action produit un chiffre précis (X personnes touchées, Y ambassadeurs mobilisés)
- **Feedback loop rapide:** Temps entre action et récompense < 500ms
- **Sentiment collectif:** "Nous" plutôt que "je", mais "je" quantifié dans le "nous"
- **Permanence de l'action:** La communauté ne dort jamais (indicateurs 24/7)

### Success Criteria

**L'expérience signature est réussie quand:**

**1. Famille dit "OMG ça marche vraiment !" (< 30 secondes après signalement)**
- ✅ Compteur mobilisation atteint 1,000+ personnes visiblement
- ✅ Animation propagation fluide et satisfaisante (60fps)
- ✅ Liste canaux diffusion se coche en temps réel
- ✅ Parent sent soulagement physique (respiration, larmes de soulagement)
- **KPI:** 95% des familles restent sur page confirmation > 30 secondes (engagement)

**2. Ambassadeur ouvre le site TOUS les matins sans rappel (addiction éthique)**
- ✅ Morning briefing toujours nouveau et imprévisible (variable reward)
- ✅ Stats personnelles impressionnantes et fières
- ✅ Défis quotidiens atteignables et motivants
- ✅ Sentiment FOMO si skip une journée
- **KPI:** 70% ambassadeurs actifs ouvrent site 5+ fois/semaine

**3. Communauté partage spontanément et revient (engagement soutenu)**
- ✅ Toast impact apparaît < 500ms après clic partage
- ✅ Chiffre impact est précis, crédible et gratifiant
- ✅ Badge premier partage débloqué immédiatement
- ✅ Envie immédiate de partager une autre annonce
- **KPI:** 40% des contributeurs partagent 3+ annonces dans leur première session

**4. Utilisateur dit à un ami "Tu DOIS voir ce site !" (viralité organique)**
- ✅ Expérience tellement satisfaisante qu'elle mérite d'être racontée
- ✅ Moments "wow" mémorables à partager
- ✅ Sentiment de fierté d'appartenir à cette communauté
- **KPI:** Net Promoter Score > 50 (excellent)

**5. Chaque page du site montre l'activité live (omnipresence impact)**
- ✅ Status bar live visible sur 100% des pages
- ✅ Chiffres bougent régulièrement (pas statiques)
- ✅ Feed activité se met à jour automatiquement
- **KPI:** Temps moyen sur site > 3 minutes (vs 1 min plateformes similaires)

### Novel vs Established Patterns

**Patterns Établis (À Adopter):**

1. **Compteurs Live (Twitch, YouTube Live)**
   - Pattern éprouvé: Viewers count en temps réel
   - Notre adaptation: Personnes mobilisées en temps réel
   - Pourquoi ça marche: Preuve sociale + FOMO + sentiment d'événement live

2. **Toast Notifications (Apps Modernes)**
   - Pattern éprouvé: Feedback visuel temporaire après action
   - Notre adaptation: Toast avec impact quantifié + animation satisfaisante
   - Pourquoi ça marche: Gratification immédiate sans interrompre flow

3. **Status Indicators (WhatsApp, Slack)**
   - Pattern éprouvé: "En ligne", "Actif il y a X min"
   - Notre adaptation: "X ambassadeurs actifs MAINTENANT"
   - Pourquoi ça marche: Sentiment de présence humaine et communauté vivante

4. **Pull-to-Refresh (Apps Mobile)**
   - Pattern éprouvé: Geste universel pour actualiser contenu
   - Notre adaptation: Refresh + animation satisfaisante + toujours nouveau contenu
   - Pourquoi ça marche: Contrôle utilisateur + curiosité + variable reward

**Patterns Novateurs (À Créer):**

1. **"Explosion de Mobilisation" (Unique à EnfantPerdu.bf)**
   - **Innovation:** Visualisation dramatique et émotionnelle de diffusion multi-canaux en temps réel
   - **Enseignement utilisateur:**
     - Animation auto-play explicative lors du premier signalement
     - Légendes courtes: "Votre annonce est diffusée sur tous nos canaux"
     - Métaphore familière: "Comme jeter une pierre dans l'eau → vagues qui se propagent"
   - **Risque:** Trop dramatique? → Mitigation: Tester avec familles réelles
   - **Unique car:** Aucune plateforme existante ne montre diffusion instantanée multi-canaux de cette façon

2. **"Morning Briefing Ambassadeur" (Inspiré de TikTok/jeux mobiles)**
   - **Innovation:** Variable reward quotidien pour créer addiction éthique
   - **Enseignement utilisateur:**
     - Onboarding ambassadeur explique le concept
     - Premiers jours: Briefings simples et gratifiants
     - Progression: Complexité augmente avec niveau ambassadeur
   - **Risque:** Burn-out ambassadeurs? → Mitigation: Opt-out fréquence notifications
   - **Unique car:** Mission sérieuse + gamification addictive + variable rewards

3. **"Compteur Impact Personnel Cumulé" (Inspiré de fitness trackers)**
   - **Innovation:** Quantifier TOUT (partages, portée, témoignages, recherches) en un seul dashboard personnel
   - **Enseignement utilisateur:**
     - Tooltip explique chaque métrique lors premier hover
     - Comparaisons sociales: "Top 10% des contributeurs"
     - Visualisations: Graphiques évolution, heatmaps activité
   - **Risque:** Gamification trivialise mission? → Mitigation: Toujours lier chiffres à impact réel
   - **Unique car:** Tracking d'impact philanthropique avec précision d'app fitness

### Experience Mechanics

**Mécanique Détaillée: "Explosion de Mobilisation" (Exemple Famille)**

**1. Initiation:**
- **Déclencheur:** Bouton "✅ Valider et publier" du formulaire signalement (Step 4 nouveau flow)
- **Invitation:** Button design urgence (rouge vif, gros, centré, pulsation subtile)
- **État mental:** Famille anxieuse, espère que "ça va marcher"

**2. Interaction:**
- **T+0ms:** Click bouton
  - Bouton désactivé immédiatement
  - Loading spinner + haptic feedback (vibration mobile)
  - Texte change: "Publication en cours..."

- **T+200ms:** Navigation automatique page "/confirmation/[announceId]"
  - Animation transition fluide (slide up)
  - Background gradient orange-rouge (urgence)

- **T+300ms:** Affichage composants page confirmation
  - Photo enfant en grand (rappel émotionnel)
  - Message rassurant: "🚨 Votre signalement est diffusé"
  - Sous-titre: "Une communauté se mobilise pour vous"

**3. Feedback (Magic Happens):**

- **T+500ms:** Animation propagation commence
  - Carte géographique centrée sur localisation disparition
  - Animation vagues concentriques (comme sonar)
  - Son subtil "whoosh" (optionnel, activable)

- **T+700ms → T+30s:** Compteur mobilisation live
  - Chiffre commence à 0
  - S'incrémente par paliers: +5, +10, +50, +100, +500
  - Animation number flip satisfaisante
  - Atteint objectif: 2,000-5,000 personnes (selon zone)
  - Chaque incrément accompagné micro-animation

- **T+1s → T+15s:** Liste canaux diffusion (check progressif)
  - "⏳ Facebook..." → "✓ Facebook (2,450 vues)"
  - "⏳ WhatsApp..." → "✓ WhatsApp (156 groupes)"
  - "⏳ Instagram..." → "✓ Instagram (890 vues)"
  - "⏳ X (Twitter)..." → "✓ X (345 retweets)"
  - "⏳ Notifications push..." → "✓ 234 personnes zone notifiées"
  - Chaque check = animation + son subtil

- **T+10s → T+30s:** Statistiques ambassadeurs
  - "🔥 12 ambassadeurs alertés dans votre zone"
  - "👥 3 recherches actives démarrées"
  - Avatars ambassadeurs actifs (floutés si pas public)

- **T+30s:** État final stabilisé
  - Compteur final impressionnant et stable
  - Tous canaux cochés verts
  - Message: "✅ Mobilisation réussie ! 2,450 personnes notifiées"
  - CTA: "Voir la carte des recherches" / "Partager sur mes réseaux"

**4. Completion:**
- **Indicateur "done":** Tous canaux cochés, compteur stable, message success
- **Outcome réussi:** Famille sent soulagement, espoir, confiance dans système
- **What's next:**
  - Bouton: "📍 Suivre les recherches en temps réel"
  - Bouton: "📱 Partager l'annonce"
  - Bouton: "💬 Envoyer un message aux ambassadeurs"
  - Auto-redirect après 60s vers page détail annonce

**Gestion Erreurs:**

**Si échec technique:**
- Message honnête: "⚠️ Problème de connexion. Votre signalement est enregistré et sera diffusé dès que possible."
- CTA: "Réessayer maintenant" / "Continuer (diffusion automatique dans 5 min)"
- Notification push quand diffusion réussie plus tard

**Si zone faible densité:**
- Compteur plus modeste mais toujours positif: "450 personnes notifiées"
- Message adapté: "Zone peu peuplée, mais tous les ambassadeurs régionaux sont alertés"
- Pas de sentiment d'échec, juste réalisme rassurant

**Principes de Design:**

1. **Jamais de silence:** Toujours du mouvement, des chiffres qui bougent, des checks qui s'ajoutent
2. **Toujours positif:** Même si chiffres modestes, célébrer la mobilisation
3. **Hyper-réactif:** < 500ms entre action et premier feedback visuel
4. **Satisfaisant visuellement:** Animations fluides 60fps, micro-interactions soignées
5. **Émotionnellement intelligent:** Ton rassurant, empathique, jamais froid

---
## 3. Fondation Visuelle

### 3.1 Analyse du Design Actuel

**Forces identifiées:**
- Design épuré et minimal qui respire la confiance
- Logo bien intégré (36x36px) avec branding cohérent "EnfantDisparu.bf"
- Mobile-first avec zones tactiles adéquates (44px minimum)
- Code couleur par plateforme sociale (bleu Facebook, vert WhatsApp, noir X/TikTok)
- Utilisation intelligente d'emojis pour reconnaissance visuelle rapide
- Hiérarchie visuelle claire avec bons contrastes

**Opportunités d'amélioration:**
- Formaliser le système de couleurs avec mappings sémantiques
- Enrichir l'échelle typographique pour plus de niveaux
- Documenter les principes d'animation et de mouvement
- Renforcer l'accessibilité avec focus states et ARIA
- Créer des tokens de design réutilisables

### 3.2 Système de Couleurs

#### Palette de Marque (Existante)
```
Rouge Principal:    #DC2626 (red-600)  - Urgence, alerte, action
Orange Accent:      #EA580C (orange-600) - Notifications, attention
Vert Succès:        #16A34A (green-600)  - Validation, WhatsApp
```

#### Palette Sémantique Étendue

**Primary (Urgence):**
- 50:  #FEF2F2  - Backgrounds subtils
- 100: #FEE2E2  - Hover states légers
- 500: #EF4444  - Actions secondaires
- 600: #DC2626  - **Principal** - CTAs, titres importants
- 700: #B91C1C  - Hover primary
- 800: #991B1B  - Active states
- 900: #7F1D1D  - Texte sur fond clair

**Secondary (Confiance):**
- 50:  #EFF6FF  - Info boxes
- 500: #3B82F6  - Liens, Facebook
- 600: #2563EB  - Hover liens
- 700: #1D4ED8  - Texte info

**Warning (Attention):**
- 50:  #FFF7ED  - Backgrounds notifications
- 500: #F97316  - **Orange principal**
- 600: #EA580C  - Notifications push
- 700: #C2410C  - Hover/Active

**Success (Validation):**
- 50:  #F0FDF4  - Success boxes
- 500: #22C55E  - Icons success
- 600: #16A34A  - **Vert principal**
- 700: #15803D  - WhatsApp dark

**Neutrals (Structure):**
- 50:  #F9FAFB  - Background app
- 100: #F3F4F6  - Cards background
- 200: #E5E7EB  - Borders
- 400: #9CA3AF  - Placeholders
- 500: #6B7280  - Text secondary
- 600: #4B5563  - Text tertiary
- 700: #374151  - Text body
- 800: #1F2937  - Headings secondary
- 900: #111827  - **Headings principal**

#### Couleurs Plateformes Sociales
```
Facebook:     #3B82F6 (blue-500)
Instagram:    Gradient purple-50 to pink-50 (#F3E8FF → #FCE7F3)
WhatsApp:     #16A34A (green-600)
X (Twitter):  #111827 (gray-900)
TikTok:       #111827 (gray-900)
LinkedIn:     #2563EB (blue-600)
```

#### Palette Émotionnelle Contextualisée

**⚠️ Amélioration War Room:** Adapter les couleurs selon le contexte émotionnel de l'utilisateur et le statut de l'annonce pour éviter la fatigue visuelle et le stress cognitif.

**Contexte Urgence (Actif - J+0 à J+7):**
- Rouge #DC2626 - Annonces actives récentes, CTAs signalement
- Orange #EA580C - Notifications push, alertes immédiates
- Usage: Interface principale, boutons d'action, stats temps réel

**Contexte Calme (Suivi/Recherche - J+8+):**
- Bleu #3B82F6 - Dashboards, statistiques historiques, suivi long terme
- Gris #6B7280 - Informations secondaires, métadonnées
- Usage: Vue d'ensemble, rapports, recherches continues

**Contexte Résolution (Retrouvé):**
- Vert #16A34A - Enfants retrouvés, messages de succès
- Beige #F5F5F4 - Backgrounds apaisants pour bonnes nouvelles
- Usage: Pages de confirmation positive, célébration

**Contexte Historique (>30 jours):**
- Gris neutre #9CA3AF - Annonces anciennes, archives
- Usage: Évite la saturation rouge sur annonces anciennes

**Rationale:** Les familles en crise ont besoin de rouge (urgence), les ambassadeurs quotidiens ont besoin de bleu/gris (moins fatiguant), les autorités consultent 50+ annonces/jour (palette sobre nécessaire).

#### Mappings Sémantiques

| Usage                  | Couleur              | Hex Code |
|------------------------|----------------------|----------|
| CTA Principal          | Red-600              | #DC2626  |
| CTA Hover              | Red-700              | #B91C1C  |
| CTA Active             | Red-800              | #991B1B  |
| CTA Disabled           | Red-400              | #F87171  |
| Lien Standard          | Blue-500             | #3B82F6  |
| Lien Hover             | Blue-600             | #2563EB  |
| Success                | Green-600            | #16A34A  |
| Warning                | Orange-600           | #EA580C  |
| Error                  | Red-600              | #DC2626  |
| Info                   | Blue-50 bg + Blue-700 text | #EFF6FF / #1D4ED8 |
| Text Principal         | Gray-900             | #111827  |
| Text Secondaire        | Gray-600             | #4B5563  |
| Text Tertiaire         | Gray-400             | #9CA3AF  |
| Border Subtil          | Gray-100             | #F3F4F6  |
| Border Standard        | Gray-200             | #E5E7EB  |

#### Accessibilité des Contrastes

**Ratio WCAG AA+ (4.5:1 minimum):**
- ✅ Red-600 sur blanc: 5.2:1
- ✅ Gray-900 sur blanc: 18.4:1
- ✅ Gray-600 sur blanc: 7.2:1
- ✅ Blue-500 sur blanc: 4.5:1
- ✅ Orange-600 sur blanc: 6.1:1
- ✅ Blanc sur Red-600: 5.2:1
- ✅ Blanc sur Gray-900: 18.4:1

**Principes:**
- Texte principal: minimum 4.5:1 (AA)
- Texte large (18pt+): minimum 3:1 (AA)
- Éléments interactifs: minimum 3:1 pour bordures/icônes
- Ne jamais utiliser la couleur seule pour transmettre l'information

### 3.3 Système Typographique

#### Famille de Polices

**Principal:** Inter (Google Fonts)
- **Raison:** Police système moderne, excellente lisibilité mobile, chargement rapide
- **Poids utilisés:** 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold), 800 (Extrabold)
- **Fallbacks:** system-ui, -apple-system, BlinkMacSystemFont, sans-serif

**Configuration:**
```css
font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
font-feature-settings: 'cv05' on, 'cv11' on;
-webkit-font-smoothing: antialiased;
```

#### Échelle Typographique

| Niveau    | Taille   | Line Height | Poids      | Usage                                |
|-----------|----------|-------------|------------|--------------------------------------|
| **H1**    | 2rem     | 1.25        | 800        | Titre page principale                |
| **H2**    | 1.5rem   | 1.3         | 700        | Sections principales, stats totales  |
| **H3**    | 1.25rem  | 1.4         | 700        | Sous-sections, titres de cartes      |
| **H4**    | 1rem     | 1.4         | 600        | Titres tertiaires                    |
| **Body L** | 1rem    | 1.6         | 400        | Texte principal, descriptions        |
| **Body M** | 0.875rem| 1.5         | 400        | Texte secondaire, labels             |
| **Body S** | 0.75rem | 1.5         | 400        | Captions, timestamps, meta info      |
| **Label**  | 0.75rem | 1.5         | 600        | Labels de formulaire                 |
| **Button** | 0.875rem| 1.2         | 600        | Boutons standard                     |
| **Stat**   | 2.5rem  | 1           | 800        | Chiffres impactants (reach total)    |
| **Micro**  | 0.625rem| 1.4         | 500        | Uppercase tracking-widest headers    |

#### Classes Tailwind Correspondantes

```
H1:      text-2xl sm:text-3xl font-extrabold text-gray-900
H2:      text-xl sm:text-2xl font-bold text-gray-900
H3:      text-lg sm:text-xl font-bold text-gray-900
Body L:  text-base leading-relaxed text-gray-700
Body M:  text-sm text-gray-600
Body S:  text-xs text-gray-500
Label:   text-sm font-medium text-gray-700
Stat:    text-2xl sm:text-3xl font-extrabold text-gray-900
Micro:   text-xs font-semibold text-gray-400 uppercase tracking-widest
```

#### Principes Typographiques

1. **Hiérarchie claire:** Chaque niveau doit être instantanément distinguable (ratio 1.25x minimum)
2. **Lisibilité mobile:** Line-height généreux (1.5-1.6) pour lecture confortable sur petit écran
3. **Longueur de ligne:** Max 65-75 caractères (max-w-2xl = 672px)
4. **Contraste de poids:** Utiliser bold/extrabold pour attirer l'attention sur l'essentiel
5. **Espacement vertical:** 1.5-2x la taille de police entre paragraphes

#### Responsive Typography

**Breakpoints:**
- Mobile (< 640px): Tailles de base
- Tablet (640px+): +0.125rem sur titres H1-H3
- Desktop (1024px+): Conserver tailles tablet (mobile-first)

**Stratégie:**
- Prioriser la lisibilité mobile (90% des utilisateurs)
- Augmenter modérément sur écrans larges sans exagérer
- Maintenir les proportions de l'échelle

### 3.4 Espacement et Layout

#### Système d'Espacement (Base 4px)

**Échelle Tailwind (multiples de 4px):**

| Token | Valeur  | Usage                                              |
|-------|---------|---------------------------------------------------|
| 0     | 0       | Reset espacement                                   |
| 0.5   | 2px     | Bordures fines                                     |
| 1     | 4px     | Espacement minimal entre éléments inline           |
| 1.5   | 6px     | Gap entre icône et texte                           |
| 2     | 8px     | Espacement standard éléments compacts              |
| 3     | 12px    | Gap entre inputs, espacement cards compacts        |
| 4     | 16px    | **Espacement standard** - padding cards, gap grids |
| 5     | 20px    | Padding cards importantes                          |
| 6     | 24px    | Espacement entre sections                          |
| 8     | 32px    | Marges section-to-section                          |
| 10    | 40px    | Espacements majeurs                                |
| 12    | 48px    | Séparation composants majeurs                      |

#### Unité de Base Recommandée

**8px (space-2)** comme unité de composition principale:
- Aligne avec les grilles de design (8pt grid)
- Compatible avec les targets tactiles (44px = 5.5 unités)
- Facilite le calcul mental (2, 4, 6, 8, 12, 16, 24)

#### Layout Container

**Max-width principal:** `max-w-2xl` (672px)
- **Raison:** Lecture optimale sur mobile (iPhone 14 Pro = 393px, laisse marges)
- **Padding horizontal:** `px-3 sm:px-4` (12px mobile, 16px tablet+)
- **Centrage:** `mx-auto` pour centrer le container

**Breakpoints:**
```
sm:  640px  - Tablet portrait
md:  768px  - Tablet landscape
lg:  1024px - Desktop
xl:  1280px - Large desktop
```

**Stratégie mobile-first:**
1. Design pour 375px width minimum (iPhone SE)
2. Expand gracieusement jusqu'à 672px (max-w-2xl)
3. Centrer et marges sur écrans plus larges

#### Grille et Colonnes

**Grid principal:** CSS Grid avec colonnes flexibles
```
grid-cols-2  - Formulaires (âge + genre)
grid-cols-3  - Stats plateformes sociales
grid-cols-4  - Stats TikTok détaillées
```

**Gap standard:**
- Grilles compactes: `gap-2` (8px)
- Grilles standard: `gap-3` (12px)
- Grilles aérées: `gap-4` (16px)

#### Border Radius (Coins Arrondis)

| Token      | Valeur | Usage                                    |
|------------|--------|------------------------------------------|
| rounded    | 4px    | Petits éléments (badges, pills)          |
| rounded-lg | 8px    | Inputs, boutons secondaires              |
| rounded-xl | 12px   | **Standard** - Boutons, petites cards    |
| rounded-2xl| 16px   | Cards principales, conteneurs majeurs    |
| rounded-full| 9999px| Avatars, progress dots                   |

**Principe:** Plus l'élément est grand, plus le radius est généreux (crée harmonie visuelle).

#### Shadows (Ombres)

```
shadow-sm:   0 1px 2px rgba(0,0,0,0.05)        - Cards standard
shadow:      0 1px 3px rgba(0,0,0,0.1)         - Cards élevées
shadow-md:   0 4px 6px rgba(0,0,0,0.1)         - Modals, dropdowns
shadow-lg:   0 10px 15px rgba(0,0,0,0.1)       - Overlays importants
```

**Usage actuel:** Principalement `shadow-sm` pour subtilité et élégance.

#### Principes de Layout

1. **Mobile-first:** Tout commence en colonne unique, expand sur écrans larges
2. **Respiration:** Minimum 16px padding dans toutes les cards
3. **Alignement vertical:** Utiliser `items-center` pour centrer icônes + texte
4. **Conteneur max:** Ne jamais dépasser max-w-2xl pour garder focus
5. **Touch targets:** Minimum 44x44px pour tous les boutons/liens (iOS HIG)

### 3.5 Composants Visuels Clés

#### Boutons

**Primary (CTA):**
```
bg-red-600 hover:bg-red-700 active:bg-red-800 active:scale-[0.98]
text-white font-semibold px-4 py-3.5 rounded-xl
transition-colors min-h-[44px]
```

**Secondary:**
```
border border-gray-200 text-gray-600 hover:bg-gray-50 active:bg-gray-100
font-medium px-4 py-3.5 rounded-xl min-w-[100px]
```

**Disabled:**
```
bg-red-400 text-white cursor-not-allowed opacity-60
```

#### Cards

**Standard:**
```
bg-white border border-gray-100 shadow-sm rounded-2xl p-5
```

**Info Box:**
```
bg-blue-50 rounded-xl p-4 text-sm text-blue-700
```

**Warning Box:**
```
bg-red-50 border-2 border-red-200 rounded-xl p-4
```

#### Forms

**Input:**
```
border border-gray-200 rounded-xl px-4 py-3
focus:ring-2 focus:ring-red-500 focus:border-transparent
text-gray-900 placeholder:text-gray-400
```

**Error State:**
```
border-red-300 focus:ring-red-500
```

**Label:**
```
text-sm font-medium text-gray-700 mb-2
```

#### Progress Indicators

**Step Circle:**
```
Completed: bg-green-500 text-white
Current:   bg-red-600 text-white
Pending:   bg-gray-200 text-gray-400
Size:      w-8 h-8 rounded-full
```

#### Stats Cards (Social Media)

**Pattern répétable:**
```html
<div class="rounded-xl bg-[platform-color-50] p-4">
  <div class="flex items-center gap-2 mb-2">
    <span class="text-xl">[emoji]</span>
    <p class="font-bold text-[platform-color-800]">[Platform]</p>
  </div>
  <div class="grid grid-cols-3 gap-2 text-center">
    [StatItem components]
  </div>
</div>
```

**Variantes par plateforme:**
- Facebook: `bg-blue-50`, `text-blue-800`
- Instagram: `bg-gradient-to-br from-purple-50 to-pink-50`, `text-pink-800`
- WhatsApp: `bg-green-50`, `text-green-800`
- X/TikTok: `bg-gray-900`, `text-white`
- Notifications: `bg-orange-50`, `text-orange-800`

### 3.6 Animations et Mouvement

#### Transitions

**Standard:**
```
transition-colors duration-200
```

**Usage:** Hover states sur boutons, liens, cards interactives

**Scale Active:**
```
active:scale-[0.98]
```

**Usage:** Feedback tactile sur boutons (sensation de "press")

#### Principes d'Animation

1. **Subtilité:** Animations discrètes pour ne pas distraire de l'urgence
2. **Performance:** Préférer `transform` et `opacity` (GPU accelerated)
3. **Durée:** 200ms maximum pour micro-interactions
4. **Easing:** `ease-out` par défaut (démarrage rapide, fin douce)
5. **Respect motion:** Honorer `prefers-reduced-motion` pour accessibilité

#### États Interactifs

**Boutons:**
- Default → Hover → Active → Disabled
- Hover: Couleur légèrement plus foncée
- Active: Couleur + foncée + scale(0.98)
- Disabled: Opacité réduite + cursor not-allowed

**Liens:**
- Default: Blue-500
- Hover: Blue-600 + underline
- Visited: Même couleur (pas de distinction pour éviter confusion)
- Focus: Ring-2 ring-red-500 (accessibilité clavier)

**Inputs:**
- Default: Border gray-200
- Focus: Ring-2 ring-red-500 + border transparent
- Error: Border red-300 + ring-red-500
- Disabled: bg-gray-50 + cursor not-allowed

### 3.7 Considérations d'Accessibilité

#### WCAG 2.1 AA Compliance

**Contraste des Couleurs:**
- ✅ Texte normal (16px): minimum 4.5:1
- ✅ Texte large (18px+ ou 14px bold): minimum 3:1
- ✅ Composants UI (borders, icons): minimum 3:1
- ✅ États hover/focus clairement distinguables

**Focus Visible:**
```css
focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
```

**Tous les éléments interactifs doivent avoir un focus state visible.**

#### Hiérarchie Sémantique

**HTML structure:**
```html
<h1>Titre page (1 seul par page)</h1>
<h2>Section principale</h2>
<h3>Sous-section</h3>
<p>Paragraphe body text</p>
```

**Importance:** Screen readers utilisent les headings pour navigation.

#### Targets Tactiles

**Taille minimum:** 44x44px (iOS) / 48x48px (Android Material)
```
min-h-[44px] min-w-[44px] p-3.5
```

**Espacement:** Minimum 8px entre targets tactiles adjacents.

#### Labels et ARIA

**Formulaires:**
```html
<label for="childName">Nom de l'enfant</label>
<input id="childName" name="childName" aria-required="true" />
```

**Boutons:**
```html
<button aria-label="Signaler une disparition">🚨 Signaler</button>
```

**Icons seules nécessitent aria-label explicite.**

#### Texte Alternatif

**Images:**
```html
<img src="/logo.png" alt="EnfantDisparu.bf - Logo" />
<img src="/photo.jpg" alt="Photo de Aminata, 6 ans, disparue" />
```

**Images décoratives:**
```html
<img src="/decoration.svg" alt="" role="presentation" />
```

#### Responsive Text

**Éviter text-xs sur informations critiques sur mobile (difficile à lire).**
- Minimum: text-sm (14px) pour texte principal
- Labels et captions: text-xs acceptable

#### Couleur + Forme

**Ne jamais utiliser la couleur seule pour communiquer:**
- ✅ Vert + checkmark ✓ (succès)
- ✅ Rouge + icône ⚠️ (erreur)
- ❌ Juste un texte rouge pour erreur

#### Contraste en Mode Sombre

**Note:** Design actuel en mode clair uniquement.
**Recommandation future:** Implémenter dark mode avec:
- Background: gray-900
- Text: gray-100
- Ajuster couleurs pour maintenir contraste WCAG AA

### 3.8 Tokens de Design (Design System)

#### Configuration Tailwind Étendue

```typescript
// tailwind.config.ts
const config: Config = {
  theme: {
    extend: {
      colors: {
        brand: {
          red: {
            50: '#FEF2F2',
            500: '#EF4444',
            600: '#DC2626',  // Primary
            700: '#B91C1C',
            800: '#991B1B',
          },
          orange: {
            50: '#FFF7ED',
            500: '#F97316',
            600: '#EA580C',  // Notifications
          },
          green: {
            50: '#F0FDF4',
            500: '#22C55E',
            600: '#16A34A',  // Success
          },
          blue: {
            50: '#EFF6FF',
            500: '#3B82F6',  // Info/Facebook
            600: '#2563EB',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'stat': ['2.5rem', { lineHeight: '1', fontWeight: '800' }],
      },
      spacing: {
        '18': '4.5rem',  // Custom spacing si besoin
      },
      borderRadius: {
        '4xl': '2rem',  // Pour très grandes cards si nécessaire
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.08)',
      },
    },
  },
};
```

#### Variables CSS Personnalisées

```css
:root {
  /* Couleurs sémantiques */
  --color-primary: #DC2626;
  --color-primary-hover: #B91C1C;
  --color-secondary: #3B82F6;
  --color-success: #16A34A;
  --color-warning: #EA580C;
  --color-error: #DC2626;

  /* Typography */
  --font-family-base: 'Inter', system-ui, sans-serif;
  --font-size-base: 1rem;
  --line-height-base: 1.6;

  /* Spacing */
  --spacing-unit: 0.25rem; /* 4px */
  --spacing-xs: calc(var(--spacing-unit) * 2);   /* 8px */
  --spacing-sm: calc(var(--spacing-unit) * 3);   /* 12px */
  --spacing-md: calc(var(--spacing-unit) * 4);   /* 16px */
  --spacing-lg: calc(var(--spacing-unit) * 6);   /* 24px */
  --spacing-xl: calc(var(--spacing-unit) * 8);   /* 32px */

  /* Border radius */
  --radius-sm: 0.5rem;   /* 8px */
  --radius-md: 0.75rem;  /* 12px */
  --radius-lg: 1rem;     /* 16px */

  /* Shadows */
  --shadow-card: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-elevated: 0 4px 6px rgba(0,0,0,0.1);

  /* Layout */
  --container-max-width: 42rem; /* 672px */
  --touch-target-min: 2.75rem;  /* 44px */
}
```

### 3.9 Principes de Design Visuel

#### 1. Clarté avant Créativité
- **Objectif:** Retrouver un enfant, pas impressionner visuellement
- **Application:** Interfaces épurées, typographie lisible, hiérarchie évidente
- **Exemple:** Bouton "🚨 Signaler" en rouge vif, impossible à manquer

#### 2. Urgence sans Anxiété
- **Objectif:** Transmettre l'urgence sans créer de panique
- **Application:** Rouge pour actions, mais backgrounds clairs et aérés
- **Exemple:** Warning box rouge avec beaucoup d'espacement pour respirer

#### 3. Confiance par la Structure
- **Objectif:** Rassurer les familles que c'est sérieux et professionnel
- **Application:** Alignements précis, spacing consistant, design soigné
- **Exemple:** Cards bien alignées, grilles parfaites, aucun élément bancal

#### 4. Mobile-First Obligatoire
- **Objectif:** 90% des utilisateurs sur mobile en Afrique
- **Application:** Design pour 375px d'abord, expand ensuite
- **Exemple:** Touch targets 44px, text lisible sans zoom

#### 5. Performance Visuelle
- **Objectif:** Chargement rapide même sur 3G
- **Application:** Emojis au lieu d'icon libraries, CSS natif, pas de bloat
- **Exemple:** ✅ emoji check au lieu de SVG icon

#### 6. Universalité Culturelle
- **Objectif:** Compréhensible pour toutes les cultures du Burkina Faso
- **Application:** Emojis universels, pas de symboles culture-spécifiques
- **Exemple:** 📍 pour localisation, 📱 pour téléphone

#### 7. Feedback Immédiat
- **Objectif:** L'utilisateur doit toujours savoir ce qui se passe
- **Application:** Hover states, active states, loading states
- **Exemple:** active:scale-[0.98] sur boutons pour feedback tactile

#### 8. Adaptabilité Émotionnelle
- **Objectif:** Le design s'adapte au contexte émotionnel et au statut de l'annonce
- **Application:** Rouge = urgence active (J+0-7), Bleu = suivi calme (J+8+), Vert = résolution, Gris = historique (>30j)
- **Exemple:** Annonce fraîche → Rouge dominant, Annonce 2 semaines → Transition bleu, Enfant retrouvé → Vert + célébration
- **Impact:** Réduit stress cognitif, aide à prioriser visuellement, respecte l'état mental de l'utilisateur
- **Implémentation:** Classes conditionnelles basées sur `daysSinceCreation` et `status`

### 3.10 Guidelines d'Implémentation

#### Pour les Développeurs

**1. Utiliser Tailwind Utility-First:**
```jsx
// ✅ Bon
<button className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold px-4 py-3.5 rounded-xl transition-colors">
  Publier
</button>

// ❌ Éviter CSS personnalisé sauf nécessité
<button className="custom-button">Publier</button>
```

**2. Composer des Variants:**
```typescript
// Utiliser cva (class-variance-authority) pour variantes
const buttonVariants = cva(
  "font-semibold rounded-xl transition-colors",
  {
    variants: {
      intent: {
        primary: "bg-red-600 hover:bg-red-700 text-white",
        secondary: "border border-gray-200 text-gray-600 hover:bg-gray-50",
      },
      size: {
        md: "px-4 py-3.5 text-sm",
        lg: "px-6 py-4 text-base",
      },
    },
  }
);
```

**3. Respecter la Hiérarchie:**
- 1 seul H1 par page
- H2 pour sections principales
- Ne pas sauter de niveau (H2 → H4 interdit)

**4. Accessibilité Checklist:**
- [ ] Focus states visibles sur tous les interactifs
- [ ] Alt text sur toutes les images
- [ ] Labels sur tous les inputs
- [ ] ARIA labels sur icons/emojis seuls
- [ ] Touch targets minimum 44x44px
- [ ] Contraste minimum 4.5:1

**5. Responsive Testing:**
- [ ] iPhone SE (375px) - minimum
- [ ] iPhone 14 Pro (393px) - commun
- [ ] iPad Mini (768px) - tablet
- [ ] Desktop (1280px+) - rare mais tester

**6. Performance Critique (URGENT avant lancement):**

**Logo Optimization:**
- ❌ **Actuel:** logo.png (805KB) - 8 secondes chargement sur 3G @ 100kbps
- ✅ **Requis:** logo.svg (~8KB) - <0.1s chargement
- **Action:** Vectoriser le logo PNG existant, optimiser avec SVGO
- **Impact:** -99% poids (-797KB), scalable toutes résolutions
- **Deadline:** AVANT LANCEMENT
- **Responsable:** Designer + Développeur (2h travail total)

**Reduced Motion Support:**
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
**Importance:** Accessibilité légale - utilisateurs avec épilepsie, vertiges, TDAH doivent avoir expérience sans animations.

**Bundle Size Monitoring:**
- Lighthouse budget: Max 200KB JavaScript
- CSS max: 50KB après compression
- Fonts preload: Inter 400/600/700 uniquement (pas 500/800)
- Images: WebP avec fallback JPEG (pas PNG sauf logo SVG)

#### Pour les Designers

**1. Fichier Figma:**
- Utiliser les tokens de couleurs définis
- Respecter l'échelle typographique
- Grid 8px pour alignement
- Components réutilisables (boutons, inputs, cards)

**2. Export Assets:**
- Logo: SVG vectoriel (pas PNG 805KB!) - **CRITIQUE: Voir section 3.10.6**
- Photos enfants: WebP optimisé
- Icons: Emojis système (pas de custom SVG sauf nécessité)

**3. Design System:**
- Créer library Figma avec tous les composants
- Documenter chaque variant
- Partager avec développeurs pour sync

### 3.11 Checklist de Validation Visuelle

#### Avant Chaque Déploiement

**Couleurs:**
- [ ] Toutes les couleurs viennent de la palette définie
- [ ] Contraste WCAG AA validé sur WebAIM
- [ ] Pas de couleur hardcodée en hex (utiliser Tailwind)

**Typographie:**
- [ ] Police Inter chargée correctement
- [ ] Échelle respectée (pas de tailles custom)
- [ ] Line-height adéquat (min 1.5 pour body)
- [ ] Hiérarchie H1-H3 logique

**Spacing:**
- [ ] Multiples de 4px uniquement
- [ ] Padding cards minimum 16px
- [ ] Touch targets minimum 44px
- [ ] Aucun élément qui se touche (min 8px gap)

**Responsive:**
- [ ] Test sur iPhone SE (375px)
- [ ] Pas de scroll horizontal
- [ ] Texte lisible sans zoom
- [ ] Touch targets accessibles

**Accessibilité:**
- [ ] Focus states visibles
- [ ] Keyboard navigation fonctionne
- [ ] Screen reader: test avec VoiceOver/TalkBack
- [ ] Alt text sur images
- [ ] ARIA labels où nécessaire

**Performance:**
- [ ] Lighthouse score >90
- [ ] Fonts préchargées
- [ ] Images optimisées (WebP)
- [ ] Pas de layout shifts (CLS < 0.1)

### 3.12 Modes d'Interface (Phase 1.5 - Post-Launch +2 semaines)

**⚠️ Amélioration War Room:** Permettre aux autorités et professionnels d'avoir une interface adaptée à leur usage quotidien intensif.

#### Mode Standard (Default)

**Cible:** Familles, grand public, ambassadeurs occasionnels

**Caractéristiques:**
- Emojis visibles pour reconnaissance rapide
- Espacement généreux (space-4 à space-6)
- Couleurs vives (rouge #DC2626, orange #EA580C)
- Touch targets 44px minimum
- Typographie: text-base (16px) pour body
- Padding cards: p-5 (20px)

**Ton:** Accessible, rassurant, urgent quand nécessaire

#### Mode Pro (Opt-in pour Autorités)

**Cible:** Police, gendarmerie, ONG, autorités consultant 50+ annonces/jour

**Caractéristiques:**
- Emojis minimisés (remplacés par icônes sobres ou cachés)
- Densité +15% (plus d'infos par écran)
- Couleurs sobres (bleu institutionnel #2563EB remplace rouge)
- Touch targets 40px (desktop principalement)
- Typographie: text-sm (14px) pour body
- Padding cards: p-4 (16px)

**Ton:** Professionnel, efficace, sobre

#### Implémentation Technique

**Déclencheur:**
```tsx
// Dans profil utilisateur
<label>
  <input type="checkbox" onChange={(e) => setUIMode(e.target.checked ? 'pro' : 'standard')} />
  Interface professionnelle (plus dense, moins de couleurs)
</label>
```

**Persistance:**
```typescript
localStorage.setItem('ui_mode', mode);
document.documentElement.setAttribute('data-mode', mode);
```

**CSS Variables (Ajout à section 3.8):**
```css
/* Mode Standard (default) */
:root {
  --color-primary: #DC2626;
  --color-primary-hover: #B91C1C;
  --emoji-display: inline;
  --spacing-scale: 1;
  --card-padding: 1.25rem;  /* 20px */
  --body-size: 1rem;        /* 16px */
}

/* Mode Pro */
[data-mode='pro'] {
  --color-primary: #2563EB;      /* Bleu institutionnel */
  --color-primary-hover: #1D4ED8;
  --emoji-display: none;          /* Cache emojis */
  --spacing-scale: 0.85;          /* Densité +15% */
  --card-padding: 1rem;           /* 16px */
  --body-size: 0.875rem;          /* 14px */
}

/* Application */
.card {
  padding: var(--card-padding);
}

.emoji {
  display: var(--emoji-display);
}

body {
  font-size: var(--body-size);
}
```

**Effort de développement:**
- Dev: 1 jour
- Testing: 2 jours
- Total: 3 jours

**ROI Estimé:**
- +40% adoption par autorités (basé sur research concurrents)
- Réduit fatigue visuelle pour utilisateurs intensifs
- Différenciateur compétitif pour partenariats institutionnels

### 3.13 Évolution Future du Design

#### Phase 1 (Lancement - Semaine 0)
- Design mobile-first clean et efficace ✅
- Palette de couleurs cohérente + émotionnelle contextualisée ✅
- Accessibilité WCAG AA ✅
- Logo SVG optimisé ✅
- Reduced motion support ✅

#### Phase 1.5 (Post-Launch Prioritaire - Semaines 2-4)
- [ ] **Mode sombre (dark mode)** - Économie data/batterie (5 jours dev)
- [ ] **Mode Pro pour autorités** - Adoption institutionnelle (3 jours dev)
- [ ] Preload fonts stratégique (Inter 400/600/700 only)
- [ ] WebP conversion toutes images

#### Phase 2 (Court terme - 3 mois)
- [ ] Animations micro-interactions enrichies (respect prefers-reduced-motion)
- [ ] Illustrations custom pour empty states
- [ ] Component library Figma complète
- [ ] Design tokens JSON exportables

#### Phase 3 (Moyen terme - 6 mois)
- [ ] Système de design documenté (Storybook)
- [ ] Brand guidelines PDF téléchargeable
- [ ] Templates pour affiches d'alerte
- [ ] Variantes régionales (langues locales)

#### Phase 4 (Long terme - 12 mois)
- [ ] Design tokens JSON (multi-plateforme)
- [ ] SDK design pour applications partenaires
- [ ] Whitelabel pour autres pays africains
- [ ] Certification accessibilité WCAG AAA

---

## 3.14 Résumé Exécutif & Décisions Cross-Functional War Room

**Fondation Approuvée:** Cette fondation visuelle préserve les forces du design actuel (clarté, efficacité, confiance) tout en formalisant un système de design scalable et accessible. L'approche mobile-first avec Inter, la palette rouge-orange-bleu, et les composants épurés créent une expérience professionnelle qui inspire confiance tout en communiquant l'urgence nécessaire pour sauver des vies.

**Améliorations Validées (Cross-Functional Team):**

### ✅ MUST HAVE - Avant Lancement (Semaine 0)

1. **Logo SVG Performance** ⚡ CRITIQUE
   - Conversion PNG 805KB → SVG 8KB (-99%)
   - Gain: 8 secondes chargement 3G
   - Impact: +20-30% completion rate
   - Lead: Designer + Dev (2h)

2. **Palette Émotionnelle Contextualisée** 🎨
   - Rouge (urgence J+0-7), Bleu (suivi J+8+), Vert (retrouvé), Gris (>30j)
   - Réduit fatigue visuelle ambassadeurs
   - Respecte état émotionnel utilisateurs
   - Lead: UX Designer

3. **Principe #8 Adaptabilité Émotionnelle** 📐
   - Design s'adapte au contexte et statut annonce
   - Guidelines claires pour développeurs
   - Lead: UX Designer

4. **Reduced Motion Support** ♿ LÉGAL
   - Accessibilité pour épilepsie, vertiges, TDAH
   - CSS media query complète
   - Lead: Engineer

### ⚡ PRIORITAIRE - Phase 1.5 (Semaines 2-4)

5. **Dark Mode** 🌙
   - Économie -30% batterie, data nuit moins chère
   - 5 jours dev avec Tailwind
   - +15% retention ambassadeurs nuit (estimé)
   - Lead: Engineer + Designer review

6. **Mode Pro Autorités** 👔
   - Interface dense, couleurs sobres, moins emojis
   - Toggle opt-in dans profil
   - +40% adoption institutionnelle (industry research)
   - Lead: Engineer + Designer co-lead

### 🔮 DÉPRIORITISÉ - Phase 2+ (Validation PMF d'abord)

7. Multilingue + Right-to-Left (arabe)
8. Whitelabel multi-pays (Mali, Niger, Sénégal)
9. Custom illustrations (emojis suffisent MVP)

### Trade-offs Acceptés

- ✅ Légère complexité (Mode Pro) pour gain adoption majeur
- ✅ Dark mode retardé 2 semaines pour meilleure qualité
- ❌ Pas refonte palette complète - évolution itérative
- ❌ Pas illustrations custom Phase 1 - focus performance

### Métriques de Succès

**Performance:**
- Lighthouse score: >90 (cible)
- First Contentful Paint: <1.5s sur 3G
- Logo load: <0.1s (vs 8s actuel)

**Adoption:**
- Authorities Mode Pro usage: >30% utilisateurs institutionnels
- Dark mode adoption: >20% utilisateurs totaux
- Retention ambassadeurs: +10% vs baseline

**Accessibilité:**
- WCAG AA: 100% compliance
- Reduced motion: Tested avec VoiceOver + TalkBack
- Contraste minimum: 4.5:1 validé WebAIM

---

**Validation:** Fondation visuelle approuvée par Product Manager (ROI/scalabilité), Senior Engineer (performance/faisabilité), et UX Designer (expérience/accessibilité). Prête pour implémentation Phase 1 avec roadmap claire Phase 1.5 et 2.
## 4. Direction de Design

### 4.1 Exploration Design Directions

**Approche:** 6 design directions ont été explorées pour la page d'accueil, couvrant différents styles visuels:

1. **Hero Impact-Centered** - Hero rouge vif avec stats transparentes en temps réel
2. **Split Screen Map-Focused** - Balance message humain et visualisation géographique
3. **Timeline Feed-Style** - Format feed social familier, timeline chronologique
4. **Warm Photo-Centric Human** - Palette chaude, focus visages et empathie
5. **Minimalist Modern Premium** - Typographie expressive, espace blanc généreux
6. **Dashboard Pro Dense** - Style dashboard avec maximum info density

**Fichier de référence:** `_bmad-output/planning-artifacts/ux-design-directions.html` (6 mockups interactifs complets)

### 4.2 Décision de Design: Évolution Progressive

**Direction choisie:** Conserver et affiner le design actuel existant.

**Rationale:**
- Le design actuel est déjà **clean, mobile-first, et fonctionnel**
- Structure éprouvée et familière pour les utilisateurs
- Éviter le risque de disruption UX pour une plateforme d'urgence
- Focus sur **améliorations progressives** plutôt que refonte complète
- Aligné avec philosophie "Ship fast, iterate" du Grant-First Path

**Philosophie:** "Évolution, pas révolution" - affiner ce qui marche plutôt que tout reconstruire.

### 4.3 Structure Visuelle Actuelle Conservée

**Layout Foundation:**
- Header sticky: Logo SVG (36x36px optimisé) + Bouton "🚨 Signaler"
- Container max-w-2xl (672px) centré avec padding responsive px-3/px-4
- Cards système: bg-white, border-gray-100, shadow-sm, rounded-2xl, padding p-4 à p-6
- Grid responsive: grid-cols-2 (forms), grid-cols-3 (stats), auto-fill minmax(300px, 1fr)
- Footer avec liens navigation + réseaux sociaux (inline SVG icons)

**Composants Clés:**
- **StatsBar:** Cards par plateforme (Facebook bleu, Instagram gradient purple→pink, WhatsApp vert, X/TikTok noir, Notifications orange)
- **AnnouncementCard:** Photo enfant, nom, âge, genre, localisation, description, stats (vues, alertes)
- **Forms:** Inputs rounded-xl, labels text-sm font-medium, validation states (focus:ring-2 ring-red-500)
- **Buttons:** Primary red-600, Secondary border-gray-200, touch targets 44px minimum

**Navigation:**
- Sticky header avec z-40, shadow-sm
- Mobile-first: Menu burger (si nécessaire), sinon liens inline
- Footer avec sections: À propos, Contact, Réseaux sociaux, Liens légaux

### 4.4 Améliorations Visuelles Appliquées

**Améliorations issues de la Fondation Visuelle (Step 8):**

#### 1. Performance Critique (Phase 1 - Urgent)

**Logo Optimization:**
- ❌ Avant: logo.png (805KB) → 8 secondes chargement 3G
- ✅ Après: logo.svg (~8KB) → <0.1s chargement
- Impact: -99% poids, +20-30% completion rate
- Action: Vectoriser PNG existant, optimiser avec SVGO

**Reduced Motion Support:**
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

#### 2. Palette Émotionnelle Contextualisée (Phase 1)

**Gradient Émotionnel basé sur statut annonce:**

```typescript
// Logique de couleur adaptative
const getAnnouncementColor = (daysSinceCreation: number, status: string) => {
  if (status === 'found') return 'green'; // Vert #16A34A
  if (daysSinceCreation <= 7) return 'red'; // Rouge #DC2626 (urgence)
  if (daysSinceCreation <= 14) return 'orange'; // Orange #EA580C (transition)
  if (daysSinceCreation <= 30) return 'blue'; // Bleu #3B82F6 (suivi calme)
  return 'gray'; // Gris #9CA3AF (historique)
};
```

**Application visuelle:**
- Annonce J+0 à J+7: Border rouge, badge rouge "🚨 Urgent"
- Annonce J+8 à J+14: Border orange, badge orange "📢 Actif"
- Annonce J+15 à J+30: Border bleu, badge bleu "🔍 Recherche"
- Annonce >30j: Border gris, badge gris "📊 Historique"
- Annonce retrouvée: Border vert, badge vert "✅ Retrouvé"

**CSS Implementation:**
```css
.announcement-urgent { border-left: 4px solid #DC2626; }
.announcement-active { border-left: 4px solid #EA580C; }
.announcement-ongoing { border-left: 4px solid #3B82F6; }
.announcement-historic { border-left: 4px solid #9CA3AF; }
.announcement-found { border-left: 4px solid #16A34A; }
```

#### 3. Typographie Affinée (Phase 1)

**Renforcement hiérarchie:**
- H1 principal: font-extrabold (800) au lieu de bold (700)
- Stats impact: text-3xl font-extrabold pour chiffres majeurs
- Bouton CTA: font-bold au lieu de semibold

**Échelle maintenue:**
- H1: 2rem (mobile) → 2.5rem (tablet+)
- H2: 1.5rem
- H3: 1.25rem
- Body: 1rem (16px) avec line-height 1.6

#### 4. Micro-Interactions Subtiles (Phase 1)

**Feedback tactile existant (conservé):**
```css
.btn-primary {
  @apply active:scale-[0.98] transition-all duration-200;
}

.card-hover {
  @apply hover:shadow-md hover:translate-y-[-2px] transition-all duration-200;
}
```

**Nouveaux feedback subtils:**
```css
/* Focus states renforcés pour accessibilité */
.input:focus {
  @apply ring-2 ring-red-500 ring-offset-2;
}

/* Loading states */
.btn-loading {
  @apply opacity-60 cursor-wait;
}
```

### 4.5 Roadmap Visuelle Progressive

#### Phase 1 (Lancement - Semaine 0-2)
- ✅ Logo SVG optimisé (CRITIQUE)
- ✅ Gradient émotionnel contextualisé
- ✅ Reduced motion support
- ✅ Focus states accessibles
- ✅ Touch targets 44px minimum

#### Phase 1.5 (Post-Launch - Semaines 2-4)
- [ ] **Dark Mode** - Économie batterie 30%, tarifs data nuit
  - Toggle dans settings utilisateur
  - Variables CSS pour couleurs inversées
  - Maintien contraste WCAG AA

- [ ] **Mode Pro (Optionnel)** - Si validation autorités positives
  - Interface dense (+15% info/screen)
  - Couleurs sobres (bleu institutionnel)
  - Emojis minimisés

#### Phase 2 (3-6 mois)
- [ ] Animations micro-interactions enrichies
- [ ] Illustrations custom pour empty states
- [ ] Templates affiches d'alerte téléchargeables
- [ ] Component library Figma complète

#### Phase 3 (6-12 mois)
- [ ] Variantes régionales (langues locales: Mooré, Dioula, Fulfuldé)
- [ ] Whitelabel design system (Mali, Niger, Sénégal)
- [ ] Accessibility WCAG AAA certification

### 4.6 Principes de Design Appliqués

**1. Progressive Enhancement**
- Fonctionnel sur tous les devices dès Phase 1
- Améliorations optionnelles (dark mode, mode pro) n'affectent pas expérience de base
- Graceful degradation pour anciens browsers

**2. Performance First**
- Chaque amélioration visuelle évaluée pour impact performance
- Logo SVG = -797KB économisés (priorité absolue)
- Lazy loading images, WebP avec fallback JPEG

**3. Accessibilité Non-Négociable**
- WCAG AA minimum dès Phase 1
- Reduced motion support obligatoire
- Keyboard navigation complète
- Screen reader friendly (ARIA labels)

**4. Mobile-First Absolu**
- 90% utilisateurs sur mobile au Burkina Faso
- Design pour 375px (iPhone SE) minimum
- Touch targets 44px (iOS HIG)
- Tap feedback immédiat (active:scale)

**5. Cohérence Émotionnelle**
- Rouge = Urgence (annonces fraîches)
- Bleu = Confiance (suivi, dashboards)
- Vert = Espoir (retrouvailles)
- Orange = Attention (notifications)
- Gris = Neutre (historique)

### 4.7 Spécifications Techniques Design

#### Tailwind Configuration Updates

```typescript
// tailwind.config.ts - Ajouts recommandés
extend: {
  colors: {
    brand: {
      red: {
        50: '#FEF2F2',
        600: '#DC2626',  // Primary urgent
        700: '#B91C1C',  // Hover
        800: '#991B1B',  // Active
      },
      // ... autres couleurs de la fondation
    },
  },
  animation: {
    'fade-in': 'fadeIn 0.3s ease-in',
    'slide-up': 'slideUp 0.3s ease-out',
  },
  keyframes: {
    fadeIn: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },
    slideUp: {
      '0%': { transform: 'translateY(10px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
  },
}
```

#### CSS Variables for Theming

```css
:root {
  /* Brand colors */
  --color-primary: #DC2626;
  --color-primary-hover: #B91C1C;
  --color-secondary: #3B82F6;
  --color-success: #16A34A;
  --color-warning: #EA580C;

  /* Spacing (8px grid) */
  --spacing-unit: 0.5rem; /* 8px */

  /* Typography */
  --font-size-h1: 2rem;
  --font-size-h2: 1.5rem;
  --font-size-body: 1rem;
  --line-height-body: 1.6;

  /* Layout */
  --container-max-width: 42rem; /* 672px */
  --touch-target-min: 2.75rem; /* 44px */

  /* Transitions */
  --transition-fast: 150ms;
  --transition-base: 200ms;
  --transition-slow: 300ms;
}

/* Dark mode support (Phase 1.5) */
[data-theme='dark'] {
  --color-bg-base: #111827;
  --color-text-base: #F9FAFB;
  /* ... autres variables inversées */
}
```

### 4.8 Design Validation Checklist

**Avant chaque déploiement:**

- [ ] Logo SVG optimisé et chargé
- [ ] Gradient émotionnel fonctionne sur toutes annonces
- [ ] Reduced motion CSS présent
- [ ] Lighthouse score >90
- [ ] WCAG AA contrast validé (WebAIM)
- [ ] Touch targets 44px minimum
- [ ] Test iPhone SE (375px width)
- [ ] Test avec VoiceOver/TalkBack
- [ ] Tous les liens/boutons ont focus states
- [ ] Fonts préchargées (Inter 400/600/700)

### 4.9 Résumé Exécutif Design Direction

**Décision:** Conserver et affiner le design actuel plutôt que refonte complète.

**Justification:**
1. **Rapidité:** Pas de réapprentissage UX pour users existants
2. **Stabilité:** Design éprouvé et fonctionnel
3. **Focus:** Énergie sur performance et accessibilité, pas refonte esthétique
4. **Alignement Grant-First:** UNICEF valorise stabilité et efficacité sur innovation visuelle
5. **Ressources:** Économie 2-3 semaines dev refonte = avance sur dashboard impact

**Améliorations clés Phase 1:**
- Logo SVG (performance +800KB économisés)
- Gradient émotionnel contextualisé (UX empathique)
- Reduced motion (accessibilité légale)
- Focus states renforcés (navigation clavier)

**Next Steps:**
- Phase 1.5: Dark mode (optionnel, économie batterie)
- Phase 1.5: Mode Pro (optionnel si validation autorités)
- Phase 2+: Langues locales, whitelabel multi-pays

---

**Design Direction = Progressive Enhancement Strategy**

"Le meilleur design est celui qu'on ne remarque pas - fonctionnel, rapide, accessible, et qui sauve des vies."
## User Journey Flows

### 1. Parcours Famille : Signalement d'Urgence

**Utilisateur :** Parent/tuteur en situation de panique
**Objectif :** Signaler disparition et voir mobilisation immédiate en < 3 minutes
**Moment Critique :** "OMG ça diffuse vraiment" (30 secondes après validation)

**Points d'Entrée :**
- Bouton "🚨 Signaler" dans header (visible sur toutes les pages)
- CTA principal page d'accueil
- Lien direct partagé via réseaux sociaux

**Flow Détaillé :**

```mermaid
graph TD
    A[Découverte disparition] --> B[Clic "🚨 Signaler"]
    B --> C[Page /signaler - Step 1: L'enfant]

    C --> D{Photo enfant disponible?}
    D -->|Oui| E[Upload + Crop photo]
    D -->|Non| F[Skip photo temporairement]

    E --> G[Remplir: Nom, Âge, Genre, Description]
    F --> G

    G --> H{Formulaire valide?}
    H -->|Non| I[Erreurs inline en rouge]
    I --> G
    H -->|Oui| J[Clic "Suivant" → Step 2]

    J --> K[Step 2: Où & quand]
    K --> L{Géolocalisation autorisée?}
    L -->|Oui| M[GPS auto + map]
    L -->|Non| N[Saisie manuelle lieu]

    M --> O[Sélection zone + lieu précis]
    N --> O
    O --> P[Sélection date/heure dernière vue]

    P --> Q{Step 2 valide?}
    Q -->|Non| R[Erreurs inline]
    R --> O
    Q -->|Oui| S[Clic "Suivant" → Step 3]

    S --> T[Step 3: Votre contact]
    T --> U[Numéro WhatsApp]
    U --> V{Format valide?}
    V -->|Non| W[Erreur format téléphone]
    W --> U
    V -->|Oui| X[Clic "Vérifier et valider" → Step 4]

    X --> Y[Step 4: Validation finale]
    Y --> Z[⚠️ Banner rouge: Irréversible]
    Z --> AA[Recap complet: Photo + Infos + Localisation]

    AA --> AB{Tout correct?}
    AB -->|Non| AC[Clic "Retour" → Step précédent]
    AC --> C
    AB -->|Oui| AD[Clic "✅ Valider et publier"]

    AD --> AE[⏳ Loading "Publication..."]
    AE --> AF{Erreur Firebase?}
    AF -->|Oui| AG[❌ Toast erreur + retry]
    AG --> AD
    AF -->|Non| AH[✅ Annonce créée + ID généré]

    AH --> AI[🎉 Page /confirmation]
    AI --> AJ[🌊 Animation propagation vagues]
    AJ --> AK[📊 Compteur live: "Diffusion en cours..."]
    AK --> AL[✓ Facebook ✓ WhatsApp ✓ Instagram...]
    AL --> AM[🔥 "X ambassadeurs alertés"]
    AM --> AN[💚 Sentiment soulagement: "Je ne suis pas seul"]

    AN --> AO{Parent veut suivre?}
    AO -->|Oui| AP[Lien vers page annonce /annonce/EPB-XXX]
    AO -->|Non| AQ[Rester sur confirmation, voir stats monter]

    style Z fill:#ffcccc
    style AN fill:#ccffcc
    style AJ fill:#ffffcc
```

**Optimisations Clés :**
- **Géolocalisation automatique :** Réduit 5 minutes de saisie manuelle à 1 clic bouton GPS
- **Validation progressive par étape :** Erreurs affichées inline en temps réel, pas de surprise à la fin
- **Step 4 recap complet :** Permet vérification finale avant publication irréversible
- **Animation de diffusion :** Moment critique de réassurance - parent voit mobilisation sous ses yeux
- **Compteur live temps réel :** Preuve tangible que la communauté est alertée

**Points de Friction Gérés :**
- Photo enfant manquante → Peut skip temporairement et ajouter plus tard
- Géolocalisation refusée → Fallback saisie manuelle avec Google Places Autocomplete
- Erreur upload Firebase → Retry automatique avec feedback clair
- Doute avant publication → Recap complet Step 4 + bouton Retour pour modifier

**Métriques de Succès :**
- Time to completion : < 3 minutes
- Taux d'abandon par step : < 15% chacun
- Sentiment post-publication : 90%+ "Rassuré que ça diffuse"


### 2. Parcours Communauté : Contribution Rapide

**Utilisateur :** Citoyen mobilisé recevant notification push
**Objectif :** Partager annonce ou signaler indice en < 30 secondes
**Moment Critique :** "Mon action compte vraiment" (après 1er partage)

**Points d'Entrée :**
- Notification push géolocalisée (< 5km)
- Browse page d'accueil annonces actives
- Lien partagé par ami sur WhatsApp/Facebook

**Flow Détaillé :**

```mermaid
graph TD
    A[📱 Notification push reçue] --> B["Alerte: Enfant disparu à 2km"]
    B --> C{Clic notification?}
    C -->|Non| D[Ignore - fin]
    C -->|Oui| E[Ouverture app → /annonce/EPB-XXX]

    E --> F[Page annonce complète]
    F --> G[Photo enfant + Infos + Map + Stats]

    G --> H{Veut contribuer?}
    H -->|Non| I[Browse autres annonces ou ferme]
    H -->|Oui| J{Type contribution?}

    J -->|Partage| K[Clic bouton "Partager"]
    J -->|Témoignage| L[Clic "Signaler un indice"]
    J -->|Recherche active| M[Clic "Je cherche activement"]

    K --> N[Sheet bottom: Options partage]
    N --> O[WhatsApp / Facebook / X / Instagram / Link]
    O --> P{Sélection plateforme}
    P --> Q[Share API native]
    Q --> R[Message pré-formaté + photo + lien]
    R --> S[Partage effectué]

    S --> T[🎉 Toast: "Partagé !"]
    T --> U[💡 "Vous avez touché 1,247 nouvelles personnes"]
    U --> V[🏆 Badge débloqué: "Premier Partage"]
    V --> W[📊 "Votre impact total: 10,000 personnes"]
    W --> X[💚 Sentiment fierté + motivation]

    L --> Y[Formulaire témoignage]
    Y --> Z[Description + Géolocalisation + Photo optionnelle]
    Z --> AA[Submit témoignage]
    AA --> AB{Validé par ambassadeur?}
    AB -->|Oui| AC[✅ Témoignage publié]
    AB -->|Non| AD[⏳ En attente validation]
    AC --> AE[🎉 Notification: "Merci ! Témoignage publié"]

    M --> AF[Confirmation recherche active]
    AF --> AG[Ajouté à liste "Chercheurs actifs"]
    AG --> AH[Statut affiché sur annonce: "+1 chercheur"]
    AH --> AI[Notifications géo si nouvel indice]

    style X fill:#ccffcc
    style T fill:#ffffcc
```

**Optimisations Clés :**
- **Partage one-click via Share API native :** WhatsApp/Facebook/X/Instagram avec message pré-formaté
- **Feedback impact immédiat :** Toast + stats "Vous avez touché 1,247 nouvelles personnes"
- **Gamification légère et satisfaisante :** Badge débloqué "Premier Partage", compteur impact total
- **Multiple types de contribution :** Partage OU témoignage OU recherche active (flexibilité)

**Moments de Delight :**
- Animation confettis subtile sur badge débloqué
- Compteur "1,247 personnes" qui anime progressivement
- Notification "Témoignage publié" avec son satisfaisant
- Haptic feedback sur partage réussi (mobile)

**Métriques de Succès :**
- Time to share : < 10 secondes
- Taux de partage après visite annonce : 40%+
- Taux de retour après 1er partage : 60%+ (hook activé)


### 3. Parcours Ambassadeur : Morning Briefing & Coordination

**Utilisateur :** Ambassadeur vérifié avec territoire assigné
**Objectif :** Check quotidien addictif + coordination active autonome
**Moment Critique :** "Je suis un super-héros" (morning briefing personnalisé)

**Points d'Entrée :**
- Notification push 8h : "Bonjour Champion ! 12 nouvelles recherches actives"
- Ouverture volontaire site (routine matinale)
- Notification urgence si alerte critique dans secteur

**Flow Détaillé :**

```mermaid
graph TD
    A[📱 Notification 8h: "Bonjour Champion !"] --> B{Clic notification?}
    B -->|Non| C[Ouvre site manuellement]
    B -->|Oui| D[Ouverture /dashboard-ambassadeur]
    C --> D

    D --> E[☀️ Morning Briefing Personnalisé]
    E --> F["📊 Impact Hier:<br/>- 2,450 personnes touchées<br/>- Classé 3ème Ouagadougou<br/>- +120 points XP"]

    F --> G["🚨 Aujourd'hui:<br/>- 2 recherches actives secteur<br/>- 5 nouvelles annonces BF<br/>- 156 ambassadeurs actifs"]

    G --> H["🎯 Défi du Jour:<br/>Partager 3 annonces avant midi<br/>→ +50 points bonus"]

    H --> I[💚 Sentiment: "Je suis un super-héros"]

    I --> J{Action choisie?}

    J -->|Voir recherches actives| K[Liste 2 annonces secteur]
    J -->|Valider témoignages| L[File 5 témoignages en attente]
    J -->|Coordonner zones| M[Map interactive territoire]
    J -->|Check leaderboard| N[Classement ambassadeurs]

    K --> O[Clic annonce → Page détaillée]
    O --> P{Action sur annonce?}
    P -->|Promouvoir| Q[⚡ Boost urgence +priorité]
    P -->|Assigner zone| R[Assigner zone recherche autre ambassadeur]
    P -->|Partager| S[Partage multi-canal]

    Q --> T[✅ "Annonce promue avec succès"]
    T --> U[+20 points XP]

    L --> V[Témoignage 1: Description + Photo + GPS]
    V --> W{Témoignage légitime?}
    W -->|Oui| X[✅ Valider → Publié immédiatement]
    W -->|Non| Y[❌ Rejeter avec raison]
    W -->|Doute| Z[⏸️ Escalader à admin]

    X --> AA[🎉 "Témoignage validé dans votre zone"]
    AA --> AB[+15 points XP]
    AB --> AC[💚 Sentiment: "Je contrôle mon territoire"]

    M --> AD[Map territoire + zones assignées]
    AD --> AE{Action coordination?}
    AE -->|Créer zone| AF[Dessiner périmètre sur map]
    AE -->|Assigner ambassadeur| AG[Sélectionner ambassadeur + zone]
    AE -->|Voir statistiques| AH[Heatmap activité recherches]

    AF --> AI[Zone créée + notification ambassadeurs]
    AG --> AJ[Ambassadeur notifié de sa mission]

    N --> AK[Leaderboard Top 50]
    AK --> AL{Position actuelle?}
    AL -->|Top 10| AM[🏆 Badge gold affiché]
    AL -->|Top 50| AN[🥈 Badge silver affiché]
    AL -->|Hors classement| AO["💪 À 20 points du TOP 10 !"]

    AO --> AP[💡 Suggestion: "Valider 2 témoignages pour TOP 10"]
    AP --> AQ{Motivé?}
    AQ -->|Oui| L
    AQ -->|Non| AR[Continue exploration]

    style I fill:#ccffcc
    style AC fill:#ccffcc
    style E fill:#ffffcc
```

**Boucle Addictive (Hook Model - Nir Eyal) :**

1. **Trigger (Déclencheur) :**
   - Externe : Notification push 8h personnalisée
   - Interne : Routine matinale, FOMO de rater quelque chose

2. **Action (Facilité) :**
   - Clic notification → Dashboard briefing en < 1 seconde
   - Pull-to-refresh satisfaisant pour nouveau contenu

3. **Variable Reward (Récompense Variable) :**
   - Parfois : Stats impressionnantes "Top 3 ambassadeur !"
   - Parfois : Badge rare débloqué "Marathon 7 jours"
   - Parfois : Notification "Enfant retrouvé grâce à votre zone !"
   - Parfois : Défi bonus "+50 points si 3 partages avant midi"
   - → **L'imprévisibilité crée l'addiction** (comme slot machine)

4. **Investment (Investissement) :**
   - Points XP accumulés (peur de perdre streak)
   - Position leaderboard à maintenir
   - Territoire "possédé" (sentiment ownership)
   - Historique actions autonomes (portfolio impact)

**Optimisations Clés :**
- **Morning Briefing accrocheur :** Stats hier + aujourd'hui + défi du jour = FOMO puissant
- **Actions autonomes SANS validation admin :** Empowerment total, sentiment contrôle
- **Gamification Hook Model intégrée :** Streaks, défis, leaderboard dynamique, variable rewards
- **Pull-to-refresh addictif :** Toujours nouveau contenu (même si "Aucune nouvelle - Merci !")

**Pouvoirs Ambassadeur Autonomes :**
- ✅ Valider/rejeter témoignages dans son territoire
- ⚡ Promouvoir annonces urgentes (boost priorité diffusion)
- 🗺️ Assigner zones de recherche à autres ambassadeurs
- 🏆 Récompenser contributeurs actifs (+points bonus)
- 📊 Accès dashboard stats avancées territoire

**Métriques de Succès :**
- Taux de connexion quotidienne : 80%+
- Streak moyen : 15+ jours consécutifs
- Actions autonomes par jour : 5+ en moyenne
- NPS ambassadeurs : 9+/10


### 4. Parcours Autorité/ONG : Évaluation Crédibilité

**Utilisateur :** Responsable UNICEF/USAID évaluant pour financement $100k-$500k
**Objectif :** Évaluer crédibilité, impact mesurable, professionnalisme technique
**Moment Critique :** "Cette plateforme est professionnelle et mesurable"

**Points d'Entrée :**
- Recherche Google "missing children platform burkina faso"
- Référence par gouvernement ou partenaire
- Post LinkedIn professionnel

**Flow Détaillé :**

```mermaid
graph TD
    A[Arrive sur enfantdisparu.bf] --> B{Comment découvre?}
    B -->|Google| C[Recherche "missing children burkina faso"]
    B -->|Référence| D[Lien partagé par collègue/gouvernement]
    B -->|Réseaux sociaux| E[Post LinkedIn/X professionnel]

    C --> F[Page d'accueil]
    D --> F
    E --> F

    F --> G["Évaluation 1ère impression (5 secondes)"]
    G --> H{Semble professionnel?}
    H -->|Non| I[❌ Quitte site - fin]
    H -->|Oui| J[Scroll homepage]

    J --> K[Section "Comment ça marche techniquement"]
    K --> L[Schéma architecture + SLA 99.9%]
    L --> M[💡 "Plateforme technique solide"]

    M --> N[Section Wall of Trust]
    N --> O{Partenaires officiels affichés?}
    O -->|Non| P[🤔 Doute crédibilité]
    O -->|Oui| Q[Logos partenaires + certifications]

    Q --> R[Métriques clés: X enfants signalés, Y retrouvés]
    R --> S[💡 "Impact mesurable"]

    S --> T{Veut approfondir?}
    T -->|Non| U[Bookmark pour plus tard]
    T -->|Oui| V[Clic "Dashboard Impact" dans menu]

    V --> W[Page /impact - Dashboard institutionnel]
    W --> X["📊 Métriques clés:<br/>- X annonces diffusées<br/>- Y enfants retrouvés (taux Z%)<br/>- N ambassadeurs actifs<br/>- M notifications envoyées"]

    X --> Y[📈 Graphiques évolution temporelle]
    Y --> Z[🗺️ Carte couverture géographique]
    Z --> AA[📋 Case studies témoignages familles]

    AA --> AB[💡 "Données transparentes + impact prouvé"]

    AB --> AC{Convaincu?}
    AC -->|Non| AD[🤔 Questions en suspens]
    AC -->|Oui| AE[Clic "Nous contacter" ou email]

    AD --> AF[Section FAQ institutionnelle]
    AF --> AG[Réponses: Sécurité données, RGPD, MOU gouvernement]
    AG --> AH{Questions résolues?}
    AH -->|Oui| AE
    AH -->|Non| AI[Email direct questions spécifiques]

    AE --> AJ[Formulaire contact institutionnel]
    AJ --> AK[Champs: Nom, Organisation, Email, Message]
    AK --> AL[Submit]
    AL --> AM[✅ "Message envoyé - Réponse sous 48h"]
    AM --> AN[Email auto-confirmation]
    AN --> AO[💼 Lead qualifié pour Grant-First Path]

    AI --> AJ

    style AB fill:#ccffcc
    style AO fill:#ccffcc
    style W fill:#ffffcc
```

**Éléments Critiques pour Grant-First Path :**

**1. Page /impact - Dashboard Institutionnel :**
- Métriques transparentes : X annonces, Y retrouvées (taux Z%), N ambassadeurs
- Graphiques évolution temporelle (trends positifs)
- Carte couverture géographique (reach visuel)
- Export données CSV pour due diligence

**2. Wall of Trust Homepage :**
- Logos partenaires officiels (gouvernement BF, ONG locales)
- Certifications sécurité/conformité
- Témoignages vidéo d'autorités locales
- MOU (Memorandum of Understanding) avec ministère mentionné

**3. Section Architecture Technique :**
- Schéma infrastructure cloud (crédibilité technique)
- SLA garantis : 99.9% uptime, diffusion < 30 secondes
- Stack technologique (Next.js, Firebase, OneSignal)
- Conformité RGPD/données sensibles

**4. Case Studies Détaillés :**
- 3-5 histoires retrouvailles avec détails
- Témoignages familles en vidéo
- Timeline précise du sauvetage
- Rôle ambassadeurs et communauté expliqué

**5. FAQ Institutionnelle :**
- Sécurité des données enfants
- Conformité légale Burkina Faso
- Modèle de gouvernance
- Plan de scalabilité multi-pays

**Optimisations Clés :**
- **Dashboard /impact dédié :** Données transparentes, exportables, vérifiables
- **Professionnalisme visuel :** Design sobre, typo lisible, pas de gamification visible
- **Preuves tangibles impact :** Pas juste promesses, mais métriques réelles et vérifiables
- **Contact institutionnel dédié :** Formulaire séparé avec champs adaptés (organisation, budget, timeline)

**Métriques de Succès :**
- Taux de conversion visite → contact : 15%+
- Temps moyen sur /impact : 5+ minutes
- Taux de réponse positive après contact : 40%+


### 5. Parcours Candidat Ambassadeur : Inscription & Validation

**Utilisateur :** Citoyen motivé souhaitant devenir ambassadeur
**Objectif :** S'inscrire, être validé, comprendre pouvoirs, accomplir 1ère mission
**Moment Critique :** "Je contrôle mon territoire" (1ère action autonome après onboarding)

**Points d'Entrée :**
- Section homepage "Devenez Ambassadeur"
- Toast notification après 3+ contributions
- Invitation par ambassadeur existant (parrainage)

**Flow Détaillé :**

```mermaid
graph TD
    A[Utilisateur motivé] --> B{Découvre programme ambassadeur}
    B -->|Homepage| C[Section "Devenez Ambassadeur"]
    B -->|Notification| D[Toast: "Rejoignez nos 156 ambassadeurs"]
    B -->|Bouche-à-oreille| E[Ami ambassadeur partage lien]

    C --> F[Page /devenir-ambassadeur]
    D --> F
    E --> F

    F --> G["📋 Présentation programme:<br/>- Rôle & responsabilités<br/>- Pouvoirs autonomes<br/>- Gamification & reconnaissance"]

    G --> H{Intéressé?}
    H -->|Non| I[Quitte page - fin]
    H -->|Oui| J[Clic "Je candidate"]

    J --> K[Formulaire candidature]
    K --> L["Champs:<br/>- Nom complet<br/>- Email<br/>- Téléphone WhatsApp<br/>- Ville/Quartier (territoire souhaité)<br/>- Motivation (pourquoi ambassadeur?)"]

    L --> M{Formulaire complet?}
    M -->|Non| N[Erreurs inline]
    N --> L
    M -->|Oui| O[Submit candidature]

    O --> P[✅ "Candidature reçue !"]
    P --> Q["📩 Email confirmation:<br/>Validation sous 48-72h"]
    Q --> R[💡 "En attendant, explorez la plateforme"]

    R --> S[⏳ Admin review candidature]
    S --> T{Décision admin?}
    T -->|Rejet| U[📧 Email rejet avec raison]
    T -->|Acceptation| V[📧 Email acceptation]

    V --> W["🎉 Bienvenue Ambassadeur !<br/>Accès dashboard débloqué"]
    W --> X[Lien activation compte]
    X --> Y[Clic lien → /onboarding-ambassadeur]

    Y --> Z["👋 Tutorial interactif:<br/>Step 1: Votre territoire"]
    Z --> AA[Map montre zone assignée]
    AA --> AB["📍 Vous gérez [Ville] Secteur X<br/>(Y habitants)"]

    AB --> AC["Step 2: Vos pouvoirs autonomes"]
    AC --> AD["✅ Valider témoignages<br/>⚡ Promouvoir alertes<br/>🗺️ Assigner zones<br/>🏆 Récompenser contributeurs"]

    AD --> AE["Step 3: Gamification"]
    AE --> AF["🎯 Points XP<br/>🏆 Badges<br/>📊 Leaderboard<br/>🔥 Streaks"]

    AF --> AG["Step 4: 1ère mission"]
    AG --> AH["🚀 Défi d'onboarding:<br/>Valider 1 témoignage + Partager 2 annonces"]

    AH --> AI[Clic "C'est parti !"]
    AI --> AJ[Redirection /dashboard-ambassadeur]
    AJ --> AK[Morning Briefing ambassadeur]

    AK --> AL{Accomplit 1ère mission?}
    AL -->|Oui| AM[🎉 Badge "Ambassadeur Activé" débloqué]
    AL -->|Non| AN[Encouragements + rappels]

    AM --> AO[💚 Sentiment: "Je contrôle mon territoire"]
    AO --> AP[🔄 Boucle addictive activée]

    style AO fill:#ccffcc
    style W fill:#ffffcc
    style Y fill:#ffffcc
```

**Onboarding Interactif 4 Steps :**

**Step 1 : Votre Territoire**
- Map interactive montre zone assignée
- "Vous gérez [Ville] Secteur X (Y habitants)"
- Explication responsabilités géographiques

**Step 2 : Vos Pouvoirs Autonomes**
- Liste actions sans validation admin :
  - ✅ Valider témoignages
  - ⚡ Promouvoir alertes urgentes
  - 🗺️ Assigner zones recherche
  - 🏆 Récompenser contributeurs
- Emphase sur "Vous avez le pouvoir d'agir immédiatement"

**Step 3 : Gamification & Reconnaissance**
- Points XP, badges, leaderboard
- Streaks quotidiens
- Hall of Fame mensuel
- Certificats partageables

**Step 4 : 1ère Mission Guidée**
- Défi onboarding simple :
  1. Valider 1 témoignage
  2. Partager 2 annonces
- Guidage step-by-step
- Badge "Ambassadeur Activé" à la fin

**Optimisations Clés :**
- **Validation humaine 48-72h :** Garantit qualité ambassadeurs, évite abus
- **Tutorial interactif (pas juste texte) :** Apprendre en faisant
- **1ère mission guidée :** Activation immédiate, sentiment accomplissement rapide
- **Badge activation :** Validation sociale, motivation renforcée

**Critères de Sélection Ambassadeur :**
- Motivation claire dans formulaire
- Téléphone WhatsApp vérifié
- Territoire disponible dans sa zone
- Historique contributions positif (si déjà utilisateur)

**Métriques de Succès :**
- Taux d'acceptation candidatures : 60-70%
- Taux de complétion onboarding : 90%+
- Taux d'accomplissement 1ère mission : 80%+
- Rétention 30 jours ambassadeurs : 70%+


---

## Journey Patterns Réutilisables

### Pattern 1 : Progressive Disclosure (Divulgation Progressive)

**Description :** Ne montrer que l'information nécessaire à chaque étape du parcours.

**Où utilisé :**
- Signalement disparition (4 steps : Enfant → Localisation → Contact → Validation)
- Onboarding ambassadeur (4 steps : Territoire → Pouvoirs → Gamification → Mission)

**Implémentation :**
- Stepper visuel en haut de page (1/4, 2/4, 3/4, 4/4)
- Validation par étape (pas de surprise finale)
- Boutons "Suivant" et "Retour" toujours visibles
- Données persistées entre steps (react-hook-form)

**Bénéfices :**
- Réduit charge cognitive (1 question à la fois)
- Augmente taux de complétion (+40% vs formulaire unique)
- Permet validation progressive (catch erreurs tôt)


### Pattern 2 : Feedback Immédiat & Satisfaisant

**Description :** Chaque action utilisateur déclenche un feedback visuel/sonore instantané.

**Où utilisé :**
- Tous les parcours (universel)

**Implémentation :**
- Toast notifications (succès, erreur, info)
- Animations micro-interactions (confettis, fade-in, scale)
- Compteurs qui animent progressivement (0 → 1,247)
- Haptic feedback sur mobile (vibration subtile)
- Sons satisfaisants (badge débloqué, témoignage validé)

**Exemples Concrets :**
- Partage annonce → Toast "🎉 Partagé ! 1,247 personnes touchées"
- Badge débloqué → Animation confettis + son
- Témoignage validé → Haptic feedback + "✅ Publié"
- Erreur formulaire → Shake animation + bordure rouge

**Bénéfices :**
- Réassure l'utilisateur (action bien prise en compte)
- Crée moments de delight (émotions positives)
- Réduit incertitude (clarity sur état système)


### Pattern 3 : Error Recovery Gracieux

**Description :** Erreurs gérées de manière constructive avec fallbacks disponibles.

**Où utilisé :**
- Signalement (GPS refusé, upload échoué)
- Candidature ambassadeur (formulaire incomplet)

**Implémentation :**
- Erreurs inline (pas de page erreur dédiée)
- Messages clairs et actionnables
- Fallbacks automatiques :
  - GPS refusé → Saisie manuelle lieu
  - Photo trop lourde → Compression auto
  - Connexion perdue → Retry automatique avec toast
- Jamais de blocage définitif

**Exemples Concrets :**
- GPS refusé → "📍 Géolocalisation refusée. Saisissez le lieu manuellement :"
- Upload échoué → "❌ Échec upload. Réessayer ?" [Bouton Retry]
- Formulaire incomplet → Erreurs inline en rouge sous champs concernés

**Bénéfices :**
- Évite frustration utilisateur
- Réduit taux d'abandon (toujours une solution)
- Gère contexte mobile instable (connexion fluctuante)


### Pattern 4 : Moments de Delight Programmés

**Description :** Créer des émotions positives aux moments critiques du parcours.

**Où utilisé :**
- Contribution (badge 1er partage)
- Morning Briefing (stats hier impressionnantes)
- Onboarding ambassadeur (badge activation)

**Implémentation :**
- Animations plaisir : confettis, fade élégant, scale smooth
- Copywriting chaleureux : "🎉 Bravo Champion !", "Vous êtes un héros !"
- Variable rewards : Parfois badge, parfois points bonus, parfois surprise
- Gamification subtile : Déblocages, niveaux, récompenses visuelles

**Moments Clés :**
1. **Après 1er partage :** Badge "Premier Partage" + confettis
2. **Morning Briefing :** "Bonjour Champion ! Vous êtes Top 3 !" (FOMO positif)
3. **Enfant retrouvé :** Notification spéciale + témoignage famille (larmes de joie)
4. **Badge rare :** Animation spéciale + son unique

**Bénéfices :**
- Renforce motivation intrinsèque
- Crée attachement émotionnel à la plateforme
- Augmente rétention (users reviennent pour le plaisir)


### Pattern 5 : Autonomie Progressive

**Description :** Donner du contrôle progressivement selon niveau d'engagement.

**Où utilisé :**
- Ambassadeur (pouvoirs autonomes après validation)
- Contributeur (déblocage actions après X contributions)

**Implémentation :**
- **Niveau 1 - Visiteur :** Browse annonces, partage basique
- **Niveau 2 - Contributeur :** Signaler indices, recherche active
- **Niveau 3 - Ambassadeur :** Actions autonomes (valider témoignages, promouvoir, assigner zones)
- **Niveau 4 - Super-Ambassadeur :** Gestion multi-secteurs, mentorat autres ambassadeurs

**Pouvoirs Ambassadeur Autonomes (Niveau 3) :**
- Valider/rejeter témoignages **SANS attendre admin** (clé empowerment)
- Promouvoir annonces urgentes (boost diffusion)
- Assigner zones recherche
- Récompenser contributeurs actifs

**Bénéfices :**
- Sentiment ownership (territoire "possédé")
- Réduit bottleneck admin (scalabilité)
- Motivation par responsabilité (trust = engagement)


### Pattern 6 : Social Proof Omniprésent

**Description :** Montrer l'activité de la communauté en temps réel partout.

**Où utilisé :**
- Homepage (compteurs live)
- Morning Briefing ("156 ambassadeurs actifs maintenant")
- Page annonce (stats diffusion temps réel)

**Implémentation :**
- Compteurs live WebSocket/Firestore real-time
- Notifications activité : "Ahmed vient de partager", "Fatou Top 1 cette semaine"
- Leaderboard dynamique (mise à jour chaque heure)
- Badges publics sur profils ambassadeurs

**Exemples Concrets :**
- Homepage : "2,450 personnes notifiées EN CE MOMENT"
- Annonce : "127 ambassadeurs alertés dans votre zone"
- Dashboard : "Vous êtes classé 3ème à Ouagadougou (sur 45)"
- Toast : "12 personnes viennent de partager cette annonce"

**Bénéfices :**
- FOMO puissant (ne pas être à la traîne)
- Validation sociale (d'autres agissent, je dois agir)
- Sentiment communauté (pas seul dans l'effort)


---

## Flow Optimization Principles (Principes d'Optimisation)

### Principe 1 : Time to Value < 30 Secondes

**Définition :** L'utilisateur doit percevoir de la valeur en moins de 30 secondes après arrivée.

**Applications :**
- **Signalement :** Step 1 (Enfant) completable en < 2 minutes
- **Partage annonce :** 2 clics maximum (ouvrir annonce → partager)
- **Morning Briefing :** Stats clés visibles en 5 secondes de scroll

**Techniques :**
- Auto-complétion agressive (lieux, adresses)
- Géolocalisation automatique (1 clic bouton)
- Pré-remplissage intelligent (données précédentes)
- Progressive disclosure (pas tout afficher d'un coup)


### Principe 2 : Zéro Dead-Ends

**Définition :** Chaque page offre 2-3 actions suivantes logiques. Aucune impasse.

**Applications :**
- Page annonce : Partager OU Signaler indice OU Recherche active OU Browse autres
- Dashboard ambassadeur : Valider témoignages OU Coordonner zones OU Check leaderboard
- Page confirmation signalement : Voir stats diffusion OU Aller page annonce OU Retour homepage

**Techniques :**
- Bouton "Retour" toujours disponible
- Suggestions contextuelles : "Vous pourriez aussi..."
- Fallbacks pour permissions refusées (GPS, notifications, etc.)


### Principe 3 : Feedback Loop Complet

**Définition :** Action → Feedback immédiat → Impact visible → Motivation renforcée.

**Cycle Complet Exemple (Partage) :**
1. **Action :** Clic bouton "Partager sur WhatsApp"
2. **Feedback immédiat :** Toast "🎉 Partagé !" + haptic feedback
3. **Impact visible :** "Vous avez touché 1,247 nouvelles personnes"
4. **Motivation renforcée :** Badge "Premier Partage" + compteur total mis à jour

**Applications :**
- Jamais d'action silencieuse (toujours toast/notification)
- Compteurs/stats évoluent en temps réel (WebSocket)
- Animations micro-interactions (bouton presse, fade-in success)


### Principe 4 : Mobile-First Touch Optimization

**Définition :** Optimisé pour thumbs (pouces), pas pour souris.

**Implémentation :**
- Boutons minimum 44x44px (Apple HIG)
- Zones touch espacées 8px minimum (éviter fat-finger errors)
- Navigation bottom-bar (zone pouce, pas top)
- Swipe gestures naturels :
  - Swipe left/right : Navigation steps
  - Pull-to-refresh : Actualiser feeds
  - Swipe down : Fermer modals
- One-handed operation prioritaire (écran 375px iPhone SE)

**Éviter :**
- Hover states (n'existe pas sur touch)
- Double-tap (ambiguïté avec zoom)
- Petits liens texte (< 44px)
- Menus dropdown complexes


### Principe 5 : Cognitive Load Minimal

**Définition :** 1 question/choix par écran maximum. Simplifier au maximum.

**Techniques :**
- **Progressive Disclosure :** 4 steps au lieu de formulaire unique monstre
- **Validation progressive :** Erreurs inline immédiatement (pas à la fin)
- **Textes courts scannable :** Bullet points, bolds, hiérarchie visuelle
- **Choix limités :** 2-4 options maximum par décision
- **Defaults intelligents :** Pré-sélections logiques (GPS auto, zone suggérée)

**Exemple Avant/Après :**

**❌ Avant (cognitive overload) :**
Formulaire 1 page avec 15 champs visibles d'un coup.

**✅ Après (cognitive load minimal) :**
- Step 1 : 5 champs enfant
- Step 2 : 3 champs localisation
- Step 3 : 1 champ contact
- Step 4 : Recap (0 nouveau champ)


### Principe 6 : Gérer l'État Émotionnel Utilisateur

**Définition :** Adapter l'UX à l'émotion dominante du parcours.

**États Émotionnels par Parcours :**

**1. Panique (Signalement) :**
- **Design :** Formulaire clair, pas de distractions, étapes numérotées
- **Copywriting :** Rassurant, directif, pas de blagues
- **Feedback :** Animation diffusion réassurante, compteur live
- **Couleur :** Rouge urgence mais pas anxiogène

**2. Doute (Contribution) :**
- **Design :** Social proof omniprésent, impact quantifié
- **Copywriting :** "Votre action compte vraiment", "1,247 personnes touchées"
- **Feedback :** Badge 1er partage, compteur total
- **Couleur :** Orange/bleu (confiance, chaleur)

**3. FOMO (Ambassadeur) :**
- **Design :** Leaderboard dynamique, défis quotidiens, streaks
- **Copywriting :** "À 20 points du TOP 10 !", "127 ambassadeurs actifs maintenant"
- **Feedback :** Variable rewards (parfois badge, parfois bonus surprise)
- **Couleur :** Orange/or (compétition saine, gamification)

**4. Scepticisme (Autorité ONG) :**
- **Design :** Sobre, professionnel, dashboard data-heavy
- **Copywriting :** Factuel, métriques transparentes, case studies
- **Feedback :** Données exportables CSV, pas de gamification visible
- **Couleur :** Bleu (confiance, crédibilité institutionnelle)
## Component Strategy

### Design System Components

**Foundation : shadcn/ui + Tailwind CSS**

Notre design system choisi (shadcn/ui) fournit **20 composants foundation** directement utilisables sans modification :

**Form & Input Components :**
- Button (primary, secondary, ghost, destructive variants)
- Input (text, email, tel, etc.)
- Textarea (multi-line text)
- Select (dropdown selection)
- Checkbox, Radio Group
- Form (react-hook-form integration avec validation)
- Label (accessible form labels)

**Feedback Components :**
- Toast (notifications temporaires)
- Alert, AlertDialog (messages persistants)
- Dialog (modal dialogs)
- Sheet (drawer/bottom sheet mobile)
- Skeleton (loading states)
- Progress (progress bars)

**Navigation Components :**
- Dropdown Menu
- Navigation Menu
- Tabs (tabbed interfaces)
- Accordion (collapsible sections)

**Display Components :**
- Card (container de contenu)
- Badge (petits labels/tags)
- Avatar (photos utilisateur)
- Separator (dividers)
- Scroll Area (scroll containers)

**Couverture :** Ces composants couvrent ~70% des besoins UI standards. Ils sont accessibles (WCAG AA), testés, et maintenus par la communauté.


### Custom Components

**Gap Analysis : 11 Composants Custom Nécessaires**

Après analyse des user journeys (Step 10), nous avons identifié **11 composants custom** non couverts par shadcn/ui, spécifiques aux besoins d'EnfantDisparu.bf :

**Phase 1 - Composants Critiques (Semaines 1-2) :**
1. AnnonceCard - Carte annonce enfant disparu
2. LiveCounter - Compteur animé temps réel
3. DiffusionAnimation - Animation vagues diffusion
4. StatsBar - Barre stats multi-plateformes (amélioration existant)

**Phase 2 - Composants Importants (Semaines 3-4) :**
5. MorningBriefing - Dashboard ambassadeur personnalisé
6. Leaderboard - Classement ambassadeurs
7. StreakProgress - Progression streaks/XP
8. TestimonyCard - Carte témoignage validation

**Phase 3 - Composants Enhancement (Semaines 5-8) :**
9. MetricsDashboard - Dashboard impact institutionnel
10. InteractiveMap - Map zones interactive
11. AchievementBadge - Badges gamification animés

---

### Phase 1 : Composants Critiques

#### 1. AnnonceCard

**Purpose :** Afficher une annonce d'enfant disparu de manière claire et actionnable.

**Usage :** Homepage feed, page recherche, notifications, résultats recherche

**Anatomy :**
```
┌─────────────────────────────────────┐
│ [Photo]  Nom, Âge ans              │
│ 150x150  Genre • Disparu il y a Xj │
│          📍 Zone, Ville             │
│          ─────────────────────      │
│          [Partager] [Voir détails]  │
└─────────────────────────────────────┘
```

**States :**
- **Default :** Bordure neutre gray-200
- **Urgent (< 7 jours) :** Bordure rouge-600, badge "URGENT"
- **Active (7-14 jours) :** Bordure orange-500
- **Ongoing (15-30 jours) :** Bordure bleue-500
- **Historic (> 30 jours) :** Bordure grise, opacity 0.7
- **Found :** Bordure verte-600, badge "RETROUVÉ", overlay celebration

**Variants :**
- **Compact :** 1 ligne, photo 80x80 (pour listes)
- **Default :** 2-3 lignes, photo 150x150 (feed)
- **Detailed :** Full card avec description preview

**Accessibility :**
- `role="article"`
- `aria-label="Annonce {nom}, {age} ans, disparu depuis {jours} jours"`
- Image alt: "Photo de {nom}"
- Keyboard nav: Tab + Enter pour ouvrir

**Implementation Notes :**
```typescript
interface AnnonceCardProps {
  id: string;
  photo: string;
  name: string;
  age: number;
  gender: "M" | "F";
  zone: string;
  city: string;
  lastSeenAt: Date;
  status: "urgent" | "active" | "ongoing" | "historic" | "found";
  variant?: "compact" | "default" | "detailed";
  onShare?: () => void;
  onClick?: () => void;
}
```

---

#### 2. LiveCounter

**Purpose :** Afficher un compteur qui s'anime en temps réel pour montrer l'impact de la diffusion.

**Usage :** Page confirmation signalement, page annonce (stats), morning briefing

**Anatomy :**
```
┌─────────────────────────┐
│  🔥 2,450              │
│  personnes notifiées    │
│  ───────────────────    │
│  [Animation pulsing]    │
└─────────────────────────┘
```

**States :**
- **Loading :** Skeleton animation
- **Counting :** Animation compteur 0 → valeur cible (2s, easeOutQuad)
- **Static :** Valeur finale affichée
- **Error :** "—" avec message d'erreur

**Variants :**
- **Large :** Page confirmation (text-4xl)
- **Medium :** Stats bar (text-2xl)
- **Small :** Compact card (text-lg)

**Accessibility :**
- `role="status"`, `aria-live="polite"`
- `aria-label="{value} {label}"`
- Reduced motion: Pas d'animation, update direct

**Animation :**
- Compteur anime de 0 → targetValue en 2 secondes
- Easing: easeOutQuad pour effet satisfaisant
- Updates via WebSocket ou polling 30s

**Implementation Notes :**
```typescript
interface LiveCounterProps {
  value: number;
  label: string;
  icon?: string | ReactNode;
  variant?: "small" | "medium" | "large";
  realTime?: boolean;
  animationDuration?: number;
  color?: "red" | "orange" | "blue" | "green" | "gray";
}
```

---

#### 3. DiffusionAnimation

**Purpose :** Animer visuellement la propagation d'une alerte pour rassurer le parent.

**Usage :** Page `/confirmation` après signalement uniquement (moment critique)

**Anatomy :**
```
┌───────────────────────────────────┐
│       [Center: Logo/Icon]         │
│   )))  Vagues concentriques  (((  │
│  Expanding circles animation      │
│                                   │
│  ✓ Facebook  ✓ WhatsApp          │
│  ✓ Instagram ✓ Notifications     │
│  🔥 156 ambassadeurs alertés     │
└───────────────────────────────────┘
```

**Animation Phases (10 secondes total) :**
1. **Phase 1 (0-2s) :** Vagues expansives depuis le centre
2. **Phase 2 (2-5s) :** Checkmarks plateformes apparaissent un par un
3. **Phase 3 (5-8s) :** Compteur ambassadeurs compte jusqu'à valeur finale
4. **Phase 4 (8-10s) :** Animation ralentit et reste visible (loop subtil)

**Accessibility :**
- `role="status"`, `aria-live="polite"`
- `aria-label="Diffusion en cours sur {plateformes}"`
- Reduced motion: Pas de vagues, juste checkmarks progressifs
- Screen reader: Annonce chaque plateforme

**Visual Details :**
- Vagues: Opacity 0.3, stroke orange-500, expanding radius
- Checkmarks: Fade in + scale animation
- Couleur: Orange/rouge (urgence mais pas anxiogène)

**Implementation Notes :**
```typescript
interface DiffusionAnimationProps {
  platforms: Array<"facebook" | "instagram" | "whatsapp" | "x" | "push">;
  ambassadeursCount: number;
  notifiedCount: number;
  onComplete?: () => void;
  reducedMotion?: boolean;
}

// Animation library: Framer Motion
// WebSocket: Real-time updates compteurs
```

---

#### 4. StatsBar

**Purpose :** Afficher les statistiques de diffusion multi-plateformes de manière compacte et branded.

**Usage :** Page annonce détaillée, sous la photo de l'enfant

**Anatomy :**
```
┌────────────────────────────────────────────────┐
│ [📘 2.4K]  [📸 1.8K]  [💬 3.2K]  [🔔 2.5K]   │
│  Facebook   Instagram   WhatsApp   personnes   │
│                                     notifiées   │
└────────────────────────────────────────────────┘
```

**Variants :**
- **Horizontal :** 4 colonnes côte à côte (desktop)
- **Grid :** 2x2 grid (mobile)
- **Compact :** Icons seuls avec tooltips

**Branded Colors :**
- Facebook: bg-blue-50, text-blue-700
- Instagram: bg-gradient purple-pink, text-pink-700
- WhatsApp: bg-green-50, text-green-700
- X: bg-gray-900, text-white
- Notifications: bg-orange-50, text-orange-700

**Accessibility :**
- `role="region"` avec `aria-label="Statistiques de diffusion"`
- Chaque stat: `aria-label="{value} partages sur {platform}"`
- Tooltips au hover/focus avec détails

**Implementation Notes :**
```typescript
interface StatsBarProps {
  stats: {
    facebook?: number;
    instagram?: number;
    whatsapp?: number;
    x?: number;
    pushNotifications?: number;
    ambassadeurs?: number;
  };
  variant?: "horizontal" | "grid" | "compact";
  realTime?: boolean;
}

// Amélioration composant existant: src/components/StatsBar.tsx
```

---

### Phase 2 : Composants Importants

#### 5. MorningBriefing

**Purpose :** Dashboard personnalisé addictif pour ambassadeurs avec stats hier, aujourd'hui, et défis.

**Usage :** Page `/dashboard-ambassadeur` (première chose vue le matin)

**Sections Required :**
1. **Greeting personnalisé** avec nom + emoji contextuel
2. **Impact Hier** - 3 stats clés performance hier
3. **Aujourd'hui** - 3 stats situation actuelle
4. **Défi du Jour** - Challenge avec progress bar
5. **Quick Actions** - 2-3 boutons CTA principaux

**Personalization Logic :**
```javascript
// Greeting varie selon heure
if (hour < 12) "☀️ Bonjour"
else if (hour < 18) "👋 Bon après-midi"
else "🌙 Bonsoir"

// Stats hier = données J-1 de cet ambassadeur
// Défi = généré dynamiquement selon profil
```

**Gamification Elements :**
- Streak counter si > 7 jours
- Badge mini si nouveau déblocké hier
- Leaderboard position avec trend (↑↓)
- Variable reward: Parfois bonus surprise

**Accessibility :**
- `role="region"` avec `aria-label="Briefing quotidien"`
- Sections structurées avec headings H3
- Progress bar avec `aria-valuenow`, `aria-valuemin`, `aria-valuemax`

**Implementation Notes :**
```typescript
interface MorningBriefingProps {
  ambassadeur: {
    name: string;
    territory: string;
    level: number;
    streak: number;
  };
  yesterday: {
    peopleReached: number;
    rank: number;
    xpEarned: number;
  };
  today: {
    activeSearches: number;
    newAnnonces: number;
    activeAmbassadeurs: number;
  };
  dailyChallenge: {
    title: string;
    progress: number;
    target: number;
    reward: string;
  };
}
```

---

#### 6. Leaderboard

**Purpose :** Afficher classement ambassadeurs pour créer compétition saine et FOMO.

**Usage :** Dashboard ambassadeur, page dédiée `/ambassadeurs/leaderboard`

**Visual Hierarchy :**
- Top 3: Taille plus grande, badges visibles
- #1: Gold gradient, animation subtile
- #2-3: Silver/bronze gradient
- #4-10: Neutral background
- Current user: Highlighted avec bordure orange

**Time Periods :**
- Cette semaine (lundi-dimanche)
- Ce mois
- Tous les temps (hall of fame)

**Motivation Elements :**
- Distance du top affiché clairement ("À 230 XP du TOP 2 !")
- Suggestion actions pour progresser
- Badge visuel pour top 10
- FOMO: "X ambassadeurs vous ont dépassé cette semaine"

**Accessibility :**
- `role="list"` avec `aria-label="Classement ambassadeurs"`
- Current user highlighted avec `aria-current="true"`
- Keyboard nav: Arrow keys pour naviguer

**Implementation Notes :**
```typescript
interface LeaderboardProps {
  entries: Array<{
    rank: number;
    ambassadeurId: string;
    name: string;
    avatar?: string;
    xp: number;
    badge?: "gold" | "silver" | "bronze";
    trend?: "up" | "down" | "stable";
  }>;
  currentUserId: string;
  currentUserRank?: number;
  period: "week" | "month" | "alltime";
  variant?: "top10" | "full" | "compact";
}
```

---

#### 7. StreakProgress

**Purpose :** Afficher progression streaks quotidiens et XP pour gamification addictive.

**Usage :** Dashboard ambassadeur, profil ambassadeur

**Components :**
1. **Streak Counter :** Jours consécutifs avec fire icons
2. **Weekly Grid :** 7 carrés (filled = jour complété)
3. **Level Progress Bar :** XP actuel vs. prochain niveau
4. **Next Reward :** XP manquants + titre niveau suivant

**Streak Rules :**
```javascript
// Streak incrémente si:
// - Connexion dans les 24h depuis dernière connexion
// - Au moins 1 action (partage, validation, etc.)

// Streak break si:
// - Pas de connexion > 24h
```

**Level System :**
```javascript
// Levels: 1-50
// XP par level = level * 100
// Titres: Gardien (1-5), Protecteur (6-10), Elite (11-20),
//         Héros (21-30), Légende (31+)
```

**Motivation Elements :**
- Milestone animations: 7j, 30j, 100j, 365j
- Level up celebration: Confettis + badge nouveau titre
- Almost milestone: "Plus que 2 jours pour 30 jours streak !"

**Implementation Notes :**
```typescript
interface StreakProgressProps {
  streak: {
    current: number;
    lastActiveDate: Date;
    weeklyGrid: boolean[]; // 7 jours
  };
  level: {
    current: number;
    title: string;
    xpCurrent: number;
    xpRequired: number;
    nextTitle: string;
  };
  onLevelUpAnimation?: () => void;
}
```

---

#### 8. TestimonyCard

**Purpose :** Carte témoignage pour ambassadeurs avec actions validation rapide.

**Usage :** Dashboard ambassadeur, file `/temoignages-en-attente`

**Actions Available :**
1. **✅ Valider :** Publie immédiatement (ambassadeur autonome)
2. **❌ Rejeter :** Demande raison (spam, faux, doublon, autre)
3. **⏸️ Doute :** Escalade à admin pour review

**Content Elements :**
- **Author :** Prénom + initiale + time ago
- **Location :** Zone précise avec pin icon
- **Description :** Max 200 caractères, expand si plus
- **Photo :** Optionnelle, lightbox au clic
- **Map :** Mini-map 100px avec pin localisation

**Validation Flow :**
```
Clic "Valider" → Confirm modal → API call → Success toast
Clic "Rejeter" → Modal raison → API call → Success toast
Clic "Doute" → Confirm escalade → API call → Badge "En review"
```

**Security / Abuse Prevention :**
- Rate limit: Max 50 validations/jour par ambassadeur
- Pattern detection: Alert si ambassadeur valide tout
- Audit log: Toutes actions ambassadeurs tracées
- Admin override: Admin peut reverser décision

**Implementation Notes :**
```typescript
interface TestimonyCardProps {
  testimony: {
    id: string;
    author: { name: string; phone?: string };
    description: string;
    photo?: string;
    location: { lat: number; lng: number; address: string };
    createdAt: Date;
    annonceId: string;
  };
  onValidate: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
  onEscalate: (id: string) => Promise<void>;
}
```

---

### Phase 3 : Composants Enhancement

#### 9. MetricsDashboard

**Purpose :** Dashboard institutionnel pour autorités/ONG montrant impact mesurable (Grant-First Path).

**Usage :** Page `/impact`

**KPI Cards (4 essentiels) :**
1. **Annonces diffusées** - Nombre total
2. **Enfants retrouvés** - Nombre + taux %
3. **Ambassadeurs actifs** - Nombre + trend
4. **Personnes touchées** - Total reach cumulé

**Charts Required :**
1. **Line Chart :** Évolution annonces/mois (6-12 mois)
2. **Bar Chart :** Taux retrouvailles par zone
3. **Map :** Heatmap couverture géographique BF
4. **Donut :** Répartition âges enfants signalés

**Professional Design :**
- Palette sobre: Bleu institutional, pas de gamification
- Fonts lisibles: Inter 14-16px minimum
- Grid layout: 2-3 colonnes desktop, 1 mobile
- White background: Impression PDF friendly

**Export Features :**
- **CSV Export :** Toutes métriques + raw data
- **PDF Report :** Charts + KPIs + case studies
- **Share Link :** Shareable public report URL

**Implementation Notes :**
```typescript
interface MetricsDashboardProps {
  kpis: {
    totalAnnonces: number;
    enfantsRetrouves: number;
    tauxRetrouvailes: number;
    ambassadeursActifs: number;
    personnesTouchees: number;
  };
  charts: {
    annoncesParMois: Array<{ month: string; count: number }>;
    tauxParZone: Array<{ zone: string; taux: number }>;
  };
  dateRange: { start: Date; end: Date };
}

// Chart library: Recharts ou Chart.js
```

---

#### 10. InteractiveMap

**Purpose :** Map interactive pour ambassadeurs gérer zones de recherche.

**Usage :** Dashboard ambassadeur, `/coordonner-zones`

**Map Features :**
- **Zones polygones :** Territoires ambassadeurs (bordure colorée)
- **Pins annonces :** Cliquable, ouvre card annonce
- **Pins ambassadeurs :** Cliquable, montre nom + statut
- **Heatmap :** Densité recherches actives
- **Drawing tools :** Dessiner nouveaux périmètres

**Actions Available :**
1. **Créer zone :** Dessiner polygon → Nommer → Assigner ambassadeur
2. **Assigner zone :** Sélectionner zone + ambassadeur
3. **Voir stats zone :** Clic zone → Modal avec metrics
4. **Goto annonce :** Clic pin → Navigate `/annonce/[id]`

**Security :**
- Zones visibles: Seulement territoire ambassadeur + adjacentes
- Assign rights: Seulement admin ou super-ambassadeurs
- Rate limit: Max 10 zones créées/jour

**Implementation Notes :**
```typescript
interface InteractiveMapProps {
  center: { lat: number; lng: number };
  zones: Array<{
    id: string;
    name: string;
    polygon: Array<{ lat: number; lng: number }>;
    ambassadeurId: string;
  }>;
  pins: Array<{
    type: "annonce" | "ambassadeur" | "testimony";
    lat: number;
    lng: number;
    data: any;
  }>;
  canEdit: boolean;
}

// Google Maps API: Drawing Manager + Polygon overlays
```

---

#### 11. AchievementBadge

**Purpose :** Badge gamification avec animation celebratoire lors déblocage.

**Usage :** Toast notification, profil ambassadeur, leaderboard

**Badge Types :**
- **Milestone :** 1er partage, 10 partages, 100 partages
- **Streak :** 7 jours, 30 jours, 100 jours, 365 jours
- **Special :** Enfant retrouvé grâce à vous, Top 10, Héros du mois
- **Rare :** Événements uniques (Noël, anniversaire plateforme)

**Animation Sequence :**
```
1. Scale up from 0 to 1.2 (0.3s)
2. Confetti burst (0.5s)
3. Scale down to 1.0 (0.2s)
4. Shimmer effect (1s loop)
5. Toast notification stays 5s
```

**Badge Rarity Levels :**
- **Common :** Gris - Faciles à obtenir
- **Uncommon :** Vert - Nécessite engagement
- **Rare :** Bleu - Difficile, < 20% ambassadeurs
- **Epic :** Violet - Très difficile, < 5% ambassadeurs
- **Legendary :** Or - Exceptionnel, < 1% ambassadeurs

**Accessibility :**
- `role="status"` pour unlock notification
- `aria-label="Badge {name} débloqué"`
- Reduced motion: Pas de confettis, fade in simple
- Sound: Optionnel, courte mélodie satisfaction

**Implementation Notes :**
```typescript
interface AchievementBadgeProps {
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
    unlockedAt?: Date;
  };
  state: "locked" | "unlocking" | "unlocked";
  onUnlockAnimation?: () => void;
}

// Animation: Framer Motion + canvas confetti
```

---

### Component Implementation Strategy

**Architecture Fichiers :**
```
src/components/
├── ui/              # shadcn/ui foundation (20 composants)
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── ...
├── custom/          # Custom components (11 composants)
│   ├── AnnonceCard.tsx
│   ├── LiveCounter.tsx
│   ├── DiffusionAnimation.tsx
│   ├── StatsBar.tsx
│   ├── MorningBriefing.tsx
│   ├── Leaderboard.tsx
│   ├── StreakProgress.tsx
│   ├── TestimonyCard.tsx
│   ├── MetricsDashboard.tsx
│   ├── InteractiveMap.tsx
│   └── AchievementBadge.tsx
└── shared/          # Utils partagés
    ├── LoadingState.tsx
    ├── ErrorBoundary.tsx
    └── EmptyState.tsx
```

**Conventions de Développement :**
1. **TypeScript Strict :** Tous composants en TS strict mode
2. **Props Interfaces :** Toutes interfaces exportées pour réutilisation
3. **Storybook :** Story pour chaque composant + variants
4. **Tests :** Unit tests (Jest + Testing Library) + Accessibility (axe-core)
5. **Documentation :** JSDoc comments pour props complexes

**Design Tokens Partagés :**
```javascript
// tailwind.config.ts - Extension palette émotionnelle
module.exports = {
  theme: {
    extend: {
      colors: {
        urgent: { 50: "...", 600: "#DC2626", 900: "..." },
        active: { 50: "...", 500: "#EA580C", 900: "..." },
        ongoing: { 50: "...", 500: "#3B82F6", 900: "..." },
        success: { 50: "...", 600: "#16A34A", 900: "..." },
        historic: { 50: "...", 500: "#9CA3AF", 900: "..." },
      },
      animation: {
        "confetti": "confetti 0.5s ease-out",
        "pulse-soft": "pulse 2s ease-in-out infinite",
        "wave": "wave 2s ease-in-out infinite",
        "count-up": "countUp 2s ease-out",
      },
    },
  },
};
```

**Performance Optimizations :**
- **Lazy Loading :** Components Phase 3 lazy-loadés
- **Code Splitting :** Route-based splitting automatique (Next.js)
- **Image Optimization :** next/image pour toutes photos
- **Bundle Analysis :** Vérifier taille bundles régulièrement

**Accessibility Standards :**
- **WCAG AA Minimum :** Toutes interactions keyboard accessible
- **ARIA Labels :** Tous composants interactifs labellés
- **Focus Management :** Focus visible et ordre logique
- **Screen Reader :** Toutes actions annoncées correctement
- **Reduced Motion :** Respecter `prefers-reduced-motion`


### Implementation Roadmap

**Semaine 1-2 (Phase 1 - MVP Critique) :**

**Objectif :** Composants essentiels pour parcours famille (signalement) et communauté (contribution).

**Composants à développer :**
1. **AnnonceCard** (3 jours)
   - Variants: compact, default, detailed
   - States: urgent, active, ongoing, historic, found
   - Tests: Unit tests + Storybook stories

2. **LiveCounter** (2 jours)
   - Animation compteur 0 → target
   - Real-time updates WebSocket
   - Variants: small, medium, large

3. **DiffusionAnimation** (3 jours)
   - 4 phases animation (10s total)
   - Checkmarks progressifs plateformes
   - Reduced motion support

4. **StatsBar** (2 jours)
   - Refactor composant existant
   - Branded colors multi-plateformes
   - Real-time updates

**Livrables Semaine 2 :**
- Parcours signalement fonctionnel avec animations
- Page annonce avec stats branded
- Tests automatisés Phase 1 (80%+ coverage)

---

**Semaine 3-4 (Phase 2 - Gamification Ambassadeurs) :**

**Objectif :** Dashboard ambassadeur addictif avec morning briefing, leaderboard, streaks.

**Composants à développer :**
5. **MorningBriefing** (4 jours)
   - Personnalisation greeting + stats hier/aujourd'hui
   - Défi du jour avec progress
   - Quick actions CTA

6. **Leaderboard** (3 jours)
   - Top 50 avec badges visuels
   - Current user highlighting
   - Time periods: semaine, mois, all-time

7. **StreakProgress** (2 jours)
   - Streak counter + weekly grid
   - Level progress bar
   - Milestone animations

8. **TestimonyCard** (3 jours)
   - Actions validation autonomes
   - Security rate limits
   - Mini-map location

**Livrables Semaine 4 :**
- Dashboard ambassadeur complet et addictif
- Boucle gamification fonctionnelle (Hook Model)
- Tests automatisés Phase 2 (80%+ coverage)

---

**Semaine 5-8 (Phase 3 - Grant-First Path & Enhancement) :**

**Objectif :** Dashboard impact institutionnel (UNICEF/USAID) + coordination avancée ambassadeurs.

**Composants à développer :**
9. **MetricsDashboard** (5 jours)
   - 4 KPI cards + 4 charts
   - Export CSV/PDF
   - Professional design sobre

10. **InteractiveMap** (7 jours)
    - Google Maps integration
    - Zones polygones ambassadeurs
    - Drawing tools
    - Pins annonces/ambassadeurs/témoignages

11. **AchievementBadge** (3 jours)
    - 5 rarity levels
    - Unlock animations confettis
    - Badge catalog display

**Livrables Semaine 8 :**
- Page `/impact` professionnelle pour ONG/autorités
- Map coordination zones fonctionnelle
- Système badges complet
- Tests automatisés Phase 3 (80%+ coverage)
- Documentation complète tous composants

---

**Semaine 9+ (Optimisations & Polish) :**

**Performance :**
- Lazy loading Phase 3 components
- Bundle size optimization (< 200KB First Load JS)
- Image optimization (WebP, responsive sizes)
- Lighthouse score > 90 mobile

**Animations Polish :**
- Framer Motion transitions fluides
- Micro-interactions satisfaction
- Loading states élégants
- Error states constructifs

**A/B Testing :**
- AnnonceCard variants (compact vs. detailed)
- MorningBriefing layouts (vertical vs. horizontal)
- Leaderboard positions (top 10 vs. top 50)

**Analytics Tracking :**
- Component interaction events
- Conversion funnels (signalement, contribution, ambassadeur)
- Performance metrics (time to interactive)

---

**Dépendances Clés :**

**npm Packages à installer :**
```json
{
  "dependencies": {
    "@radix-ui/react-*": "^1.0.0",  // shadcn/ui peer deps
    "framer-motion": "^10.0.0",     // Animations
    "recharts": "^2.5.0",           // Charts (MetricsDashboard)
    "@googlemaps/js-api-loader": "^1.16.0", // Google Maps
    "canvas-confetti": "^1.9.0",    // Confetti animations
    "date-fns": "^2.30.0",          // Date formatting
    "react-hook-form": "^7.45.0",   // Forms (déjà installé)
    "zod": "^3.21.0"                // Validation (déjà installé)
  },
  "devDependencies": {
    "@storybook/react": "^7.0.0",   // Storybook
    "@testing-library/react": "^14.0.0", // Tests
    "axe-core": "^4.7.0"            // A11y tests
  }
}
```

**APIs Externes :**
- Google Maps JavaScript API (zones, pins, drawing)
- Firebase Realtime Database (live counters WebSocket)
- OneSignal (déjà intégré pour notifications)

---

**Total Estimation :**
- **31 composants** (20 foundation + 11 custom)
- **8 semaines développement** (Phases 1-3)
- **~240 heures** développement (1 dev full-time)
- **80%+ test coverage** toutes phases
- **WCAG AA compliance** tous composants
## UX Consistency Patterns

### Button Hierarchy

**Purpose :** Établir hiérarchie visuelle claire entre actions pour guider l'utilisateur vers les actions principales.

**Button Types & Usage :**

#### Primary Button (Action Principale)
- **Visual :** bg-red-600, text-white, rounded-xl, font-semibold, min-h-44px
- **Usage :** 1 seul par écran maximum, action critique (Signaler, Valider, Publier)
- **Exemples :** "🚨 Signaler", "✅ Valider et publier", "Partager"
- **States :**
  - Default: bg-red-600
  - Hover: bg-red-700
  - Active: scale-0.98
  - Disabled: bg-red-400 opacity-50
  - Focus: ring-2 ring-red-500 offset-2
- **Accessibility :** `aria-label` descriptif, focus ring visible, keyboard accessible

#### Secondary Button (Action Secondaire)
- **Visual :** bg-white, text-red-600, border-2 border-red-600, rounded-xl
- **Usage :** Actions alternatives ou moins critiques (Annuler, Retour, Voir plus)
- **Exemples :** "Retour", "Annuler", "Plus tard"
- **States :**
  - Default: bg-white, border-red-600
  - Hover: bg-red-50
  - Active: scale-0.98

#### Ghost Button (Action Tertiaire)
- **Visual :** bg-transparent, text-gray-700, no border, underline on hover
- **Usage :** Actions discrètes (Skip, Ignorer, Fermer)
- **Exemples :** "Passer cette étape", "Fermer", "Ne plus afficher"
- **States :**
  - Hover: underline, text-gray-900

#### Destructive Button (Action Dangereuse)
- **Visual :** bg-red-600, text-white, icon ❌ ou 🗑️
- **Usage :** Actions irréversibles nécessitant confirmation (Supprimer, Rejeter)
- **Exemples :** "❌ Rejeter témoignage", "Supprimer annonce"
- **Pattern :** TOUJOURS suivi d'un AlertDialog de confirmation

**Button Size Guidelines :**
```css
.btn-large {  min-height: 48px; padding: 12px 24px; } /* Primary CTAs mobile */
.btn-medium { min-height: 44px; padding: 10px 20px; } /* Standard buttons */
.btn-small {  min-height: 36px; padding: 8px 16px; }  /* Compact contexts */
```

**Button Group Patterns :**

**❌ Anti-Pattern:**
```
[Primary] [Primary] [Primary]  // Confusion - pas de hiérarchie
```

**✅ Correct Pattern:**
```
[Primary]              [Secondary]  // Hiérarchie claire gauche-droite
[Valider et publier]   [Retour]

Mobile (full-width):
[Primary full-width]
[Secondary full-width]
```

**Spacing Rules:**
- Horizontal gap: 12px entre boutons
- Vertical gap (stacked): 12px entre boutons
- Container padding: 16px minimum autour groupe boutons

**Implementation (shadcn/ui):**
```tsx
import { Button } from "@/components/ui/button";

// Primary
<Button variant="default" size="lg">🚨 Signaler</Button>

// Secondary
<Button variant="outline" size="lg">Retour</Button>

// Ghost
<Button variant="ghost">Fermer</Button>

// Destructive
<Button variant="destructive">Supprimer</Button>
```


### Feedback Patterns

**Purpose :** Communiquer état système et résultats actions de manière claire et non-intrusive.

#### A. Toast Notifications (Feedback Temporaire)

**Visual Design :**
- **Position :** Bottom center (mobile), top-right (desktop)
- **Duration :** 3-5 secondes auto-dismiss
- **Dismiss :** Swipe down/right ou clic X
- **Animation :** Slide in (300ms) + fade out (200ms)

**Toast Types & Usage :**

**Success Toast:**
- **Color :** bg-green-50, text-green-800, border-l-4 border-green-600
- **Icon :** ✅ checkmark
- **Usage :** Actions réussies (partage, validation, publication)
- **Exemple :** "✅ Partagé avec succès ! 1,247 personnes touchées"
- **Sound :** Optionnel, courte mélodie satisfaction

**Error Toast:**
- **Color :** bg-red-50, text-red-800, border-l-4 border-red-600
- **Icon :** ❌ alert-circle
- **Usage :** Erreurs récupérables
- **Exemple :** "❌ Échec de l'upload [Réessayer]"
- **Action :** Bouton "Réessayer" si action recoverable

**Warning Toast:**
- **Color :** bg-orange-50, text-orange-800, border-l-4 border-orange-600
- **Icon :** ⚠️ alert-triangle
- **Usage :** Avertissements non-bloquants
- **Exemple :** "⚠️ Connexion instable. Vérifiez votre réseau"

**Info Toast:**
- **Color :** bg-blue-50, text-blue-800, border-l-4 border-blue-600
- **Icon :** ℹ️ info-circle
- **Usage :** Informations contextuelles
- **Exemple :** "ℹ️ Nouvelle annonce proche. Enfant disparu à 2km"

**Implementation (shadcn/ui):**
```tsx
import { toast } from "@/components/ui/use-toast";

// Success
toast({
  title: "Partagé avec succès !",
  description: "1,247 personnes touchées",
  variant: "success",
  duration: 4000,
});

// Error with action
toast({
  title: "Échec de l'upload",
  description: "Vérifiez votre connexion",
  variant: "destructive",
  action: <Button size="sm">Réessayer</Button>,
});
```

**Accessibility:**
- `role="status"` (info, success, warning)
- `role="alert"` (errors uniquement)
- `aria-live="polite"` ou `"assertive"` (errors)
- Screen reader annonce automatiquement le contenu

---

#### B. Inline Validation (Form Feedback)

**Pattern :** Validation en temps réel pendant saisie, pas seulement au submit.

**Visual States:**

**Error State:**
```
Numéro de téléphone
[01234567]  ← bordure red-500 2px
❌ Format invalide (8 chiffres requis)  ← text-red-600 text-xs
```

**Success State:**
```
Numéro de téléphone
[01234567] ✅  ← bordure green-500 1px, checkmark
```

**Validation Timing Strategy:**
- **onBlur :** Valide quand user quitte champ (pas trop aggressif)
- **onChange :** Valide pendant saisie SEULEMENT si erreur déjà affichée (correction en temps réel)
- **onSubmit :** Valide tous champs, focus premier champ en erreur avec scroll

**Error Message Guidelines:**
1. **Spécifique :** "Format invalide (8 chiffres requis)" pas juste "Erreur"
2. **Actionnable :** Dire comment corriger le problème
3. **Court :** Max 1 ligne (40 caractères)
4. **Tone neutre :** "Format invalide" pas "Vous avez mal saisi"
5. **Positif quand possible :** "Il manque 2 chiffres" plutôt que "Trop court"

**Implementation (shadcn/ui + react-hook-form):**
```tsx
<FormField
  control={form.control}
  name="phone"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Numéro de téléphone *</FormLabel>
      <FormControl>
        <Input {...field} placeholder="01234567" />
      </FormControl>
      <FormMessage />  {/* Error message inline */}
    </FormItem>
  )}
/>
```

**Accessibility:**
- `aria-invalid="true"` sur input en erreur
- `aria-describedby="error-id"` pointant vers message erreur
- Error message avec `id="error-id"` et `role="alert"`
- Focus management vers premier champ erreur au submit

---

#### C. Loading States

**Pattern Types:**

**1. Skeleton Loading (Preferred for Lists/Cards):**
```tsx
<Skeleton className="h-24 w-full mb-4" />
<Skeleton className="h-24 w-full mb-4" />
<Skeleton className="h-24 w-full mb-4" />
```
- **Usage :** Chargement lists, cards, complex layouts
- **Animation :** Pulse subtle (2s ease-in-out infinite)
- **Color :** bg-gray-200 avec animate-pulse
- **Avantage :** Montre structure layout avant data

**2. Spinner Loading:**
- **Usage :** Actions API (submit, delete, fetch)
- **Size :** 24px par défaut, 16px small, 32px large
- **Color :** text-gray-600 ou brand color
- **Position :** Centré dans container ou inline dans button

**3. Progress Bar:**
```tsx
<Progress value={60} className="w-full" />
```
- **Usage :** Upload fichiers, multi-step avec % completion
- **Show percentage :** Si durée estimée > 10 secondes
- **Color :** bg-red-600 pour brand consistency
- **Update frequency :** Every 100ms minimum (éviter flickering)

**4. Button Loading State:**
```tsx
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Publication...
</Button>
```
- **Disabled :** true pendant loading
- **Cursor :** not-allowed
- **Spinner :** 16px à gauche du texte
- **Text change :** "Publication..." au lieu de "Publier"
- **Preserve width :** Éviter layout shift avec min-width

**Loading State Decision Tree:**
```
Liste de données?
  → Yes: Skeleton (montre structure)
  → No: Continue

Action user (button click)?
  → Yes: Button spinner inline
  → No: Continue

Upload fichier?
  → Yes: Progress bar avec %
  → No: Spinner centré
```

**Accessibility:**
- `aria-busy="true"` pendant chargement
- `aria-live="polite"` pour updates de status
- Screen reader annonce: "Chargement en cours"
- Disabled buttons avec `aria-disabled="true"`


### Form Patterns

**Purpose :** Garantir saisie rapide, validation claire, et error recovery gracieux.

#### Multi-Step Form Pattern

**Visual Structure:**
```
[1●─2○─3○─4○]  ← Stepper horizontal (Progress component)

┌────────────────────────────────┐
│ Étape 1/4 : L'enfant          │
│                                │
│ [Form fields]                  │
│                                │
│ [Retour]        [Suivant →]   │
└────────────────────────────────┘
```

**Rules:**
- **Stepper visible :** Progress indicator en haut de page
- **1 step = 1 écran :** Pas de scroll vertical entre steps
- **3-7 champs max :** Par step (cognitive load management)
- **Navigation :** Boutons Retour + Suivant toujours visibles
- **Data persistence :** Données sauvegardées entre steps (react-hook-form state)
- **Validation par step :** Valide step actuel avant autoriser Suivant

**Progressive Disclosure Pattern:**
```
❌ Anti-Pattern: 10 champs visibles d'un coup
→ Cognitive overload

✅ Correct Pattern:
Step 1 (5 champs) → Complete → Step 2 (3 champs) → Complete → Step 3...
→ Focused attention, higher completion
```

**Step Indicator States:**
- **Completed :** ● (filled circle) + green color
- **Current :** ● (filled circle) + red color + pulse animation
- **Upcoming :** ○ (empty circle) + gray color
- **Line connector :** Solid si completed, dashed si upcoming

**Implementation:**
```tsx
<Progress value={(currentStep / totalSteps) * 100} />

<div className="flex items-center justify-between mb-6">
  <Button variant="outline" onClick={prevStep}>
    ← Retour
  </Button>
  <span className="text-sm text-gray-600">
    Étape {currentStep}/{totalSteps}
  </span>
  <Button onClick={nextStep}>
    Suivant →
  </Button>
</div>
```

---

#### Required vs. Optional Fields

**Visual Indicators:**
```
Nom de l'enfant *              ← Asterisk rouge après label
Email (optionnel)              ← Text gray explicit "optionnel"
```

**Rules:**
- **Required :** Asterisk `*` rouge après label
- **Optional :** Text "(optionnel)" en gray-500 après label
- **Default assumption :** Tous champs required sauf mention contraire
- **Error priority :** Valider required fields en premier

**Legend Pattern:**
```
Les champs marqués d'un * sont obligatoires
```
- Position: En haut du form
- Font: text-sm text-gray-600
- Icon: * rouge comme exemple

---

#### Input States Specification

**1. Default State:**
- Border: border-gray-300 1px
- Background: bg-white
- Text: text-gray-900
- Placeholder: text-gray-400

**2. Focus State:**
- Border: border-red-500 2px
- Ring: ring-2 ring-red-500 ring-offset-1
- Background: bg-white (pas de changement)
- Cursor: text cursor visible

**3. Error State:**
- Border: border-red-500 2px
- Background: bg-red-50
- Text: text-gray-900
- Error message: text-red-600 text-xs mt-1
- Icon: ❌ ou AlertCircle à droite dans input

**4. Success State:**
- Border: border-green-500 1px
- Checkmark: ✅ ou CheckCircle green-600 16px à droite
- Background: bg-white
- No success message (checkmark suffit)

**5. Disabled State:**
- Border: border-gray-200 1px
- Background: bg-gray-100
- Text: text-gray-400
- Cursor: cursor-not-allowed
- Opacity: 0.6

---

#### Auto-Complete & Smart Defaults

**Geolocation Auto-Fill:**
```tsx
<Button
  type="button"
  variant="outline"
  onClick={getCurrentLocation}
>
  📍 Utiliser ma position
</Button>
```
- Remplit automatiquement adresse via GPS + reverse geocoding
- Fallback: Saisie manuelle si GPS refusé
- Loading state pendant fetch coordinates

**Date/Time Defaults:**
- Date disparition: Default à date du jour
- Heure: Default à heure actuelle
- Format: Localisé français (DD/MM/YYYY HH:mm)

**Phone Formatting:**
- Auto-format: `01234567` → `01 23 45 67`
- Validation: 8 chiffres Burkina Faso
- Remove spaces pour API: `01 23 45 67` → `01234567`

**Auto-Capitalize:**
- Noms propres: First letter uppercase auto
- Villes: Capitalize each word
- Descriptions: Sentence case

**Implementation:**
```tsx
// Auto-format phone
const formatPhone = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
  }
  return value;
};
```

**Accessibility:**
- Labels toujours visibles (pas de placeholder-only)
- `<label for="input-id">` associé à `<input id="input-id">`
- Error messages avec `aria-describedby="error-id"`
- Keyboard nav: Tab entre champs, Enter submit form
- Auto-complete: `autocomplete` attribute approprié (name, tel, email, etc.)


### Navigation Patterns

**Purpose :** Navigation mobile-first cohérente et intuitive.

#### Mobile Bottom Navigation Bar

**Visual Structure:**
```
┌────────────────────────────────┐
│     [Page Content]             │
│                                │
└────────────────────────────────┘
┌────────────────────────────────┐
│ [🏠]  [🔍]  [🚨]  [👤]        │ ← Fixed bottom
│ Accueil Chercher Signaler Profil│
└────────────────────────────────┘
```

**Specifications:**
- **Position :** Fixed bottom, z-index 40
- **Height :** 64px (56px content + 8px safe area)
- **Items :** 4-5 maximum (optimal UX)
- **Icons :** 24px, spacing 16px
- **Labels :** 10px, gray-600 inactive, red-600 active
- **Active indicator :** Bold label + colored icon
- **Safe area :** Padding-bottom iOS notch

**Navigation Items Priority:**
1. **🏠 Accueil** - Feed annonces actives
2. **🔍 Rechercher** - Search annonces
3. **🚨 Signaler** - CTA principal (red circular background)
4. **👤 Profil/Dashboard** - User settings ou ambassadeur dashboard

**CTA Signaler Styling:**
- Background: bg-red-600 circular (60px diameter)
- Position: Elevated above bar (-20px translateY)
- Icon: 24px white
- Pulse animation subtle (attention grabber)

**Implementation:**
```tsx
<nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 pb-safe">
  <div className="flex items-center justify-around h-14">
    <NavItem icon={Home} label="Accueil" active={true} />
    <NavItem icon={Search} label="Chercher" />
    <NavItemCTA icon={AlertCircle} label="Signaler" />
    <NavItem icon={User} label="Profil" />
  </div>
</nav>
```

**Accessibility:**
- `<nav>` semantic tag avec `aria-label="Navigation principale"`
- `aria-current="page"` sur item actif
- Keyboard: Tab navigation + Enter activation
- Touch target: Minimum 44x44px (Apple HIG)

---

#### Desktop Header Navigation

**Visual Structure:**
```
┌──────────────────────────────────────────────────────────┐
│ [Logo] EnfantDisparu.bf  [Accueil] [Impact] [Ambassadeurs] [🚨 Signaler] │
└──────────────────────────────────────────────────────────┘
```

**Specifications:**
- **Position :** Sticky top, shadow on scroll
- **Height :** 64px
- **Logo :** Cliquable → homepage
- **Links :** 3-5 max, text-gray-700 hover:text-red-600
- **CTA :** "🚨 Signaler" toujours visible, red button
- **Spacing :** 32px entre items

**Sticky Behavior:**
```css
/* Pas de shadow initial */
header { box-shadow: none; }

/* Shadow au scroll > 10px */
header.scrolled { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
```

**Responsive Breakpoint:**
- `< 768px` : Bottom navigation (mobile)
- `≥ 768px` : Header navigation (desktop)

---

#### Breadcrumbs (Desktop Only)

**Visual Structure:**
```
Accueil > Annonces > EPB-20260328-001
```

**Specifications:**
- **Usage :** Pages détaillées (annonce, profil ambassadeur, dashboard)
- **Color :** text-gray-600, hover:text-red-600
- **Separator :** `>` ou `/` gray-400
- **Last item :** font-semibold, non-cliquable (current page)
- **Max depth :** 4 niveaux (éviter surcharge)

**Implementation:**
```tsx
<nav aria-label="Breadcrumb" className="text-sm">
  <ol className="flex items-center space-x-2">
    <li><Link href="/">Accueil</Link></li>
    <li className="text-gray-400">></li>
    <li><Link href="/annonces">Annonces</Link></li>
    <li className="text-gray-400">></li>
    <li className="font-semibold" aria-current="page">EPB-001</li>
  </ol>
</nav>
```

**Accessibility:**
- `<nav aria-label="Breadcrumb">`
- `<ol>` list semantics
- `aria-current="page"` sur dernier item
- Links keyboard accessible

---

#### Back Button Pattern

**Visual Structure:**
```
[← Retour]   Titre de la page
```

**Specifications:**
- **Position :** Top left sous header
- **Mobile :** Arrow icon seul `←`
- **Desktop :** Arrow + "Retour" text
- **Action :** `router.back()` ou route parent explicite
- **Color :** text-gray-700 hover:text-red-600

**When to Use:**
- Pages détaillées (annonce, profil)
- Modals/drawers (X close button)
- Multi-step forms (entre steps)

**Implementation:**
```tsx
<Button
  variant="ghost"
  size="sm"
  onClick={() => router.back()}
>
  <ArrowLeft className="mr-2 h-4 w-4" />
  <span className="hidden sm:inline">Retour</span>
</Button>
```


### Modal & Overlay Patterns

**Purpose :** Interruptions contextuelles sans quitter page principale.

#### Dialog Modal (Confirmations)

**Visual Structure:**
```
[Backdrop: bg-black/50 backdrop-blur-sm]

┌────────────────────────────────┐
│ ⚠️  Confirmer la suppression   │ ← Title
│                 [X]             │ ← Close button
│                                │
│ Cette action est irréversible. │ ← Description
│ L'annonce sera définitivement  │
│ supprimée.                     │
│                                │
│ [Annuler]     [Oui, supprimer]│ ← Actions
└────────────────────────────────┘
```

**Specifications:**
- **Max width :** 400px mobile, 500px desktop
- **Position :** Centered vertical + horizontal
- **Backdrop :** Click ferme modal (sauf actions critiques)
- **Close :** X button top-right + Escape key
- **Animation :** Fade in backdrop (200ms) + scale modal (300ms)
- **Focus trap :** Tab cycle uniquement dans modal

**When to Use:**
- Confirmations actions destructives (supprimer, rejeter)
- Forms courts (1-3 champs, ex: raison rejet)
- Messages importants nécessitant action immédiate
- Warnings critiques bloquant workflow

**Implementation (shadcn/ui):**
```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Supprimer</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
      <AlertDialogDescription>
        Cette action est irréversible...
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Annuler</AlertDialogCancel>
      <AlertDialogAction>Oui, supprimer</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**Accessibility:**
- `role="alertdialog"` avec `aria-modal="true"`
- `aria-labelledby` vers titre
- `aria-describedby` vers description
- Focus sur premier bouton action à l'ouverture
- Focus return à trigger element à fermeture
- Escape key ferme modal

---

#### Sheet / Bottom Drawer (Mobile)

**Visual Structure:**
```
┌────────────────────────────────┐
│     [Page Content]             │
└────────────────────────────────┘
┌────────────────────────────────┐
│ ═══  [Drag handle]             │ ← Swipe down pour fermer
│                                │
│ Partager sur :                 │
│ [📘 Facebook]                  │
│ [📸 Instagram]                 │
│ [💬 WhatsApp]                  │
│ [✕ Fermer]                     │
└────────────────────────────────┘
```

**Specifications:**
- **Animation :** Slide up from bottom (300ms ease-out)
- **Gesture :** Swipe down pour fermer
- **Max height :** 80% viewport
- **Drag handle :** Visible en haut (8px wide, 4px height, rounded)
- **Backdrop :** Semi-transparent (bg-black/40)
- **Dismiss :** Swipe down, clic backdrop, ou bouton Fermer

**When to Use:**
- Share menus (multi-plateformes)
- Action sheets (choix multiples)
- Filters/sorts (non-bloquant)
- Quick actions lists

**Implementation (shadcn/ui):**
```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button>Partager</Button>
  </SheetTrigger>
  <SheetContent side="bottom" className="h-[80vh]">
    <SheetHeader>
      <SheetTitle>Partager sur</SheetTitle>
    </SheetHeader>
    {/* Content */}
  </SheetContent>
</Sheet>
```

**Accessibility:**
- `role="dialog"` avec `aria-modal="true"`
- `aria-labelledby` vers titre sheet
- Focus trap active
- Swipe gesture annoncé aux screen readers

---

#### Toast vs. Dialog Decision Tree

**Use Toast when:**
- Information non-critique
- Pas de réponse user requise
- Feedback rapide d'action (success, error recoverable)
- Durée courte (3-5s auto-dismiss)

**Use Dialog when:**
- Action nécessite confirmation user
- Information critique bloquant workflow
- Form input requis
- Choix multiples à présenter

**Use Sheet when:**
- Liste d'options (partage, actions)
- Filters/sorts complexes
- Mobile-first interactions
- Non-bloquant mais nécessite attention

**Example Decision:**
```
User clique "Supprimer annonce"
→ Dialog (confirmation critique requise)

User clique "Partager"
→ Sheet bottom (liste options non-bloquant)

Upload réussi
→ Toast (feedback rapide, pas de réponse requise)

Connexion perdue
→ Toast error avec action "Réessayer"
```


### Empty States & Loading States

**Purpose :** Guider utilisateur quand pas de contenu disponible.

#### Empty State Pattern

**Visual Structure:**
```
┌────────────────────────────────┐
│                                │
│         [Icon 64px]            │ ← Decorative icon
│                                │
│    Aucune annonce active       │ ← Headline 18px bold
│                                │
│  Il n'y a pas d'annonces dans  │ ← Body 14px gray-600
│  votre zone actuellement.      │
│                                │
│  [🚨 Signaler une disparition] │ ← CTA si applicable
│                                │
└────────────────────────────────┘
```

**Empty State Types:**

**1. No Results (Search/Filter):**
- **Icon :** 🔍 MagnifyingGlass 64px gray-400
- **Headline :** "Aucun résultat trouvé"
- **Body :** "Essayez d'autres mots-clés ou ajustez les filtres"
- **CTA :** "Réinitialiser les filtres" (secondary button)

**2. No Data Yet (First Time User):**
- **Icon :** ✨ Sparkles 64px red-400
- **Headline :** "Bienvenue sur EnfantDisparu.bf"
- **Body :** "Explorez les annonces actives dans votre zone"
- **CTA :** "Explorer les annonces" (primary button)

**3. No Content (List Vide):**
- **Icon :** 📋 Clipboard 64px gray-400
- **Headline :** "Aucun témoignage en attente"
- **Body :** "Tous les témoignages ont été traités. Excellent travail !"
- **CTA :** Optionnel (pas d'action pertinente)

**4. Error State (Failed Load):**
- **Icon :** ⚠️ AlertTriangle 64px orange-500
- **Headline :** "Erreur de chargement"
- **Body :** "Impossible de charger les données. Vérifiez votre connexion."
- **CTA :** "Réessayer" (primary button avec onClick reload)

**Specifications:**
- **Icon :** 64px, color gray-400 ou brand color
- **Headline :** 18px font-semibold text-gray-900
- **Body :** 14px text-gray-600, max 2 lignes, centered
- **CTA :** Primary si action principale, secondary si optionnel
- **Alignment :** Centré vertical + horizontal dans container
- **Padding :** 48px vertical minimum

**Implementation:**
```tsx
<div className="flex flex-col items-center justify-center py-12 px-4">
  <div className="text-6xl mb-4" aria-hidden="true">🔍</div>
  <h3 className="text-lg font-semibold text-gray-900 mb-2">
    Aucun résultat trouvé
  </h3>
  <p className="text-sm text-gray-600 text-center mb-6 max-w-sm">
    Essayez d'autres mots-clés ou ajustez les filtres
  </p>
  <Button variant="outline" onClick={resetFilters}>
    Réinitialiser les filtres
  </Button>
</div>
```

**Accessibility:**
- Icon avec `aria-hidden="true"` (décoratif)
- Headline comme heading `<h3>`
- `role="status"` sur container pour screen reader announcement
- CTA button keyboard accessible

---

#### Skeleton Loading (Preferred)

**Pattern :** Show layout structure avant data load.

**Visual Structure:**
```
[████░░░░░] ░░░░░░  ← Skeleton blocks avec pulse
[████░░░░] ░░░░
[████░░░░░] ░░░░░░
```

**Specifications:**
- **Color :** bg-gray-200
- **Animation :** animate-pulse (2s ease-in-out infinite)
- **Shape :** Match exact layout du content final
- **Count :** 3-5 skeleton items (preview du volume)

**Usage Contexts:**
- **Lists :** 3-5 AnnonceCard skeletons
- **Forms :** Input fields skeletons
- **Cards :** Card layout skeleton
- **Text :** Line skeletons avec varying widths

**Implementation (shadcn/ui):**
```tsx
import { Skeleton } from "@/components/ui/skeleton";

// AnnonceCard skeleton
<div className="space-y-4">
  <Skeleton className="h-32 w-full" />
  <Skeleton className="h-32 w-full" />
  <Skeleton className="h-32 w-full" />
</div>

// Text skeleton
<div className="space-y-2">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
</div>
```

**Accessibility:**
- `aria-label="Chargement en cours"` sur container
- `aria-busy="true"` pendant loading
- `role="status"` announcement pour screen readers


### Search & Filtering Patterns

**Purpose :** Permettre utilisateurs trouver annonces rapidement et efficacement.

#### Search Bar Pattern

**Visual Structure:**
```
┌────────────────────────────────┐
│ 🔍 [Rechercher un enfant...]   │ ← Placeholder descriptif
│    [X clear]                    │ ← Clear button si text
└────────────────────────────────┘
```

**Specifications:**
- **Icon :** 🔍 MagnifyingGlass 20px, position left, gray-400
- **Placeholder :** Descriptif et actionnable ("Rechercher un enfant..." pas juste "Rechercher")
- **Clear button :** X icon 16px, position right, visible si texte saisi
- **Border :** border-gray-300 focus:border-red-500
- **Height :** 44px (touch target)

**Behavior:**
- **Auto-focus :** Desktop oui, mobile non (éviter keyboard popup forcé)
- **Debounce :** 300ms avant trigger search (évite trop de requêtes)
- **Clear button :** Apparaît si texte saisi, clic vide input
- **Enter key :** Trigger search immédiat (ignore debounce)
- **Escape key :** Clear search input

**Search Scope (Priority Order):**
1. **Nom enfant** - Priorité haute, fuzzy match
2. **Zone/Ville** - Match exact ou partial
3. **Description** - Full-text search
4. **Âge** - Si chiffres détectés dans query

**Results Display:**
```
[Résultats pour "Ahmed"]  12 annonces trouvées

[AnnonceCard 1]
[AnnonceCard 2]
[AnnonceCard 3]
```

**No Results:**
- Empty state avec "Aucun résultat pour "Ahmed""
- Suggestions: "Essayez d'autres mots-clés ou ajustez les filtres"

**Implementation:**
```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
  <Input
    type="search"
    placeholder="Rechercher un enfant..."
    className="pl-10 pr-10"
    value={searchQuery}
    onChange={(e) => debouncedSearch(e.target.value)}
  />
  {searchQuery && (
    <Button
      variant="ghost"
      size="sm"
      className="absolute right-2 top-1/2 -translate-y-1/2"
      onClick={clearSearch}
    >
      <X className="h-4 w-4" />
    </Button>
  )}
</div>
```

**Accessibility:**
- `<input type="search">` pour semantic search
- `role="search"` sur container form
- `aria-label="Rechercher une annonce"`
- Clear button avec `aria-label="Effacer la recherche"`

---

#### Filter Pattern

**Visual Structure (Mobile Sheet):**
```
┌────────────────────────────────┐
│ Filtres                    [X] │
│                                │
│ Zone:                          │
│ ○ Toutes les zones             │
│ ● Ouagadougou                  │
│ ○ Bobo-Dioulasso               │
│                                │
│ Âge:                           │
│ [0] ───●─── [18]               │ ← Range slider
│                                │
│ Statut:                        │
│ ☑ Urgentes (< 7j)              │
│ ☑ Actives (7-14j)              │
│ ☐ Anciennes (>30j)             │
│                                │
│ [Réinitialiser]  [Appliquer]  │
└────────────────────────────────┘
```

**Filter Categories:**

**1. Zone Géographique (Radio Buttons):**
- Toutes les zones (default)
- Ouagadougou
- Bobo-Dioulasso
- Koudougou
- Autre...

**2. Âge Enfant (Range Slider):**
- Min: 0, Max: 18
- Default: 0-18 (tous)
- Step: 1 year
- Display: "0-5 ans"

**3. Statut Urgence (Checkboxes):**
- ☑ Urgentes (< 7 jours) - Checked par défaut
- ☑ Actives (7-14 jours) - Checked par défaut
- ☐ Anciennes (>30 jours) - Unchecked par défaut

**4. Date Disparition (Date Range Picker):**
- Depuis: [Date picker]
- Jusqu'à: [Date picker]
- Default: Tous

**Active Filters Display:**
```
Filtres actifs:
[Ouagadougou X] [0-5 ans X] [Urgentes X]  ← Chips removable
[Réinitialiser tout]                       ← Link clear all
```

**Filter Chips:**
- Background: bg-red-100
- Text: text-red-700, text-sm
- Remove: X icon 14px, hover:bg-red-200
- Gap: 8px entre chips

**Implementation (Mobile Sheet):**
```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">
      <Filter className="mr-2 h-4 w-4" />
      Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
    </Button>
  </SheetTrigger>
  <SheetContent side="bottom">
    <SheetHeader>
      <SheetTitle>Filtres</SheetTitle>
    </SheetHeader>
    {/* Filter options */}
    <SheetFooter>
      <Button variant="outline" onClick={resetFilters}>
        Réinitialiser
      </Button>
      <Button onClick={applyFilters}>
        Appliquer
      </Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

**Accessibility:**
- Filter button avec `aria-expanded` true/false
- `aria-label="Filtres (3 actifs)"` si filtres appliqués
- Radio/Checkbox groupes avec `<fieldset>` et `<legend>`
- Range slider avec `aria-valuemin`, `aria-valuemax`, `aria-valuenow`

---

#### Sort Pattern

**Visual Structure (Dropdown):**
```
Trier par: [Plus récents ▼]

Dropdown options:
● Plus récents
○ Plus anciens
○ Âge croissant
○ Âge décroissant
○ Zone (A-Z)
```

**Sort Options:**
1. **Plus récents** (default) - lastSeenAt DESC
2. **Plus anciens** - lastSeenAt ASC
3. **Âge croissant** - childAge ASC
4. **Âge décroissant** - childAge DESC
5. **Zone (A-Z)** - zoneName ASC

**Default Sort Logic:**
- **Homepage :** Plus récents + Urgents en priorité (status sort first)
- **Search results :** Relevance score (text match quality)
- **Archives :** Plus anciens (chronologique)

**Implementation:**
```tsx
<Select value={sortBy} onValueChange={setSortBy}>
  <SelectTrigger className="w-48">
    <SelectValue placeholder="Trier par..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="recent">Plus récents</SelectItem>
    <SelectItem value="oldest">Plus anciens</SelectItem>
    <SelectItem value="age-asc">Âge croissant</SelectItem>
    <SelectItem value="age-desc">Âge décroissant</SelectItem>
    <SelectItem value="zone">Zone (A-Z)</SelectItem>
  </SelectContent>
</Select>
```

**Accessibility:**
- Select avec `aria-label="Trier les annonces par"`
- Options avec clear labels
- Keyboard nav: Arrow keys + Enter


### Design System Integration

**How These Patterns Integrate with shadcn/ui:**

**Buttons:**
```tsx
// shadcn/ui Button component avec variants custom
<Button variant="default">Primary</Button>      // bg-red-600
<Button variant="outline">Secondary</Button>    // border-red-600
<Button variant="ghost">Ghost</Button>          // transparent
<Button variant="destructive">Delete</Button>   // bg-red-600 + icon
```

**Forms:**
```tsx
// shadcn/ui Form + react-hook-form integration
<Form {...form}>
  <FormField
    control={form.control}
    name="childName"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Nom de l'enfant *</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormMessage />  {/* Error inline auto */}
      </FormItem>
    )}
  />
</Form>
```

**Feedback:**
```tsx
// Toast notifications
import { toast } from "@/components/ui/use-toast";
toast({
  title: "Succès",
  description: "Partagé avec succès !",
  variant: "success",
});

// Dialogs confirmations
<AlertDialog>
  <AlertDialogTrigger>Supprimer</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>Confirmer?</AlertDialogTitle>
    <AlertDialogAction>Oui, supprimer</AlertDialogAction>
  </AlertDialogContent>
</AlertDialog>
```

**Loading:**
```tsx
// Skeleton loading
<Skeleton className="h-24 w-full" />

// Progress bar
<Progress value={60} />

// Button spinner
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Loading...
</Button>
```

**Navigation:**
```tsx
// Custom bottom bar (pas dans shadcn/ui)
// Custom header navigation
// Breadcrumbs avec Link components
```

**Modals:**
```tsx
// Dialog desktop
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
  </DialogContent>
</Dialog>

// Sheet mobile
<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent side="bottom">
    {/* Content */}
  </SheetContent>
</Sheet>
```

**Search & Filters:**
```tsx
// Input avec icons
<Input type="search" className="pl-10" />

// Select dropdown
<Select>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="x">X</SelectItem>
  </SelectContent>
</Select>

// Checkbox filters
<Checkbox id="urgent" />
<Label htmlFor="urgent">Urgentes</Label>
```

**Tailwind Extensions Required:**
```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        // Extend shadcn/ui colors
        primary: {
          DEFAULT: "#DC2626", // red-600
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.3s ease-out",
      },
    },
  },
};
```

**Custom Pattern Rules:**

1. **Toujours utiliser shadcn/ui components comme base** - Pas de réinvention
2. **Étendre variants si nécessaire** - Ajouter custom variants via cva()
3. **Respecter design tokens** - Colors, spacing, typography de la foundation
4. **Accessibility first** - Tous patterns WCAG AA minimum
5. **Mobile-first** - Tous patterns optimisés touch 44x44px minimum
6. **Reduced motion support** - `prefers-reduced-motion` respecté partout

**Pattern Consistency Checklist:**

✅ Utilise shadcn/ui component si disponible
✅ Suit color palette émotionnelle (urgent/active/ongoing/success/historic)
✅ Respecte spacing 8px grid system
✅ Typography Inter font avec scales définis
✅ Touch targets 44x44px minimum mobile
✅ Keyboard navigation complète
✅ Screen reader friendly (ARIA labels, roles, live regions)
✅ Focus indicators visibles (2px ring offset)
✅ Error recovery gracieux (fallbacks, retry)
✅ Loading states informatifs (skeleton > spinner)
✅ Empty states constructifs (CTA actionnable)
## Responsive Design & Accessibility

### Responsive Strategy

**Philosophy : Mobile-First Progressive Enhancement**

Notre approche stratégique : concevoir pour mobile d'abord (90% des utilisateurs), puis enrichir progressivement pour les écrans plus larges. Pas de dégradation depuis desktop, mais amélioration depuis mobile.

#### Mobile Strategy (320px - 767px) - PRIORITÉ 1

**Target Devices :**
- iPhone SE (375px) - Smallest common viewport baseline
- Android budget (360px - 414px) - Predominant au Burkina Faso
- Touch-first interaction paradigm

**Layout Principles :**

**1. Single Column Stack :**
- Layout vertical single column, full width
- Padding horizontal : 16px (4rem Tailwind)
- No multi-column grids (cognitive overload)
- Sequential content flow top-to-bottom

**2. Bottom Navigation (Thumb Zone Optimization) :**
- 4-5 items maximum (optimal ergonomics)
- Icons 24px + labels 10px
- Fixed position bottom avec z-index élevé
- Safe area insets iOS (padding-bottom: env(safe-area-inset-bottom))
- Active state : Red-600 color + font-bold

**3. Touch Target Sizing :**
- **Minimum absolu :** 44x44px (Apple HIG + WCAG 2.5.5)
- **Préféré :** 48x48px pour comfort
- **Spacing :** 8px minimum entre targets adjacents
- **No hover states :** N'existent pas sur touch devices
- **Swipe gestures :** Left/right navigation, pull-to-refresh, swipe-to-dismiss

**4. Content Density Mobile :**
- **AnnonceCard :** Compact variant (photo 80x80px)
- **Forms :** 1 champ par ligne, inputs full-width
- **Modals :** Sheet bottom drawer (80% viewport height max)
- **Text size :** 16px minimum (évite zoom automatique iOS)
- **Line height :** 1.5 pour lisibilité

**5. Performance Optimizations Mobile :**
- **Images :** WebP format avec fallback JPEG, lazy loading, responsive sizes
- **Fonts :** Subset Inter (latin uniquement), preload critical
- **CSS :** Critical inline dans `<head>`, defer non-critical
- **JavaScript :** Code splitting par route (Next.js automatic)
- **Target :** First Contentful Paint < 1.8s sur Slow 3G

**Desktop Features REMOVED on Mobile :**
- Breadcrumbs (espace insuffisant)
- Hover tooltips extensive (pas de hover)
- Multi-column grids (trop dense, cognitive overload)
- Sidebar navigation persistent (bottom bar instead)
- Right-click context menus

---

#### Tablet Strategy (768px - 1023px) - PRIORITÉ 2

**Target Devices :**
- iPad Mini (768px portrait)
- iPad (810px portrait, 1080px landscape)
- Android tablets (800px - 1024px)

**Layout Principles :**

**1. Hybrid Approach Adaptive :**
- 2-column grid si space permet (≥800px width)
- Maintain single column si portrait étroit
- Adaptive gap: 16px mobile, 24px tablet
- Flexbox/Grid responsive avec breakpoints

**2. Navigation Conditionnelle (Orientation-Based) :**
```css
/* Portrait tablet → Bottom bar (comme mobile) */
@media (max-width: 1023px) and (max-height: 900px) {
  /* Bottom navigation */
}

/* Landscape tablet → Header nav (comme desktop) */
@media (min-width: 768px) and (min-height: 900px) {
  /* Header navigation */
}
```

**3. Touch Optimization Maintained :**
- 44x44px touch targets maintenus
- Support gestures (swipe, pinch-zoom)
- No mouse hover dependencies (peut être utilisé sans souris)
- Keyboard shortcuts si clavier externe connecté

**4. Content Density Tablet :**
- **AnnonceCard :** Default variant (150x150px photo)
- **Dashboard :** 2-column grid (ambassador stats + content)
- **Forms :** 2-column si grouping logique (ex: prénom/nom)
- **Modals :** Centered 500px max-width (pas full-screen)

**5. Tablet-Specific Features :**
- Split-screen multitasking support (iPadOS)
- Landscape mode optimized (different layout que portrait)
- Keyboard shortcuts avec clavier externe
- Apple Pencil / Stylus support si applicable

---

#### Desktop Strategy (1024px+) - PRIORITÉ 3

**Target Devices :**
- Laptop 13" (1280px - 1440px) - Predominant
- Desktop 24" (1920px+) - Ambassadeurs, autorités
- Mouse + keyboard interaction paradigm

**Layout Principles :**

**1. Multi-Column Layouts :**
```
┌──────────────────────────────────────┐
│ Header + Nav                    [CTA]│
├──────────────────────────────────────┤
│ [Sidebar]  [Main Content]  [Sidebar]│
│  240px         flex-1        320px   │
│                                       │
│  Filters       Feed          Stats   │
└──────────────────────────────────────┘

- 2 colonnes : 1024px - 1439px
- 3 colonnes : 1440px+
- Max content width : 1440px (évite lignes lecture trop longues)
```

**2. Header Navigation Sticky :**
- Logo left cliquable → homepage
- Links center (Accueil, Impact, Ambassadeurs)
- CTA right "🚨 Signaler" toujours visible
- Breadcrumbs sous header pour deep pages
- Search bar expanded (pas juste icon)
- Shadow au scroll > 10px (visual feedback)

**3. Information Density Increased :**
- **AnnonceCard :** Detailed variant, 3-4 cards par row
- **Dashboard :** 3-column grid, sidebar stats persistent
- **Forms :** 2-3 column layout, inline labels possible
- **Modals :** Centered 600px max-width (pas full-screen)
- **Tables :** Full data grids avec sorting/filtering

**4. Desktop-Specific Features :**
- **Hover states :** Tooltips extensive, preview panes
- **Right-click :** Context menus (copier lien, ouvrir nouvel onglet)
- **Keyboard shortcuts :** Cmd/Ctrl+K search, Cmd/Ctrl+N nouvelle annonce
- **Multi-tab support :** State persistence localStorage
- **Drag & drop :** File upload, reordering si applicable

**5. Extra Screen Real Estate Usage :**
- **Sidebar filters left :** Persistent filters, no modal needed
- **Stats dashboard right :** Real-time widgets, leaderboard preview
- **Preview panes :** Click annonce → preview right, no full navigation
- **Batch actions :** Multi-select avec checkboxes, bulk operations
- **Advanced features :** Export CSV, print layouts, keyboard shortcuts hints

**Desktop Features NOT Available Mobile :**
- Persistent sidebars (collapse to modals mobile)
- Extensive hover tooltips (convert to tap interactions)
- Multi-select batch operations (too complex touch)
- Keyboard shortcuts UI hints (no keyboard mobile)
- Right-click context menus (long-press alternative mobile)


### Breakpoint Strategy

**Tailwind CSS Breakpoints (Mobile-First) :**

```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    screens: {
      'sm': '640px',   // Large mobile, small tablet portrait
      'md': '768px',   // Tablet portrait, landscape phones
      'lg': '1024px',  // Tablet landscape, small desktop
      'xl': '1280px',  // Desktop
      '2xl': '1536px', // Large desktop, 4K
    },
  },
};
```

**Critical Breakpoints for EnfantDisparu.bf :**

#### 1. Mobile Baseline (< 640px)
**Target :** iPhone SE 375px, Android 360px-414px

**Layout :**
- Single column stack vertical
- Bottom navigation fixed
- Full-width components
- 16px horizontal padding

**Forms :**
- 1 field per line
- Full-width inputs (min-h-44px)
- Stacked buttons vertical

**Cards :**
- AnnonceCard compact variant
- Single column list
- Touch-optimized spacing

**Images :**
- 1x resolution (performance)
- WebP format
- Lazy loading after viewport

**Navigation :**
- Bottom bar 4-5 items
- Fixed position z-40
- Safe area iOS padding

---

#### 2. Large Mobile (640px - 767px)
**Target :** Large phones, phablets

**Layout :**
- Still single column
- Increased padding 24px

**Forms :**
- Can use side-by-side buttons
- Still single column fields

**Cards :**
- AnnonceCard default variant (150x150)
- Slightly increased spacing

**Images :**
- 1.5x resolution possible
- Larger preview sizes

---

#### 3. Tablet Portrait (768px - 1023px)
**Target :** iPad, Android tablets portrait

**Layout :**
- 2-column grid possible
- Gap 24px entre colonnes
- Container max-width 720px

**Navigation :**
- Conditional (bottom si portrait court, header si landscape)
- Breadcrumbs si header navigation

**Forms :**
- 2-column si logical grouping
- Inline labels possible

**Cards :**
- 2 cards per row
- Default variant (150x150)

**Modals :**
- Centered 500px max-width
- Not full-screen

---

#### 4. Desktop Small (1024px - 1279px)
**Target :** Small laptops, tablet landscape

**Layout :**
- 2-column avec sidebar possible
- Container max-width 960px
- Sidebar 240px left

**Navigation :**
- Header sticky avec links
- Breadcrumbs visible
- Search bar expanded

**Forms :**
- Multi-column intelligent
- Inline labels desktop

**Cards :**
- 3 cards per row
- Detailed variant possible

**Hover :**
- Enabled (tooltips, previews)

---

#### 5. Desktop Large (1280px+)
**Target :** Laptops, desktops

**Layout :**
- 3-column avec sidebars both sides
- Container max-width 1440px
- Sidebar left 240px, right 320px

**Navigation :**
- Full header avec tous links
- Breadcrumbs + search prominent
- User menu dropdown

**Density :**
- Increased information density
- 4 cards per row si space
- Stats dashboards complex

**Features :**
- Advanced (batch actions)
- Keyboard shortcuts
- Preview panes

---

#### 6. Large Desktop / 4K (1536px+)
**Target :** Large monitors, 4K displays

**Layout :**
- Max-width container 1440px (avoid too wide)
- Increased horizontal padding
- Content centered

**Density :**
- Same as 1280px (évite surcharge)
- More whitespace around content
- Comfortable reading experience

---

**Mobile-First Media Query Pattern :**

```tsx
// ❌ WRONG: Desktop-first (deprecated approach)
<div className="lg:w-1/3 w-full">
// Applies w-full first, then overrides at lg

// ✅ CORRECT: Mobile-first (recommended)
<div className="w-full lg:w-1/3">
// Start mobile (w-full), enhance desktop (lg:w-1/3)

// Example progression:
<div className="
  w-full           // Mobile: 100% width
  sm:w-1/2         // Small mobile: 50% width
  md:w-1/3         // Tablet: 33.33% width
  lg:w-1/4         // Desktop: 25% width
">
```

**Container Responsive Padding :**

```tsx
<div className="
  container        // Auto margins, responsive width
  mx-auto          // Center horizontally
  px-4             // Mobile: 16px padding
  sm:px-6          // Small mobile: 24px
  lg:px-8          // Desktop: 32px
  max-w-7xl        // Max 1280px, never wider
">
  {/* Content auto-centers, never exceeds max-width */}
</div>
```

**Responsive Typography :**

```tsx
<h1 className="
  text-2xl         // Mobile: 24px
  sm:text-3xl      // Small mobile: 30px
  lg:text-4xl      // Desktop: 36px
  font-bold
">
  Titre Responsive
</h1>

<p className="
  text-sm          // Mobile: 14px
  md:text-base     // Tablet: 16px
  lg:text-lg       // Desktop: 18px
">
  Texte qui scale avec viewport
</p>
```


### Accessibility Strategy

**Target Compliance : WCAG 2.1 Level AA (Industry Standard)**

**Rationale :**
- **Level A :** Insuffisant - bare minimum légal, mauvaise UX
- **Level AA :** ✅ **Recommandé** - Standard industrie, confiance institutions (UNICEF/USAID), équilibre coût/bénéfice optimal
- **Level AAA :** Over-engineering - Coûts élevés, bénéfices marginaux, rarement requis

**WCAG AA garantit :**
- Conformité légale internationale
- Crédibilité auprès ONG/autorités
- UX inclusive pour 99% utilisateurs
- SEO amélioré (Google ranking)

---

#### 1. Color Contrast (WCAG 1.4.3)

**Requirements :**
- **Normal text (< 18px) :** 4.5:1 minimum
- **Large text (≥ 18px ou ≥ 14px bold) :** 3:1 minimum
- **UI components (borders, icons) :** 3:1 minimum

**EnfantDisparu.bf Palette Compliance :**

**✅ Compliant Combinations (Safe to Use) :**
```css
/* Text on backgrounds */
text-gray-900 on bg-white        → 21:1 ratio (excellent)
text-red-600 on bg-white         → 5.7:1 (pass AA large)
text-orange-600 on bg-white      → 4.8:1 (pass AA)
text-blue-600 on bg-white        → 5.9:1 (pass AA)
text-green-600 on bg-white       → 4.7:1 (pass AA)
text-white on bg-red-600         → 5.7:1 (pass AA)
text-white on bg-gray-900        → 19:1 (excellent)

/* Borders & UI components */
border-gray-300 on bg-white      → 3.2:1 (pass AA UI)
border-red-500 on bg-white       → 4.5:1 (pass AA)
```

**❌ Non-Compliant (Avoid or Use Only for Large Text) :**
```css
text-gray-400 on bg-white        → 2.8:1 (FAIL AA - use gray-500+ or larger font)
text-red-400 on bg-white         → 3.1:1 (FAIL AA normal - OK pour large text ≥18px)
text-orange-400 on bg-white      → 2.9:1 (FAIL AA - use orange-600+)
```

**Testing Tools :**
- **WebAIM Contrast Checker :** https://webaim.org/resources/contrastchecker/
- **Chrome DevTools :** Lighthouse accessibility audit auto-check
- **axe DevTools :** Browser extension real-time feedback

**Implementation :**
```tsx
// ✅ Correct: High contrast
<p className="text-gray-900">Texte principal</p>
<span className="text-gray-600">Texte secondaire</span>

// ❌ Avoid: Low contrast
<p className="text-gray-400">Texte difficile à lire</p>

// ✅ Exception: Large text
<h1 className="text-3xl font-bold text-red-500">
  Titre grand (OK car ≥18px bold)
</h1>
```

---

#### 2. Keyboard Navigation (WCAG 2.1.1, 2.1.2)

**Requirement :** Toute fonctionnalité accessible sans souris, uniquement keyboard.

**Keyboard Shortcuts Standard :**
```
Tab           → Focus élément suivant
Shift+Tab     → Focus élément précédent
Enter         → Activer bouton/lien
Space         → Activer bouton, toggle checkbox
Arrow keys    → Naviguer dans composant (select, radio, tabs)
Escape        → Fermer modal/dialog
Home/End      → Aller début/fin liste
```

**Tab Order Guidelines :**
- **Logique séquentielle :** Left-to-right, top-to-bottom
- **Skip links :** "Skip to main content" premier TAB
- **Focus indicators :** Toujours visibles (2px ring, offset 2px)
- **No keyboard traps :** Toujours possibilité sortir (ESC, Shift+Tab)

**Focus Management Patterns :**

**Modal Opens :**
```tsx
<Dialog onOpenChange={(open) => {
  if (open) {
    // Focus premier élément interactif
    firstButtonRef.current?.focus();
  }
}}>
  <DialogContent>
    <DialogTitle>Confirmer</DialogTitle>
    <Button ref={firstButtonRef}>Oui</Button>
    <Button>Non</Button>
  </DialogContent>
</Dialog>
```

**Modal Closes :**
```tsx
// Return focus to trigger element
const triggerRef = useRef<HTMLButtonElement>(null);

<DialogTrigger ref={triggerRef}>
  <Button>Ouvrir</Button>
</DialogTrigger>

<DialogClose onClick={() => {
  triggerRef.current?.focus(); // Focus return
}} />
```

**Skip Links Implementation :**
```tsx
<a
  href="#main-content"
  className="
    sr-only                    // Hidden by default
    focus:not-sr-only          // Visible on focus
    focus:absolute
    focus:top-4 focus:left-4
    focus:z-50
    focus:px-4 focus:py-2
    focus:bg-white
    focus:border focus:border-gray-300
    focus:rounded
  "
>
  Aller au contenu principal
</a>

<main id="main-content">
  {/* Content */}
</main>
```

**Custom Component Keyboard Support :**
```tsx
// Button-like div (avoid, use <button> instead)
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  Action
</div>

// ✅ Better: Use semantic button
<button onClick={handleClick}>
  Action
</button>
```

---

#### 3. Screen Reader Compatibility (WCAG 1.3.1, 4.1.2)

**Semantic HTML Priority :**

```tsx
// ❌ WRONG: Divs everywhere
<div onClick={handleClick}>Click me</div>
<div>Navigation</div>
<div>Main content</div>

// ✅ CORRECT: Semantic elements
<button onClick={handleClick}>Click me</button>
<nav aria-label="Navigation principale">...</nav>
<main>...</main>
<header>...</header>
<footer>...</footer>
<article>...</article>
<section aria-labelledby="heading-id">...</section>
```

**ARIA Labels & Roles :**

**Icons Decorative vs. Functional :**
```tsx
// Decorative (no meaning)
<SearchIcon aria-hidden="true" className="text-gray-400" />

// Functional (button with icon only)
<button aria-label="Rechercher une annonce">
  <SearchIcon aria-hidden="true" />
</button>

// Icon + Text (text sufficient, icon decorative)
<button>
  <SearchIcon aria-hidden="true" />
  <span>Rechercher</span>
</button>
```

**Form Input Labeling :**
```tsx
// ✅ Explicit label association
<label htmlFor="child-name">Nom de l'enfant *</label>
<input
  id="child-name"
  aria-required="true"
  placeholder="Ex: Ahmed Traoré"
/>

// Error state
<input
  id="phone"
  aria-invalid="true"
  aria-describedby="phone-error"
/>
<span id="phone-error" role="alert" className="text-red-600">
  Format invalide (8 chiffres requis)
</span>
```

**Loading States Announcement :**
```tsx
<div
  aria-busy="true"
  aria-live="polite"
  className="flex items-center"
>
  <Loader2 className="animate-spin mr-2" aria-hidden="true" />
  <span>Chargement en cours...</span>
</div>
```

**Toast Notifications :**
```tsx
// Success (polite, non-urgent)
<div role="status" aria-live="polite">
  ✅ Annonce partagée avec succès !
</div>

// Error (assertive, urgent)
<div role="alert" aria-live="assertive">
  ❌ Erreur de connexion. Vérifiez votre réseau.
</div>
```

**Live Regions (Dynamic Content) :**
```tsx
// Polite updates (non-urgent)
<div aria-live="polite" aria-atomic="true">
  {annonceCount} nouvelles annonces
</div>

// Assertive updates (urgent, errors)
<div aria-live="assertive" role="alert">
  Connexion perdue. Reconnexion en cours...
</div>
```

**Complex Widgets :**
```tsx
// Tabs
<Tabs defaultValue="urgentes">
  <TabsList role="tablist">
    <TabsTrigger value="urgentes" role="tab" aria-selected={true}>
      Urgentes
    </TabsTrigger>
    <TabsTrigger value="actives" role="tab" aria-selected={false}>
      Actives
    </TabsTrigger>
  </TabsList>
  <TabsContent value="urgentes" role="tabpanel">
    Content
  </TabsContent>
</Tabs>
```

---

#### 4. Touch Targets (WCAG 2.5.5 - Level AAA, Exceeds AA)

**Minimum Size : 44x44px (Apple HIG & Android Material Design)**

**Implementation Buttons :**
```tsx
// Standard button
<Button className="min-h-[44px] min-w-[44px] px-4">
  Valider
</Button>

// Icon button
<button className="p-3">  {/* 12px padding + 20px icon = 44px */}
  <X className="h-5 w-5" />
</button>

// Link in text (increase hit area)
<a href="..." className="inline-block py-2">
  En savoir plus
</a>
```

**Spacing Between Targets :**
```tsx
// Horizontal buttons
<div className="flex gap-3">  {/* 12px gap minimum */}
  <Button>Annuler</Button>
  <Button>Valider</Button>
</div>

// Vertical stack
<div className="space-y-3">  {/* 12px gap minimum */}
  <Button>Option 1</Button>
  <Button>Option 2</Button>
</div>
```

**Bottom Navigation Touch Targets :**
```tsx
<nav className="h-14">  {/* 56px height > 44px ✓ */}
  <button className="min-w-[60px] min-h-[56px] flex flex-col items-center">
    <Home className="h-6 w-6" />
    <span className="text-xs">Accueil</span>
  </button>
</nav>
```

---

#### 5. Alternative Text (WCAG 1.1.1)

**Image Alt Text Guidelines :**

```tsx
// Informative images
<img
  src="/child-photo.jpg"
  alt="Photo de Ahmed Traoré, 8 ans, porté disparu le 28 mars 2026"
/>

// Decorative images (no meaning)
<img
  src="/pattern-background.svg"
  alt=""  // Empty alt for decorative
  aria-hidden="true"
/>

// Complex images (charts, maps)
<figure>
  <img
    src="/map-coverage.png"
    alt="Carte de couverture EnfantDisparu.bf au Burkina Faso"
  />
  <figcaption className="sr-only">
    Description détaillée : La carte montre 12 zones de couverture
    active avec 156 ambassadeurs répartis dans les régions de
    Ouagadougou, Bobo-Dioulasso, et Koudougou.
  </figcaption>
</figure>

// Linked images (describe destination)
<a href="/annonce/EPB-001">
  <img
    src="/child-photo.jpg"
    alt="Voir l'annonce de Ahmed Traoré, 8 ans"
  />
</a>
```

**Icon Fonts / SVG Alt Text :**
```tsx
// Decorative icons (no alt needed)
<SearchIcon aria-hidden="true" />

// Functional icons (use aria-label on button)
<button aria-label="Fermer">
  <X aria-hidden="true" />
</button>
```

**next/image Automatic Alt :**
```tsx
import Image from 'next/image';

<Image
  src="/child-photo.jpg"
  alt="Photo de Ahmed Traoré"  // Required prop
  width={400}
  height={400}
  priority={false}  // Lazy load by default
/>
```

---

#### 6. Forms Accessibility (WCAG 3.3.1, 3.3.2)

**Labels Required (Not Placeholder-Only) :**

```tsx
// ❌ WRONG: Placeholder only
<input placeholder="Nom de l'enfant" />

// ✅ CORRECT: Explicit label always visible
<label htmlFor="child-name" className="block mb-1">
  Nom de l'enfant *
</label>
<input
  id="child-name"
  placeholder="Ex: Ahmed Traoré"
  aria-required="true"
/>
```

**Required Fields Indication :**
```tsx
<label htmlFor="name">
  Nom de l'enfant
  <span className="text-red-600 ml-1" aria-label="requis">*</span>
</label>
<input
  id="name"
  required
  aria-required="true"
/>

// Legend for form
<p className="text-sm text-gray-600 mb-4">
  Les champs marqués d'un <span className="text-red-600">*</span> sont obligatoires
</p>
```

**Error Identification & Recovery :**
```tsx
<FormField
  control={form.control}
  name="phone"
  render={({ field, fieldState }) => (
    <FormItem>
      <FormLabel htmlFor="phone">Téléphone *</FormLabel>
      <FormControl>
        <Input
          id="phone"
          {...field}
          aria-invalid={!!fieldState.error}
          aria-describedby={fieldState.error ? "phone-error" : undefined}
        />
      </FormControl>
      {fieldState.error && (
        <FormMessage id="phone-error" role="alert">
          {fieldState.error.message}
        </FormMessage>
      )}
    </FormItem>
  )}
/>
```

**Form Submission Feedback :**
```tsx
// Success
<div role="status" aria-live="polite">
  ✅ Annonce publiée avec succès !
</div>

// Error with recovery action
<div role="alert" aria-live="assertive">
  ❌ Échec de la publication.
  <Button onClick={retry}>Réessayer</Button>
</div>
```

---

#### 7. Responsive Text & Zoom (WCAG 1.4.4, 1.4.10)

**Text Resize Support (200% Zoom) :**

```css
/* Use rem units (relative to root font-size) */
html { font-size: 16px; }  /* 1rem = 16px */

.text-sm { font-size: 0.875rem; }   /* 14px */
.text-base { font-size: 1rem; }     /* 16px */
.text-lg { font-size: 1.125rem; }   /* 18px */

/* User zooms to 200% → text scales proportionally */
/* No horizontal scroll, content reflows */
```

**Avoid Fixed Pixel Widths :**
```tsx
// ❌ WRONG: Fixed pixel width
<div style={{ width: '300px' }}>Text</div>

// ✅ CORRECT: Relative width
<div className="max-w-sm">Text</div>  // max-width: 24rem (384px)
```

**Reflow at 320px Width :**
- Content reflows without horizontal scroll
- Single column layout mobile
- No content truncated at 320px
- Viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1">`

**Implementation Next.js :**
```tsx
// _document.tsx
<Head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</Head>
```

---

#### 8. Reduced Motion Support (WCAG 2.3.3)

**Respect `prefers-reduced-motion` Media Query :**

```css
/* Default: Animations enabled */
.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

.transition-all {
  transition: all 300ms ease-in-out;
}

/* Reduced motion: Disable animations */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**React Hook for Reduced Motion :**
```tsx
// hooks/useReducedMotion.ts
import { useEffect, useState } from 'react';

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}
```

**Conditional Animations in Components :**
```tsx
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function DiffusionAnimation({ ... }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div>
      {prefersReducedMotion ? (
        // No animations, instant display
        <CheckmarksList platforms={platforms} />
      ) : (
        // Full animation with waves
        <AnimatedWaves>
          <CheckmarksList platforms={platforms} />
        </AnimatedWaves>
      )}
    </div>
  );
}
```

**Tailwind Config Reduced Motion :**
```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      animation: {
        'pulse-safe': 'pulse 2s ease-in-out infinite',
      },
    },
  },
  variants: {
    animation: ['motion-safe', 'motion-reduce'],
  },
};

// Usage
<div className="motion-safe:animate-pulse motion-reduce:animate-none">
```


### Testing Strategy

**4-Phase Comprehensive Testing Approach :**

#### Phase 1: Automated Testing (Continuous Integration)

**1. Lighthouse CI Audits (Every PR) :**
```bash
# Install
npm install -g @lhci/cli

# Run audit
lhci autorun --collect.url=http://localhost:3000

# Target scores:
# Performance: > 90 (mobile baseline)
# Accessibility: 100 (no violations)
# Best Practices: > 95
# SEO: > 90
```

**CI/CD Integration (GitHub Actions) :**
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run lighthouse-ci
```

---

**2. axe-core Automated A11y Testing :**
```tsx
// __tests__/accessibility.test.tsx
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  test('AnnonceCard has no violations', async () => {
    const { container } = render(<AnnonceCard {...mockProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('SignalementForm has no violations', async () => {
    const { container } = render(<SignalementForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

**Run on Every Commit :**
```bash
npm test -- --coverage --watchAll=false
```

---

**3. Visual Regression Testing (Percy.io / Chromatic) :**
```bash
# Install Chromatic
npm install --save-dev chromatic

# Run visual tests
npx chromatic --project-token=<TOKEN>

# Catches unintended visual changes across:
# - All breakpoints (mobile, tablet, desktop)
# - All component states (default, hover, focus, error)
# - Dark mode / light mode
```

---

#### Phase 2: Manual Device Testing (Pre-Release)

**Real Device Testing Matrix :**

**Mobile Devices (Priority 1) :**
- ✅ **iPhone SE (375px, iOS 16+)** - Smallest viewport baseline
- ✅ **iPhone 14 Pro (393px, iOS 17)** - Modern iOS
- ✅ **Samsung Galaxy A14 (360px, Android 13)** - Budget Android
- ✅ **Google Pixel 7 (412px, Android 14)** - Pure Android

**Tablet Devices (Priority 2) :**
- ✅ **iPad Mini (768px, iPadOS 17)** - Small tablet
- ✅ **iPad Pro 11" (834px, iPadOS 17)** - Pro tablet

**Desktop (Priority 3) :**
- ✅ **MacBook Air 13" (1440px, macOS Sonoma)** - MacOS
- ✅ **Windows laptop 15" (1920px, Windows 11)** - Windows

**Browser Coverage :**
- **Chrome** (80% market share) - Primary browser
- **Safari** (15% market share) - iOS critical
- **Firefox** (3% market share) - Standards compliance
- **Edge** (2% market share) - Windows default

**Network Conditions Testing :**
```
Chrome DevTools → Network → Throttling:
- Fast 3G (750 KB/s download, 250 KB/s upload)
- Slow 3G (400 KB/s download, 400 KB/s upload)
- Offline (PWA offline fallback)
```

**Per-Device Testing Checklist :**
- [ ] Touch targets minimum 44x44px
- [ ] Text readable without zoom (16px minimum)
- [ ] No horizontal scroll at device width
- [ ] Forms submit successfully
- [ ] Images load properly (WebP with JPEG fallback)
- [ ] Animations smooth 60fps
- [ ] Bottom navigation accessible (no notch overlap iOS)
- [ ] Pull-to-refresh works
- [ ] Swipe gestures responsive

---

#### Phase 3: Accessibility Manual Testing (Pre-Release)

**1. Screen Reader Testing :**

**VoiceOver (iOS Safari) :**
```
Settings → Accessibility → VoiceOver → On

Gestures:
- Swipe right: Next element
- Swipe left: Previous element
- Double tap: Activate
- Two-finger swipe up: Read from top
- Rotor (two fingers rotate): Navigation mode
```

**NVDA (Windows - Free) :**
```
Download: https://www.nvaccess.org/

Shortcuts:
- NVDA + Down Arrow: Read next
- NVDA + Up Arrow: Read previous
- Enter: Activate link/button
- NVDA + T: Read page title
- NVDA + H: Next heading
- NVDA + Spacebar: Browse/Focus mode toggle
```

**Testing Checklist :**
- [ ] All buttons/links announced correctly with role
- [ ] Form labels read before inputs
- [ ] Error messages announced with role="alert"
- [ ] Loading states announced (aria-live)
- [ ] Images have meaningful alt text (not "image" generic)
- [ ] Navigation landmarks announced (header, nav, main, footer)
- [ ] Heading hierarchy logical (H1 → H2 → H3, no skips)
- [ ] Dynamic content updates announced (toasts, live counters)

---

**2. Keyboard-Only Navigation Testing :**

**Disable Mouse/Trackpad Completely :**

**Testing Protocol :**
- [ ] Tab order logical (left-to-right, top-to-bottom)
- [ ] Skip link appears on first Tab press
- [ ] All interactive elements focusable (buttons, links, inputs)
- [ ] Focus indicator visible (2px ring, red-500 color, offset 2px)
- [ ] Modal opens → focus moves to first element inside
- [ ] Modal closes → focus returns to trigger element
- [ ] Dropdown/Select navigable with Arrow keys
- [ ] No keyboard traps (can always Escape out)
- [ ] Enter activates buttons and links
- [ ] Space activates buttons and toggles checkboxes
- [ ] Escape closes modals/dialogs
- [ ] Form can be completed without mouse
- [ ] Form submission possible with Enter key

**Keyboard Shortcuts Testing :**
- [ ] Cmd/Ctrl+K: Opens search (if implemented)
- [ ] Escape: Closes modals/sheets
- [ ] Arrow keys: Navigate within lists/tabs
- [ ] Enter/Space: Activate buttons/checkboxes

---

**3. Color Blindness Simulation Testing :**

**Chrome DevTools Rendering Tab :**
```
DevTools → ... menu → More tools → Rendering
→ Emulate vision deficiencies:

- Protanopia (red-blind) - 1% male population
- Deuteranopia (green-blind) - 1% male population
- Tritanopia (blue-blind) - 0.001% population
- Achromatopsia (total color-blind) - 0.003% population
```

**Testing Checklist :**
- [ ] Information not conveyed by color alone (use icons + text)
- [ ] Red/green status distinguishable (urgent vs. success)
- [ ] Error states identifiable without red color (icon + text)
- [ ] Charts/graphs use patterns + colors
- [ ] Link text underlined or bold (not just color differentiation)
- [ ] Focus indicators visible (not just color change)

---

#### Phase 4: User Testing with Disabilities (Pre-Launch)

**Recruit Diverse Participants (8-12 users) :**
- 2-3 **motor disabilities** (keyboard-only, switch access, tremor)
- 2-3 **visual impairments** (screen reader users, low vision, color-blind)
- 2-3 **cognitive disabilities** (dyslexia, ADHD, autism spectrum)
- 2-3 **seniors 60+ years** (digital literacy variability, presbyopia)

**Testing Protocol :**

**1. Task-Based Testing :**
```
Tasks:
1. "Trouvez une annonce d'enfant disparu dans Ouagadougou"
2. "Signalez la disparition d'un enfant fictif"
3. "Partagez une annonce sur WhatsApp"
4. "Devenez ambassadeur (si applicable)"
```

**2. Think-Aloud Protocol :**
- Users verbalize thoughts pendant navigation
- "What are you thinking right now?"
- "What do you expect to happen when you click this?"
- Observer note friction points sans intervenir

**3. Post-Task Questionnaire :**
```
System Usability Scale (SUS):
1. Je pense que j'utiliserais ce système fréquemment. (1-5)
2. J'ai trouvé le système inutilement complexe. (1-5)
3. J'ai trouvé le système facile à utiliser. (1-5)
...
(10 questions total, score /100)
```

**Success Metrics :**
- **Task completion rate :** > 80%
- **Time on task :** < 5 minutes pour signalement
- **Error rate :** < 2 erreurs par task
- **SUS score :** > 68 (above average)
- **CSAT :** > 4/5 satisfaction

**Iterate Based on Feedback :**
- Prioritize P0 blockers (cannot complete task)
- Fix P1 major issues (frustration, confusion)
- Document P2 minor issues (enhancement backlog)


### Implementation Guidelines

**For Development Team - Actionable Checklists**

#### Responsive Development Checklist

**General Principles :**
- [ ] Use relative units (`rem`, `%`, `vw`, `vh`) over fixed `px`
- [ ] Mobile-first media queries (base = mobile, enhance = desktop)
- [ ] Touch targets minimum 44x44px
- [ ] Test on real devices (not just browser DevTools)
- [ ] Optimize images (WebP, responsive sizes, lazy loading)

**HTML/CSS :**
- [ ] Viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- [ ] Container max-width: `max-w-7xl` (1280px) to avoid too wide
- [ ] Responsive padding: `px-4 sm:px-6 lg:px-8`
- [ ] Responsive typography: `text-base md:text-lg lg:text-xl`
- [ ] Responsive grids: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

**Components :**
- [ ] AnnonceCard adapts: compact mobile, default tablet, detailed desktop
- [ ] Navigation switches: bottom bar mobile, header desktop
- [ ] Forms stack: 1 column mobile, 2 columns tablet/desktop
- [ ] Modals adapt: full-screen mobile, centered desktop

**Testing :**
- [ ] Chrome DevTools responsive mode (all breakpoints)
- [ ] Real device testing matrix (iPhone SE, Android budget, iPad, desktop)
- [ ] Browser testing (Chrome, Safari, Firefox, Edge)
- [ ] Network throttling (Fast 3G, Slow 3G)

---

#### Accessibility Development Checklist

**Semantic HTML :**
- [ ] Use semantic elements (`<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`, `<section>`)
- [ ] Heading hierarchy logical (H1 → H2 → H3, no skips)
- [ ] Lists use `<ul>`/`<ol>` + `<li>` (not divs)
- [ ] Tables use proper structure (`<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`)
- [ ] Buttons use `<button>` (not divs avec onClick)
- [ ] Links use `<a href>` (not buttons pour navigation)

**ARIA :**
- [ ] Roles on custom components (`role="button"`, `role="dialog"`, `role="alert"`)
- [ ] Labels on icons (`aria-label` or `aria-labelledby`)
- [ ] States communicated (`aria-expanded`, `aria-checked`, `aria-selected`)
- [ ] Live regions (`aria-live="polite"`, `role="alert"` for errors)
- [ ] Hidden decorative elements (`aria-hidden="true"` on icons)

**Keyboard Navigation :**
- [ ] All functionality keyboard accessible (no mouse-only features)
- [ ] Tab order logical (sequential left-to-right, top-to-bottom)
- [ ] Skip links implemented ("Skip to main content")
- [ ] Focus indicators visible (`:focus-visible` with 2px ring)
- [ ] Modal focus management (trap focus inside, return on close)
- [ ] No keyboard traps (always can Escape)

**Forms :**
- [ ] Labels explicitly associated (`<label for="id">` + `<input id="id">`)
- [ ] Required fields marked (`aria-required="true"`, `required`, visual `*`)
- [ ] Error messages linked (`aria-describedby="error-id"`)
- [ ] Error states indicated (`aria-invalid="true"`)
- [ ] Placeholders not sole labels (label always visible)

**Color & Contrast :**
- [ ] Text contrast 4.5:1 minimum (normal text)
- [ ] Large text contrast 3:1 minimum (≥18px or ≥14px bold)
- [ ] UI components contrast 3:1 minimum (borders, icons)
- [ ] Information not color-only (use icons + text)
- [ ] Links distinguishable (underline or bold)

**Images & Media :**
- [ ] All images have `alt` text (empty `alt=""` if decorative)
- [ ] Complex images have long descriptions (`<figcaption>`)
- [ ] Icons with meaning have `aria-label` (decorative have `aria-hidden`)
- [ ] Videos have captions (if applicable)

**Responsive & Zoom :**
- [ ] Text resizes to 200% without loss of functionality
- [ ] No horizontal scroll at 320px width
- [ ] Touch targets 44x44px minimum
- [ ] Viewport meta tag configured correctly

**Animations :**
- [ ] Respect `prefers-reduced-motion` media query
- [ ] No flashing content > 3 times per second (seizure risk)
- [ ] Animations pausable if > 5 seconds

---

**Testing Tools for Developers :**

**Browser Extensions :**
- **axe DevTools** (Chrome/Firefox) - Real-time accessibility scan
- **WAVE** (Chrome/Firefox/Edge) - Visual feedback on issues
- **Lighthouse** (Chrome DevTools) - Automated audit
- **Color Contrast Analyzer** - Check contrast ratios

**Command Line :**
```bash
# pa11y - Automated accessibility testing
npm install -g pa11y
pa11y http://localhost:3000

# Lighthouse CI
npm install -g @lhci/cli
lhci autorun

# axe-core CLI
npm install -g @axe-core/cli
axe http://localhost:3000
```

**React Testing :**
```tsx
// jest-axe integration
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';

expect.extend(toHaveNoViolations);

test('Component has no a11y violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

**Quick Reference - Common Patterns :**

```tsx
// Skip link
<a href="#main" className="sr-only focus:not-sr-only">
  Skip to main content
</a>

// Button with icon
<button aria-label="Close dialog">
  <X aria-hidden="true" />
</button>

// Form field
<label htmlFor="name">Name *</label>
<input
  id="name"
  aria-required="true"
  aria-invalid={!!error}
  aria-describedby={error ? "name-error" : undefined}
/>
{error && <span id="name-error" role="alert">{error}</span>}

// Loading state
<div aria-busy="true" aria-live="polite">
  Loading...
</div>

// Toast notification
<div role="status" aria-live="polite">
  Success message
</div>

// Error alert
<div role="alert" aria-live="assertive">
  Error message
</div>

// Modal
<Dialog onOpenChange={setOpen}>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogTitle>Title</DialogTitle>
    <DialogDescription>Description</DialogDescription>
  </DialogContent>
</Dialog>
```

---

**Resources & Documentation :**

**WCAG Guidelines :**
- Official: https://www.w3.org/WAI/WCAG21/quickref/
- How to Meet WCAG (Quick Reference)

**Testing Tools :**
- axe DevTools: https://www.deque.com/axe/devtools/
- WAVE: https://wave.webaim.org/extension/
- Lighthouse: https://developers.google.com/web/tools/lighthouse
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/

**Screen Readers :**
- NVDA (Windows, free): https://www.nvaccess.org/
- JAWS (Windows, paid): https://www.freedomscientific.com/products/software/jaws/
- VoiceOver (macOS/iOS, built-in): Native accessibility features

**Learning Resources :**
- Web Accessibility Initiative (WAI): https://www.w3.org/WAI/
- The A11Y Project: https://www.a11yproject.com/
- Inclusive Components: https://inclusive-components.design/
