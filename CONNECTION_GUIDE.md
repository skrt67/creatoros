# Guide de Connexion - CreatorOS

## Vue d'ensemble
Ce guide explique comment se connecter aux différents services de CreatorOS : serveur backend, frontend Vercel, et les identifiants nécessaires.

## Serveur Backend

### URL d'accès
- **URL principale**: http://46.101.143.40:8003
- **Status**: ✅ Backend Python fonctionnel sur le port 8003
- **Base de données**: ✅ Supabase PostgreSQL connecté (pooler: aws-1-eu-west-1.pooler.supabase.com:6543)

### Identifiants de test
- **Email**: test@test.com
- **Mot de passe**: Test1234

### API Endpoints
- **Status**: ✅ Tous les endpoints fonctionnels (réponses 200 OK)
- **Authentification**: ✅ JWT tokens fonctionnels
- **Enregistrement/Connexion**: ✅ Fonctionnels

## Frontend Vercel

### URL d'accès
- **URL de production**: https://creatoros.vercel.app
- **Status**: ✅ Déployé et connecté au backend

### Authentification Google
- **Client ID**: [VOTRE_GOOGLE_CLIENT_ID]
- **Redirect URIs configurés**:
  - https://creatoros.vercel.app/api/auth/callback/google
  - http://localhost:3000/api/auth/callback/google

## Variables d'environnement

### Vercel (Frontend)
```env
NEXTAUTH_SECRET=[VOTRE_SECRET_NEXTAUTH]
NEXTAUTH_GOOGLE_SECRET=[VOTRE_SECRET_NEXTAUTH_GOOGLE]
NEXTAUTH_URL=https://creatoros.vercel.app
NEXT_PUBLIC_GOOGLE_CLIENT_ID=[VOTRE_GOOGLE_CLIENT_ID]
NEXT_PUBLIC_API_URL=http://46.101.143.40:8003
```

### Backend
```env
RESEND_API_KEY=[VOTRE_CLE_RESEND]
TEMPORAL_DB_PASSWORD=[VOTRE_MOT_DE_PASSE_TEMPORAL]
GOOGLE_CLIENT_ID=[VOTRE_GOOGLE_CLIENT_ID]
GOOGLE_CLIENT_SECRET=[VOTRE_GOOGLE_CLIENT_SECRET]
```

## Services externes

### Resend (Emails)
- **API Key**: [VOTRE_CLE_RESEND]
- **Status**: ✅ Configuré et fonctionnel

### TikTok Business API
- **Client Key**: [VOTRE_TIKTOK_CLIENT_KEY]
- **Client Secret**: [VOTRE_TIKTOK_CLIENT_SECRET]
- **Status**: Prêt à implémenter (Analytics Dashboard)

### Alternative TikTok (Sandbox)
- **Client Key**: [VOTRE_TIKTOK_SANDBOX_CLIENT_KEY]
- **Client Secret**: [VOTRE_TIKTOK_SANDBOX_CLIENT_SECRET]
- **Status**: ⚠️ Problème `unauthorized_client` - à vérifier

## Services en cours

### Temporal Server
- **Status**: ⚠️ Installation en cours (Docker - problème connexion PostgreSQL)
- **Base de données**: temporal / temporal123
- **Objectif**: Traitement asynchrone des vidéos

## Déploiement Backend sur api.vidova.me

### 1. Préparer le backend
```bash
cd backend
# Installer les dépendances
pip3 install -r requirements.txt
pip3 install PyJWT

# Générer le client Prisma
PATH="$PATH:/Users/altan/Library/Python/3.9/bin" PRISMA_PY_DEBUG_GENERATOR=1 prisma generate

# Tester localement
python3 main.py
```

### 2. Variables d'environnement pour production
Créer un fichier `.env.production` sur le serveur :

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
RESEND_API_KEY=re_G4VNBn2Y_4KvG5Dxzao5kquZPDyuE6iZw
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SECRET_KEY=your_jwt_secret_key
PORT=8000
```

### 3. Déployer avec systemd
Créer un service systemd `/etc/systemd/system/vidova-backend.service` :

```ini
[Unit]
Description=Vidova Backend API
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/path/to/backend
ExecStart=/usr/bin/python3 main.py
Restart=always
Environment=PATH=/usr/local/bin:/usr/bin

[Install]
WantedBy=multi-user.target
```

### 4. Configurer Nginx
Créer `/etc/nginx/sites-available/api.vidova.me` :

```nginx
server {
    listen 80;
    server_name api.vidova.me;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 5. Activer le site
```bash
sudo ln -s /etc/nginx/sites-available/api.vidova.me /etc/nginx/sites-enabled/
sudo systemctl reload nginx
sudo systemctl enable vidova-backend
sudo systemctl start vidova-backend
```

## Résultat
- ✅ Backend accessible sur https://api.vidova.me
- ✅ CORS configuré pour https://vidova.me
- ✅ Authentification Google fonctionnelle

## URLs importantes

- **Dashboard Vercel**: https://vercel.com/dashboard
- **Google Cloud Console**: https://console.cloud.google.com/
- **TikTok Developer Portal**: https://developers.tiktok.com/
- **Supabase Dashboard**: [URL à confirmer]

## Support

Pour toute question concernant les connexions ou les identifiants, vérifier d'abord :
1. Les variables d'environnement sont correctement configurées
2. Les services externes sont accessibles
3. Les URLs de redirection OAuth sont à jour
