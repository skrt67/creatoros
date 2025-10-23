# 🚀 Guide de Déploiement CreatorOS
## Supabase + DigitalOcean + Vercel

**Temps estimé** : 45 minutes  
**Coût** : GRATUIT pendant 10+ mois avec GitHub Student Pack

---

## 📋 Prérequis

✅ Compte GitHub (déjà fait)  
✅ GitHub Student Pack activé (déjà fait)  
✅ Code CreatorOS sur GitHub  

---

## 🎯 Architecture Finale

```
Frontend (Vercel) → Supabase (DB + Auth + Storage) ← Backend (DigitalOcean)
```

---

## PARTIE 1️⃣ : SUPABASE (Database + Auth + Storage)

### Étape 1.1 : Créer le projet Supabase (5 min)

1. **Allez sur** : https://supabase.com
2. **Sign in with GitHub**
3. **New Project** :
   - Name : `CreatorOS`
   - Database Password : `[NOTEZ-LE BIEN]`1905Altan.
   - Region : `Europe (Paris)` ou le plus proche
   - Plan : Free
4. **Attendez 2-3 minutes** que le projet soit créé

### Étape 1.2 : Copier les clés API

Dans votre projet Supabase :
1. Allez dans **Settings** → **API**
2. **Copiez et sauvegardez** :
   ```
   Project URL: https://xxxxx.supabase.co
   anon (public) key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0cm12YXhnbHBxYnBicXpmemZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMjgwMzIsImV4cCI6MjA3NjgwNDAzMn0.jPbqckJA1zE8kZxi8xVAB6ejEpSrmul5bp2H-xgyqqU
   service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0cm12YXhnbHBxYnBicXpmemZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTIyODAzMiwiZXhwIjoyMDc2ODA0MDMyfQ.641an1fy0XzoydAXdplSjVL_kfjBIuyvm4OEPURwETM
   ```

### Étape 1.3 : Exécuter le schéma SQL

1. Allez dans **SQL Editor** (menu gauche)
2. **New Query**
3. **Copiez-collez tout le contenu ci-dessous** :

```sql
-- CreatorOS Database Schema for Supabase
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE video_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');
CREATE TYPE job_status AS ENUM ('STARTED', 'COMPLETED', 'FAILED');
CREATE TYPE asset_type AS ENUM ('BLOG_POST', 'TWITTER_THREAD', 'LINKEDIN_POST', 'TIKTOK', 'VIDEO_HIGHLIGHTS');
CREATE TYPE asset_status AS ENUM ('GENERATED', 'PUBLISHED', 'ARCHIVED');

-- Users table
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT ('usr_' || replace(uuid_generate_v4()::text, '-', '')),
    email TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workspaces table
CREATE TABLE workspaces (
    id TEXT PRIMARY KEY DEFAULT ('wsp_' || replace(uuid_generate_v4()::text, '-', '')),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Video Sources table
CREATE TABLE video_sources (
    id TEXT PRIMARY KEY DEFAULT ('vid_' || replace(uuid_generate_v4()::text, '-', '')),
    youtube_url TEXT NOT NULL,
    title TEXT,
    status video_status DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE
);

-- Processing Jobs table
CREATE TABLE processing_jobs (
    id TEXT PRIMARY KEY DEFAULT ('job_' || replace(uuid_generate_v4()::text, '-', '')),
    temporal_workflow_id TEXT UNIQUE NOT NULL,
    status job_status DEFAULT 'STARTED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    video_source_id TEXT UNIQUE NOT NULL REFERENCES video_sources(id) ON DELETE CASCADE
);

-- Transcripts table
CREATE TABLE transcripts (
    id TEXT PRIMARY KEY DEFAULT ('trs_' || replace(uuid_generate_v4()::text, '-', '')),
    full_transcript JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    job_id TEXT UNIQUE NOT NULL REFERENCES processing_jobs(id) ON DELETE CASCADE
);

-- Content Assets table
CREATE TABLE content_assets (
    id TEXT PRIMARY KEY DEFAULT ('ast_' || replace(uuid_generate_v4()::text, '-', '')),
    type asset_type NOT NULL,
    content TEXT NOT NULL,
    status asset_status DEFAULT 'GENERATED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    job_id TEXT NOT NULL REFERENCES processing_jobs(id) ON DELETE CASCADE
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id TEXT PRIMARY KEY DEFAULT ('sub_' || replace(uuid_generate_v4()::text, '-', '')),
    user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_customer_id TEXT UNIQUE NOT NULL,
    stripe_subscription_id TEXT UNIQUE NOT NULL,
    stripe_price_id TEXT NOT NULL,
    stripe_current_period_end TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL
);

-- Create indexes
CREATE INDEX idx_workspaces_owner_id ON workspaces(owner_id);
CREATE INDEX idx_video_sources_workspace_id ON video_sources(workspace_id);
CREATE INDEX idx_video_sources_status ON video_sources(status);
CREATE INDEX idx_processing_jobs_status ON processing_jobs(status);
CREATE INDEX idx_content_assets_job_id ON content_assets(job_id);

-- Updated trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_video_sources_updated_at BEFORE UPDATE ON video_sources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Demo user (password: demo123)
INSERT INTO users (id, email, hashed_password) VALUES
    ('usr_demo', 'demo@creatoros.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5aeOFVQxBr2Km');

INSERT INTO workspaces (id, name, owner_id) VALUES
    ('wsp_demo', 'Demo Workspace', 'usr_demo');
```

