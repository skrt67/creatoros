"""Dashboard statistics routes."""

import os
from fastapi import APIRouter, Request
from prisma import Prisma

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/dashboard")
async def get_dashboard_stats(request: Request):
    """
    Get general dashboard stats for current user
    """
    prisma = Prisma()
    await prisma.connect()

    try:
        # Get token from Authorization header
        auth_header = request.headers.get("authorization", "")
        if not auth_header.startswith("Bearer "):
            print("No Bearer token provided for dashboard stats")
            return {
                "videosProcessed": 0,
                "videosInProgress": 0,
                "contentGenerated": 0,
            }

        token = auth_header.replace("Bearer ", "")

        try:
            # Decode token manually
            from jose import jwt
            SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            print(f"🔑 Token decoded successfully, payload: {payload}")

            # Try to get user_id from 'sub' field first (it contains user ID)
            user_id = payload.get("sub")
            email = payload.get("email")
            print(f"📧 Email from token: {email}, User ID: {user_id}")

            if not user_id:
                print("❌ Invalid token payload for dashboard stats - no user_id")
                return {
                    "videosProcessed": 0,
                    "videosInProgress": 0,
                    "contentGenerated": 0,
                }

            # Verify user exists
            user = await prisma.user.find_unique(where={"id": user_id})
            print(f"👤 User found: {user.id if user else 'None'}")
            if not user:
                print(f"❌ User not found for id: {user_id}")
                return {
                    "videosProcessed": 0,
                    "videosInProgress": 0,
                    "contentGenerated": 0,
                }

            print(f"✅ User ID for stats: {user_id}")

        except Exception as token_error:
            print(f"Token validation failed for dashboard stats: {token_error}")
            return {
                "videosProcessed": 0,
                "videosInProgress": 0,
                "contentGenerated": 0,
            }

        print(f"Getting dashboard stats for user: {user_id}")

        # Get video sources count (processed videos)
        video_sources_count = await prisma.videosource.count(
            where={"workspace": {"ownerId": user_id}}
        )
        print(f"Video sources count: {video_sources_count}")

        # Get processing jobs count (videos in progress)
        in_progress_count = await prisma.processingjob.count(
            where={
                "videoSource": {"workspace": {"ownerId": user_id}},
                "status": {"not": "COMPLETED"}
            }
        )
        print(f"Videos in progress count: {in_progress_count}")

        # Get content assets count (generated content)
        content_count = await prisma.contentasset.count(
            where={
                "job": {
                    "videoSource": {"workspace": {"ownerId": user_id}}
                }
            }
        )
        print(f"Content generated count: {content_count}")

        result = {
            "videosProcessed": video_sources_count,
            "videosInProgress": in_progress_count,
            "contentGenerated": content_count,
        }
        print(f"Returning dashboard stats: {result}")
        return result

    except Exception as e:
        print(f"Unexpected error in dashboard stats: {str(e)}")
        import traceback
        traceback.print_exc()
        # Return zeros instead of error for better UX
        return {
            "videosProcessed": 0,
            "videosInProgress": 0,
            "contentGenerated": 0,
        }
    finally:
        await prisma.disconnect()
