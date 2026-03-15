"""Shared database client for the application."""

from prisma import Prisma
from fastapi import HTTPException

# Shared Prisma client (set by main.py at startup)
_prisma_client: Prisma = None


def set_prisma_client(client: Prisma):
    """Set the shared Prisma client. Called once at startup from main.py."""
    global _prisma_client
    _prisma_client = client


def get_prisma_client() -> Prisma:
    """Get the shared Prisma client. Raises if not initialized."""
    if _prisma_client is None:
        raise HTTPException(status_code=500, detail="Database not connected")
    return _prisma_client
