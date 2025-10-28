# 🚀 Vidova - Quick Start Déploiement

## ⏱️ 3 Commandes pour déployer en production

### 1️⃣ Supabase (5 min)
```
1. https://supabase.com → New Project "Vidova"
2. SQL Editor → Coller le schema depuis DEPLOYMENT_GUIDE.md
3. Settings → API → Copier les clés
```

### 2️⃣ DigitalOcean Backend (10 min)
```bash
# Sur votre Droplet
git clone https://github.com/VOTRE_USER/Vidova.git
cd Vidova/backend
cp .env.production.example .env
nano .env  # Remplir les variables
docker-compose up -d
```

### 3️⃣ Vercel Frontend (3 min)
```
1. https://vercel.com → Import Vidova
2. Root: frontend
3. Env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_API_URL
4. Deploy
```

## ✅ C'est fait !

Votre app est en ligne :
- **Frontend** : https://votre-app.vercel.app
- **Backend** : http://VOTRE_IP:8003
- **Database** : Supabase Dashboard

## 📚 Guide Complet

Voir `DEPLOYMENT_GUIDE.md` pour tous les détails.

---

## 💰 Coût : $0 pendant 2+ ans avec GitHub Student Pack

| Service | Crédit |
|---------|--------|
| DigitalOcean | $200 = 33 mois |
| Vercel | Gratuit illimité |
| Supabase | Gratuit illimité |
| Domain .me | Gratuit 1 an |
