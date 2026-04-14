#!/bin/bash
# Script de déploiement rapide - mise à jour du code sans rebuild complet

set -e

echo "🚀 Déploiement rapide Vidova Backend"
echo "===================================="

ssh root@46.101.143.40 << 'ENDSSH'
set -e

cd /var/www/backend

# Mise à jour du code
echo "📥 Mise à jour du code..."
git fetch origin
git reset --hard origin/main

cd backend

# Vérifier si le conteneur existe
if docker ps -a | grep -q vidova-backend; then
    echo ""
    echo "🛑 Arrêt du conteneur..."
    docker stop vidova-backend 2>/dev/null || true
    docker rm vidova-backend 2>/dev/null || true
fi

# Vérifier si l'image existe
if docker images | grep -q vidova-backend; then
    echo ""
    echo "🔨 Rebuild rapide (avec cache)..."
    docker build -t vidova-backend . 2>&1 | tail -10
else
    echo ""
    echo "🔨 Construction initiale de l'image..."
    docker build -t vidova-backend .
fi

echo ""
echo "🚀 Démarrage du conteneur..."
docker run -d \
  --name vidova-backend \
  --restart unless-stopped \
  -p 8003:8003 \
  --env-file .env \
  vidova-backend

echo ""
echo "⏳ Attente du démarrage (15s)..."
sleep 15

echo ""
echo "🧪 Vérification..."
if curl -s http://localhost:8003/health | grep -q "healthy"; then
    echo ""
    echo "✅ =========================================="
    echo "✅ Déploiement réussi!"
    echo "✅ =========================================="
    echo ""
    echo "📡 API: https://api.vidova.me"
    echo "📋 Logs: docker logs -f vidova-backend"
else
    echo ""
    echo "❌ Problème - Logs:"
    docker logs vidova-backend 2>&1 | tail -30
    exit 1
fi

ENDSSH

echo ""
echo "✅ Déploiement terminé!"
