# 🔧 Mise à jour du Backend sur DigitalOcean

## Problème identifié
Le backend écoute sur `127.0.0.1` au lieu de `0.0.0.0`, ce qui empêche les connexions externes.

## 🚀 Commandes pour mettre à jour

### 1. Se connecter au Droplet
```bash
ssh root@46.101.143.40
```

### 2. Aller dans le dossier backend
```bash
cd Vidova/backend
```

### 3. Pull les dernières modifications
```bash
git pull origin main
```

### 4. Rebuild et redémarrer Docker
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### 5. Vérifier les logs
```bash
docker-compose logs -f api
```

Vous devriez voir :
```
✅ Database connected
✅ Utilisateur demo déjà présent
⚠️  Temporal client connection failed (normal si pas configuré)
🎉 Vidova Backend started successfully!
🚀 Starting Vidova API on port 8000...
```

### 6. Tester l'API
```bash
curl http://localhost:8003/health
```

Devrait retourner :
```json
{
  "status": "healthy",
  "service": "Vidova API",
  "version": "1.0.0"
}
```

## ✅ Vérification finale

Depuis votre machine locale :
```bash
curl http://46.101.143.40:8003/health
```

Une fois que ça fonctionne, testez votre frontend Vercel :
https://creatoros-altans-projects-4827283a.vercel.app

---

## 🐛 Si ça ne marche toujours pas

### Vérifier que le port 8003 est ouvert
```bash
ufw status
```

Si le port n'est pas ouvert :
```bash
ufw allow 8003
ufw reload
```

### Vérifier que Docker écoute sur 0.0.0.0
```bash
netstat -tulpn | grep 8003
```

Devrait montrer : `0.0.0.0:8003`
