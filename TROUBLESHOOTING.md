# Guide de dépannage - Soumission de vidéo échoue

## Problème
Lorsqu'une vidéo est soumise sur le site en ligne (vidova.me), la soumission échoue sans message d'erreur clair.

## Causes possibles

### 1. Variable d'environnement NEXT_PUBLIC_API_URL non configurée sur Vercel

**Symptôme:** Le frontend essaie de se connecter à `http://localhost:8003` au lieu de `https://api.vidova.me`

**Solution:**
1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Settings > Environment Variables
4. Ajoutez `NEXT_PUBLIC_API_URL` = `https://api.vidova.me`
5. Redéployez l'application

**Vérification:**
```bash
# Ouvrez la console du navigateur sur vidova.me
# Tapez:
console.log(process.env.NEXT_PUBLIC_API_URL)
# Devrait afficher: https://api.vidova.me
```

### 2. Clé API AssemblyAI manquante ou invalide

**Symptôme:** La vidéo est uploadée mais le traitement échoue

**Solution:**
```bash
# Se connecter au serveur
ssh root@api.vidova.me

# Vérifier la configuration
cd /root/CreatorOS/backend
python3 check_config.py

# Si ASSEMBLYAI_API_KEY manque, l'ajouter au .env
nano .env
# Ajouter: ASSEMBLYAI_API_KEY=votre_cle_ici

# Redémarrer le service
systemctl restart creatoros-backend
```

### 3. Problème de CORS

**Symptôme:** Erreur CORS dans la console du navigateur

**Solution:**
Le backend doit autoriser `https://vidova.me`. Vérifiez dans `backend/main.py`:

```python
allowed_origins = [
    "https://vidova.me",
    "https://www.vidova.me",
    # ...
]
```

### 4. Limite d'utilisation atteinte

**Symptôme:** Erreur 402 Payment Required

**Solution:**
- Vérifiez votre plan (Free = 3 vidéos/mois)
- Upgradez vers Pro pour plus de vidéos
- Ou attendez le mois prochain

### 5. Type de fichier non supporté

**Symptôme:** Erreur 400 Bad Request

**Solution:**
Formats supportés: MP4, AVI, MOV, WEBM, QuickTime

### 6. Fichier trop volumineux

**Symptôme:** Upload timeout ou erreur 413

**Solution:**
- Compressez la vidéo
- Limitez à 500 MB maximum

## Diagnostic étape par étape

### Étape 1: Vérifier que le backend est en ligne

```bash
curl https://api.vidova.me/health
# Devrait retourner: {"status":"healthy"}
```

### Étape 2: Vérifier les variables d'environnement Vercel

1. Allez sur https://vercel.com/dashboard
2. Vérifiez que `NEXT_PUBLIC_API_URL` est défini
3. Redéployez si nécessaire

### Étape 3: Vérifier les logs du backend

```bash
ssh root@api.vidova.me
journalctl -u creatoros-backend -f
```

Soumettez une vidéo et observez les logs en temps réel.

### Étape 4: Vérifier la console du navigateur

1. Ouvrez vidova.me
2. Ouvrez la console (F12)
3. Allez dans l'onglet Network
4. Soumettez une vidéo
5. Regardez les requêtes HTTP et les erreurs

### Étape 5: Tester l'API directement

```bash
# Obtenir un token
curl -X POST https://api.vidova.me/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234"}'

# Utiliser le token pour tester l'upload
# (remplacez TOKEN par le token obtenu)
curl -X POST https://api.vidova.me/workspaces/WORKSPACE_ID/videos/upload \
  -H "Authorization: Bearer TOKEN" \
  -F "file=@test_video.mp4"
```

## Corrections appliquées

### Frontend (`VideoSubmission.tsx`)
- ✅ Amélioration de la gestion des erreurs
- ✅ Affichage du code HTTP et du message d'erreur détaillé
- ✅ Logging dans la console pour le debugging

### Backend (`videos.py`)
- ✅ Ajout de logging détaillé pour l'upload
- ✅ Vérification de la clé API AssemblyAI
- ✅ Messages d'erreur plus explicites

## Commandes utiles

### Redémarrer le backend
```bash
ssh root@api.vidova.me 'systemctl restart creatoros-backend'
```

### Voir les logs en temps réel
```bash
ssh root@api.vidova.me 'journalctl -u creatoros-backend -f'
```

### Vérifier la configuration
```bash
ssh root@api.vidova.me 'cd /root/CreatorOS/backend && python3 check_config.py'
```

### Tester l'API
```bash
./test_api.sh
```

## Contact

Si le problème persiste après avoir suivi ce guide, vérifiez:
1. Les logs du backend
2. La console du navigateur
3. Les variables d'environnement Vercel
4. Que toutes les clés API sont valides
