from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from app.routes.auth import get_current_active_user
from ..database import get_prisma_client

router = APIRouter(prefix="/preferences", tags=["preferences"])

class ContentPreferencesRequest(BaseModel):
    writing_style: Optional[str] = None
    content_length: Optional[str] = None
    tone: Optional[str] = None

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
    prisma = get_prisma_client()

    # Get or create preferences
    preferences = await prisma.contentpreferences.find_unique(
        where={"userId": current_user.id}
    )

    if not preferences:
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

@router.put("/content", response_model=ContentPreferencesResponse)
async def update_content_preferences(
    prefs: ContentPreferencesRequest,
    current_user = Depends(get_current_active_user)
):
    """Update user's content generation preferences."""
    prisma = get_prisma_client()

    update_data = {}
    if prefs.writing_style:
        update_data["writingStyle"] = prefs.writing_style
    if prefs.content_length:
        update_data["contentLength"] = prefs.content_length
    if prefs.tone:
        update_data["tone"] = prefs.tone

    existing = await prisma.contentpreferences.find_unique(
        where={"userId": current_user.id}
    )

    if existing:
        preferences = await prisma.contentpreferences.update(
            where={"userId": current_user.id},
            data=update_data
        )
    else:
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
