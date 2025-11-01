"""Usage tracking and limits routes."""

from fastapi import APIRouter, Depends, HTTPException
from fastapi import status as http_status
from prisma import Prisma
from ..auth import get_current_user
from ..services import usage_service

router = APIRouter(prefix="/usage", tags=["usage"])


@router.get("/current")
async def get_current_usage(current_user = Depends(get_current_user)):
    """Get current user's usage for this month."""
    prisma = Prisma()
    await prisma.connect()

    try:
        usage_info = await usage_service.get_usage_stats(current_user.id, prisma)

        return {
            "success": True,
            "usage": usage_info
        }

    except Exception as e:
        raise HTTPException(
            status_code=http_status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch usage: {str(e)}"
        )
    finally:
        await prisma.disconnect()


@router.get("/can-process")
async def can_process_video(current_user = Depends(get_current_user)):
    """Check if user can process a new video."""
    prisma = Prisma()
    await prisma.connect()

    try:
        can_process, error_message = await usage_service.check_can_process_video(
            current_user.id,
            prisma
        )

        if not can_process:
            return {
                "success": False,
                "canProcess": False,
                "message": error_message
            }

        usage_info = await usage_service.get_user_usage(current_user.id, prisma)

        return {
            "success": True,
            "canProcess": True,
            "usage": usage_info
        }

    except Exception as e:
        raise HTTPException(
            status_code=http_status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to check usage: {str(e)}"
        )
    finally:
        await prisma.disconnect()
