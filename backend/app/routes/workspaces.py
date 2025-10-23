"""Workspace management routes."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from prisma import Prisma

from ..models import (
    WorkspaceCreate,
    WorkspaceResponse,
    WorkspaceWithVideos,
    APIResponse
)
from ..auth import get_current_active_user

router = APIRouter(prefix="/workspaces", tags=["workspaces"])

@router.get("", response_model=List[WorkspaceResponse])
async def list_user_workspaces(current_user = Depends(get_current_active_user)):
    prisma = Prisma()
    await prisma.connect()
    
    try:
        workspaces = await prisma.workspace.find_many(
            where={"ownerId": current_user.id}
        )
        
        return [
            WorkspaceResponse(
                id=ws.id,
                name=ws.name,
                created_at=ws.createdAt,
                updated_at=ws.updatedAt,
                owner_id=ws.ownerId
            )
            for ws in workspaces
        ]
        
    finally:
        await prisma.disconnect()

@router.post("", response_model=APIResponse)
async def create_workspace(
    workspace_data: WorkspaceCreate,
    current_user = Depends(get_current_active_user)
):
    """Create a new workspace."""
    prisma = Prisma()
    await prisma.connect()
    
    try:
        workspace = await prisma.workspace.create(
            data={
                "name": workspace_data.name,
                "ownerId": current_user.id
            }
        )
        
        return APIResponse(
            success=True,
            message="Workspace created successfully",
            data={
                "workspace_id": workspace.id,
                "name": workspace.name
            }
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create workspace: {str(e)}"
        )
    finally:
        await prisma.disconnect()

@router.get("/{workspace_id}", response_model=WorkspaceWithVideos)
async def get_workspace_details(
    workspace_id: str,
    current_user = Depends(get_current_active_user)
):
    """Get workspace details with video sources."""
    prisma = Prisma()
    await prisma.connect()
    
    try:
        workspace = await prisma.workspace.find_unique(
            where={"id": workspace_id},
            include={
                "videoSources": {
                    "order": {"createdAt": "desc"},
                    "include": {
                        "processingJob": True
                    }
                }
            }
        )
        
        if not workspace:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workspace not found"
            )
        
        # Check if user owns the workspace
        if workspace.ownerId != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this workspace"
            )
        
        # Convert to response model
        from ..models import VideoSourceResponse
        
        video_sources = []
        for vs in workspace.videoSources:
            video_sources.append(
                VideoSourceResponse(
                    id=vs.id,
                    youtube_url=vs.youtubeUrl,
                    title=vs.title,
                    status=vs.status,
                    created_at=vs.createdAt,
                    updated_at=vs.updatedAt,
                    workspace_id=vs.workspaceId
                )
            )
        
        return WorkspaceWithVideos(
            id=workspace.id,
            name=workspace.name,
            created_at=workspace.createdAt,
            updated_at=workspace.updatedAt,
            owner_id=workspace.ownerId,
            video_sources=video_sources
        )
        
    finally:
        await prisma.disconnect()

@router.delete("/{workspace_id}", response_model=APIResponse)
async def delete_workspace(
    workspace_id: str,
    current_user = Depends(get_current_active_user)
):
    """Delete a workspace and all its content."""
    prisma = Prisma()
    await prisma.connect()
    
    try:
        # Check if workspace exists and user owns it
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
        
        # Delete workspace (cascade will handle related records)
        await prisma.workspace.delete(
            where={"id": workspace_id}
        )
        
        return APIResponse(
            success=True,
            message="Workspace deleted successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete workspace: {str(e)}"
        )
    finally:
        await prisma.disconnect()
