#!/bin/bash
# Script pour déployer rapidement sur DigitalOcean depuis votre machine locale

echo "🚀 Déploiement sur api.vidova.me"
echo "=================================="
echo ""

# Connexion SSH et exécution des commandes
ssh root@46.101.143.40 << 'ENDSSH'
set -e

echo "📥 Mise à jour du code..."
cd /var/www/backend 2>/dev/null || {
    echo "📁 Création du répertoire..."
    mkdir -p /var/www/backend
    cd /var/www/backend
    git clone https://github.com/skrt67/creatoros.git .
}

# Pull latest changes
git fetch origin
git reset --hard origin/main

cd backend

echo ""
echo "🐍 Configuration Python..."
python3 -m venv venv || true
source venv/bin/activate

echo ""
echo "📦 Installation des dépendances..."
pip install --upgrade pip
pip install -r requirements.txt
pip install PyJWT

echo ""
echo "📦 Installation de Node.js et Prisma..."
npm install prisma@5.4.2 @prisma/client@5.4.2

echo ""
echo "🗄️  Génération du client Prisma..."
export PATH="$PWD/venv/bin:$PATH"
npx prisma@5.4.2 generate || {
    echo "⚠️  Erreur génération Prisma, continuons..."
}

echo ""
echo "⚙️  Configuration .env..."
if [ ! -f ".env" ]; then
    echo "❌ Fichier .env manquant!"
    echo "📝 Veuillez créer le fichier .env avec vos credentials:"
    echo "   nano /var/www/backend/backend/.env"
    echo ""
    echo "Utilisez .env.template comme base"
    exit 1
else
    echo "✅ Fichier .env existe"
fi

echo ""
echo "🔧 Configuration du service systemd..."
sudo tee /etc/systemd/system/vidova-backend.service > /dev/null << 'EOF'
[Unit]
Description=Vidova Backend API
After=network.target

[Service]
User=root
WorkingDirectory=/var/www/backend/backend
Environment="PATH=/var/www/backend/backend/venv/bin:/usr/local/bin:/usr/bin:/bin"
ExecStart=/var/www/backend/backend/venv/bin/python3 main.py
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

echo ""
echo "🚀 Redémarrage du service..."
sudo systemctl daemon-reload
sudo systemctl enable vidova-backend
sudo systemctl restart vidova-backend

sleep 3

if sudo systemctl is-active --quiet vidova-backend; then
    echo "✅ Service vidova-backend est actif"
else
    echo "❌ Service vidova-backend n'est pas actif"
    echo "📋 Logs:"
    sudo journalctl -u vidova-backend -n 50 --no-pager
    exit 1
fi

echo ""
echo "🧪 Test de l'API..."
if curl -s http://localhost:8003/health | grep -q "healthy"; then
    echo "✅ API répond correctement"
else
    echo "❌ API ne répond pas"
    sudo journalctl -u vidova-backend -n 20 --no-pager
fi

echo ""
echo "=================================="
echo "🎉 Déploiement terminé!"
echo "=================================="
echo ""
echo "📡 Tester:"
echo "  http://api.vidova.me/health"
echo ""
echo "📋 Logs:"
echo "  sudo journalctl -u vidova-backend -f"
echo ""

ENDSSH

echo ""
echo "✅ Déploiement distant terminé!"
echo ""
echo "⚠️  IMPORTANT: Si le .env n'existe pas sur le serveur:"
echo "   1. ssh root@46.101.143.40"
echo "   2. cd /var/www/backend/backend"
echo "   3. cp .env.template .env"
echo "   4. nano .env  # Remplir avec vos vraies credentials"
echo "   5. sudo systemctl restart vidova-backend"
echo ""
