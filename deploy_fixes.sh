#!/bin/bash

echo "🚀 Déploiement des corrections CreatorOS"
echo "========================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Commit et push des changements frontend
echo "📦 1. Commit et push des changements..."
git add .
git commit -m "Fix: Amélioration gestion erreurs soumission vidéo + logging backend"
git push origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Code poussé sur GitHub${NC}"
else
    echo -e "${RED}❌ Erreur lors du push${NC}"
    exit 1
fi

echo ""
echo "⏳ 2. Vercel va automatiquement redéployer le frontend..."
echo "   Vérifiez sur: https://vercel.com/dashboard"
echo ""

# 2. Déployer le backend
echo "🔧 3. Déploiement du backend sur api.vidova.me..."
echo ""

# Demander confirmation
read -p "Voulez-vous déployer le backend maintenant? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Se connecter au serveur et redéployer
    ssh root@api.vidova.me << 'ENDSSH'
        cd /root/CreatorOS
        
        echo "📥 Récupération des dernières modifications..."
        git pull origin main
        
        echo "🔄 Redémarrage du service backend..."
        systemctl restart creatoros-backend
        
        echo "✅ Backend redémarré"
        
        echo "📊 Status du service:"
        systemctl status creatoros-backend --no-pager -l
ENDSSH

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Backend déployé avec succès${NC}"
    else
        echo -e "${RED}❌ Erreur lors du déploiement backend${NC}"
        exit 1
    fi
else
    echo "⏭️  Déploiement backend ignoré"
fi

echo ""
echo "========================================"
echo -e "${GREEN}✅ Déploiement terminé!${NC}"
echo ""
echo "🔍 Prochaines étapes:"
echo "1. Vérifiez que NEXT_PUBLIC_API_URL est configuré sur Vercel"
echo "2. Testez la soumission d'une vidéo sur https://vidova.me"
echo "3. Vérifiez les logs du backend: ssh root@api.vidova.me 'journalctl -u creatoros-backend -f'"
echo ""
