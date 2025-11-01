"""
Usage Tracking Service
Manages video processing limits and usage tracking
"""
from datetime import datetime
from prisma import Prisma
from typing import Dict, Optional


class UsageLimits:
    """Usage limits for different plans."""
    FREE = 3
    PRO = -1  # Unlimited
    ENTERPRISE = -1  # Unlimited


async def get_current_month() -> str:
    """Get current month in YYYY-MM format."""
    return datetime.now().strftime("%Y-%m")


async def get_user_usage(user_id: str, prisma: Prisma) -> Dict:
    """
    Get user's current usage for the month.
    Returns dict with usage info and limits.
    """
    current_month = await get_current_month()

    # Get or create usage tracking for current month
    usage = await prisma.usagetracking.find_unique(
        where={
            "userId_month": {
                "userId": user_id,
                "month": current_month
            }
        }
    )

    # Get user plan
    user = await prisma.user.find_unique(where={"id": user_id})

    if not user:
        return {
            "error": "User not found",
            "canProcess": False
        }

    # Determine limit based on plan
    plan = user.plan or "FREE"
    if plan == "FREE":
        limit = UsageLimits.FREE
    elif plan in ["PRO", "ENTERPRISE"]:
        limit = UsageLimits.PRO  # Unlimited
    else:
        limit = UsageLimits.FREE

    # Create usage tracking if doesn't exist
    if not usage:
        usage = await prisma.usagetracking.create(
            data={
                "userId": user_id,
                "month": current_month,
                "videosProcessed": 0,
                "limit": limit
            }
        )

    videos_processed = usage.videosProcessed
    videos_remaining = limit - videos_processed if limit > 0 else -1
    can_process = limit == -1 or videos_processed < limit

    return {
        "plan": plan,
        "videosProcessed": videos_processed,
        "limit": limit,
        "videosRemaining": videos_remaining,
        "canProcess": can_process,
        "month": current_month,
        "isUnlimited": limit == -1
    }


async def increment_usage(user_id: str, prisma: Prisma) -> Dict:
    """
    Increment user's video count for the month.
    Returns updated usage info.
    """
    current_month = await get_current_month()

    # Get current usage
    usage_info = await get_user_usage(user_id, prisma)

    if not usage_info["canProcess"]:
        return {
            "success": False,
            "error": "Usage limit reached",
            "usage": usage_info
        }

    # Increment counter
    usage = await prisma.usagetracking.upsert(
        where={
            "userId_month": {
                "userId": user_id,
                "month": current_month
            }
        },
        data={
            "create": {
                "userId": user_id,
                "month": current_month,
                "videosProcessed": 1,
                "limit": usage_info["limit"]
            },
            "update": {
                "videosProcessed": {"increment": 1}
            }
        }
    )

    # Get updated usage info
    updated_usage = await get_user_usage(user_id, prisma)

    return {
        "success": True,
        "usage": updated_usage
    }


async def check_can_process_video(user_id: str, prisma: Prisma) -> tuple[bool, Optional[str]]:
    """
    Check if user can process a video.
    Returns (can_process: bool, error_message: Optional[str])
    """
    usage_info = await get_user_usage(user_id, prisma)

    if usage_info.get("error"):
        return False, usage_info["error"]

    if not usage_info["canProcess"]:
        if usage_info["plan"] == "FREE":
            return False, f"Limite gratuite atteinte ({usage_info['limit']} vidéos/mois). Passez à Pro pour un accès illimité !"
        else:
            return False, "Limite d'usage atteinte pour ce mois"

    return True, None


async def get_usage_stats(user_id: str, prisma: Prisma) -> Dict:
    """
    Get detailed usage statistics for user.
    """
    usage_info = await get_user_usage(user_id, prisma)

    # Get total videos ever processed
    total_videos = await prisma.videosource.count(
        where={
            "workspace": {
                "ownerId": user_id
            }
        }
    )

    return {
        **usage_info,
        "totalVideosAllTime": total_videos
    }
