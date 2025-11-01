"""Video processing routes."""

import uuid
import os
import shutil
import asyncio
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from prisma import Prisma

from ..models import (
    VideoSubmit,
    VideoSourceResponse,
    VideoSourceWithJob,
    APIResponse
)
from ..auth import get_current_active_user
from ..services.video_processor import VideoProcessor
from ..services import usage_service

router = APIRouter(tags=["videos"])

@router.post("/workspaces/{workspace_id}/videos", response_model=APIResponse)
async def submit_video_for_processing(
    workspace_id: str,
    video_data: VideoSubmit,
    current_user = Depends(get_current_active_user)
):
    """Submit a YouTube video for processing."""
    prisma = Prisma()
    await prisma.connect()

    try:
        # Check usage limits FIRST
        can_process, error_message = await usage_service.check_can_process_video(
            current_user.id,
            prisma
        )

        if not can_process:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail=error_message
            )

        # Verify workspace ownership
        workspace = await prisma.workspace.find_unique(
            where={"id": workspace_id}
        )

        if not workspace:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workspace not found"
            )

        if workspace.ownerId != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this workspace"
            )
        
        # Create video source record
        video_source = await prisma.videosource.create(
            data={
                "youtubeUrl": video_data.youtube_url,
                "workspaceId": workspace_id,
                "status": "PENDING"
            }
        )
        
        # Create processing job record
        job_id = str(uuid.uuid4())
        workflow_id = f"process-video-{video_source.id}-{job_id}"
        
        processing_job = await prisma.processingjob.create(
            data={
                "id": job_id,
                "temporalWorkflowId": workflow_id,
                "videoSourceId": video_source.id,
                "status": "STARTED"
            }
        )
        
        # Increment usage counter
        usage_result = await usage_service.increment_usage(current_user.id, prisma)
        print(f"✅ Usage incremented: {usage_result['usage']}")

        # Process video asynchronously (without Temporal)
        asyncio.create_task(process_video_async(
            video_source.id,
            video_data.youtube_url,
            job_id,
            workspace_id
        ))

        return APIResponse(
            success=True,
            message="Video submitted for processing",
            data={
                "video_id": video_source.id,
                "job_id": job_id,
                "workflow_id": workflow_id,
                "usage": usage_result['usage']
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit video: {str(e)}"
        )
    finally:
        await prisma.disconnect()

async def process_video_async(video_id: str, youtube_url: str, job_id: str, workspace_id: str):
    """Process video asynchronously without Temporal."""
    try:
        processor = VideoProcessor()
        await processor.process_video(video_id, youtube_url, job_id)
    except Exception as e:
        print(f"Error processing video {video_id}: {str(e)}")

@router.get("/workspaces/{workspace_id}/videos", response_model=List[VideoSourceResponse])
async def list_workspace_videos(
    workspace_id: str,
    current_user = Depends(get_current_active_user)
):
    """List all videos in a workspace."""
    prisma = Prisma()
    await prisma.connect()
    
    try:
        # Verify workspace ownership
        workspace = await prisma.workspace.find_unique(
            where={"id": workspace_id}
        )
        
        if not workspace:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workspace not found"
            )
        
        if workspace.ownerId != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this workspace"
            )
        
        # Get videos
        videos = await prisma.videosource.find_many(
            where={"workspaceId": workspace_id},
            order={"createdAt": "desc"}
        )
        
        return [
            VideoSourceResponse(
                id=video.id,
                youtube_url=video.youtubeUrl,
                title=video.title,
                status=video.status,
                created_at=video.createdAt,
                updated_at=video.updatedAt,
                workspace_id=video.workspaceId
            )
            for video in videos
        ]
        
    finally:
        await prisma.disconnect()

