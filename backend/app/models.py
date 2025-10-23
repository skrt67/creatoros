"""Pydantic models for request/response validation."""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field
from enum import Enum

# Enums
class VideoStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class JobStatus(str, Enum):
    STARTED = "STARTED"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class AssetType(str, Enum):
    BLOG_POST = "BLOG_POST"
    TWITTER_THREAD = "TWITTER_THREAD"
    LINKEDIN_POST = "LINKEDIN_POST"
    TIKTOK = "TIKTOK"
    VIDEO_HIGHLIGHTS = "VIDEO_HIGHLIGHTS"

class AssetStatus(str, Enum):
    GENERATED = "GENERATED"
    PUBLISHED = "PUBLISHED"
    ARCHIVED = "ARCHIVED"

# Auth Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    workspace_name: str = Field(..., min_length=1)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

class TokenData(BaseModel):
    email: Optional[str] = None

# User Models
class UserBase(BaseModel):
    email: EmailStr

class UserResponse(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime

# Workspace Models
class WorkspaceCreate(BaseModel):
    name: str = Field(..., min_length=1)

class WorkspaceResponse(BaseModel):
    id: str
    name: str
    created_at: datetime
    updated_at: datetime
    owner_id: str

class WorkspaceWithVideos(WorkspaceResponse):
    video_sources: List['VideoSourceResponse'] = []

# Video Models
class VideoSubmit(BaseModel):
    youtube_url: str = Field(..., pattern=r'^https?://(www\.)?(youtube\.com/watch\?v=|youtu\.be/)')

class VideoSourceResponse(BaseModel):
    id: str
    youtube_url: str
    title: Optional[str]
    status: VideoStatus
    created_at: datetime
    updated_at: datetime
    workspace_id: str

class VideoSourceWithJob(VideoSourceResponse):
    processing_job: Optional['ProcessingJobResponse'] = None

# Job Models
class ProcessingJobResponse(BaseModel):
    id: str
    temporal_workflow_id: str
    status: JobStatus
    created_at: datetime
    updated_at: datetime
    video_source_id: str

class JobDetails(ProcessingJobResponse):
    video_source: VideoSourceResponse
    transcript: Optional['TranscriptResponse'] = None
    content_assets: List['ContentAssetResponse'] = []

# Transcript Models
class TranscriptResponse(BaseModel):
    id: str
    full_transcript: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    job_id: str

# Content Asset Models
class ContentAssetResponse(BaseModel):
    id: str
    type: AssetType
    content: str
    status: AssetStatus
    created_at: datetime
    updated_at: datetime
    job_id: str

# Billing Models
class CheckoutRequest(BaseModel):
    price_id: str
    success_url: str
    cancel_url: str

class CheckoutResponse(BaseModel):
    session_url: str
    session_id: str

class PortalRequest(BaseModel):
    return_url: str

class PortalResponse(BaseModel):
    portal_url: str

class SubscriptionResponse(BaseModel):
    id: str
    user_id: str
    stripe_customer_id: str
    stripe_subscription_id: str
    stripe_price_id: str
    stripe_current_period_end: datetime
    status: str

# Webhook Models
class StripeEvent(BaseModel):
    id: str
    type: str
    data: Dict[str, Any]

# Integration Models
class DiscordSyncRequest(BaseModel):
    user_id: str
    discord_user_id: str
    role_name: str

# API Response Models
class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None

class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    error_code: Optional[str] = None

# Update forward references
WorkspaceWithVideos.model_rebuild()
VideoSourceWithJob.model_rebuild()
JobDetails.model_rebuild()
