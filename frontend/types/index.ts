// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error_code?: string;
}

// Auth Types
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  workspace_name: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Workspace Types
export interface Workspace {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
}

export interface WorkspaceWithVideos extends Workspace {
  video_sources: VideoSource[];
}

// Video Types
export type VideoStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type JobStatus = 'STARTED' | 'COMPLETED' | 'FAILED';
export type AssetType = 'BLOG_POST' | 'TWITTER_THREAD' | 'LINKEDIN_POST' | 'NEWSLETTER' | 'VIDEO_HIGHLIGHTS' | 'CLIPS' | 'TIKTOK';
export type AssetStatus = 'GENERATED' | 'PUBLISHED' | 'ARCHIVED';

export interface VideoSource {
  id: string;
  youtube_url: string;
  title?: string;
  status: VideoStatus;
  created_at: string;
  updated_at: string;
  workspace_id: string;
}

export interface VideoSubmission {
  youtube_url: string;
}

// Job Types
export interface ProcessingJob {
  id: string;
  temporal_workflow_id: string;
  status: JobStatus;
  created_at: string;
  updated_at: string;
  video_source_id: string;
}

export interface JobDetails extends ProcessingJob {
  video_source: VideoSource;
  transcript?: Transcript;
  content_assets: ContentAsset[];
}

// Content Types
export interface Transcript {
  id: string;
  full_transcript: {
    text: string;
    words?: Array<{
      text: string;
      start: number;
      end: number;
      confidence: number;
      speaker?: string;
    }>;
    chapters?: Array<{
      summary: string;
      headline: string;
      gist: string;
      start: number;
      end: number;
    }>;
    summary?: string;
    entities?: Array<{
      entity_type: string;
      text: string;
      start: number;
      end: number;
    }>;
    sentiment_analysis_results?: Array<{
      text: string;
      start: number;
      end: number;
      sentiment: string;
      confidence: number;
    }>;
    iab_categories_result?: {
      status: string;
      results: Array<{
        text: string;
        labels: Array<{
          relevance: number;
          label: string;
        }>;
      }>;
    };
  };
  created_at: string;
  updated_at: string;
  job_id: string;
}

export interface ContentAsset {
  id: string;
  type: AssetType;
  content: string;
  status: AssetStatus;
  created_at?: string;
  updated_at?: string;
  job_id: string;
}

// Billing Types
export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  stripe_price_id: string;
  stripe_current_period_end: string;
  status: string;
}

export interface CheckoutRequest {
  price_id: string;
  success_url: string;
  cancel_url: string;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// Form Types
export interface FormError {
  field: string;
  message: string;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Asset Type Display Names
export const ASSET_TYPE_NAMES: Record<AssetType, string> = {
  BLOG_POST: 'Blog Post',
  TWITTER_THREAD: 'Twitter Thread',
  LINKEDIN_POST: 'LinkedIn Post',
  NEWSLETTER: 'Newsletter',
  VIDEO_HIGHLIGHTS: 'Video Highlights',
  CLIPS: 'Viral Clips',
  TIKTOK: 'TikTok Video'
};

// Status Display Names
export const VIDEO_STATUS_NAMES: Record<VideoStatus, string> = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  FAILED: 'Failed'
};

export const JOB_STATUS_NAMES: Record<JobStatus, string> = {
  STARTED: 'Started',
  COMPLETED: 'Completed',
  FAILED: 'Failed'
};
