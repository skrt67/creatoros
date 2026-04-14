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
sudo apt install -y python3 python3-pip python3-venv git curl

# Étape 2: Créer le répertoire
echo "📁 Étape 2: Création du répertoire backend..."
mkdir -p $BACKEND_DIR

# Étape 3: Cloner le repo
echo "📥 Étape 3: Clonage du repository..."
cd $BACKEND_DIR
if [ -d ".git" ]; then
    git pull origin main
else
    git clone $REPO_URL .
fi

# Étape 4: Aller dans le dossier backend
cd $BACKEND_DIR/backend

# Étape 5: Créer l'environnement virtuel
echo "🐍 Étape 5: Création de l'environnement virtuel..."
python3 -m venv venv
source venv/bin/activate

# Étape 6: Installer les dépendances
echo "📚 Étape 6: Installation des dépendances..."
pip install --upgrade pip
pip install -r requirements.txt
pip install PyJWT

# Étape 7: Générer Prisma
echo "🗄️ Étape 7: Génération du client Prisma..."
npm install -g prisma
PATH="$PATH:/Users/altan/Library/Python/3.9/bin" PRISMA_PY_DEBUG_GENERATOR=1 prisma generate

# Étape 8: Créer le fichier .env
echo "⚙️ Étape 8: Configuration des variables d'environnement..."
if [ ! -f ".env" ]; then
    cat > .env << 'EOF'
# Database
DATABASE_URL=postgresql://default:REDACTED@aws-1-eu-west-1.pooler.supabase.com:6543/postgres

# API Keys
RESEND_API_KEY=[VOTRE_RESEND_API_KEY]

# Google OAuth
GOOGLE_CLIENT_ID=[VOTRE_GOOGLE_CLIENT_ID]
GOOGLE_CLIENT_SECRET=[VOTRE_GOOGLE_CLIENT_SECRET]

# JWT
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production

# Server
PORT=8000
EOF
    echo "⚠️ IMPORTANT: Éditer .env avec vos vraies valeurs DATABASE_URL et SECRET_KEY"
    echo "nano .env"
else
    echo "✅ .env existe déjà"
fi

# Étape 9: Test du backend
echo "🧪 Étape 9: Test du backend..."
timeout 10 python3 main.py &
BACKEND_PID=$!
sleep 5

if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend démarré avec succès!"
    kill $BACKEND_PID 2>/dev/null || true
else
    echo "❌ Erreur au démarrage du backend"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Étape 10: Créer le service systemd
echo "🔧 Étape 10: Création du service systemd..."
sudo tee /etc/systemd/system/vidova-backend.service > /dev/null << EOF
[Unit]
Description=Vidova Backend API
After=network.target

[Service]
User=root
WorkingDirectory=$BACKEND_DIR/backend
ExecStart=$VENV_DIR/bin/python3 main.py
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Étape 11: Activer et démarrer le service
echo "🚀 Étape 11: Activation du service systemd..."
sudo systemctl daemon-reload
sudo systemctl enable vidova-backend
sudo systemctl start vidova-backend

# Vérifier le statut
sleep 2
if sudo systemctl is-active --quiet vidova-backend; then
    echo "✅ Service vidova-backend est actif"
else
    echo "❌ Service vidova-backend n'est pas actif"
    sudo systemctl status vidova-backend
    exit 1
fi

# Étape 12: Configurer Nginx
echo "🌐 Étape 12: Configuration de Nginx..."
sudo tee /etc/nginx/sites-available/api.vidova.me > /dev/null << 'EOF'
server {
    listen 80;
    server_name api.vidova.me;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
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
    exit 1
fi

# Étape 13: Tests finaux
echo "🧪 Étape 13: Tests finaux..."
sleep 2

echo "Teste http://localhost:8000/health..."
if curl -s http://localhost:8000/health | grep -q "healthy"; then
    echo "✅ Backend répond correctement"
else
    echo "❌ Backend ne répond pas correctement"
    exit 1
fi

echo ""
echo "=========================================="
echo "🎉 Déploiement terminé avec succès!"
echo "=========================================="
echo ""
echo "📡 Vérifiez:"
echo "  - http://api.vidova.me/health"
echo "  - https://api.vidova.me/health"
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
