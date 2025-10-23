'use client';

import { useState } from 'react';
import { Play, Clock, CheckCircle, AlertCircle, Eye, Download, Trash2, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'react-hot-toast';
import { VideoProgressTracker } from './VideoProgressTracker';

interface Video {
  id: string;
  youtubeUrl?: string | null;
  youtube_url?: string | null;
  title: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt?: string;
  created_at?: string;
}

interface VideoItemProps {
  video: Video;
  onViewVideo: (video: Video) => void;
  onVideoDeleted?: () => void;
}

export function VideoItem({ video, onViewVideo, onVideoDeleted }: VideoItemProps) {
  const { t } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const extractVideoId = (url: string | null | undefined) => {
    if (!url || typeof url !== 'string' || url.trim() === '') return null;
    try {
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      return match ? match[1] : null;
    } catch (error) {
      return null;
    }
  };

  const normalizeStatus = (status: string) => status.toLowerCase();

  const getStatusConfig = (status: string) => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case 'completed':
        return {
          icon: CheckCircle,
          label: 'Terminées',
          bg: 'bg-emerald-100',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
        };
      case 'processing':
        return {
          icon: null,
          label: 'En cours',
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          border: 'border-blue-200',
        };
      case 'pending':
        return {
          icon: Clock,
          label: 'En attente',
          bg: 'bg-yellow-100',
          text: 'text-yellow-700',
          border: 'border-yellow-200',
        };
      case 'failed':
        return {
          icon: AlertCircle,
          label: 'Échec',
          bg: 'bg-red-100',
          text: 'text-red-700',
          border: 'border-red-200',
        };
      default:
        return {
          icon: Clock,
          label: status,
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          border: 'border-gray-200',
        };
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiUrl}/videos/${video.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Vidéo supprimée');
        onVideoDeleted?.();
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const youtubeUrl = video.youtubeUrl || video.youtube_url;
  const videoId = extractVideoId(youtubeUrl);
  const statusConfig = getStatusConfig(video.status);
  const StatusIcon = statusConfig.icon;

  return (
    <>
      <div className="group bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all p-4">
        <div className="flex gap-4">
          {/* Thumbnail Compact */}
          <div className="relative flex-shrink-0 w-40 h-24 overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200">
            {videoId && !imageError ? (
              <>
                <img
                  src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                  alt={video.title || 'Video'}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Play className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              {/* Title & Status */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-base font-bold text-gray-900 line-clamp-2 flex-1">
                  {video.title || 'Sans titre'}
                </h3>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} text-xs font-semibold whitespace-nowrap`}>
                  {normalizeStatus(video.status) === 'processing' ? (
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : StatusIcon && (
                    <StatusIcon className="h-3 w-3" />
                  )}
                  <span>{statusConfig.label}</span>
                </div>
              </div>

              {/* URL & Date */}
              <div className="space-y-1">
                {youtubeUrl && (
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600 transition-colors"
                  >
                    <span className="truncate max-w-xs">{youtubeUrl}</span>
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </a>
                )}
                <p className="text-xs text-gray-400">
                  {new Date(video.createdAt || video.created_at || Date.now()).toLocaleString('fr-FR')}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => onViewVideo(video)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:border-primary-500 transition-all"
              >
                <Eye className="h-4 w-4" />
                <span>{t('viewDetails')}</span>
              </button>

              {normalizeStatus(video.status) === 'completed' && (
                <>
                  <button
                    onClick={() => window.open(youtubeUrl || '', '_blank')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-medium rounded-lg transition-all"
                  >
                    <Download className="h-4 w-4" />
                    <span>{t('download')}</span>
                  </button>

                  <button
                    onClick={() => window.open(youtubeUrl || '', '_blank')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-lg transition-all"
                  >
                    <Play className="h-4 w-4" />
                    <span>{t('watchOnYoutube')}</span>
                  </button>
                </>
              )}

              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg border border-red-200 hover:border-red-500 transition-all"
              >
                <Trash2 className="h-4 w-4" />
                <span>{t('delete')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Tracker - Affiche pendant le traitement */}
      {normalizeStatus(video.status) === 'processing' && (
        <div className="mt-4">
          <VideoProgressTracker
            videoId={video.id}
            status={video.status}
            onStatusChange={(newStatus) => {
              // Rafraîchir la liste des vidéos si le statut change
              if (onVideoDeleted) {
                onVideoDeleted();
              }
            }}
          />
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('deleteVideo')}</h3>
              <p className="text-gray-600">{t('actionIrreversible')}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all disabled:opacity-50"
              >
                {isDeleting ? t('deleting') : t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
