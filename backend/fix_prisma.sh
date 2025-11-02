#!/bin/bash

# 🔧 Script de correction Prisma pour DigitalOcean + Supabase
# Résout le problème "prisma-client-py: command not found"

set -e

echo "=========================================="
echo "🔧 Correction Prisma Client Python"
echo "=========================================="

# Détection de l'environnement
if [ -d "venv" ]; then
    VENV_PATH="venv"
elif [ -d "../.venv" ]; then
    VENV_PATH="../.venv"
elif [ -d ".venv" ]; then
    VENV_PATH=".venv"
else
    echo "❌ Environnement virtuel non trouvé"
    exit 1
fi

echo "✅ Environnement virtuel trouvé: $VENV_PATH"

# Activer l'environnement virtuel
source $VENV_PATH/bin/activate

# Étape 1: Vérifier Prisma Python
echo ""
echo "📦 Étape 1: Vérification de Prisma..."
if python -c "import prisma" 2>/dev/null; then
    echo "✅ Prisma Python est installé"
    python -c "import prisma; print(f'Version: {prisma.__version__}')"
else
    echo "❌ Prisma Python non installé, installation..."
    pip install prisma
fi

# Étape 2: Installer Node.js si nécessaire
echo ""
echo "📦 Étape 2: Vérification de Node.js..."
if command -v node &> /dev/null; then
    echo "✅ Node.js installé: $(node --version)"
else
    echo "⚠️ Node.js non installé, installation requise:"
    echo "   sudo apt install -y nodejs npm"
    exit 1
fi

# Étape 3: Installer Prisma CLI
echo ""
echo "📦 Étape 3: Installation de Prisma CLI (version 5.4.2)..."
if [ ! -d "node_modules" ]; then
    npm install prisma@5.4.2 @prisma/client@5.4.2
else
    echo "✅ node_modules existe, vérification de la version..."
    npm install prisma@5.4.2 @prisma/client@5.4.2
fi

# Étape 4: Générer le client
echo ""
echo "🗄️ Étape 4: Génération du client Prisma..."

# Essayer plusieurs méthodes
METHOD_SUCCESS=false

# Méthode 1: npx prisma@5.4.2 generate avec PATH
echo "Tentative 1: npx prisma@5.4.2 generate avec PATH..."
export PATH="$VENV_PATH/bin:$PATH"
if npx prisma@5.4.2 generate 2>&1 | tee /tmp/prisma_generate.log; then
    if ! grep -q "command not found\|Error" /tmp/prisma_generate.log; then
        echo "✅ Génération réussie avec npx"
        METHOD_SUCCESS=true
    fi
fi

# Méthode 2: python -m prisma generate
if [ "$METHOD_SUCCESS" = false ]; then
    echo ""
    echo "Tentative 2: python -m prisma generate..."
    if python -m prisma generate 2>&1; then
        echo "✅ Génération réussie avec Python"
        METHOD_SUCCESS=true
    fi
fi

# Méthode 3: Installation de Rust pour compiler
if [ "$METHOD_SUCCESS" = false ]; then
    echo ""
    echo "Tentative 3: Installation de Rust..."
    if ! command -v cargo &> /dev/null; then
        echo "Installation de Rust..."
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
        source "$HOME/.cargo/env"
    fi
    
    echo "Compilation du générateur Prisma..."
    # Note: Cette méthode nécessite le code source du générateur
    echo "⚠️ Compilation depuis les sources non implémentée"
fi

# Vérification finale
echo ""
echo "🔍 Vérification finale..."
if python -c "from prisma import Prisma; print('✅ Client Prisma importable')" 2>/dev/null; then
    echo "✅ Prisma Client généré avec succès!"
    METHOD_SUCCESS=true
else
    echo "❌ Le client Prisma n'est pas accessible"
fi

echo ""
echo "=========================================="
if [ "$METHOD_SUCCESS" = true ]; then
    echo "✅ Correction terminée avec succès!"
    echo ""
    echo "Vous pouvez maintenant lancer:"
    echo "  python main.py"
else
    echo "❌ Correction échouée"
    echo ""
    echo "Solutions alternatives:"
    echo "  1. Migrer vers SQLAlchemy (recommandé)"
    echo "  2. Utiliser Prisma via une image Docker"
    echo "  3. Contacter le support Prisma Python"
fi
echo "=========================================="
