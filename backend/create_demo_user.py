"""
Script pour créer l'utilisateur demo
"""

import asyncio
from prisma import Prisma
from passlib.context import CryptContext

# Utiliser le même contexte que l'application
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def main():
    db = Prisma()
    await db.connect()
    
    # Supprimer les anciens utilisateurs si présents (les 2 variantes)
    for email in ['demo@creatorOS.com', 'demo@creatoros.com']:
        existing_user = await db.user.find_unique(
            where={'email': email}
        )
        
        if existing_user:
            print(f"🗑️  Suppression de l'ancien utilisateur: {email}")
            
            # Supprimer les workspaces associés
            await db.workspace.delete_many(
                where={'ownerId': existing_user.id}
            )
            
            # Supprimer l'utilisateur
            await db.user.delete(
                where={'id': existing_user.id}
            )
            print("✅ Ancien utilisateur supprimé")
    
    print("📝 Création du nouvel utilisateur demo...")
    
    # Hasher le mot de passe avec passlib (comme l'app)
    password = 'demo123456'
    hashed_password = pwd_context.hash(password)
    
    # Créer l'utilisateur avec le bon email (minuscules)
    user = await db.user.create(
        data={
            'email': 'demo@creatoros.com',
            'hashedPassword': hashed_password
        }
    )
    
    print(f"✅ Utilisateur créé: {user.email}")
    
    # Créer un workspace
    workspace = await db.workspace.create(
        data={
            'name': 'Demo Workspace',
            'ownerId': user.id
        }
    )
    
    print(f"✅ Workspace créé: {workspace.name}")
    
    await db.disconnect()
    print("\n🎉 Configuration terminée!")

if __name__ == "__main__":
    asyncio.run(main())
