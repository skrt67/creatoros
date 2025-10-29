"""Main FastAPI application entry point."""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
# from temporalio.client import Client
from prisma import Prisma
import uvicorn

from app.routes.auth import router as auth_router
from app.routes.workspaces import router as workspaces_router
from app.routes.videos import router as videos_router
from app.routes.jobs import router as jobs_router
from app.routes.billing import router as billing_router
from app.routes.processing import router as processing_router
from app.routes.progress import router as progress_router, set_prisma_client
from app.routes.simple_processing import router as simple_processing_router
from app.routes.password_reset import router as password_reset_router

# Global variables
prisma_client: Prisma = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    global prisma_client
    
    # Startup
    print("🚀 Starting Vidova Backend...")
    
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
    
    # Temporal disabled - videos will be processed asynchronously without Temporal
    print("⚠️  Temporal disabled - videos will process asynchronously")
    
    print("🎉 Vidova Backend started successfully!")
    
    yield
    
    # shutdown
    print("🛑 Shutting down Vidova Backend...")
    
    if prisma_client:
        await prisma_client.disconnect()
        print("✅ Database disconnected")
    
    print("👋 Vidova Backend shutdown complete")

# Create FastAPI app
app = FastAPI(
    title="Vidova API",
    description="AI-powered content creation platform for video creators",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS middleware - Liste explicite des origines autorisées
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://creatoros-henna.vercel.app",
    "https://creatoros.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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
        "service": "Vidova API",
        "version": "1.0.0",
        "temporal_connected": False,
        "database_connected": prisma_client is not None
    }

# Include routers
app.include_router(auth_router)
app.include_router(password_reset_router)
app.include_router(workspaces_router)
app.include_router(videos_router)
app.include_router(jobs_router)
app.include_router(billing_router)
app.include_router(processing_router)
app.include_router(progress_router)
app.include_router(simple_processing_router)
# app.include_router(integrations_router)  # Disabled for now

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to Vidova API",
        "version": "1.0.0",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8003))
    print(f"🚀 Starting Vidova API on port {port}...")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
