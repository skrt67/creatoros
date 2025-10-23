# 🚀 Démarrer le Worker de Traitement

## Problème
Les vidéos restent bloquées en "pending" car le **worker de traitement** n'est pas lancé.

## Solution Rapide

### Option 1 : Sans Temporal (Traitement Direct)

Créons un système de traitement simplifié sans Temporal :

```bash
cd backend
python simple_worker.py
```

### Option 2 : Avec Temporal (Production)

Si vous voulez utiliser Temporal :

1. **Démarrer Temporal Server:**
```bash
# Option A : Docker (recommandé)
docker run -p 7233:7233 temporalio/auto-setup:latest

# Option B : Temporal CLI
temporal server start-dev
```

2. **Démarrer le Worker:**
```bash
cd backend
source venv/bin/activate  # ou venv\Scripts\activate sur Windows
python worker.py
```

## État Actuel

❌ Worker non lancé → Vidéos bloquées en "pending"
✅ Backend lancé → Peut recevoir soumissions
✅ Frontend lancé → Interface fonctionne

## Solution Temporaire

Je vais créer un **worker simple** qui traite les vidéos directement sans Temporal.
