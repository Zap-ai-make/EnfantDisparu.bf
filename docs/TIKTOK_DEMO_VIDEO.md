# Script pour la vidéo de démo TikTok

Ce script vous guidera pour créer la vidéo de démonstration à soumettre à TikTok.

## Durée recommandée
30-60 secondes

## Outils
- Loom (https://www.loom.com/) - gratuit et simple
- Ou tout autre logiciel de screen recording

## Script de la vidéo

### 1. Introduction (5 secondes)
**Écran** : Page d'accueil enfentdisparu.bf

**Actions** :
- Montrer la page d'accueil
- Scroller rapidement pour montrer le site

**Narration optionnelle** :
> "EnfantDisparu.bf est une plateforme de signalement d'enfants disparus au Burkina Faso."

---

### 2. Connexion TikTok - Login Kit (15 secondes)
**Écran** : `/admin/tiktok`

**Actions** :
1. Naviguer vers `https://enfentdisparu.bf/admin/tiktok`
2. Montrer le statut "⚠️ Compte TikTok non connecté"
3. Cliquer sur le bouton "🚀 Connecter TikTok"
4. Autoriser l'accès sur TikTok (écran OAuth)
5. Retour sur le site avec "✅ Compte TikTok connecté"

**Points clés à montrer** :
- L'URL dans la barre d'adresse
- Le flux OAuth TikTok (Login Kit)
- L'autorisation des permissions

---

### 3. Création d'une alerte (10 secondes)
**Écran** : `/signaler`

**Actions** :
1. Naviguer vers la page de signalement
2. Remplir rapidement le formulaire (peut être accéléré en post-production)
3. Uploader une photo
4. Soumettre l'alerte

**Note** : Vous pouvez utiliser des données de test fictives.

---

### 4. Publication automatique sur TikTok - Content Posting API (10 secondes)
**Écran** : TikTok (web ou app)

**Actions** :
1. Ouvrir TikTok dans un nouvel onglet ou sur mobile
2. Naviguer vers votre profil @enfentdisparu.bf
3. Montrer que l'alerte vient d'être publiée automatiquement
4. Scroller pour voir la photo d'alerte et la description

**Points clés à montrer** :
- Le post TikTok avec l'alert card
- La description formatée avec émojis et hashtags
- Le lien vers l'annonce

---

### 5. Conclusion (5 secondes)
**Écran** : Retour sur le site ou recap rapide

**Actions** :
- Montrer rapidement les 2 écrans côte à côte (site + TikTok)

**Narration optionnelle** :
> "Publication automatique des alertes sur TikTok pour maximiser la portée."

---

## Checklist avant d'enregistrer

- [ ] Le site est en production (enfentdisparu.bf accessible)
- [ ] Les Cloud Functions sont déployées
- [ ] Le Client Key TikTok est configuré dans `.env.local`
- [ ] Les secrets TikTok sont dans Firebase Secret Manager
- [ ] Vous avez un compte TikTok de test prêt
- [ ] Loom est installé et configuré

## Checklist pendant l'enregistrement

- [ ] L'URL est visible dans la barre d'adresse
- [ ] Le domaine "enfentdisparu.bf" est clairement visible
- [ ] Le flux OAuth TikTok est visible (écran d'autorisation)
- [ ] Le statut "Compte connecté" s'affiche après connexion
- [ ] La publication apparaît sur TikTok
- [ ] L'interface utilisateur est claire et lisible

## Astuces

### Pour un mode Sandbox
Si l'app n'est pas encore approuvée :
- Utilisez un compte TikTok de test autorisé
- Mentionnez dans la description de soumission : "Démonstration en mode Sandbox"
- Ou créez une simulation avec des captures d'écran mockées

### Pour une meilleure qualité
- Fermez les onglets inutiles
- Masquez les bookmarks
- Utilisez le mode plein écran (F11)
- Ralentissez les actions pour qu'elles soient visibles
- Évitez de parler trop vite si vous ajoutez une narration

### Si vous n'avez pas de site en production
Vous pouvez faire la démonstration en localhost et ajouter un texte overlay expliquant :
> "Démonstration en environnement de développement. URL de production : enfentdisparu.bf"

## Après l'enregistrement

1. ✅ Vérifier que la vidéo est claire
2. ✅ Vérifier la durée (max 5 minutes, mais 30-60s est idéal)
3. ✅ Vérifier la taille du fichier (max 50 MB)
4. ✅ Exporter en MP4 ou MOV
5. ✅ Uploader sur TikTok Developer Portal

## Format technique

- **Format** : MP4 ou MOV
- **Taille max** : 50 MB par fichier
- **Nombre max** : 5 vidéos
- **Résolution recommandée** : 1080p ou 720p
- **Durée recommandée** : 30-60 secondes (max 5 minutes)

## Exemple de texte d'accompagnement

Lors de la soumission, vous pouvez ajouter cette description :

> Cette vidéo démontre l'intégration TikTok sur EnfantDisparu.bf, une plateforme de signalement d'enfants disparus au Burkina Faso.
>
> **Fonctionnalités démontrées :**
> - Login Kit : Connexion OAuth du compte TikTok officiel
> - Content Posting API : Publication automatique des alertes sur TikTok
>
> **Flux complet :**
> 1. Administrateur connecte le compte TikTok via Login Kit
> 2. Utilisateur crée une alerte enfant disparu sur le site
> 3. L'alerte est automatiquement publiée sur TikTok
> 4. Post visible sur @enfentdisparu.bf avec photo et lien
>
> Cette intégration permet de maximiser la portée des alertes en touchant la communauté TikTok du Burkina Faso.

---

Bonne chance avec votre vidéo ! 🎬
