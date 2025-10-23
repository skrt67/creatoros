#!/usr/bin/env python3
"""
Setup script for CreatorOS backend.
This script helps initialize the database and create initial data.
"""

import asyncio
import os
import sys
from pathlib import Path

# Add the parent directory to the path so we can import our modules
sys.path.append(str(Path(__file__).parent.parent))

from prisma import Prisma
from app.auth import get_password_hash


async def setup_database():
    """Initialize the database with schema and sample data."""
    print("🔧 Setting up CreatorOS database...")
    
    # Connect to database
    prisma = Prisma()
    await prisma.connect()
    
    try:
        # Check if database is already set up
        users_count = await prisma.user.count()
        if users_count > 0:
            print("✅ Database already contains data. Skipping setup.")
            return
        
        # Create demo user
        print("👤 Creating demo user...")
        demo_user = await prisma.user.create(
            data={
                "email": "demo@creatorOS.com",
                "hashedPassword": get_password_hash("demo123456")
            }
        )
        
        # Create demo workspace
        print("🏢 Creating demo workspace...")
        demo_workspace = await prisma.workspace.create(
            data={
                "name": "Demo Workspace",
                "ownerId": demo_user.id
            }
        )
        
        print("✅ Database setup complete!")
        print(f"   Demo user: demo@creatorOS.com")
        print(f"   Password: demo123456")
        print(f"   Workspace: {demo_workspace.name}")
        
    except Exception as e:
        print(f"❌ Error setting up database: {e}")
        raise
    finally:
        await prisma.disconnect()


async def check_environment():
    """Check if all required environment variables are set."""
    print("🔍 Checking environment variables...")
    
    required_vars = [
        "DATABASE_URL",
        "JWT_SECRET_KEY",
        "ASSEMBLYAI_API_KEY"
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\nPlease set these variables in your .env file")
        return False
    
    print("✅ All required environment variables are set")
    return True


async def test_connections():
    """Test connections to external services."""
    print("🔗 Testing connections...")
    
    # Test database connection
    try:
        prisma = Prisma()
        await prisma.connect()
        await prisma.disconnect()
        print("✅ Database connection successful")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False
    
    # Test AssemblyAI connection
    try:
        import assemblyai as aai
        aai.settings.api_key = os.getenv("ASSEMBLYAI_API_KEY")
        # Simple test - this will fail gracefully if API key is invalid
        print("✅ AssemblyAI configuration loaded")
    except Exception as e:
        print(f"❌ AssemblyAI setup failed: {e}")
        return False
    
    return True


async def main():
    """Main setup function."""
    print("🚀 CreatorOS Backend Setup")
    print("=" * 50)
    
    # Check environment
    if not await check_environment():
        sys.exit(1)
    
    # Test connections
    if not await test_connections():
        sys.exit(1)
    
    # Setup database
    await setup_database()
    
    print("\n🎉 Setup complete! You can now start the application:")
    print("   python main.py")
    print("\nAnd in another terminal:")
    print("   python worker.py")


if __name__ == "__main__":
    asyncio.run(main())
