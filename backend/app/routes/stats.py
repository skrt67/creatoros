"""Dashboard statistics routes."""

from fastapi import APIRouter, Depends
from ..auth import get_current_active_user
from ..database import get_prisma_client

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/dashboard")
async def get_dashboard_stats(current_user = Depends(get_current_active_user)):
    """
    Get general dashboard stats for current user
    """
    prisma = get_prisma_client()

    try:
        user_id = current_user.id

        # Get video sources count (processed videos)
        video_sources_count = await prisma.videosource.count(
            where={"workspace": {"ownerId": user_id}}
        )

        # Get processing jobs count (videos in progress)
        in_progress_count = await prisma.processingjob.count(
            where={
                "videoSource": {"workspace": {"ownerId": user_id}},
                "status": {"not": "COMPLETED"}
            }
        )

        # Get content assets count (generated content)
        content_count = await prisma.contentasset.count(
            where={
                "job": {
                    "videoSource": {"workspace": {"ownerId": user_id}}
                }
            }
        )

        return {
            "videosProcessed": video_sources_count,
            "videosInProgress": in_progress_count,
            "contentGenerated": content_count,
        }

    except Exception as e:
        print(f"Error in dashboard stats: {str(e)}")
        return {
            "videosProcessed": 0,
            "videosInProgress": 0,
            "contentGenerated": 0,
        }
