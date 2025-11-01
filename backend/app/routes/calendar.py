"""Calendar and scheduled posts routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from prisma import Prisma
from datetime import datetime, timedelta
from typing import Optional, List
from pydantic import BaseModel
from ..auth import get_current_user

router = APIRouter(prefix="/calendar", tags=["calendar"])


class SchedulePostRequest(BaseModel):
    contentAssetId: str
    platform: str  # TWITTER, LINKEDIN, INSTAGRAM, TIKTOK, YOUTUBE
    scheduledDate: datetime


class UpdateScheduledPostRequest(BaseModel):
    scheduledDate: Optional[datetime] = None
    status: Optional[str] = None


@router.get("/scheduled-posts")
async def get_scheduled_posts(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    platform: Optional[str] = None,
    status: Optional[str] = None,
    current_user = Depends(get_current_user)
):
    """Get all scheduled posts for current user with optional filters."""
    prisma = Prisma()
    await prisma.connect()

    try:
        user_id = current_user.id

        # Build filter conditions
        where_conditions = {
            "userId": user_id
        }

        if platform:
            where_conditions["platform"] = platform

        if status:
            where_conditions["status"] = status

        if start_date and end_date:
            where_conditions["scheduledDate"] = {
                "gte": datetime.fromisoformat(start_date),
                "lte": datetime.fromisoformat(end_date)
            }

        # Fetch scheduled posts with content asset details
        scheduled_posts = await prisma.scheduledpost.find_many(
            where=where_conditions,
            include={
                "contentAsset": {
                    "include": {
                        "job": {
                            "include": {
                                "videoSource": True
                            }
                        }
                    }
                }
            },
            order={"scheduledDate": "asc"}
        )

        # Format response
        result = []
        for post in scheduled_posts:
            result.append({
                "id": post.id,
                "contentAssetId": post.contentAssetId,
                "platform": post.platform,
                "scheduledDate": post.scheduledDate.isoformat(),
                "status": post.status,
                "publishedAt": post.publishedAt.isoformat() if post.publishedAt else None,
                "errorMessage": post.errorMessage,
                "content": post.contentAsset.content if post.contentAsset else "",
                "videoTitle": post.contentAsset.job.videoSource.title if post.contentAsset and post.contentAsset.job and post.contentAsset.job.videoSource else None,
                "createdAt": post.createdAt.isoformat(),
                "updatedAt": post.updatedAt.isoformat()
            })

        return result

    except Exception as e:
        print(f"Error fetching scheduled posts: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch scheduled posts: {str(e)}"
        )
    finally:
        await prisma.disconnect()


@router.post("/schedule-post")
async def schedule_post(
    request: SchedulePostRequest,
    current_user = Depends(get_current_user)
):
    """Schedule a content asset for publication on a specific platform."""
    prisma = Prisma()
    await prisma.connect()

    try:
        user_id = current_user.id

        # Verify content asset exists and belongs to user
        content_asset = await prisma.contentasset.find_unique(
            where={"id": request.contentAssetId},
            include={
                "job": {
                    "include": {
                        "videoSource": {
                            "include": {
                                "workspace": True
                            }
                        }
                    }
                }
            }
        )

        if not content_asset:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Content asset not found"
            )

        # Verify user owns the workspace
        if content_asset.job.videoSource.workspace.ownerId != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to schedule this content"
            )

        # Validate platform
        valid_platforms = ["TWITTER", "LINKEDIN", "INSTAGRAM", "TIKTOK", "YOUTUBE"]
        if request.platform not in valid_platforms:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid platform. Must be one of: {', '.join(valid_platforms)}"
            )

        # Validate scheduled date is in the future
        if request.scheduledDate <= datetime.now():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Scheduled date must be in the future"
            )

        # Create scheduled post
        scheduled_post = await prisma.scheduledpost.create(
            data={
                "contentAssetId": request.contentAssetId,
                "userId": user_id,
                "platform": request.platform,
                "scheduledDate": request.scheduledDate,
                "status": "SCHEDULED"
            }
        )

        print(f"✅ Post scheduled: {scheduled_post.id} for {request.platform} at {request.scheduledDate}")

        return {
            "id": scheduled_post.id,
            "contentAssetId": scheduled_post.contentAssetId,
            "platform": scheduled_post.platform,
            "scheduledDate": scheduled_post.scheduledDate.isoformat(),
            "status": scheduled_post.status,
            "message": f"Post scheduled for {request.platform} at {request.scheduledDate.strftime('%Y-%m-%d %H:%M')}"
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error scheduling post: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to schedule post: {str(e)}"
        )
    finally:
        await prisma.disconnect()


@router.put("/scheduled-posts/{post_id}")
async def update_scheduled_post(
    post_id: str,
    request: UpdateScheduledPostRequest,
    current_user = Depends(get_current_user)
):
    """Update a scheduled post (reschedule or cancel)."""
    prisma = Prisma()
    await prisma.connect()

    try:
        user_id = current_user.id

        # Verify post exists and belongs to user
        scheduled_post = await prisma.scheduledpost.find_unique(
            where={"id": post_id}
        )

        if not scheduled_post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Scheduled post not found"
            )

        if scheduled_post.userId != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to modify this scheduled post"
            )

        # Prepare update data
        update_data = {}

        if request.scheduledDate:
            if request.scheduledDate <= datetime.now():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Scheduled date must be in the future"
                )
            update_data["scheduledDate"] = request.scheduledDate

        if request.status:
            valid_statuses = ["SCHEDULED", "CANCELLED"]
            if request.status not in valid_statuses:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
                )
            update_data["status"] = request.status

        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No update data provided"
            )

        # Update scheduled post
        updated_post = await prisma.scheduledpost.update(
            where={"id": post_id},
            data=update_data
        )

        print(f"✅ Post updated: {post_id}")

        return {
            "id": updated_post.id,
            "scheduledDate": updated_post.scheduledDate.isoformat(),
            "status": updated_post.status,
            "message": "Scheduled post updated successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating scheduled post: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update scheduled post: {str(e)}"
        )
    finally:
        await prisma.disconnect()


@router.delete("/scheduled-posts/{post_id}")
async def delete_scheduled_post(
    post_id: str,
    current_user = Depends(get_current_user)
):
    """Delete a scheduled post."""
    prisma = Prisma()
    await prisma.connect()

    try:
        user_id = current_user.id

        # Verify post exists and belongs to user
        scheduled_post = await prisma.scheduledpost.find_unique(
            where={"id": post_id}
        )

        if not scheduled_post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Scheduled post not found"
            )

        if scheduled_post.userId != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to delete this scheduled post"
            )

        # Delete scheduled post
        await prisma.scheduledpost.delete(
            where={"id": post_id}
        )

        print(f"✅ Post deleted: {post_id}")

        return {"message": "Scheduled post deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting scheduled post: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete scheduled post: {str(e)}"
        )
    finally:
        await prisma.disconnect()


@router.get("/available-content")
async def get_available_content(
    current_user = Depends(get_current_user)
):
    """Get all generated content assets that can be scheduled."""
    prisma = Prisma()
    await prisma.connect()

    try:
        user_id = current_user.id

        # Fetch all content assets from user's workspaces
        content_assets = await prisma.contentasset.find_many(
            where={
                "job": {
                    "videoSource": {
                        "workspace": {
                            "ownerId": user_id
                        }
                    }
                },
                "status": "GENERATED"
            },
            include={
                "job": {
                    "include": {
                        "videoSource": True
                    }
                },
                "scheduledPosts": True
            },
            order={"createdAt": "desc"}
        )

        # Format response
        result = []
        for asset in content_assets:
            result.append({
                "id": asset.id,
                "type": asset.type,
                "content": asset.content[:200] + "..." if len(asset.content) > 200 else asset.content,
                "videoTitle": asset.job.videoSource.title if asset.job and asset.job.videoSource else "Unknown",
                "videoId": asset.job.videoSourceId if asset.job else None,
                "createdAt": asset.createdAt.isoformat(),
                "scheduledCount": len(asset.scheduledPosts) if asset.scheduledPosts else 0
            })

        return result

    except Exception as e:
        print(f"Error fetching available content: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch available content: {str(e)}"
        )
    finally:
        await prisma.disconnect()