4. **Run** (bouton en bas à droite)
5. Vérifiez qu'il n'y a pas d'erreurs ✅

---

## PARTIE 2️⃣ : DIGITALOCEAN (Backend)

### Étape 2.1 : Activer le crédit GitHub Student ($200)

1. **Allez sur** : https://www.digitalocean.com
2. **Sign up** avec GitHub
3. **Allez dans Billing** → **Promo Code**
4. **Appliquez votre GitHub Student Pack** ($200 crédit)

### Étape 2.2 : Créer un Droplet

1. **Create** → **Droplets**
2. **Configuration** :
   - Image : `Ubuntu 22.04 LTS`
   - Plan : `Basic` → `Regular` → **$6/month** (1GB RAM)
   - Datacenter : Paris ou le plus proche
   - Authentication : **SSH keys** (ou Password)
   - Hostname : `creatoros-backend`
3. **Create Droplet** (2 min)
4. **Notez l'IP publique** : 46.101.143.40

### Étape 2.3 : Se connecter et installer Docker

```bash
# SSH vers votre droplet
ssh root@142.93.xxx.xxx

# Mettre à jour le système
apt update && apt upgrade -y

# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Installer Docker Compose
apt install docker-compose -y

# Vérifier l'installation
docker --version
docker-compose --version
```

### Étape 2.4 : Cloner et configurer le backend

```bash
# Installer Git
apt install git -y

# Cloner votre repo (remplacez par votre URL)
git clone https://github.com/VOTRE_USERNAME/CreatorOS.git
cd CreatorOS/backend

# Créer le fichier .env
nano .env
```

**Contenu du .env** :
```env
# Supabase
DATABASE_URL=postgresql://postgres:[VOTRE_PASSWORD]@db.xxxxx.supabase.co:5432/postgres
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbG...

# JWT
JWT_SECRET=votre-secret-super-long-et-aleatoire-123456789

# API Keys
ASSEMBLYAI_API_KEY=votre-cle-assemblyai
GEMINI_API_KEY=votre-cle-gemini

# Temporal
TEMPORAL_HOST=localhost
TEMPORAL_PORT=7233
```

**Sauvegarder** : `Ctrl+X` → `Y` → `Enter`

### Étape 2.5 : Lancer le backend

```bash
# Construire et lancer
docker-compose up -d

# Vérifier les logs
docker-compose logs -f api

# Si tout va bien, vous verrez :
# "Application startup complete"
```

### Étape 2.6 : Configurer le firewall

```bash
# Ouvrir les ports nécessaires
ufw allow 22     # SSH
ufw allow 8003   # API
ufw allow 80     # HTTP
ufw allow 443    # HTTPS
ufw enable
```

---

## PARTIE 3️⃣ : VERCEL (Frontend)

### Étape 3.1 : Préparer le code frontend

