#!/bin/bash

# 🚀 Script de redéploiement rapide - Backend api.vidova.me
# Met à jour le code depuis GitHub et redémarre le service

set -e

echo "=========================================="
echo "🔄 Redéploiement Backend api.vidova.me"
echo "=========================================="

SERVER_IP="104.248.28.252"
SERVER_USER="root"  # ou "ubuntu" selon votre config
BACKEND_DIR="/var/www/backend"

echo "📡 Connexion au serveur $SERVER_IP..."
echo ""

ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'
set -e

echo "📥 Étape 1: Pull des dernières modifications..."
cd /var/www/backend
git pull origin main

echo ""
echo "🔄 Étape 2: Redémarrage du service backend..."
sudo systemctl restart vidova-backend

echo ""
echo "⏳ Attente du redémarrage (5 secondes)..."
sleep 5

echo ""
echo "✅ Étape 3: Vérification du statut..."
if sudo systemctl is-active --quiet vidova-backend; then
    echo "✅ Service vidova-backend est actif"
    sudo systemctl status vidova-backend --no-pager -l | head -20
else
    echo "❌ Erreur: Service non actif"
    sudo journalctl -u vidova-backend -n 50 --no-pager
    exit 1
fi

echo ""
echo "🧪 Étape 4: Test de l'API..."
if curl -s http://localhost:8000/health | grep -q "healthy"; then
    echo "✅ Backend répond correctement"
else
    echo "❌ Backend ne répond pas"
    exit 1
fi

echo ""
echo "=========================================="
echo "🎉 Redéploiement terminé avec succès!"
echo "=========================================="
echo ""
echo "📡 Testez:"
echo "  - http://api.vidova.me/health"
echo "  - https://api.vidova.me/health"
echo ""
echo "📋 Voir les logs:"
echo "  sudo journalctl -u vidova-backend -f"

ENDSSH

echo ""
echo "✅ Script de redéploiement terminé!"
