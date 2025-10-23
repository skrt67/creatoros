import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Video, RefreshCw } from 'lucide-react';
import { Button, LoadingState } from '@/components/ui';
import { VideoCard } from './VideoCard';
import { useWorkspaceStore } from '@/store/workspace';
import { usePolling } from '@/hooks/usePolling';
import type { VideoSource } from '@/types';

interface DashboardVideoListProps {
  workspaceId: string;
}

export const DashboardVideoList: React.FC<DashboardVideoListProps> = ({ 
  workspaceId 
}) => {
  const { 
    videos, 
    isLoading, 
    error, 
    fetchWorkspaceVideos, 
    deleteVideo, 
    clearError 
  } = useWorkspaceStore();

  // Fetch videos on mount
  useEffect(() => {
    if (workspaceId) {
      fetchWorkspaceVideos(workspaceId);
    }
  }, [workspaceId, fetchWorkspaceVideos]);

  // Poll for updates on processing videos
  const hasProcessingVideos = videos.some(video => 
    video.status === 'PENDING' || video.status === 'PROCESSING'
  );

  usePolling(
    () => {
      if (workspaceId && hasProcessingVideos) {
        fetchWorkspaceVideos(workspaceId);
      }
    },
    {
      interval: 5000, // Poll every 5 seconds
      enabled: hasProcessingVideos,
      immediate: false,
    }
  );

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleDeleteVideo = async (videoId: string) => {
    try {
      await deleteVideo(videoId);
      toast.success('Video deleted successfully');
    } catch (error) {
      toast.error('Failed to delete video');
    }
  };

  const handleRefresh = () => {
    if (workspaceId) {
      fetchWorkspaceVideos(workspaceId);
    }
  };

  if (isLoading && videos.length === 0) {
    return <LoadingState message="Loading videos..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Video className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Your Videos ({videos.length})
          </h2>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="ml-2">Refresh</span>
        </Button>
      </div>

      {/* Videos Grid */}
      {videos.length === 0 ? (
        <div className="text-center py-12">
          <Video className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No videos yet</h3>
          <p className="mt-2 text-sm text-gray-600">
            Submit your first YouTube video to get started with AI-powered content creation.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onDelete={handleDeleteVideo}
            />
          ))}
        </div>
      )}

      {/* Processing indicator */}
      {hasProcessingVideos && (
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-warning-500 rounded-full animate-pulse" />
            <p className="text-sm text-warning-800">
              {videos.filter(v => v.status === 'PROCESSING' || v.status === 'PENDING').length} video(s) are being processed. 
              This page will update automatically.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
