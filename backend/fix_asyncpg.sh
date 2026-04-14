#!/bin/bash
# Script de correction pour le problème asyncpg sur Ubuntu

echo "🔧 Correction du problème asyncpg..."

# Installation des dépendances de compilation
echo "📦 Installation des outils de compilation..."
sudo apt update
sudo apt install -y build-essential python3-dev libpq-dev

# Activation de l'environnement virtuel
cd /var/www/backend/backend
source venv/bin/activate

# Installation de asyncpg avec les bonnes options
echo "📦 Installation de asyncpg..."
pip install --no-cache-dir asyncpg==0.29.0

# Installation du reste des dépendances
echo "📦 Installation des autres dépendances..."
pip install -r requirements.txt
pip install PyJWT

echo "✅ Installation terminée!"

# Test rapide
echo "🧪 Test de l'import asyncpg..."
python3 -c "import asyncpg; print('✅ asyncpg importé avec succès')"

echo ""
echo "🎉 Correction terminée!"
echo ""
echo "Prochaines étapes:"
echo "  1. npx prisma@5.4.2 generate"
echo "  2. python3 main.py (test)"
echo "  3. sudo systemctl restart vidova-backend"
