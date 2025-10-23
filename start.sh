#!/bin/bash

echo "🚀 Démarrage de CreatorOS..."

# Backend setup
echo "📦 Configuration du backend..."
cd /Users/altan/Desktop/CreatorOS/backend
source venv/bin/activate

# Configuration directe de la base de données
python -c "
import asyncio
import os
os.environ['DATABASE_URL'] = 'postgresql://postgres:postgres@localhost:5432/creatorOS'
os.environ['JWT_SECRET_KEY'] = '40dec992b74feb6d6c434ce557238807'
os.environ['ASSEMBLYAI_API_KEY'] = '27ddd92458e14a408d32bb80b46ebd19'

from prisma import Prisma
from app.auth import get_password_hash

async def setup():
    print('🔧 Setting up CreatorOS database...')
    prisma = Prisma()
    await prisma.connect()
    
    users_count = await prisma.user.count()
    if users_count > 0:
        print('✅ Database already contains data. Skipping setup.')
        await prisma.disconnect()
        return
    
    print('👤 Creating demo user...')
    demo_user = await prisma.user.create(
        data={
            'email': 'demo@creatorOS.com',
            'hashedPassword': get_password_hash('demo123')
        }
    )
    
    print('🏢 Creating demo workspace...')
    demo_workspace = await prisma.workspace.create(
        data={
            'name': 'Demo Workspace',
            'ownerId': demo_user.id
        }
    )
    
    print('✅ Database setup complete!')
    print('   Demo user: demo@creatorOS.com')
    print('   Password: demo123')
    await prisma.disconnect()

asyncio.run(setup())
"

if [ $? -eq 0 ]; then
    echo "✅ Backend configuré avec succès!"
else
    echo "❌ Erreur lors de la configuration du backend"
    exit 1
fi

# Frontend setup
echo "🎨 Configuration du frontend..."
cd /Users/altan/Desktop/CreatorOS/frontend
rm -rf node_modules package-lock.json
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend configuré avec succès!"
    echo "🌐 Démarrage du serveur de développement..."
    npm run dev
else
    echo "❌ Erreur lors de la configuration du frontend"
    exit 1
fi
