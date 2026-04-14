"""
Workaround pour Prisma Python - Utilise asyncpg directement pour Supabase
"""
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

class PrismaWorkaround:
    """Client de base de données qui émule Prisma pour le développement"""
    
    def __init__(self):
        self.pool = None
        self.conn = None
    
    async def connect(self):
        """Connecter à la base de données Supabase"""
        try:
            self.pool = await asyncpg.create_pool(DATABASE_URL)
            self.conn = await self.pool.acquire()
            print("✅ Connected to Supabase via asyncpg")
        except Exception as e:
            print(f"❌ Failed to connect to database: {e}")
            raise
    
    async def disconnect(self):
        """Déconnecter de la base de données"""
        if self.pool:
            await self.pool.close()
            print("✅ Disconnected from database")
    
    async def query(self, sql: str, *args):
        """Exécuter une requête SELECT"""
        try:
            return await self.conn.fetch(sql, *args)
        except Exception as e:
            print(f"❌ Query failed: {e}")
            raise
    
    async def execute(self, sql: str, *args):
        """Exécuter une requête (INSERT, UPDATE, DELETE)"""
        try:
            return await self.conn.execute(sql, *args)
        except Exception as e:
            print(f"❌ Execute failed: {e}")
            raise

# Instance globale
prisma_workaround = PrismaWorkaround()
