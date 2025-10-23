"""Main FastAPI application entry point."""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from temporalio.client import Client
from prisma import Prisma
import uvicorn

from app.routes.auth import router as auth_router
from app.routes.workspaces import router as workspaces_router
from app.routes.videos import router as videos_router
from app.routes.jobs import router as jobs_router
from app.routes.billing import router as billing_router
from app.routes.processing import router as processing_router
from app.routes.progress import router as progress_router, set_prisma_client
from app.routes.videos import set_temporal_client

# Global variables
prisma_client: Prisma = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    global temporal_client, prisma_client
    
    # Startup
    print("🚀 Starting CreatorOS Backend...")
    
    # Initialize Prisma
    prisma_client = Prisma()
    await prisma_client.connect()
    set_prisma_client(prisma_client)
    print("✅ Database connected")
    
    # Créer l'utilisateur demo s'il n'existe pas
    try:
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
        demo_user = await prisma_client.user.find_unique(
            where={'email': 'demo@creatoros.com'}
        )
        
        if not demo_user:
            print("📝 Création de l'utilisateur demo...")
            hashed_password = pwd_context.hash('demo123456')
            demo_user = await prisma_client.user.create(
                data={
                    'email': 'demo@creatoros.com',
                    'hashedPassword': hashed_password
                }
            )
            
            # Créer workspace
            await prisma_client.workspace.create(
                data={
                    'name': 'Demo Workspace',
                    'ownerId': demo_user.id
                }
            )
            print("✅ Utilisateur demo créé automatiquement")
        else:
            print("✅ Utilisateur demo déjà présent")
    except Exception as e:
        print(f"⚠️ Erreur création utilisateur demo: {e}")
    
    # Initialize Temporal client
    temporal_server_url = os.getenv("TEMPORAL_SERVER_URL", "localhost:7233")
    try:
        temporal_client = await Client.connect(temporal_server_url)
        set_temporal_client(temporal_client)
        print(f"✅ Temporal client connected to {temporal_server_url}")
    except Exception as e:
        print(f"⚠️  Temporal client connection failed: {e}")
        print("   Continuing without Temporal (development mode)")
    
    print("🎉 CreatorOS Backend started successfully!")
    
    yield
    
    # shutdown
    print("🛑 Shutting down CreatorOS Backend...")
    if 'temporal_client' in globals() and temporal_client:
        await temporal_client.close()
        print("✅ Temporal client disconnected")
    
    if prisma_client:
        await prisma_client.disconnect()
        print("✅ Database disconnected")
    
    print("👋 CreatorOS Backend shutdown complete")

# Create FastAPI app
app = FastAPI(
    title="CreatorOS API",
    description="AI-powered content creation platform for video creators",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permet toutes les origines en développement
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail,
            "error_code": exc.status_code
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """General exception handler."""
    print(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal server error",
            "error_code": 500
        }
    )

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "CreatorOS API",
        "version": "1.0.0",
        "temporal_connected": 'temporal_client' in globals() and temporal_client is not None,
        "database_connected": prisma_client is not None
    }

# Include routers
app.include_router(auth_router)
app.include_router(workspaces_router)
app.include_router(videos_router)
app.include_router(jobs_router)
app.include_router(billing_router)
app.include_router(processing_router)
app.include_router(progress_router)
# app.include_router(integrations_router)  # Disabled for now

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to CreatorOS API",
        "version": "1.0.0",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    print(f"🚀 Starting CreatorOS API on port {port}...")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
