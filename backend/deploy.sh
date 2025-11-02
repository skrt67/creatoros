#!/bin/bash

# 🚀 Script de déploiement automatisé - Backend sur api.vidova.me
# À exécuter sur le serveur api.vidova.me

set -e  # Arrêter si une erreur survient

echo "=========================================="
echo "🚀 Déploiement Vidova Backend"
echo "=========================================="

# Configuration
REPO_URL="https://github.com/skrt67/creatoros.git"
BACKEND_DIR="/var/www/backend"
VENV_DIR="$BACKEND_DIR/backend/venv"

# Étape 1: Mise à jour du système
echo "📦 Étape 1: Mise à jour du système..."
sudo apt update
sudo apt install -y python3 python3-pip python3-venv git curl nodejs npm

# Étape 2: Créer le répertoire
echo "📁 Étape 2: Création du répertoire backend..."
sudo mkdir -p $BACKEND_DIR
sudo chown $USER:$USER $BACKEND_DIR

# Étape 3: Cloner le repo
echo "📥 Étape 3: Clonage du repository..."
cd $BACKEND_DIR
if [ -d ".git" ]; then
    echo "Repository existe, mise à jour..."
    git fetch origin
    git reset --hard origin/main
else
    echo "Clonage du repository..."
    git clone $REPO_URL .
fi

# Étape 4: Aller dans le dossier backend
cd $BACKEND_DIR/backend

# Étape 5: Créer l'environnement virtuel
echo "🐍 Étape 5: Création de l'environnement virtuel..."
python3 -m venv venv
source venv/bin/activate

# Étape 6: Installer les dépendances Python
echo "📚 Étape 6: Installation des dépendances Python..."
pip install --upgrade pip
pip install -r requirements.txt

# Étape 7: Installer Node.js et Prisma
echo "📦 Étape 7: Installation de Prisma..."
npm install prisma

# Étape 8: Générer Prisma Client
echo "🗄️ Étape 8: Génération du client Prisma..."
# Essayer avec npx prisma generate
if npx prisma generate 2>/dev/null; then
    echo "✅ Prisma généré avec succès"
else
    echo "⚠️ Erreur de génération Prisma, tentative alternative..."
    # Essayer avec la commande Python
    if python3 -m prisma generate 2>/dev/null; then
        echo "✅ Prisma généré via Python"
    else
        echo "❌ Échec de génération Prisma"
        echo "⚠️ Continuons sans Prisma généré (à corriger manuellement)"
    fi
fi

# Étape 9: Créer le fichier .env
echo "⚙️ Étape 9: Configuration des variables d'environnement..."
if [ ! -f ".env" ]; then
    echo "📝 Copie du fichier .env.production..."
    if [ -f ".env.production" ]; then
        cp .env.production .env
        echo "✅ Fichier .env créé depuis .env.production"
        echo "⚠️  IMPORTANT: Vérifier et mettre à jour les valeurs dans .env"
    else
        echo "❌ Fichier .env.production non trouvé"
        echo "📝 Création d'un fichier .env template..."
        echo "⚠️  Vous devrez éditer ce fichier avec vos vraies credentials"
        cat > .env << 'EOF'
# Database Supabase (Connection Pooling)
# ⚠️ IMPORTANT: Remplacer [USER], [PASSWORD], [HOST] avec vos vraies valeurs Supabase
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://[USER]:[PASSWORD]@[HOST]:5432/postgres"

# JWT Secret - Générer avec: openssl rand -base64 32
JWT_SECRET_KEY="CHANGE_ME_TO_A_RANDOM_SECRET"

# API Keys
RESEND_API_KEY="YOUR_RESEND_API_KEY"

# Google OAuth - Depuis Google Cloud Console
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"

# Google Gemini - Depuis Google AI Studio
GOOGLE_GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# YouTube API
YOUTUBE_API_KEY="YOUR_YOUTUBE_API_KEY"

# TikTok OAuth - Depuis TikTok Developer Portal
TIKTOK_CLIENT_KEY="YOUR_TIKTOK_CLIENT_KEY"
TIKTOK_CLIENT_SECRET="YOUR_TIKTOK_CLIENT_SECRET"
TIKTOK_REDIRECT_URI="https://vidova.me/api/tiktok/callback"

