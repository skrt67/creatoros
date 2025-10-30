#!/bin/bash

# Script pour déployer la migration sur le serveur de production

echo "🚀 Déploiement de la migration 'add_user_name'..."

# Se connecter au serveur et exécuter les commandes
ssh root@46.101.143.40 << 'ENDSSH'
  cd /root/CreatorOS/backend

  echo "📥 Récupération des derniers changements..."
  git pull

  echo "🔄 Application de la migration Prisma..."
  prisma migrate deploy

  echo "🔧 Génération du client Prisma..."
  prisma generate

  echo "🔄 Redémarrage du service..."
  # Trouver le processus Python et le redémarrer
  pkill -f "python3 main.py"
  nohup python3 main.py > /dev/null 2>&1 &

  echo "✅ Déploiement terminé!"
ENDSSH

echo "🎉 Migration déployée avec succès!"
