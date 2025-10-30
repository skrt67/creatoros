'use client';

import { useState, useEffect, useMemo } from 'react';
import { Play, AlertCircle, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useLanguage } from '@/contexts/LanguageContext';
import { VideoItem } from './VideoItem';
import { VideoFilters } from './VideoFilters';
import { VideoSkeleton } from '@/components/ui/SkeletonCard';

interface Video {
  id: string;
  youtubeUrl?: string | null;
  youtube_url?: string | null;
  title: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  workspaceId?: string;
  workspace_id?: string;
}

interface VideoListProps {
  workspaceId: string;
  refreshTrigger: number;
}

interface VideoItemProps {
  video: Video;
  onViewVideo: (video: Video) => void;
}

export function VideoList({ workspaceId, refreshTrigger }: VideoListProps) {
  const { t } = useLanguage();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);
  const router = useRouter();

  const fetchVideos = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
      const token = Cookies.get('access_token');

      const response = await fetch(`${apiUrl}/workspaces/${workspaceId}/videos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const videosData = await response.json();
        setVideos(videosData);
        setError('');
      } else {
        throw new Error('Failed to fetch videos');
      }
    } catch (err: any) {
      if (!silent) setError(err.message || 'Failed to fetch videos');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (workspaceId) {
      fetchVideos();
    }
  }, [workspaceId, refreshTrigger]);

  // Auto-refresh pour voir les vidéos en traitement en temps réel
  useEffect(() => {
    if (!workspaceId) return;

    // Vérifier s'il y a des vidéos en cours de traitement
    const hasProcessingVideos = videos.some(v => 
      v.status.toLowerCase() === 'processing' || v.status.toLowerCase() === 'pending'
    );

    setIsAutoRefreshing(hasProcessingVideos);

    if (!hasProcessingVideos) return;

    // Rafraîchir toutes les 5 secondes s'il y a des vidéos en traitement (mode silent)
    const interval = setInterval(() => {
      fetchVideos(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [workspaceId, videos]);

  const handleViewVideo = (video: Video) => {
    router.push(`/videos/${video.id}`);
  };

  // Filter and sort videos
  const filteredVideos = useMemo(() => {
    let result = [...videos];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(video => {
        const title = (video.title || '').toLowerCase();
        const url = (video.youtubeUrl || video.youtube_url || '').toLowerCase();
        const query = searchQuery.toLowerCase();
        return title.includes(query) || url.includes(query);
      });
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(video => video.status.toLowerCase() === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      const dateA = new Date(a.createdAt || a.created_at || 0).getTime();
      const dateB = new Date(b.createdAt || b.created_at || 0).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [videos, searchQuery, statusFilter, sortBy]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <VideoSkeleton />
          <VideoSkeleton />
          <VideoSkeleton />
          <VideoSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('errorsLoadingVideos')}</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchVideos()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-video-list>
      {/* Filters */}
      {videos.length > 0 && (
        <VideoFilters
          onSearchChange={setSearchQuery}
          onFilterChange={setStatusFilter}
          onSortChange={setSortBy}
          currentFilter={statusFilter}
          currentSort={sortBy}
          totalCount={videos.length}
          filteredCount={filteredVideos.length}
        />
      )}

      {/* Video List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Play className="h-5 w-5 text-primary-600" />
                {t('dashboardYourVideos')}
              </h3>
              <p className="text-sm text-gray-600 mt-0.5">
                {filteredVideos.length} {t('filtersVideos')}
                {filteredVideos.length !== videos.length && ` (${videos.length} total)`}
              </p>
            </div>
            
            {/* Auto-refresh indicator */}
            {isAutoRefreshing && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-green-700">
                  Mise à jour automatique
                </span>
              </div>
            )}
          </div>
        </div>

        {videos.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex p-4 bg-primary-50 rounded-full mb-4">
              <Play className="h-12 w-12 text-primary-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">{t('dashboardNoVideos')}</h4>
            <p className="text-gray-600 mb-6">{t('dashboardSubmitFirst')}</p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Sparkles className="h-4 w-4 text-primary-500" />
              <span>{t('dashboardAiPowered')}</span>
            </div>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">{t('filtersNoMatch')}</h4>
            <p className="text-gray-600 mb-4">{t('filtersTryAdjusting')}</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              {t('filtersClearFilters')}
            </button>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {filteredVideos.map((video) => (
              <VideoItem
                key={video.id}
                video={video}
                onViewVideo={handleViewVideo}
                onVideoDeleted={fetchVideos}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
