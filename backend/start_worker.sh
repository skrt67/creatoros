#!/bin/bash

echo "╔══════════════════════════════════════════════════════════╗"
echo "║         CreatorOS - Démarrage du Worker                 ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Vérifier si on est dans le bon dossier
if [ ! -f "simple_worker.py" ]; then
    echo "❌ Erreur: Exécutez ce script depuis le dossier backend/"
    exit 1
fi

# Activer l'environnement virtuel si il existe
if [ -d "venv" ]; then
    echo "🔧 Activation de l'environnement virtuel..."
    source venv/bin/activate
else
    echo "⚠️  Pas d'environnement virtuel trouvé"
fi

# Vérifier les dépendances
echo "📦 Vérification des dépendances..."
pip list | grep -q "yt-dlp" || pip install yt-dlp
pip list | grep -q "openai-whisper" || pip install openai-whisper

echo ""
echo "🚀 Démarrage du worker..."
echo ""

# Lancer le worker
python simple_worker_prisma.py
