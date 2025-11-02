# 🚀 Guide de Déploiement - Backend Vidova

## ✅ Configuration Locale Terminée

Le backend fonctionne maintenant en local avec :
- ✅ **Prisma Client généré** (version 5.4.2)
- ✅ **Base de données Supabase** connectée
- ✅ **Authentification Google** fonctionnelle (endpoint `/auth/google` corrigé)
- ✅ **CORS** configuré pour `https://vidova.me`

## 🔧 Problèmes Résolus

### 1. Erreur CORS
**Problème :** `No 'Access-Control-Allow-Origin' header`  
**Solution :** Modifié `/auth/google` pour utiliser POST avec JSON body au lieu de query params

### 2. Client Prisma non généré
**Problème :** `prisma-client-py: command not found`  
**Solution :** 
- Installé Prisma CLI v5.4.2 (compatible avec prisma-client-py 0.11.0)
- Ajouté le venv au PATH : `export PATH="/path/to/.venv/bin:$PATH"`
- Commande : `npx prisma@5.4.2 generate`

### 3. Connexion Supabase
**Problème :** `Tenant or user not found`  
**Solution :** Utilisé les bonnes credentials avec pgbouncer:
```
postgresql://postgres.htrmvaxglpqbpbqzfzfq:1905Altan.@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

## 📦 Déploiement sur DigitalOcean

### Prérequis
- Serveur DigitalOcean : `46.101.143.40`
- Domaine : `api.vidova.me` pointant vers le serveur
- SSH : `ssh root@46.101.143.40`

### Étapes de Déploiement

#### 1. Commiter et pousser les changements
```bash
cd /Users/altan/Desktop/CreatorOS
git add .
git commit -m "Fix: CORS Google Auth + Prisma generation + Supabase connection"
git push origin main
```

#### 2. Se connecter au serveur
```bash
ssh root@46.101.143.40
```

#### 3. Cloner ou mettre à jour le repository
```bash
# Si première fois
mkdir -p /var/www/backend
cd /var/www/backend
git clone https://github.com/skrt67/creatoros.git .

# Si déjà cloné
cd /var/www/backend
git pull origin main
```

#### 4. Exécuter le script de déploiement
```bash
cd /var/www/backend/backend
chmod +x deploy.sh
./deploy.sh
```

Le script va automatiquement :
- ✅ Installer Python 3, Node.js, npm
- ✅ Créer l'environnement virtuel
- ✅ Installer les dépendances Python
- ✅ Installer Prisma CLI v5.4.2
- ✅ Générer le client Prisma
- ✅ Créer le fichier `.env` avec les credentials
- ✅ Créer le service systemd
- ✅ Configurer Nginx
- ✅ Démarrer le backend

#### 5. Vérifier le déploiement
```bash
# Vérifier le statut du service
sudo systemctl status vidova-backend

# Vérifier les logs
sudo journalctl -u vidova-backend -f

# Tester l'API
curl http://localhost:8003/health
curl http://api.vidova.me/health
```

### 🔧 Dépannage

#### Si Prisma ne se génère pas
```bash
cd /var/www/backend/backend
chmod +x fix_prisma.sh
./fix_prisma.sh
```

#### Redémarrer le service
```bash
sudo systemctl restart vidova-backend
```

#### Voir les logs d'erreur
```bash
sudo journalctl -u vidova-backend -n 100 --no-pager
```

#### Vérifier Nginx
```bash
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/api.vidova.me_error.log
```

## 🌐 URLs

- **API Production :** https://api.vidova.me
- **Health Check :** https://api.vidova.me/health
- **API Docs :** https://api.vidova.me/docs
- **Frontend :** https://vidova.me

## 📝 Variables d'Environnement

Les variables sont dans `.env.production` et seront copiées automatiquement lors du déploiement.

**Important :** Les credentials Supabase et Google OAuth sont déjà configurées.

## 🔐 Sécurité

- ⚠️ **Ne jamais** commiter les fichiers `.env` ou `.env.production` dans Git
- ✅ Ajouter `.env*` dans `.gitignore`
- ✅ Utiliser des secrets différents pour dev/staging/prod

## 📊 Monitoring

Une fois déployé, vérifier régulièrement :
1. Logs du service : `sudo journalctl -u vidova-backend -f`
2. Logs Nginx : `sudo tail -f /var/log/nginx/api.vidova.me_access.log`
3. Status Supabase : Dashboard Supabase
4. Utilisation serveur : `htop`

## 🚀 Prochaines Étapes

1. ✅ Configurer SSL/HTTPS avec Let's Encrypt (Certbot)
2. ✅ Mettre à jour le frontend pour utiliser `https://api.vidova.me`
3. ⏳ Implémenter Stripe pour les paiements
4. ⏳ Configurer Temporal pour le traitement vidéo asynchrone
5. ⏳ Ajouter monitoring avec Sentry ou LogRocket

## 📞 Support

En cas de problème :
1. Vérifier les logs : `sudo journalctl -u vidova-backend -n 100`
2. Tester la connexion Supabase depuis le serveur
3. Vérifier la configuration Nginx
4. Vérifier que le port 8003 est ouvert : `sudo ufw status`
