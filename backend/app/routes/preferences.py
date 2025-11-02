from fastapi import APIRouter, Depends, HTTPException, status
from prisma import Prisma
from pydantic import BaseModel
from typing import Optional
from app.routes.auth import get_current_active_user

router = APIRouter(prefix="/preferences", tags=["preferences"])

class ContentPreferencesRequest(BaseModel):
    writing_style: Optional[str] = None  # FORMAL, CASUAL, BALANCED, PROFESSIONAL, CREATIVE
    content_length: Optional[str] = None  # SHORT, MEDIUM, LONG
    tone: Optional[str] = None  # FRIENDLY, PROFESSIONAL, INSPIRATIONAL, HUMOROUS, SERIOUS

class ContentPreferencesResponse(BaseModel):
    id: str
    writing_style: str
    content_length: str
    tone: str

@router.get("/content", response_model=ContentPreferencesResponse)
async def get_content_preferences(
    current_user = Depends(get_current_active_user)
):
    """Get user's content generation preferences."""
    prisma = Prisma()
    await prisma.connect()

    try:
        # Get or create preferences
        preferences = await prisma.contentpreferences.find_unique(
            where={"userId": current_user.id}
        )

        if not preferences:
            # Create default preferences
            preferences = await prisma.contentpreferences.create(
                data={
                    "userId": current_user.id,
                    "writingStyle": "BALANCED",
                    "contentLength": "MEDIUM",
                    "tone": "FRIENDLY"
                }
            )

        return ContentPreferencesResponse(
            id=preferences.id,
            writing_style=preferences.writingStyle,
            content_length=preferences.contentLength,
            tone=preferences.tone
        )

    finally:
        await prisma.disconnect()

@router.put("/content", response_model=ContentPreferencesResponse)
async def update_content_preferences(
    prefs: ContentPreferencesRequest,
    current_user = Depends(get_current_active_user)
):
    """Update user's content generation preferences."""
    prisma = Prisma()
    await prisma.connect()

    try:
        # Build update data
        update_data = {}
        if prefs.writing_style:
            update_data["writingStyle"] = prefs.writing_style
        if prefs.content_length:
            update_data["contentLength"] = prefs.content_length
        if prefs.tone:
            update_data["tone"] = prefs.tone

        # Get or create preferences
        existing = await prisma.contentpreferences.find_unique(
            where={"userId": current_user.id}
        )

        if existing:
            # Update existing
            preferences = await prisma.contentpreferences.update(
                where={"userId": current_user.id},
                data=update_data
            )
        else:
            # Create new with defaults and updates
            preferences = await prisma.contentpreferences.create(
                data={
                    "userId": current_user.id,
                    "writingStyle": update_data.get("writingStyle", "BALANCED"),
                    "contentLength": update_data.get("contentLength", "MEDIUM"),
                    "tone": update_data.get("tone", "FRIENDLY")
                }
            )

        return ContentPreferencesResponse(
            id=preferences.id,
            writing_style=preferences.writingStyle,
            content_length=preferences.contentLength,
            tone=preferences.tone
        )

    finally:
        await prisma.disconnect()