@router.get("/videos/{video_id}", response_model=VideoSourceWithJob)
async def get_video_details(
    video_id: str,
    current_user = Depends(get_current_active_user)
):
    """Get detailed video information including processing status."""
    prisma = Prisma()
    await prisma.connect()
    
    try:
        video = await prisma.videosource.find_unique(
            where={"id": video_id},
            include={
                "workspace": True,
                "processingJob": True
            }
        )
        
        if not video:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Video not found"
            )
        
        # Check workspace ownership
        if video.workspace.ownerId != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this video"
            )
        
        # Build response
        from ..models import ProcessingJobResponse
        
        processing_job = None
        if video.processingJob:
            processing_job = ProcessingJobResponse(
                id=video.processingJob.id,
                temporal_workflow_id=video.processingJob.temporalWorkflowId,
                status=video.processingJob.status,
                created_at=video.processingJob.createdAt,
                updated_at=video.processingJob.updatedAt,
                video_source_id=video.processingJob.videoSourceId
            )
        
        return VideoSourceWithJob(
            id=video.id,
            youtube_url=video.youtubeUrl,
            title=video.title,
            status=video.status,
            created_at=video.createdAt,
            updated_at=video.updatedAt,
            workspace_id=video.workspaceId,
            processing_job=processing_job
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get transcript: {str(e)}"
        )
    finally:
        await prisma.disconnect()

@router.get("/videos/{video_id}/transcript")
async def get_video_transcript(
    video_id: str,
    current_user = Depends(get_current_active_user)
):
    """Get transcript for a specific video."""
    prisma = Prisma()
    await prisma.connect()
    
    try:
        # Get video and check ownership
        video = await prisma.videosource.find_unique(
            where={"id": video_id},
            include={
                "workspace": True,
                "processingJob": {
                    "include": {"transcript": True}
                }
            }
        )
        
        if not video:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Video not found"
            )
        
        # Check ownership
        if video.workspace.ownerId != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        if not video.processingJob or not video.processingJob.transcript:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transcript not found"
            )
        
        transcript = video.processingJob.transcript
        import json
        
        # Parse JSON transcript if it's a string
        transcript_content = transcript.fullTranscript
        if isinstance(transcript_content, str):
            try:
                transcript_content = json.loads(transcript_content)
            except:
                transcript_content = {"text": transcript_content}
        
        return {
            "id": transcript.id,
            "content": transcript_content.get("text", ""),
            "summary": transcript_content.get("summary", None),
            "chapters": transcript_content.get("chapters", [])
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get transcript: {str(e)}"
        )
    finally:
        await prisma.disconnect()

@router.get("/videos/{video_id}/content")
async def get_video_content(
    video_id: str,
    current_user = Depends(get_current_active_user)
):
    """Get generated content for a specific video."""
    prisma = Prisma()
    await prisma.connect()
    
    try:
        # Get video and check ownership
        video = await prisma.videosource.find_unique(
            where={"id": video_id},
            include={
                "workspace": True,
                "processingJob": {
                    "include": {"contentAssets": True}
                }
            }
        )
        
        if not video:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Video not found"
            )
        
        # Check ownership
        if video.workspace.ownerId != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        if not video.processingJob:
            return []
        
        content_assets = []
        for asset in video.processingJob.contentAssets:
            content_assets.append({
                "id": asset.id,
                "type": asset.type,
                "content": asset.content,
                "status": asset.status,
                "createdAt": asset.createdAt.isoformat()
            })
        
        return content_assets
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get content: {str(e)}"
        )
    finally:
        await prisma.disconnect()

@router.delete("/videos/{video_id}", response_model=APIResponse)
async def delete_video(
    video_id: str,
    current_user = Depends(get_current_active_user)
):
    """Delete a video and its associated data."""
    prisma = Prisma()
    await prisma.connect()
    
    try:
        # Get video and check ownership
        video = await prisma.videosource.find_unique(
            where={"id": video_id},
            include={"workspace": True}
        )
        
        if not video:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Video not found"
            )
        
        # Check ownership
        if video.workspace.ownerId != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Delete video (cascade will handle related records)
        await prisma.videosource.delete(
            where={"id": video_id}
        )
        
        return APIResponse(
            success=True,
            message="Video deleted successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete video: {str(e)}"
        )
    finally:
        await prisma.disconnect()

