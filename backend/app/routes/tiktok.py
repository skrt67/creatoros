from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer
from fastapi.security.http import HTTPAuthorizationCredentials
import httpx
import os
import jwt
from datetime import datetime
from app.routes.progress import prisma_client

security = HTTPBearer()
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from JWT token"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"id": user_id, "email": payload.get("email")}
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Unauthorized")

router = APIRouter(prefix="/tiktok", tags=["tiktok"])

TIKTOK_CLIENT_KEY = os.getenv("TIKTOK_CLIENT_KEY", "awczkmz8uuquhy73")
TIKTOK_CLIENT_SECRET = os.getenv("TIKTOK_CLIENT_SECRET", "5IONt6wOrUIIaPluZ7zNjx8uZglw1XC2")
TIKTOK_REDIRECT_URI = os.getenv("TIKTOK_REDIRECT_URI", "https://creatoros-henna.vercel.app/api/tiktok/callback")


@router.post("/callback")
async def tiktok_callback(
    data: dict,
    current_user: dict = Depends(get_current_user)
):
    """
    Handle TikTok OAuth callback
    """
    try:
        code = data.get("code")
        if not code:
            raise HTTPException(status_code=400, detail="No authorization code provided")

        # Exchange code for access token
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://open.tiktokapis.com/v1/oauth/token/",
                data={
                    "client_key": TIKTOK_CLIENT_KEY,
                    "client_secret": TIKTOK_CLIENT_SECRET,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": TIKTOK_REDIRECT_URI,
                },
            )

            if token_response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to exchange code for token")

            token_data = token_response.json()
            access_token = token_data.get("access_token")
            refresh_token = token_data.get("refresh_token")

            if not access_token:
                raise HTTPException(status_code=400, detail="No access token in response")

            # Get user info from TikTok
            user_response = await client.get(
                "https://open.tiktokapis.com/v1/user/info/",
                headers={"Authorization": f"Bearer {access_token}"},
                params={"fields": "open_id,display_name,avatar_url,follower_count,video_count,like_count"},
            )

            if user_response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to get user info from TikTok")

            user_info = user_response.json().get("data", {}).get("user", {})
            tiktok_user_id = user_info.get("open_id")
            username = user_info.get("display_name", "Unknown")

            if not tiktok_user_id:
                raise HTTPException(status_code=400, detail="No TikTok user ID in response")

            # Save or update TikTok account
            tiktok_account = await prisma_client.tiktokaccount.upsert(
                where={"userId": current_user["id"]},
                data={
                    "create": {
                        "userId": current_user["id"],
                        "tiktokUserId": tiktok_user_id,
                        "username": username,
                        "accessToken": access_token,
                        "refreshToken": refresh_token or "",
                        "followers": user_info.get("follower_count", 0),
                        "videoCount": user_info.get("video_count", 0),
                        "totalLikes": user_info.get("like_count", 0),
                        "totalViews": 0,
                        "lastSyncedAt": datetime.utcnow(),
                    },
                    "update": {
                        "accessToken": access_token,
                        "refreshToken": refresh_token or "",
                        "followers": user_info.get("follower_count", 0),
                        "videoCount": user_info.get("video_count", 0),
                        "totalLikes": user_info.get("like_count", 0),
                        "lastSyncedAt": datetime.utcnow(),
                    },
                },
            )

            return {
                "followers": tiktok_account.followers,
                "videoCount": tiktok_account.videoCount,
                "totalLikes": tiktok_account.totalLikes,
                "totalViews": tiktok_account.totalViews,
                "username": tiktok_account.username,
                "lastSyncedAt": tiktok_account.lastSyncedAt,
            }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in TikTok callback: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/stats")
async def get_tiktok_stats(current_user: dict = Depends(get_current_user)):
    """
    Get TikTok stats for current user
    """
    try:
        tiktok_account = await prisma_client.tiktokaccount.find_unique(
            where={"userId": current_user["id"]}
        )

        if not tiktok_account:
            raise HTTPException(status_code=404, detail="TikTok account not connected")

        return {
            "followers": tiktok_account.followers,
            "videoCount": tiktok_account.videoCount,
            "totalLikes": tiktok_account.totalLikes,
            "totalViews": tiktok_account.totalViews,
            "username": tiktok_account.username,
            "lastSyncedAt": tiktok_account.lastSyncedAt,
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting TikTok stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/sync")
async def sync_tiktok_stats(current_user: dict = Depends(get_current_user)):
    """
    Sync TikTok stats from API
    """
    try:
        tiktok_account = await prisma_client.tiktokaccount.find_unique(
            where={"userId": current_user["id"]}
        )

        if not tiktok_account:
            raise HTTPException(status_code=404, detail="TikTok account not connected")

        # Refresh access token if needed
        access_token = tiktok_account.accessToken

        # Get updated user info from TikTok
        async with httpx.AsyncClient() as client:
            user_response = await client.get(
                "https://open.tiktokapis.com/v1/user/info/",
                headers={"Authorization": f"Bearer {access_token}"},
                params={"fields": "open_id,display_name,avatar_url,follower_count,video_count,like_count"},
            )

            if user_response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to sync stats from TikTok")

            user_info = user_response.json().get("data", {}).get("user", {})

            # Get videos to calculate total views
            videos_response = await client.get(
                "https://open.tiktokapis.com/v1/video/list/",
                headers={"Authorization": f"Bearer {access_token}"},
                params={"fields": "id,view_count,like_count,comment_count,share_count"},
            )

            total_views = 0
            if videos_response.status_code == 200:
                videos = videos_response.json().get("data", {}).get("videos", [])
                total_views = sum(video.get("view_count", 0) for video in videos)

            # Update TikTok account
            updated_account = await prisma_client.tiktokaccount.update(
                where={"userId": current_user["id"]},
                data={
                    "followers": user_info.get("follower_count", tiktok_account.followers),
                    "videoCount": user_info.get("video_count", tiktok_account.videoCount),
                    "totalLikes": user_info.get("like_count", tiktok_account.totalLikes),
                    "totalViews": total_views,
                    "lastSyncedAt": datetime.utcnow(),
                },
            )

            return {
                "followers": updated_account.followers,
                "videoCount": updated_account.videoCount,
                "totalLikes": updated_account.totalLikes,
                "totalViews": updated_account.totalViews,
                "username": updated_account.username,
                "lastSyncedAt": updated_account.lastSyncedAt,
            }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error syncing TikTok stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
