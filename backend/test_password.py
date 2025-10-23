"""
Test du password hash
"""

import asyncio
from prisma import Prisma
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def main():
    db = Prisma()
    await db.connect()
    
    # Récupérer l'utilisateur
    user = await db.user.find_unique(
        where={'email': 'demo@creatorOS.com'}
    )
    
    if user:
        print(f"✅ Utilisateur trouvé: {user.email}")
        print(f"📝 Hash stocké: {user.hashedPassword[:50]}...")
        
        # Tester le password
        password = 'demo123456'
        is_valid = pwd_context.verify(password, user.hashedPassword)
        
        print(f"\n🔐 Test password: {password}")
        print(f"✅ Validation: {is_valid}")
        
        if not is_valid:
            print("\n❌ Le mot de passe ne correspond pas!")
            print("🔄 Mise à jour du hash...")
            
            new_hash = pwd_context.hash(password)
            await db.user.update(
                where={'id': user.id},
                data={'hashedPassword': new_hash}
            )
            print("✅ Hash mis à jour!")
    else:
        print("❌ Utilisateur non trouvé")
    
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
