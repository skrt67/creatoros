#!/bin/bash

# Script de déploiement automatique pour nouveau serveur
# Usage: ./deploy_new_server.sh <IP_DU_SERVEUR>

set -e

if [ -z "$1" ]; then
    echo "❌ Usage: ./deploy_new_server.sh <IP_DU_SERVEUR>"
    exit 1
fi

SERVER_IP=$1

echo "🚀 Déploiement automatique sur $SERVER_IP"
echo "================================================"
echo ""

ssh -o StrictHostKeyChecking=no root@$SERVER_IP << 'ENDSSH'
set -e

echo "📦 Mise à jour du système..."
apt update -qq
apt upgrade -y -qq

echo ""
echo "🐳 Installation de Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

echo ""
echo "🔧 Configuration Docker avec IPv6..."
mkdir -p /etc/docker
cat > /etc/docker/daemon.json << 'EOF'
{
  "ipv6": true,
  "fixed-cidr-v6": "2001:db8:1::/64",
  "experimental": true,
  "ip6tables": true
}
EOF

systemctl restart docker

echo ""
echo "📥 Installation de Git..."
apt install -y git

echo ""
echo "📁 Clonage du repository..."
cd /root
git clone https://github.com/skrt67/creatoros.git
cd creatoros/backend

echo ""
echo "📝 Configuration de l'environnement..."
cat > .env << 'EOF'
DATABASE_URL=[VOTRE_DATABASE_URL]
SUPABASE_URL=[VOTRE_SUPABASE_URL]
SUPABASE_KEY=[VOTRE_SUPABASE_KEY]
JWT_SECRET_KEY=[VOTRE_JWT_SECRET]
GOOGLE_CLIENT_ID=[VOTRE_GOOGLE_CLIENT_ID]
GOOGLE_CLIENT_SECRET=[VOTRE_GOOGLE_CLIENT_SECRET]
FRONTEND_URL=https://vidova.me
GOOGLE_GEMINI_API_KEY=[VOTRE_GEMINI_API_KEY]
STRIPE_SECRET_KEY=[VOTRE_STRIPE_SECRET_KEY]
STRIPE_WEBHOOK_SECRET=[VOTRE_STRIPE_WEBHOOK_SECRET]
STRIPE_PRICE_ID=[VOTRE_STRIPE_PRICE_ID]
EOF

echo ""
echo "🏗️ Construction de l'image Docker..."
docker build -t vidova-backend .

echo ""
echo "🚀 Lancement du container..."
docker run -d \
  --name vidova-backend \
  --restart unless-stopped \
  -p 8003:8003 \
  --env-file .env \
  vidova-backend

echo ""
echo "⏳ Attente du démarrage du container..."
sleep 10

echo ""
echo "🔍 Vérification des logs..."
docker logs vidova-backend 2>&1 | tail -20

echo ""
echo "🌐 Installation de Nginx..."
apt install -y nginx certbot python3-certbot-nginx

echo ""
echo "🔧 Configuration de Nginx..."
cat > /etc/nginx/sites-available/vidova << 'EOF'
server {
    listen 80;
    server_name api.vidova.me;

    location / {
        proxy_pass http://localhost:8003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

ln -sf /etc/nginx/sites-available/vidova /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl restart nginx

echo ""
echo "✅ Déploiement terminé!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Pointez api.vidova.me vers $SERVER_IP dans votre DNS"
echo "2. Attendez 2-5 minutes que le DNS se propage"
echo "3. Lancez: ssh root@$SERVER_IP 'certbot --nginx -d api.vidova.me --non-interactive --agree-tos -m votre@email.com'"
echo ""
echo "🧪 Test local: curl http://$SERVER_IP:8003/health"

ENDSSH

echo ""
echo "🎉 Déploiement automatique terminé!"
echo ""
echo "📍 Changez maintenant le DNS de api.vidova.me vers: $SERVER_IP"
