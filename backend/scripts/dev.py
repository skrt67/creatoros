#!/usr/bin/env python3
"""
Development helper script for Vidova.
Provides utilities for development and testing.
"""

import asyncio
import os
import sys
import subprocess
from pathlib import Path

# Add the parent directory to the path
sys.path.append(str(Path(__file__).parent.parent))

from prisma import Prisma


async def reset_database():
    """Reset the database by clearing all data."""
    print("🗑️  Resetting database...")
    
    prisma = Prisma()
    await prisma.connect()
    
    try:
        # Delete all data in reverse dependency order
        await prisma.contentasset.delete_many()
        await prisma.transcript.delete_many()
        await prisma.processingjob.delete_many()
        await prisma.videosource.delete_many()
        await prisma.subscription.delete_many()
        await prisma.workspace.delete_many()
        await prisma.user.delete_many()
        
        print("✅ Database reset complete")
        
    except Exception as e:
        print(f"❌ Error resetting database: {e}")
        raise
    finally:
        await prisma.disconnect()


async def seed_test_data():
    """Seed the database with test data."""
    print("🌱 Seeding test data...")
    
    from app.auth import get_password_hash
    
    prisma = Prisma()
    await prisma.connect()
    
    try:
        # Create test users
        users_data = [
            {
                "email": "alice@example.com",
                "hashedPassword": get_password_hash("password123")
            },
            {
                "email": "bob@example.com", 
                "hashedPassword": get_password_hash("password123")
            }
        ]
        
        users = []
        for user_data in users_data:
            user = await prisma.user.create(data=user_data)
            users.append(user)
        
        # Create test workspaces
        workspaces = []
        for i, user in enumerate(users):
            workspace = await prisma.workspace.create(
                data={
                    "name": f"Test Workspace {i+1}",
                    "ownerId": user.id
                }
            )
            workspaces.append(workspace)
        
        # Create test video sources
        test_videos = [
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "https://www.youtube.com/watch?v=jNQXAC9IVRw"
        ]
        
        for i, (workspace, video_url) in enumerate(zip(workspaces, test_videos)):
            await prisma.videosource.create(
                data={
                    "youtubeUrl": video_url,
                    "title": f"Test Video {i+1}",
                    "status": "PENDING",
                    "workspaceId": workspace.id
                }
            )
        
        print("✅ Test data seeded successfully")
        print("   Test users: alice@example.com, bob@example.com")
        print("   Password: password123")
        
    except Exception as e:
        print(f"❌ Error seeding test data: {e}")
        raise
    finally:
        await prisma.disconnect()


def start_services():
    """Start all development services."""
    print("🚀 Starting development services...")
    
    # Check if Temporal is running
    try:
        subprocess.run(["temporal", "workflow", "list"], 
                      capture_output=True, check=True)
        print("✅ Temporal server is running")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Temporal server not running. Please start it with:")
        print("   temporal server start-dev")
        return
    
    # Start the API server and worker in parallel
    print("🔧 Starting API server and worker...")
    
    try:
        # Start API server
        api_process = subprocess.Popen([
            sys.executable, "main.py"
        ], cwd=Path(__file__).parent.parent)
        
        # Start worker
        worker_process = subprocess.Popen([
            sys.executable, "worker.py"
        ], cwd=Path(__file__).parent.parent)
        
        print("✅ Services started!")
        print("   API: http://localhost:8000")
        print("   Docs: http://localhost:8000/docs")
        print("   Temporal UI: http://localhost:8233")
        print("\nPress Ctrl+C to stop all services")
        
        # Wait for processes
        try:
            api_process.wait()
            worker_process.wait()
        except KeyboardInterrupt:
            print("\n🛑 Stopping services...")
            api_process.terminate()
            worker_process.terminate()
            api_process.wait()
            worker_process.wait()
            print("✅ Services stopped")
            
    except Exception as e:
        print(f"❌ Error starting services: {e}")


def generate_prisma():
    """Generate Prisma client."""
    print("🔧 Generating Prisma client...")
    
    try:
        subprocess.run([
            "prisma", "generate"
        ], cwd=Path(__file__).parent.parent, check=True)
        print("✅ Prisma client generated")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error generating Prisma client: {e}")


def push_schema():
    """Push Prisma schema to database."""
    print("📤 Pushing schema to database...")
    
    try:
        subprocess.run([
            "prisma", "db", "push"
        ], cwd=Path(__file__).parent.parent, check=True)
        print("✅ Schema pushed to database")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error pushing schema: {e}")


async def main():
    """Main development helper."""
    if len(sys.argv) < 2:
        print("🛠️  Vidova Development Helper")
        print("Usage: python dev.py <command>")
        print("\nCommands:")
        print("  reset-db     - Reset database (clear all data)")
        print("  seed-data    - Seed database with test data")
        print("  start        - Start all development services")
        print("  generate     - Generate Prisma client")
        print("  push-schema  - Push Prisma schema to database")
        print("  full-reset   - Reset DB, generate client, push schema, and seed data")
        return
    
    command = sys.argv[1]
    
    if command == "reset-db":
        await reset_database()
    elif command == "seed-data":
        await seed_test_data()
    elif command == "start":
        start_services()
    elif command == "generate":
        generate_prisma()
    elif command == "push-schema":
        push_schema()
    elif command == "full-reset":
        await reset_database()
        generate_prisma()
        push_schema()
        await seed_test_data()
        print("🎉 Full reset complete!")
    else:
        print(f"❌ Unknown command: {command}")


if __name__ == "__main__":
    asyncio.run(main())