Votre `frontend/.env.local` devrait contenir :
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
NEXT_PUBLIC_API_URL=http://142.93.xxx.xxx:8003
```

### Étape 3.2 : Déployer sur Vercel

1. **Allez sur** : https://vercel.com
2. **Sign up with GitHub**
3. **Import Project**
4. **Sélectionnez** : `CreatorOS`
5. **Configuration** :
   - Framework Preset : `Next.js`
   - Root Directory : `frontend`
   - Build Command : `npm run build`
   - Output Directory : `.next`
6. **Environment Variables** (cliquez sur "Add Environment Variable") :
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbG...
   NEXT_PUBLIC_API_URL = http://142.93.xxx.xxx:8003
   ```
7. **Deploy** (3-5 min)

---

## PARTIE 4️⃣ : DOMAIN GRATUIT (.me)

### Étape 4.1 : Obtenir le domain

1. **Allez sur** : https://nc.me (Namecheap)
2. **Connectez votre GitHub Student**
3. **Réclamez votre .me gratuit** : `creatoros.me`
4. **Attendez la confirmation** (5-10 min)

### Étape 4.2 : Configurer le DNS

**Sur Namecheap** :
1. **Dashboard** → `creatoros.me` → **Manage**
2. **Advanced DNS** :
   ```
   Type    Host    Value                           TTL
   A       @       142.93.xxx.xxx                 Automatic
   CNAME   www     cname.vercel-dns.com           Automatic
   CNAME   app     cname.vercel-dns.com           Automatic
   ```

**Sur Vercel** :
1. **Project Settings** → **Domains**
2. **Add Domain** : `app.creatoros.me`
3. Suivez les instructions

---

## ✅ VÉRIFICATION FINALE

### Testez votre déploiement :

1. **Frontend** : https://app.creatoros.me
2. **API** : http://142.93.xxx.xxx:8003/docs
3. **Supabase** : Dashboard → Table Editor

### Se connecter :
```
Email: demo@creatoros.com
Password: demo123
```

---

## 📊 MONITORING (Bonus)

### Sentry (Erreurs) - GRATUIT

1. https://sentry.io → Sign up with GitHub
2. Créer projet "CreatorOS"
3. Suivre les instructions d'intégration

### Datadog (Performance) - 2 ans GRATUIT

1. https://www.datadoghq.com → Appliquer GitHub Student
2. Installer l'agent sur DigitalOcean :
```bash
DD_API_KEY=votre-cle DD_SITE="datadoghq.eu" bash -c "$(curl -L https://s3.amazonaws.com/dd-agent/scripts/install_script.sh)"
```

---

## 🎯 COÛTS

| Service | Coût Normal | Avec Student Pack | Durée |
|---------|-------------|-------------------|-------|
| DigitalOcean | $6/mois | **GRATUIT** | 33 mois ($200) |
| Vercel | Gratuit | **GRATUIT** | Illimité |
| Supabase | Gratuit | **GRATUIT** | Illimité |
| Domain .me | $15/an | **GRATUIT** | 1 an |
| Sentry | $29/mois | **GRATUIT** | Illimité (plan student) |
| **TOTAL** | ~$100/mois | **$0** | 2+ ans |

---

## 🆘 DÉPANNAGE

### Backend ne démarre pas
```bash
docker-compose logs api
# Vérifiez les variables d'environnement
```

### Erreur de connexion Supabase
```bash
# Vérifiez que l'IP du Droplet est autorisée
# Supabase → Settings → Database → Connection Pooling
```

### Frontend ne se connecte pas au backend
```bash
# Ajoutez CORS dans le backend (main.py)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.creatoros.me"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🚀 PROCHAINES ÉTAPES

1. ✅ **Configurez les backups** (Supabase → Settings → Backups)
2. ✅ **Ajoutez HTTPS** au backend (Let's Encrypt + Nginx)
3. ✅ **Configurez les alertes** (Sentry + Datadog)
4. ✅ **Testez la vidéo démo** sur la prod !

---

## 📞 SUPPORT

- Supabase : https://supabase.com/docs
- DigitalOcean : https://docs.digitalocean.com
- Vercel : https://vercel.com/docs

**🎉 Félicitations ! CreatorOS est en ligne ! 🚀**
