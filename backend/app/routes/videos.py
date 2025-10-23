"""Video processing routes."""

import uuid
import os
import shutil
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from prisma import Prisma
from temporalio.client import Client

from ..models import (
    VideoSubmit,
    VideoSourceResponse,
    VideoSourceWithJob,
    APIResponse
)
from ..auth import get_current_active_user
from temporal_workflows.workflows import ProcessVideoWorkflow

router = APIRouter(tags=["videos"])

# Temporal client (will be initialized in main app)
temporal_client: Client = None

def set_temporal_client(client: Client):
    """Set the temporal client instance."""
    global temporal_client
    temporal_client = client

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
        
        # Start Temporal workflow
        if temporal_client:
            await temporal_client.start_workflow(
                ProcessVideoWorkflow.run,
                args=[video_source.id, video_data.youtube_url, job_id],
                id=workflow_id,
                task_queue="video-processing"
            )
        else:
            # Fallback for development/testing
            print(f"Temporal client not available. Would start workflow: {workflow_id}")
        
        return APIResponse(
            success=True,
            message="Video submitted for processing",
            data={
                "video_id": video_source.id,
                "job_id": job_id,
                "workflow_id": workflow_id
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
                transcript_content = {"full_text": transcript_content}
        
        return {
            "id": transcript.id,
            "content": transcript_content.get("full_text", ""),
            "segments": transcript_content.get("segments", [])
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