# Server
PORT=8003
ENVIRONMENT="production"
EOF
        echo "✅ Fichier .env créé"
    fi
else
    echo "✅ .env existe déjà"
    echo "⚠️  Pour modifier: nano .env"
fi

# Étape 10: Test du backend
echo "🧪 Étape 10: Test du backend..."
timeout 10 python3 main.py &
BACKEND_PID=$!
sleep 5

if curl -s http://localhost:8003/health > /dev/null 2>&1; then
    echo "✅ Backend démarré avec succès!"
    kill $BACKEND_PID 2>/dev/null || true
else
    echo "⚠️ Backend ne répond pas (normal si Prisma n'est pas généré)"
    kill $BACKEND_PID 2>/dev/null || true
fi

# Étape 11: Créer le service systemd
echo "🔧 Étape 11: Création du service systemd..."
sudo tee /etc/systemd/system/vidova-backend.service > /dev/null << EOF
[Unit]
Description=Vidova Backend API
After=network.target

[Service]
User=$USER
WorkingDirectory=$BACKEND_DIR/backend
Environment="PATH=$VENV_DIR/bin:/usr/local/bin:/usr/bin:/bin"
ExecStart=$VENV_DIR/bin/python3 main.py
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Étape 12: Activer et démarrer le service
echo "🚀 Étape 12: Activation du service systemd..."
sudo systemctl daemon-reload
sudo systemctl enable vidova-backend
sudo systemctl restart vidova-backend

# Vérifier le statut
sleep 3
if sudo systemctl is-active --quiet vidova-backend; then
    echo "✅ Service vidova-backend est actif"
else
    echo "❌ Service vidova-backend n'est pas actif"
    echo "📋 Affichage des logs:"
    sudo journalctl -u vidova-backend -n 50 --no-pager
fi

# Étape 13: Configurer Nginx
echo "🌐 Étape 13: Configuration de Nginx..."
sudo tee /etc/nginx/sites-available/api.vidova.me > /dev/null << 'EOF'
server {
    listen 80;
    server_name api.vidova.me;

    location / {
        proxy_pass http://127.0.0.1:8003;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    access_log /var/log/nginx/api.vidova.me_access.log;
    error_log /var/log/nginx/api.vidova.me_error.log;
}
EOF

# Activer le site
sudo ln -sf /etc/nginx/sites-available/api.vidova.me /etc/nginx/sites-enabled/

# Tester la configuration Nginx
if sudo nginx -t > /dev/null 2>&1; then
    echo "✅ Configuration Nginx valide"
    sudo systemctl reload nginx
else
    echo "❌ Erreur dans la configuration Nginx"
    sudo nginx -t
fi

# Étape 14: Tests finaux
echo "🧪 Étape 14: Tests finaux..."
sleep 2

echo "Test http://localhost:8003/health..."
if curl -s http://localhost:8003/health | grep -q "healthy"; then
    echo "✅ Backend répond correctement en local"
else
    echo "⚠️ Backend ne répond pas correctement"
fi

echo ""
echo "=========================================="
echo "🎉 Déploiement terminé!"
echo "=========================================="
echo ""
echo "📡 Vérifiez:"
echo "  - http://api.vidova.me/health"
echo "  - http://api.vidova.me/docs"
echo ""
echo "📋 Logs:"
echo "  - sudo journalctl -u vidova-backend -f"
echo "  - sudo tail -f /var/log/nginx/api.vidova.me_access.log"
echo ""
echo "🔧 Maintenance:"
echo "  - Redémarrer: sudo systemctl restart vidova-backend"
echo "  - Statut: sudo systemctl status vidova-backend"
echo "  - Éditer .env: nano $BACKEND_DIR/backend/.env"
echo ""
echo "⚠️ IMPORTANT: Si le service ne démarre pas, vérifier:"
echo "  1. Prisma client généré: cd $BACKEND_DIR/backend && npx prisma generate"
echo "  2. Logs: sudo journalctl -u vidova-backend -n 100"
echo ""
