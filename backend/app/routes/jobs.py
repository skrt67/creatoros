"""Processing job and content asset routes."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from prisma import Prisma

from ..models import (
    JobDetails,
    ContentAssetResponse,
    TranscriptResponse,
    ProcessingJobResponse,
    VideoSourceResponse
)
from ..auth import get_current_active_user

router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.get("/{job_id}", response_model=JobDetails)
async def get_job_status_and_results(
    job_id: str,
    current_user = Depends(get_current_active_user)
):
    """Get processing job status and all generated content assets."""
    prisma = Prisma()
    await prisma.connect()
    
    try:
        job = await prisma.processingjob.find_unique(
            where={"id": job_id},
            include={
                "videoSource": {
                    "include": {"workspace": True}
                },
                "transcript": True,
                "contentAssets": {
                    "order": {"createdAt": "desc"}
                }
            }
        )
        
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        
        # Check workspace ownership
        if job.videoSource.workspace.ownerId != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this job"
            )
        
        # Build response
        video_source = VideoSourceResponse(
            id=job.videoSource.id,
            youtube_url=job.videoSource.youtubeUrl,
            title=job.videoSource.title,
            status=job.videoSource.status,
            created_at=job.videoSource.createdAt,
            updated_at=job.videoSource.updatedAt,
            workspace_id=job.videoSource.workspaceId
        )
        
        transcript = None
        if job.transcript:
            transcript = TranscriptResponse(
                id=job.transcript.id,
                full_transcript=job.transcript.fullTranscript,
                created_at=job.transcript.createdAt,
                updated_at=job.transcript.updatedAt,
                job_id=job.transcript.jobId
            )
        
        content_assets = [
            ContentAssetResponse(
                id=asset.id,
                type=asset.type,
                content=asset.content,
                status=asset.status,
                created_at=asset.createdAt,
                updated_at=asset.updatedAt,
                job_id=asset.jobId
            )
            for asset in job.contentAssets
        ]
        
        return JobDetails(
            id=job.id,
            temporal_workflow_id=job.temporalWorkflowId,
            status=job.status,
            created_at=job.createdAt,
            updated_at=job.updatedAt,
            video_source_id=job.videoSourceId,
            video_source=video_source,
            transcript=transcript,
            content_assets=content_assets
        )
        
    finally:
        await prisma.disconnect()

@router.get("/{job_id}/assets", response_model=List[ContentAssetResponse])
async def get_job_content_assets(
    job_id: str,
    current_user = Depends(get_current_active_user)
):
    """Get all content assets for a specific job."""
    prisma = Prisma()
    await prisma.connect()
    
    try:
        # First verify job access
        job = await prisma.processingjob.find_unique(
            where={"id": job_id},
            include={
                "videoSource": {
                    "include": {"workspace": True}
                }
            }
        )
        
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        
        # Check workspace ownership
        if job.videoSource.workspace.ownerId != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this job"
            )
        
        # Get content assets
        assets = await prisma.contentasset.find_many(
            where={"jobId": job_id},
            order={"createdAt": "desc"}
        )
        
        return [
            ContentAssetResponse(
                id=asset.id,
                type=asset.type,
                content=asset.content,
                status=asset.status,
                created_at=asset.createdAt,
                updated_at=asset.updatedAt,
                job_id=asset.jobId
            )
            for asset in assets
        ]
        
    finally:
        await prisma.disconnect()

@router.get("/{job_id}/transcript", response_model=TranscriptResponse)
async def get_job_transcript(
    job_id: str,
    current_user = Depends(get_current_active_user)
):
    """Get transcript for a specific job."""
    prisma = Prisma()
    await prisma.connect()
    
    try:
        # First verify job access
        job = await prisma.processingjob.find_unique(
            where={"id": job_id},
            include={
                "videoSource": {
                    "include": {"workspace": True}
                },
                "transcript": True
            }
        )
        
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        
        # Check workspace ownership
        if job.videoSource.workspace.ownerId != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this job"
            )
        
        if not job.transcript:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transcript not found for this job"
            )
        
        return TranscriptResponse(
            id=job.transcript.id,
            full_transcript=job.transcript.fullTranscript,
            created_at=job.transcript.createdAt,
            updated_at=job.transcript.updatedAt,
            job_id=job.transcript.jobId
        )
        
    finally:
        await prisma.disconnect()

# Individual asset routes
@router.get("/assets/{asset_id}", response_model=ContentAssetResponse)
async def get_content_asset(
    asset_id: str,
    current_user = Depends(get_current_active_user)
):
    """Get a specific content asset."""
    prisma = Prisma()
    await prisma.connect()
    
    try:
        asset = await prisma.contentasset.find_unique(
            where={"id": asset_id},
            include={
                "job": {
                    "include": {
                        "videoSource": {
                            "include": {"workspace": True}
                        }
                    }
                }
            }
        )
        
        if not asset:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Content asset not found"
            )
        
        # Check workspace ownership
        if asset.job.videoSource.workspace.ownerId != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this asset"
            )
        
        return ContentAssetResponse(
            id=asset.id,
            type=asset.type,
            content=asset.content,
            status=asset.status,
            created_at=asset.createdAt,
            updated_at=asset.updatedAt,
            job_id=asset.jobId
        )
        
    finally:
        await prisma.disconnect()