@router.post("/workspaces/{workspace_id}/videos/upload", response_model=APIResponse)
async def upload_video_file(
    workspace_id: str,
    file: UploadFile = File(...),
    current_user = Depends(get_current_active_user)
):
    """Upload a video file for processing."""
    prisma = Prisma()
    await prisma.connect()
    
    try:
        # Verify workspace ownership
        workspace = await prisma.workspace.find_unique(
            where={"id": workspace_id}
        )
        
        if not workspace:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workspace not found"
            )
        
        if workspace.ownerId != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this workspace"
            )
        
        # Validate file type
        allowed_extensions = {'.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv', '.wmv', '.m4v'}
        file_ext = os.path.splitext(file.filename)[1].lower()
        
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type. Allowed: {', '.join(allowed_extensions)}"
            )
        
        # Create upload directory if it doesn't exist
        upload_dir = os.path.join(os.getcwd(), "uploads", "videos")
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        file_id = str(uuid.uuid4())
        file_path = os.path.join(upload_dir, f"{file_id}{file_ext}")
        
        # Save uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Create video source record with file path
        video_source = await prisma.videosource.create(
            data={
                "title": file.filename,
                "youtubeUrl": f"file://{file_path}",  # Store file path
                "workspaceId": workspace_id,
                "status": "PENDING"
            }
        )
        
        # Create processing job record
        job_id = str(uuid.uuid4())
        workflow_id = f"process-video-{video_source.id}-{job_id}"
        
        processing_job = await prisma.processingjob.create(
            data={
                "id": job_id,
                "temporalWorkflowId": workflow_id,
                "videoSourceId": video_source.id,
                "status": "STARTED"
            }
        )
        
        return APIResponse(
            success=True,
            message="Video file uploaded successfully",
            data={
                "video_id": video_source.id,
                "job_id": job_id,
                "filename": file.filename,
                "file_size": os.path.getsize(file_path)
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload video: {str(e)}"
        )
    finally:
        await prisma.disconnect()


@router.post("/content/{asset_id}/regenerate", response_model=APIResponse)
async def regenerate_content(
    asset_id: str,
    current_user = Depends(get_current_active_user)
):
    """Regenerate a specific content asset."""
    prisma = Prisma()
    await prisma.connect()

    try:
        # Get the content asset
        asset = await prisma.contentasset.find_unique(
            where={"id": asset_id},
            include={
                "job": {
                    "include": {
                        "videoSource": {
                            "include": {
                                "workspace": True
                            }
                        },
                        "transcript": True
                    }
                }
            }
        )

        if not asset or not asset.job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Content asset not found"
            )

        # Verify ownership
        if asset.job.videoSource.workspace.ownerId != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )

        # Get transcript and video title
        transcript_data = asset.job.transcript
        if not transcript_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No transcript available for regeneration"
            )

        # Parse transcript
        import json
        transcript_obj = json.loads(transcript_data.fullTranscript) if isinstance(transcript_data.fullTranscript, str) else transcript_data.fullTranscript
        transcript_text = transcript_obj.get("text", "")
        video_title = asset.job.videoSource.title or "Video"

        # Regenerate content based on type
        processor = VideoProcessor()
        gemini = processor.gemini

        print(f"🔄 Regenerating {asset.type} content for asset {asset_id}")

        if asset.type == "BLOG_POST":
            result = await gemini.generate_blog_post(transcript_text, video_title)
        elif asset.type == "TWITTER_THREAD":
            result = await gemini.generate_twitter_thread(transcript_text, video_title)
        elif asset.type == "LINKEDIN_POST":
            result = await gemini.generate_linkedin_post(transcript_text, video_title)
        elif asset.type == "TIKTOK":
            result = await gemini.generate_tiktok(transcript_text, video_title)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported content type: {asset.type}"
            )

        # Update the content asset with new content
        updated_asset = await prisma.contentasset.update(
            where={"id": asset_id},
            data={"content": result.get("content", "")}
        )

        print(f"✅ Successfully regenerated {asset.type} content")

        return APIResponse(
            success=True,
            message="Content regenerated successfully",
            data={
                "asset_id": updated_asset.id,
                "type": updated_asset.type,
                "content": updated_asset.content
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error regenerating content: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to regenerate content: {str(e)}"
        )
    finally:
        await prisma.disconnect()
