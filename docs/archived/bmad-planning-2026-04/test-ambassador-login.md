# 🧪 Guide de Test - Connexion Ambassadeur

## 📋 Pré-requis

Pour tester la connexion ambassadeur, vous avez besoin :

1. **Un ambassadeur approuvé** dans Firestore
2. **Son numéro de téléphone** exact (tel qu'enregistré)

---

## 🎯 Comment Créer un Ambassadeur Test

### Option A: Via l'Admin (Recommandé)

1. **Créer une candidature**
   - Aller sur `/devenir-ambassadeur`
   - Remplir le formulaire avec un numéro test (ex: `+22670123456`)
   - Soumettre la candidature

2. **Approuver la candidature**
   - Aller sur `/admin/ambassadeurs`
   - Se connecter avec le mot de passe admin
   - Cliquer "Approuver" sur la candidature test

3. **Tester la connexion**
   - Aller sur `/ambassadeur/connexion`
   - Entrer le numéro exact : `+22670123456`
   - Cliquer "Se connecter"
   - Devrait rediriger vers le dashboard ✅

### Option B: Via Firebase Console

1. Aller sur Firebase Console > Firestore
2. Chercher un document dans `ambassadors` collection
3. Filtrer par `status = "approved"`
4. Copier le champ `phone` (ex: `+22670987654`)
5. Utiliser ce numéro pour se connecter

---

## ✅ Test de Connexion

### Test 1: Connexion Réussie

**Données:**
- Numéro: Celui d'un ambassadeur approuvé
- Status: `approved`
- AccessToken: Existe

**Étapes:**
1. Aller sur `/ambassadeur/connexion`
2. Entrer le numéro exact
3. Cliquer "Se connecter"

**Résultat Attendu:**
- ✅ Pas d'erreur
- ✅ Redirection vers `/ambassadeur?t=xxx`
- ✅ Dashboard s'affiche

### Test 2: Numéro Inconnu

**Données:**
- Numéro: `+22600000000` (n'existe pas)

**Étapes:**
1. Entrer le numéro inexistant
2. Cliquer "Se connecter"

**Résultat Attendu:**
- ❌ Message: "Aucun compte ambassadeur trouvé avec ce numéro..."
- ❌ Pas de redirection

### Test 3: Candidature Pending

**Données:**
- Numéro: Ambassadeur avec `status = "pending"`

**Étapes:**
1. Entrer le numéro
2. Cliquer "Se connecter"

**Résultat Attendu:**
- ⚠️ Message: "Votre candidature est en cours de traitement..."
- ❌ Pas de redirection

---

## 🔍 Débogage

### Voir les Logs API

Ouvrir la console du navigateur (F12) et regarder :
- **Network tab** → Voir la requête POST à `/api/ambassador/request-access`
- **Console tab** → Voir les erreurs JavaScript

### Tester l'API Directement

```bash
# Test avec numéro inexistant
curl -X POST http://localhost:3000/api/ambassador/request-access \
  -H "Content-Type: application/json" \
  -d '{"phone":"+22600000000"}'

# Résultat: {"success":false,"error":"not_found"}
```

### Vérifier Firestore

```bash
# Lister les ambassadeurs approuvés
firebase firestore:get ambassadors --where status==approved

# Voir un ambassadeur spécifique
firebase firestore:get ambassadors/<AMBASSADOR_ID>
```

---

## 📱 Formats de Numéro Acceptés

L'API normalise automatiquement les numéros en retirant espaces et tirets :

| Format Entré | Normalisé | Match Base? |
|-------------|-----------|-------------|
| `+226 70 12 34 56` | `+22670123456` | ✅ |
| `+226-70-12-34-56` | `+22670123456` | ✅ |
| `+22670123456` | `+22670123456` | ✅ |
| `226 70 12 34 56` | `22670123456` | ❌ (manque +) |

**Important:** Le numéro dans Firestore DOIT être au format `+XXXXXXXXXXX` (avec +)

---

## 🐛 Problèmes Connus

### Erreur: "Erreur de connexion..."

**Cause:** Exception JavaScript (catch block)
**Solution:** Vérifier console navigateur pour l'erreur exacte

### Erreur: "Erreur lors de la demande d'accès..."

**Cause:** Erreur inconnue de l'API
**Solution:** Vérifier logs serveur Next.js

### Aucune Redirection

**Cause:** Token manquant ou invalide
**Solution:**
1. Vérifier que l'ambassadeur a un `accessToken` dans Firestore
2. Vérifier que le token n'est pas expiré (`accessTokenExpiresAt`)

---

## 🎬 Vidéo du Flow

```
┌─────────────────────────────────┐
│  /ambassadeur/connexion         │
│                                 │
│  [_____________________]  📞   │  ← Entre numéro
│                                 │
│  [   Se connecter   ]   →      │  ← Clique
└─────────────────────────────────┘
           ↓
    POST /api/ambassador/request-access
           ↓
    {"success": true, "accessToken": "xxx"}
           ↓
    Redirection → /ambassadeur?t=xxx
           ↓
┌─────────────────────────────────┐
│  Dashboard Ambassadeur          │
│  ✅ Bienvenue [Prénom] !        │
└─────────────────────────────────┘
```

---

## ✅ Checklist Avant Test

- [ ] Serveur Next.js en cours d'exécution (`npm run dev`)
- [ ] Firebase configuré (`.env.local` avec credentials)
- [ ] Au moins 1 ambassadeur approuvé dans Firestore
- [ ] Connaître le numéro exact de cet ambassadeur

---

## 💡 Astuce Rapide

Si tu n'as pas encore d'ambassadeur approuvé :

1. Va sur `/devenir-ambassadeur`
2. Remplis le formulaire avec :
   - Prénom: `Test`
   - Nom: `Ambassadeur`
   - Téléphone: `+22670999999`
3. Va sur `/admin/ambassadeurs`
4. Approuve "Test Ambassadeur"
5. Retourne sur `/ambassadeur/connexion`
6. Entre `+22670999999`
7. Teste ! 🚀

---

**Créé le:** 2026-04-02
**Status:** ✅ Ready for Testing
