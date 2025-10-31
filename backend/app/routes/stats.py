"""Dashboard statistics routes."""

from fastapi import APIRouter, Request

from app.routes.progress import prisma_client

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/dashboard")
async def get_dashboard_stats(request: Request):
    """
    Get general dashboard stats for current user
    """
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
            SECRET_KEY = "your-secret-key-change-in-production"  # Same as in auth.py
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            print(f"🔑 Token decoded successfully, payload: {payload}")
            email = payload.get("sub")
            print(f"📧 Email from token: {email}")

            if not email:
                print("❌ Invalid token payload for dashboard stats - no email")
                return {
                    "videosProcessed": 0,
                    "videosInProgress": 0,
                    "contentGenerated": 0,
                }

            # Get user by email
            user = await prisma_client.user.find_unique(where={"email": email})
            print(f"👤 User found: {user.id if user else 'None'}")
            if not user:
                print(f"❌ User not found for email: {email}")
                return {
                    "videosProcessed": 0,
                    "videosInProgress": 0,
                    "contentGenerated": 0,
                }

            user_id = user.id
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
        video_sources_count = await prisma_client.videosource.count(
            where={"workspace": {"ownerId": user_id}}
        )
        print(f"Video sources count: {video_sources_count}")

        # Get processing jobs count (videos in progress)
        in_progress_count = await prisma_client.processingjob.count(
            where={
                "videoSource": {"workspace": {"ownerId": user_id}},
                "status": {"not": "COMPLETED"}
            }
        )
        print(f"Videos in progress count: {in_progress_count}")

        # Get content assets count (generated content)
        content_count = await prisma_client.contentasset.count(
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
